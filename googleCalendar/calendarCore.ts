import { Bot } from "@grammyjs/bot";
import { getCalendarEventsForNext24Hours } from "./calendarSevice.ts";
import { CHAT_ID } from "../botStatic/constance.ts";
import { yerevanToUTC } from "../helpers.ts";
import { MyContext } from "../bot.ts";
import { getKv } from "../botStatic/kvClient.ts";
import { GoogleCalendarEvent } from "./calendarSevice.ts";

export async function updateCalendarReminders(bot: Bot<MyContext>) {
  Deno.cron("updateCalendarReminders", `0 7 * * *`, async () => {
    try {
      console.log("Бот проснулся.");
      // await scheduleDailyReminders(bot);
      console.log("Утренее обновление напоминаний завершено.");
    } catch (error) {
      console.error(
        "Ошибка при утренем обновлении напоминаний:",
        error,
      );
    }
  });
}


export async function saveGoogleEvent() {
  try {
    const events = await getCalendarEventsForNext24Hours();
    const kv = await getKv();

    for (const event of events) {
      // Проверяем существование события в базе
      const existingEvent = await kv.get(["reltubBot","Google_event", `event:${event.id}`]);
      if (existingEvent.value) {
        console.log(`Событие с ID ${event.id} уже существует в базе`);
        continue;
      }

      const googleEvent: GoogleCalendarEvent = {
        id: event.id,
        summary: event.summary,
        description: event.description,
        start: event.start,
        end: event.end,
      };
      await kv.set(["reltubBot", "Google_event", `event:${event.id}`], googleEvent);
      console.log(`Событие с ID ${event.id} успешно сохранено`);
    }

    console.log("Обработка новых событий завершена");
  } catch (error) {
    console.error("Ошибка при сохранении событий в Deno.kv:", error);
  }
}



async function initializeQueueListener() {
  const kv = await getKv();
  await kv.listenQueue(async (message) => {
    if (message.action === "TEST_FUNC") {
      try {
        // await testFunc();
        await kv.delete(["TEST_FUNC_PENDING"]);
        console.log("TestFunc успешно выполнена и отметка удалена.");
      } catch (error) {
        console.error("Ошибка при выполнении testFunc:", error);
        // Здесь можно реализовать логику повторной попытки или уведомления
      }
    }
  });
}

