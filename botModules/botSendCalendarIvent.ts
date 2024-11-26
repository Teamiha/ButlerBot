import { Bot } from "@grammyjs/bot";
import { IDESOS_GROUP_ID, IDESOSO_NEWS_TOPIC_ID } from "../botStatic/constance.ts";
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
    const eventMessage = `${event.summary}\n\n${
      event.description || "Описание отсутствует"
    }`;

    const messageOptions: any = {};
    
    // Add message_thread_id only for IDESOS_GROUP_ID
    if (chatId === IDESOS_GROUP_ID) {
      messageOptions.message_thread_id = IDESOSO_NEWS_TOPIC_ID;
    }

    await bot.api.sendMessage(chatId, eventMessage, messageOptions);
    console.log(`Сообщение о событии ${eventId} отправлено в группу ${chatId}`);
  } catch (error) {
    console.error(`Ошибка при отправке сообщения о событии ${eventId}:`, error);
  }
}
