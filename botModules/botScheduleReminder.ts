import { Bot } from "@grammyjs/bot";
import { getCalendarEventsForTomorrow } from "./calendarSevice.ts";
import { IDESOS_GROUP_ID } from "../botStatic/constance.ts";
import { yerevanToUTC } from "../helpers.ts";
import { MyContext } from "../bot.ts";

export async function scheduleDailyReminders(bot: Bot<MyContext>) {
  try {
    const events = await getCalendarEventsForTomorrow();

    for (const event of events) {
      if (!event.start || (!event.start.dateTime && !event.start.date)) {
        continue;
      }

      let eventTime: Date;

      if (event.start.dateTime) {
        eventTime = new Date(event.start.dateTime);
      } else if (event.start.date) {
        // Если событие целый день, установим время на 09:00
        eventTime = new Date(event.start.date);
        eventTime.setHours(9, 0, 0, 0);
      } else {
        continue;
      }

      // Преобразуем время из Еревана в UTC
      const utcHour = await yerevanToUTC(eventTime.getHours());
      eventTime.setUTCHours(utcHour);

      const now = new Date();
      const delay = eventTime.getTime() - now.getTime();

      if (delay <= 0) {
        console.log(`Событие "${event.summary}" уже прошло.`);
        continue;
      }

      setTimeout(async () => {
        try {
          await bot.api.sendMessage(
            IDESOS_GROUP_ID,
            `⏰ Напоминание: ${event.summary}\n${event.description || ""}`,
          );
          console.log(`Напоминание о событии "${event.summary}" отправлено.`);
        } catch (error) {
          console.error(`Ошибка при отправке напоминания:`, error);
        }
      }, delay);
    }

    console.log("Все напоминания за завтра запланированы.");
  } catch (error) {
    console.error("Ошибка при получении событий календаря:", error);
  }
}
