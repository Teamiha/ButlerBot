import { Bot } from "@grammyjs/bot";
import { CHAT_ID } from "../botStatic/constance.ts";
import { MyContext } from "../bot.ts";
import { getKv } from "../botStatic/kvClient.ts";
import { GoogleCalendarEvent } from "../googleCalendar/calendarSevice.ts";

export async function sendCalendarEventToGroup(
  bot: Bot<MyContext>,
  chatId: string | number,
  eventId: string,
) {
  try {
    const kv = await getKv();
    const eventEntry = await kv.get<GoogleCalendarEvent>([
      "reltubBot",
      "Google_event",
      `event:${eventId}`,
    ]);

    if (!eventEntry.value) {
      console.error(`Событие с ID ${eventId} не найдено`);
      return;
    }

    const event = eventEntry.value;
    const eventMessage = `📅 ${event.summary}\n\n${
      event.description || "Описание отсутствует"
    }`;

    await bot.api.sendMessage(chatId, eventMessage);
    console.log(`Сообщение о событии ${eventId} отправлено в группу ${chatId}`);
  } catch (error) {
    console.error(`Ошибка при отправке сообщения в группу ${chatId}:`, error);
  }
}
