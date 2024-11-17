import { InlineKeyboard } from "@grammyjs/bot";


// export const startKeyboard = new InlineKeyboard()
//   .text("Авторизация", "auth");
  

export const startKeyboard = new InlineKeyboard()
  .text("Новости", "auth")
  .row()
  .text("Календарь", "auth")
  .row()
  .text("Анонимное сообщение", "auth")
  .row()
  .text("Админский раздел", "auth")
  .row()
  .text("Авторизация", "auth");

export const adminKeyboard = new InlineKeyboard()
  .text("Написать новость", "auth")
  .row()
  .text("Назначить дежурство", "auth")
  .row()
  .text("Создать напоминание", "auth")
  .row()
  .text("Авторизация", "auth")
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
