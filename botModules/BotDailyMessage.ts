import { cron } from "@cron";
import { Bot } from "https://deno.land/x/grammy/mod.ts";
import { CHAT_ID } from "../botStatic/constance.ts";

const dailyMessage = "Сейчас 10 часов утра, и я, такой молодец, созданный гениальный Михаилом, вам об этом сообщаю!"




export function testCronDailyMessage(bot: Bot) {

    cron("0 10 * * *", async () => {
        try {
            await bot.api.sendMessage(CHAT_ID, dailyMessage);
            console.log("Еженедельное сообщение отправлено.");
        } catch (error) {
            console.error("Ошибка при отправке еженедельного сообщения:", error);
        }
    });
}
