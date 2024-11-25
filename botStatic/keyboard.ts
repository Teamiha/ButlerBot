import { InlineKeyboard } from "@grammyjs/bot";
import { getAllUserNames } from "../db.ts";
import { transferTaskToKeyboard } from "../tasksSystem/taskDb.ts";


export const registrationKeyboard = new InlineKeyboard()
  .text("Регистрация", "auth");

export const startKeyboard = new InlineKeyboard()
  .text("Процесс обустройки замка", "castleProcess")
  .row()
  .text("Информация", "info")
  .row()
  .text("Анонимное сообщение", "anonMessage")
  .row()
  .text("Добавить вещь в глобальный виш-лист", "addWish")
  .row()
  .text("Админский раздел", "adminZone");

export const adminKeyboard = new InlineKeyboard()
  .text("Написать новость", "makeNews")
  .row()
  .text("Добавить пользователя", "addUser")
  .row()
  .text("Удалить пользователя", "deleteUser")
  .row()
  .text("Управление задачами", "taskManager")
  .row()
  .text("Вернуться в меню", "start");

export const taskManagerKeyboard = new InlineKeyboard()
  .text("Добавить задачу", "addTask")
  .row()
  .text("Удалить задачу", "deleteTask")
  .row()
  .text("Сменить статус задачи", "changeTaskStatus")
  .row()
  .text("Вернуться в админку", "adminZone");

export const calendarKeyboard = new InlineKeyboard()
  .text("События сегодня", "auth")
  .row()
  .text("обытия завтра", "auth")
  .row()
  .text("Раписание на эту неделю", "auth")
  .row()
  .text("Добавить событие", "auth")
  .row()
  .text("Удалить событие", "auth");


export const castleProcessKeyboard = new InlineKeyboard();

const listOfCastleProcess = await transferTaskToKeyboard();

listOfCastleProcess.forEach((task) => {
  castleProcessKeyboard.text(task, `task_${task}`);
  castleProcessKeyboard.row();
});


export const listOfUsersKeyboard = new InlineKeyboard();

const listOfUsers = await getAllUserNames();

listOfUsers.forEach((user) => {
  listOfUsersKeyboard.text(user, `user_${user}`);
  listOfUsersKeyboard.row();
});
