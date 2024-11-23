import { getKv } from "./botStatic/kvClient.ts";

// const REDIRECT_URI = "http://localhost:8000/oauth2callback";

// const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];

// let accessToken = "";

//     const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPES.join(
//       " ",
//     )}&access_type=offline`;
//     ctx.reply(`Авторизуйтесь, перейдя по ссылке: ${authUrl}`);
//   });

// bot.use(
//     session<MySession, SessionData>({
//       initial: () => ({}), // Инициализируем сессию
//     }),
//   );

// bot.callbackQuery("calendarAuth", async (ctx) => {
//     const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
//     authUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID);
//     authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
//     authUrl.searchParams.set("response_type", "code");
//     authUrl.searchParams.set("scope", "https://www.googleapis.com/auth/calendar.readonly");
//     authUrl.searchParams.set("access_type", "offline");
//     authUrl.searchParams.set("prompt", "consent");
//     authUrl.searchParams.set("state", "admin");

//     await ctx.reply(`Перейдите по этой ссылке для авторизации админа: ${authUrl.toString()}`);
//   });

const tony = { Id: 703883881 };





// import { enqueueNotification } from "./notificationQueue.ts";
// import { Bot } from "@grammyjs/bot";
// import { MyContext } from "../bot.ts";

// interface Notification {
//   forUser: string;
//   body: string;
// }

// export async function scheduleDailyReminders(bot: Bot<MyContext>) {
//   try {
//     const events = await getCalendarEventsForTomorrow();
    
//     for (const event of events) {
//       if (!event.start || (!event.start.dateTime && !event.start.date)) {
//         continue;
//       }

//       let eventTime: Date;

//       if (event.start.dateTime) {
//         eventTime = new Date(event.start.dateTime);
//       } else if (event.start.date) {
//         eventTime = new Date(event.start.date);
//         eventTime.setHours(9, 0, 0, 0);
//       } else {
//         continue;
//       }

//       const utcHour = await yerevanToUTC(eventTime.getHours());
//       eventTime.setUTCHours(utcHour);

//       const delay = eventTime.getTime() - Date.now();

//       if (delay <= 0) {
//         console.log(`Событие "${event.summary}" уже прошло.`);
//         continue;
//       }

//       const notification: Notification = {
//         forUser: "userId", // Замените на реальный идентификатор пользователя
//         body: `⏰ Напоминание: ${event.summary}\n${event.description || ""}`,
//       };

//       await enqueueNotification(notification, delay);
//     }

//     console.log("Все напоминания за завтра добавлены в очередь.");
//   } catch (error) {
//     console.error("Ошибка при получении событий календаря:", error);
//   }
// }


// Функция которую хотим выполнить
export async function testFunc() {
    console.log("TestFunc выполнена спустя 10 минут!");
}
  
// export async function testDelay(){
//     console.log("Начало выполнения функции с задержкой");
//     try {
//       const kv = await getKv();
//       await kv.enqueue({ action: "TEST_FUNC" }, { delay: 600000 });
//       console.log("Сообщение добавлено в очередь успешно.");
//     } catch (error) {
//       console.error("Ошибка при добавлении сообщения в очередь:", error);
//       // Здесь можно реализовать логику повторной попытки или уведомления
//     }
//   }
export async function deleteTestFuncPending(){
    console.log("Начало выявления и удаления отметки");
    try {
      const kv = await getKv();
      const existing = await kv.get(["TEST_FUNC_PENDING"]);
      if (existing) {
        await kv.delete(["TEST_FUNC_PENDING"]);
        console.log("Отметка удалена");
      } else {
        console.log("Отметка не найдена");
      }
  } catch (error) {
    console.error("Ошибка при удалении отметки:", error);
  }
}

  export async function testDelay(){
    console.log("Начало выполнения функции с задержкой");
    try {
      const kv = await getKv();
      const existing = await kv.get(["TEST_FUNC_PENDING"]);
      if (existing.value !== null) {
        console.log(`Тестовая функция уже запланирована. ${existing.value}`);
        return;
      }

      await kv.enqueue({ action: "TEST_FUNC" }, { delay: 600000 });
      await kv.set(["TEST_FUNC_PENDING"], true, { expireIn: 600000 });
      console.log("Сообщение добавлено в очередь и помечено как запланированное.");
    } catch (error) {
      console.error("Ошибка при добавлении сообщения в очередь:", error);
    }
  }

  
