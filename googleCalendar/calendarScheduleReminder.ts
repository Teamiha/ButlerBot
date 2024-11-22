import { enqueueNotification } from "../helpers.ts";
import { Bot } from "@grammyjs/bot";
import { getCalendarEventsForTomorrow } from "./calendarSevice.ts";
import { CHAT_ID } from "../botStatic/constance.ts";
import { yerevanToUTC } from "../helpers.ts";
import { MyContext } from "../bot.ts";

interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
}

interface Notification {
  forUser: number;
  body: string;
}

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
        eventTime = new Date(event.start.date);
        eventTime.setHours(9, 0, 0, 0);
      } else {
        continue;
      }

      const utcHour = await yerevanToUTC(eventTime.getHours());
      eventTime.setUTCHours(utcHour);

      const delay = eventTime.getTime() - Date.now();

      if (delay <= 0) {
        console.log(`Событие "${event.summary}" уже прошло.`);
        continue;
      }

      const notification: Notification = {
        forUser: CHAT_ID,
        body: `⏰ Напоминание: ${event.summary}\n${event.description || ""}`,
      };

      await enqueueNotification(notification, delay);
    }

    console.log("Все напоминания за завтра добавлены в очередь.");
  } catch (error) {
    console.error("Ошибка при получении событий календаря:", error);
  }
}

export async function updateCalendarReminders(bot: Bot<MyContext>) {
  Deno.cron("updateCalendarReminders", `0 7 * * *`, async () => {
    try {
      console.log("Бот проснулся.");
      await scheduleDailyReminders(bot);
      console.log("Утренее обновление напоминаний завершено.");
    } catch (error) {
      console.error(
        "Ошибка при утренем обновлении напоминаний:",
        error,
      );
    }
  });
}
