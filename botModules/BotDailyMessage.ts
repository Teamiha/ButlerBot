import { Bot } from "@grammyjs/bot";
import { IDESOS_GROUP_ID } from "../botStatic/constance.ts";
import { MyContext } from "../bot.ts";
import { formatWeatherMessage, getTodayWeather } from "../weatherService.ts";
import { yerevanToUTC } from "../helpers.ts";


const weatherMessage = formatWeatherMessage(await getTodayWeather());

const dailyMessage =
  `С добрым утром дорогой замок!

${weatherMessage}`;

const targetHour = await yerevanToUTC(9);

export async function botDailyMessage(bot: Bot<MyContext>) {
  Deno.cron("testMessage", `0 ${targetHour} * * *`, async () => {
    try {
      console.log("Бот проснулся.");
      await bot.api.sendMessage(IDESOS_GROUP_ID, dailyMessage);
      console.log("Ежедневное сообщение DenoCrone отправлено.");
    } catch (error) {
      console.error(
        "Ошибка при отправке DenoCrone еженедельного сообщения:",
        error,
      );
    }
  });
}
