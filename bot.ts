import { Bot, Context, session, SessionFlavor } from "@grammyjs/bot";
import { BOT_TOKEN } from "./config.ts";
import { listOfUsersKeyboard } from "./botStatic/keyboard.ts";
import { botStart } from "./botModules/botStart.ts";
import { CHAT_ID } from "./botStatic/constance.ts";
import { sendMessageToGroup } from "./botModules/botSendMessageToGroup.ts";
import { updateUser } from "./db.ts";
import { updateCalendarReminders } from "./googleCalendar/calendarScheduleReminder.ts";
import { setupQueueListener } from "./helpers.ts";
import { testDelay, testFunc } from "./playground.ts";
import { getKv } from "./botStatic/kvClient.ts";
import { saveGoogleEvent } from "./googleCalendar/calendarScheduleReminder.ts";
import { deleteTestFuncPending } from "./playground.ts";
import { testDenoDailyMessage } from "./botModules/BotDailyMessage.ts";

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

bot.callbackQuery("testCron", async (ctx) => {
  //   await testDenoDailyMessage(bot);
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

// testDenoDailyMessage(bot);

saveGoogleEvent();

// await deleteTestFuncPending().catch(console.error);

// testDelay().catch(console.error);

// async function initializeQueueListener() {
//   const kv = await getKv();
//   await kv.listenQueue(async (message) => {
//     if (message.action === "TEST_FUNC") {
//       try {
//         await testFunc();
//         await kv.delete(["TEST_FUNC_PENDING"]);
//         console.log("TestFunc успешно выполнена и отметка удалена.");
//       } catch (error) {
//         console.error("Ошибка при выполнении testFunc:", error);
//         // Здесь можно реализовать логику повторной попытки или уведомления
//       }
//     }
//   });
// }

// initializeQueueListener().catch(console.error);

export { bot };
