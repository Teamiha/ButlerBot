import { MyContext } from "../bot.ts";

export async function anonymusMessage(ctx: MyContext) {
    ctx.session.waitingForMessage = true;
    await ctx.reply("Напиши своё сообщение:");
      
    const onMessageHandler = async (ctx: MyContext) => {
        if (ctx.session.waitingForMessage && ctx.message?.text) {
            ctx.session.waitingForMessage = false;
            return ctx.message.text;
        }
        return null;
    };
      
    return onMessageHandler;
}

