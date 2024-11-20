import { MyContext } from "../bot.ts";

export async function anonymusMessage(ctx: MyContext) {
        ctx.session.waitingForMessage = true; // Устанавливаем состояние ожидания
        await ctx.reply("Напиши своё сообщение:");
      
        const onMessageHandler = async (ctx: MyContext) => {
          if (ctx.session.waitingForMessage) {
            ctx.session.waitingForMessage = false; // Сбрасываем состояние
            const message = ctx.message?.text;
            return message;
          }
        };
      return onMessageHandler
}

