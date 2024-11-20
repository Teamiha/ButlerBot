import { Bot, Context } from "@grammyjs/bot"

export async function anonymusMessage(ctx: Context, bot: Bot) {
    await ctx.reply("Привет! Введи своё сообщение.");
    
    const test = await new Promise<string>((resolve, reject) => {
        const handler = async (ctx: Context) => {
            try {
                if (ctx.message && ctx.message.text) {
                    resolve(ctx.message.text);
                } else {
                    reject(new Error("Message is undefined"));
                }
            } catch (error) {
                reject(error); 
            }
        };
        bot.on("message:text", handler);
    });

    await ctx.reply(`Твоё сообщение: ${test}`);
}

