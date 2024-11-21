import { Bot } from "@grammyjs/bot";
import { CHAT_ID } from "../botStatic/constance.ts";
import { MyContext } from "../bot.ts";
import { formatWeatherMessage, getTodayWeather } from "../weatherService.ts";
import { yerevanToUTC } from "../helpers.ts";
const weatherMessage = formatWeatherMessage(await getTodayWeather());

const dailyMessage =
  `Сейчас 12 часов утра, тест новой передачи целевого значения времени.

${weatherMessage}`;

const targetHour = await yerevanToUTC(12);

// const schedule: Deno.CronSchedule = {
//     minute: 0,
//     hour: 8,
//     dayOfMonth: 0,
//     month: 0,
//     dayOfWeek: 0,
// };


export async function testDenoDailyMessage(bot: Bot<MyContext>) {
  Deno.cron("testMessage", `0 ${targetHour} * * *`, async () => {
    try {
      console.log("Бот проснулся.");
      await bot.api.sendMessage(CHAT_ID, dailyMessage);
      console.log("Ежедневное сообщение DenoCrone отправлено.");
    } catch (error) {
      console.error(
        "Ошибка при отправке DenoCrone еженедельного сообщения:",
        error,
      );
    }
  });
}

