import { Bot, Context, session, SessionFlavor } from "@grammyjs/bot";
import { BOT_TOKEN } from "./config.ts";
import {
  generateCastleProcessKeyboard,
  generateListOfUsersKeyboard,
  startKeyboard,
  taskManagerKeyboard,
} from "./botStatic/keyboard.ts";
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
import {
  addTask,
  deleteTaskById,
  toggleTaskStatusById,
  transferTaskStatusForView,
} from "./tasksSystem/taskDb.ts";

export interface SessionData {
  stage:
    | "anonMessage"
    | "askName"
    | "askBirthDate"
    | "null"
    | "addUser"
    | "addTask";
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

bot.command("door", async (ctx) => {
  if (ctx.chat.id !== IDESOS_GROUP_ID) {
    await ctx.reply("Эта команда доступна только в определенной группе.");
    return;
  }

  try {
    const response = await fetch("https://lamb-enough-closely.ngrok-free.app/open");
    if (response.ok) {
      await ctx.reply("Дверь открыта! 🚪");
    } else {
      await ctx.reply("Произошла ошибка, сообщите Мише.");
    }
  } catch (error) {
    console.error("Error executing door command:", error);
    await ctx.reply("Произошла ошибка, сообщите Мише.");
  }
});

bot.callbackQuery("adminZone", async (ctx) => {
  await ctx.answerCallbackQuery();
  await botAdminZone(ctx);
});

bot.callbackQuery("start", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageReplyMarkup({
    reply_markup: startKeyboard,
  });
});

bot.callbackQuery("listOfUsers", async (ctx) => {
  await ctx.answerCallbackQuery();
  const keyboard = await generateListOfUsersKeyboard();
  await ctx.reply("Список пользователей:", {
    reply_markup: keyboard,
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
  ctx.session.stage = "addUser";
  await ctx.reply("Введите ID пользователя:");
});

bot.callbackQuery("deleteUser", async (ctx) => {
  await ctx.answerCallbackQuery();
  const keyboard = await generateListOfUsersKeyboard();
  await ctx.reply("Выберите пользователя для удаления:", {
    reply_markup: keyboard,
  });
});

bot.callbackQuery("taskManager", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageReplyMarkup({
    reply_markup: taskManagerKeyboard,
  });
});

bot.callbackQuery("addTask", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.stage = "addTask";
  await ctx.reply("Напишите текст задачи:");
});

bot.callbackQuery("deleteTask", async (ctx) => {
  await ctx.answerCallbackQuery();
  const keyboard = await generateCastleProcessKeyboard();
  await ctx.reply("Выберите задачу для удаления:", {
    reply_markup: keyboard,
  });
});

bot.callbackQuery("changeTaskStatus", async (ctx) => {
  await ctx.answerCallbackQuery();
  const keyboard = await generateCastleProcessKeyboard();
  await ctx.reply("Выберите задачу для изменения статуса:", {
    reply_markup: keyboard,
  });
});

bot.callbackQuery("castleProcess", async (ctx) => {
  await ctx.answerCallbackQuery();
  const tasksList = await transferTaskStatusForView();
  await ctx.reply("Список текущих задач Замка:\n\n" + tasksList);
});

bot.callbackQuery(/^task_/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const taskId = ctx.callbackQuery.data.replace("task_", "");
  const previousMessage = ctx.callbackQuery.message?.text;

  if (previousMessage?.includes("для удаления")) {
    await deleteTaskById(taskId);
    await ctx.reply(`Задача успешно удалена.`);
  } else if (previousMessage?.includes("для изменения статуса")) {
    await toggleTaskStatusById(taskId);
    await ctx.reply(`Статус задачи успешно изменен.`);
  }
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
  } else if (ctx.session.stage === "addTask") {
    const messageText = ctx.message.text;
    await addTask(messageText);
    ctx.session.stage = "null";
    await ctx.reply("Задача добавлена. Выберите действие:", {
      reply_markup: taskManagerKeyboard,
    });
  }
});



export { bot };
