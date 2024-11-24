import { Bot, Context, session, SessionFlavor } from "@grammyjs/bot";
import { BOT_TOKEN } from "./config.ts";
import { listOfUsersKeyboard } from "./botStatic/keyboard.ts";
import { botStart } from "./botModules/botStart.ts";
import { CHAT_ID } from "./botStatic/constance.ts";
import { sendMessageToGroup } from "./botModules/botSendMessageToGroup.ts";
import { updateUser } from "./db.ts";
import { info } from "./botStatic/info.ts";
import { botAdminZone } from "./botModules/botAdminZone.ts";

export interface SessionData {
  stage:
    | "anonMessage"
    | "askName"
    | "askBirthDate"
    | "null";
}

export type MyContext = Context & SessionFlavor<SessionData>;

const bot = new Bot<MyContext>(BOT_TOKEN);

bot.use(session({
  initial: (): SessionData => ({
    stage: "null",
  }),
}));

bot.command("start", async (ctx) => {
  if (ctx.chat.type !== "private") {
    await ctx.reply("Доступ к меню доступен только в личном диалоге с ботом.");
    return;
  }

  ctx.session.stage = "null";
  await botStart(ctx);
});

bot.callbackQuery("adminZone", async (ctx) => {
  await botAdminZone(ctx);
});

bot.callbackQuery("listOfUsers", async (ctx) => {
  await ctx.reply("Список пользователей:", {
    reply_markup: listOfUsersKeyboard,
  });
});

bot.callbackQuery("info", async (ctx) => {
  try {
    await ctx.answerCallbackQuery();
    await ctx.reply(info);
  } catch (error) {
    console.error("Error handling info callback:", error);
  }
});

bot.callbackQuery("auth", async (ctx) => {
  ctx.session.stage = "askName";
  const userName = ctx.from?.username;
  if (userName) {
    await updateUser(ctx.from?.id, "nickName", userName);
  }
  await ctx.reply("Напишите ваше имя:");
});

bot.callbackQuery("anonMessage", async (ctx) => {
  ctx.session.stage = "anonMessage";
  await ctx.reply("Напиши своё сообщение:");
});

bot.callbackQuery(/^user_/, async (ctx) => {
    const userName = ctx.callbackQuery.data.replace('user_', '');
    console.log(`Выбран пользователь: ${userName}`);
  await ctx.reply(`Вы выбрали пользователя: ${userName}`);
});


bot.on("message:text", async (ctx) => {
  if (ctx.session.stage === "anonMessage") {
    const messageText = ctx.message.text;
    ctx.session.stage = "null";
    await sendMessageToGroup(ctx, CHAT_ID, messageText);
  } else if (ctx.session.stage === "askName") {
    const messageText = ctx.message.text;
    await updateUser(ctx.from?.id, "name", messageText);
    ctx.session.stage = "askBirthDate";
    await ctx.reply(`Теперь укажите вашу дату рождения в формате YYYY-MM-DD.
            Что значит Год-Месяц-День.
            Например: 1988-11-30
            `);
  } else if (ctx.session.stage === "askBirthDate") {
    const messageText = ctx.message.text;
    await updateUser(ctx.from?.id, "birthday", messageText);
    ctx.session.stage = "null";
    await ctx.reply("Регистрация завершена! Спасибо!");
  } 
});

export { bot };
