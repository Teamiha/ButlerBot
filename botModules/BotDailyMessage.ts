import { cron } from "@cron";
import { Bot } from "https://deno.land/x/grammy/mod.ts";
import { CHAT_ID } from "../botStatic/constance.ts";
// import { CronSchedule } from "@DenoCrone";

const dailyMessage1 = `Сейчас 10 часов утра, и я, такой молодец, созданный гениальный Михаилом, вам об этом сообщаю!
Cron сработал успешно.
`
const dailyMessage2 = `Сейчас 11 часов утра, и я, такой молодец, созданный гениальный Михаилом, вам об этом сообщаю!
Чистый DenoCron сработал успешно.
`
const dailyMessage3 = `Сейчас 12 часов утра, и я, такой молодец, созданный гениальный Михаилом, вам об этом сообщаю!
DenoCron обмазанный всяким, сработал успешно. 
`




export function testCronDailyMessage(bot: Bot) {

    cron("0 10 * * *", async () => {
        try {
            console.log("Бот проснулся.");
            await bot.api.sendMessage(CHAT_ID, dailyMessage1);
            console.log("Ежедневное сообщение Crone отправлено.");
        } catch (error) {
            console.error("Ошибка при отправке Crone еженедельного сообщения:", error);
        }
    });
}

export async function testDenoDailyMessage(bot: Bot) {
    Deno.cron("testMessage", "0 10 * * *", async () => { 
        try {
            console.log("Бот проснулся.");
            await bot.api.sendMessage(CHAT_ID, dailyMessage2);
            console.log("Ежедневное сообщение DenoCrone отправлено.");
        } catch (error) {
            console.error("Ошибка при отправке DenoCrone еженедельного сообщения:", error);
        }
    }
)};



export async function testClaudeDailyMessage(bot: Bot) {

    Deno.cron("daily-message", "0 12 * * *", async () => {
        try {
            console.log("Бот проснулся.");
            await bot.api.sendMessage(CHAT_ID, dailyMessage3);
            console.log("Ежедневное сообщение отправлено ClaudeDenoCron.");
        } catch (error) {
            console.error("Ошибка при отправке ежедневного сообщения ClaudeDenoCron:", error);
            
            if (error instanceof Error) {
                console.error("Детали ошибки:", error.message);
                console.error("Стек вызовов:", error.stack);
            }
        }
    });
}