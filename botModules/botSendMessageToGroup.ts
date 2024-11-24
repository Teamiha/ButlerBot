import { Bot } from "@grammyjs/bot";
import { MyContext } from "../bot.ts";

export async function sendMessageToGroup(
  ctx: MyContext,
  groupId: string | number,
  message: string,
  bot: Bot<MyContext>,
) {
  const messageToSend =
    `Анонимное сообщение от одного из участников: ${message}`;

  try {
    await bot.api.sendMessage(groupId, messageToSend);
    console.log(`Сообщение отправлено в группу ${groupId}: ${message}`);
    await ctx.reply("Сообщение отправлено");
  } catch (error) {
    console.error(`Ошибка при отправке сообщения в группу ${groupId}:`, error);
  }
}
