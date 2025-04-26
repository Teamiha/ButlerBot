import { Bot } from "@grammyjs/bot";
import { IDESOS_GROUP_ID } from "../botStatic/constance.ts";
import { MyContext } from "../bot.ts";
import { formatWeatherMessage, getWeather } from "../NewWeather.ts";
import { yerevanToUTC } from "../helpers.ts";
import { getCalendarEventsForNext24Hours } from "../googleCalendar/calendarSevice.ts";
import { CASTLE_PUBLIC_CALENDAR_ID } from "../botStatic/constance.ts";
import { formatCalendarEvents } from "../googleCalendar/formatCalendarEvents.ts";
import { getKv } from "../botStatic/kvClient.ts";

const targetHour = await yerevanToUTC(23);
const reminderHour = await yerevanToUTC(22);
const reminderMinute = 50;

export async function botDailyMessage(bot: Bot<MyContext>) {
  // Планируем получение событий на 22:50
  Deno.cron("getEvents", `${reminderMinute} ${reminderHour} * * *`, async () => {
    try {
      const events = await getCalendarEventsForNext24Hours(CASTLE_PUBLIC_CALENDAR_ID);
      const weatherData = await getWeather();
      const weatherMessage = weatherData ? formatWeatherMessage(weatherData) : "Weather data unavailable";
      const eventsMessage = formatCalendarEvents(events);

      const dailyMessage = `Всем хорошего вечера! 🤗

${weatherMessage}

${eventsMessage}`;

      // Сохраняем сообщение в KV для отправки в 23:00
      const kv = await getKv();
      await kv.set(["reltubBot", "dailyMessage"], dailyMessage);
    } catch (error) {
      console.error("Ошибка при подготовке ежедневного сообщения:", error);
    }
  });

  // Отправляем сообщение в 23:00
  Deno.cron("dailyMessage", `0 ${targetHour} * * *`, async () => {
    try {
      const kv = await getKv();
      const messageEntry = await kv.get<string>(["reltubBot", "dailyMessage"]);
      const message = messageEntry.value || "Всем хорошего вечера! 🤗";

      await bot.api.sendMessage(IDESOS_GROUP_ID, message);
      console.log("Ежедневное сообщение отправлено");
      
      // Очищаем сохраненное сообщение
      await kv.delete(["reltubBot", "dailyMessage"]);
    } catch (error) {
      console.error("Ошибка при отправке ежедневного сообщения:", error);
    }
  });
}
