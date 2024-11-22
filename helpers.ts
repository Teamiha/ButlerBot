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
    forUser: string;
    body: string;
  }
  
  // Функция для добавления уведомления в очередь
  export async function enqueueNotification(notification: Notification, delay: number = 0) {
    const kv = await Deno.openKv();
    
  // Добавляем уведомление в очередь с указанной задержкой
  await kv.enqueue(notification, { delay });

  await kv.close();
}
