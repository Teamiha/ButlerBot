import { Bot } from "@grammyjs/bot";
import { IDESOS_GROUP_ID } from "../botStatic/constance.ts";
import { MyContext } from "../bot.ts";
import { formatWeatherMessage, getWeather } from "../NewWeather.ts";
import { yerevanToUTC } from "../helpers.ts";

const weatherData = await getWeather();
const weatherMessage = weatherData ? formatWeatherMessage(weatherData) : "Weather data unavailable";

const dailyMessage =
  `Доброго вечера, дорогой Замок!

${weatherMessage}`;

const targetHour = await yerevanToUTC(23);

export async function botDailyMessage(bot: Bot<MyContext>) {
  Deno.cron("dailyMessage", `0 ${targetHour} * * *`, async () => {
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
