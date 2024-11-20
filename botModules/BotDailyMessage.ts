import { cron } from "@cron";
import { Bot } from "@grammyjs/bot";
import { CHAT_ID } from "../botStatic/constance.ts";
import { MyContext } from "../bot.ts";
import { formatWeatherMessage, getTodayWeather } from "../weatherService.ts";

const weatherMessage = formatWeatherMessage(await getTodayWeather());

const dailyMessage1 =
  `Сейчас 11 часов утра, и я, такой молодец, созданный гениальный Михаилом, вам об этом сообщаю!
Cron сработал успешно.
`;
const dailyMessage2 =
  `Сейчас 12 часов утра, и это должно быть сегодня единственное сообщение.
А ещё, рассписание погоды на сегодня!
${weatherMessage}`;

const dailyMessage3 =
  `Сейчас 13 часов утра, и я, такой молодец, созданный гениальный Михаилом, вам об этом сообщаю!
DenoCron обмазанный всяким, сработал успешно. 
`;

// function yerevanToUTC(yerevanHour: number): number | null {
//     // Проверяем валидность входных данных
//     if (!Number.isInteger(yerevanHour) || yerevanHour < 0 || yerevanHour > 23) {
//         return null;
//     }

//     // Ереван находится в UTC+4, поэтому вычитаем 4 часа
//     let utcHour = yerevanHour - 4;

//     // Если получилось отрицательное число, добавляем 24 часа
//     if (utcHour < 0) {
//         utcHour += 24;
//     }

//     return utcHour;
// }

// const targetHour = yerevanToUTC(11)

// const test: Deno.CronSchedule =

export function testCronDailyMessage(bot: Bot<MyContext>) {
  cron("0 7 * * *", async () => {
    try {
      console.log("Бот проснулся.");
      await bot.api.sendMessage(CHAT_ID, dailyMessage1);
      console.log("Ежедневное сообщение Crone отправлено.");
    } catch (error) {
      console.error(
        "Ошибка при отправке Crone еженедельного сообщения:",
        error,
      );
    }
  });
}

export async function testDenoDailyMessage(bot: Bot<MyContext>) {
  Deno.cron("testMessage", "0 8 * * *", async () => {
    try {
      console.log("Бот проснулся.");
      await bot.api.sendMessage(CHAT_ID, dailyMessage2);
      console.log("Ежедневное сообщение DenoCrone отправлено.");
    } catch (error) {
      console.error(
        "Ошибка при отправке DenoCrone еженедельного сообщения:",
        error,
      );
    }
  });
}

export async function testClaudeDailyMessage(bot: Bot<MyContext>) {
  Deno.cron("daily-message", "0 9 * * *", async () => {
    try {
      console.log("Бот проснулся.");
      await bot.api.sendMessage(CHAT_ID, dailyMessage3);
      console.log("Ежедневное сообщение отправлено ClaudeDenoCron.");
    } catch (error) {
      console.error(
        "Ошибка при отправке ежедневного сообщения ClaudeDenoCron:",
        error,
      );

      if (error instanceof Error) {
        console.error("Детали ошибки:", error.message);
        console.error("Стек вызовов:", error.stack);
      }
    }
  });
}
