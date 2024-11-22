import { Bot } from "@grammyjs/bot";
import { MyContext } from "./bot.ts";
import { getKv } from "./kvClient.ts";

export async function yerevanToUTC(yerevanHour: number): Promise<number | 0> {
  if (!Number.isInteger(yerevanHour) || yerevanHour < 0 || yerevanHour > 23) {
    throw new Error("Неправильное значение часа.");
  }

  let utcHour = yerevanHour - 4;

  if (utcHour < 0) {
    utcHour += 24;
  }

  return utcHour;
}


interface Notification {
  forUser: number;
  body: string;
}
  
  // Функция для добавления уведомления в очередь
  export async function enqueueNotification(notification: Notification, delay: number = 0) {
  const kv = await getKv();

  // Добавляем уведомление в очередь с указанной задержкой
  await kv.enqueue(notification, { delay });

}

function isNotification(o: unknown): o is Notification {
    return (
      typeof (o as Notification).forUser === "number" &&
      typeof (o as Notification).body === "string"
    );
  }
  
// Настройка слушателя очереди
export async function setupQueueListener(bot: Bot<MyContext>) {
  const kv = await getKv();

    kv.listenQueue(async (msg: unknown) => {
      if (isNotification(msg)) {
        const { forUser, body } = msg;
        try {
          await bot.api.sendMessage(forUser, body);
          console.log(`Сообщение отправлено в группу ${forUser}: ${body}`);
        } catch (error) {
          console.error(`Ошибка при отправке сообщения в группу ${forUser}:`, error);
        }
      } else {
        console.error("Получено неизвестное сообщение:", msg);
      }
    });
  }