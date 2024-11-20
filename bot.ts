import { Bot, BotError, Context, session, SessionFlavor } from "@grammyjs/bot";
// import { BOT_TOKEN, CLIENT_ID, CLIENT_SECRET } from "./token.ts";
import { BOT_TOKEN } from "./config.ts";
import { startKeyboard, listOfUsersKeyboard } from "./botStatic/keyboard.ts";
import { botStart } from "./botModules/botStart.ts";
import {
  testClaudeDailyMessage,
  testCronDailyMessage,
  testDenoDailyMessage,
} from "./botModules/BotDailyMessage.ts";
import { CHAT_ID } from "./botStatic/constance.ts";
import { sendMessageToGroup } from "./botModules/botSendMessageToGroup.ts";
import { updateUser } from "./db.ts";

// import { limit } from "https://deno.land/x/grammy_ratelimiter@v1.2.0/mod.ts";

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

// bot.callbackQuery("auth", (ctx) => {

bot.command("start", async (ctx) => {
  if (ctx.chat.type !== "private") {
    await ctx.reply("Доступ к меню доступен только в личном диалоге с ботом.");
    return;
  }

  // const chatId = ctx.chat.id;
  // await ctx.reply(`ID этого чата: ${chatId}`);
  // console.log(`Chat ID: ${chatId}`);
  ctx.session.stage = "null";
  await botStart(ctx);
});

bot.callbackQuery("listOfUsers", async (ctx) => {
  await ctx.reply("Список пользователей:", {
    reply_markup: listOfUsersKeyboard,
  });
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

bot.on("message:text", async (ctx) => {
  if (ctx.session.stage === "anonMessage") {
    const messageText = ctx.message.text;
    ctx.session.stage = "null";
    await sendMessageToGroup(bot, CHAT_ID, messageText);
    await ctx.reply("Ваше анонимное сообщение отправлено!");
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
  } else {
    await ctx.reply("Введите команду /start для начала.");
  }
});

// testClaudeDailyMessage(bot);
testDenoDailyMessage(bot);
testCronDailyMessage(bot);

export { bot };
