import { Bot } from "@grammyjs/bot";
import { CHAT_ID } from "../botStatic/constance.ts";
import { MyContext } from "../bot.ts";

export async function sendMessageToGroup(
  bot: Bot<MyContext>,
  groupId: string | number,
  message: string,
) {
  const messageToSend =
    `Анонимное сообщение от одного из участников: ${message}`;

  try {
    await bot.api.sendMessage(groupId, messageToSend);
    console.log(`Сообщение отправлено в группу ${groupId}: ${message}`);
  } catch (error) {
    console.error(`Ошибка при отправке сообщения в группу ${groupId}:`, error);
  }
}
