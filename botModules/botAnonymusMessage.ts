import { MyContext } from "../bot.ts";

export async function anonymusMessage(ctx: MyContext) {
        ctx.session.waitingForMessage = true; // Устанавливаем состояние ожидания
        await ctx.reply("Напиши своё сообщение:");
      
        // Ожидание пользовательского ввода
        const onMessageHandler = async (ctx: MyContext) => {
          if (ctx.session.waitingForMessage) {
            ctx.session.waitingForMessage = false; // Сбрасываем состояние
            await ctx.reply(`Твоё сообщение: "${ctx.message?.text}"`);
          }
        };
      
        return onMessageHandler;
      

}

