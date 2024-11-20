import { InlineKeyboard } from "@grammyjs/bot";
import { getAllUserNames } from "../db.ts";
export const registrationKeyboard = new InlineKeyboard()
  .text("Регистрация", "auth");

export const startKeyboard = new InlineKeyboard()
  .text("Новости", "auth")
  .row()
  .text("Календарь", "auth")
  .row()
  .text("Анонимное сообщение", "anonMessage")
  .row()
  .text("Полезная информация", "auth")
  .row()
  .text("Админский раздел", "listOfUsers");

export const adminKeyboard = new InlineKeyboard()
  .text("Написать новость", "auth")
  .row()
  .text("Назначить дежурство", "auth")
  .row()
  .text("Создать напоминание", "auth")
  .row()
  .text("Добавить пользователя", "auth")
  .row()
  .text("Авторизация", "auth");

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


export const listOfUsersKeyboard = new InlineKeyboard();

const listOfUsers = await getAllUserNames();

listOfUsers.forEach((user) => {
    listOfUsersKeyboard.text(user, `user_${user}`);
    listOfUsersKeyboard.row();
  });
