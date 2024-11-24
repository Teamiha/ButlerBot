import { Bot, Context, session, SessionFlavor } from "@grammyjs/bot";
import { BOT_TOKEN } from "./config.ts";
import { listOfUsersKeyboard, taskManagerKeyboard } from "./botStatic/keyboard.ts";
import { botStart } from "./botModules/botStart.ts";
import { IDESOS_GROUP_ID } from "./botStatic/constance.ts";
import { sendMessageToGroup } from "./botModules/botSendMessageToGroup.ts";
import {
  getUserIdByName,
  grantAccess,
  revokeAccess,
  updateUser,
} from "./db.ts";
import { info } from "./botStatic/info.ts";
import { botAdminZone } from "./botModules/botAdminZone.ts";

export interface SessionData {
  stage:
    | "anonMessage"
    | "askName"
    | "askBirthDate"
    | "null"
    | "addUser";
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
  await ctx.answerCallbackQuery();
  await botAdminZone(ctx);
});

bot.callbackQuery("listOfUsers", async (ctx) => {
  await ctx.answerCallbackQuery();
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
  await ctx.answerCallbackQuery();
  ctx.session.stage = "askName";
  const userName = ctx.from?.username;
  if (userName) {
    await updateUser(ctx.from?.id, "nickName", userName);
  }
  await ctx.reply("Напишите ваше имя:");
});

bot.callbackQuery("anonMessage", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.stage = "anonMessage";
  await ctx.reply("Напиши своё сообщение:");
});

bot.callbackQuery("addUser", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("Выберите пользователя для удаления:", {
    reply_markup: listOfUsersKeyboard,
  });
});

bot.callbackQuery("deleteUser", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("Введите ID пользователя:");
});

bot.callbackQuery("taskManager", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("Выберите действие:", {
    reply_markup: taskManagerKeyboard,
  });
});

bot.callbackQuery(/^user_/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const userName = ctx.callbackQuery.data.replace("user_", "");
  const userId = await getUserIdByName(userName);

  const previousMessage = ctx.callbackQuery.message?.text;

  if (!userId) {
    await ctx.reply(`Не удалось найти пользователя ${userName}.`);
    return;
  }

  if (previousMessage?.includes("для удаления")) {
    await revokeAccess(userId);
    await ctx.reply(`Пользователь ${userName} успешно удален.`);
  }
});

bot.on("message:text", async (ctx) => {
  if (ctx.session.stage === "anonMessage") {
    const messageText = ctx.message.text;
    ctx.session.stage = "null";
    await sendMessageToGroup(ctx, IDESOS_GROUP_ID, messageText, bot);
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
  } else if (ctx.session.stage === "addUser") {
    const messageText = ctx.message.text;
    await grantAccess(Number(messageText));
    ctx.session.stage = "null";
    await ctx.reply("Доступ предоставлен!");
  }
});

export { bot };
