import { Bot, Context } from "@grammyjs/bot"

export async function anonymusMessage(ctx: Context, bot:Bot) {
    await ctx.reply("Привет! Введи своё сообщение.");
    

    const test = await new Promise((resolve) => {
        bot.on("message:text", async (ctx) => {
            resolve(ctx.message.text);
        });
    });


    await ctx.reply(`Твоё сообщение: ${test}`);

}