import { Bot, Context } from "@grammyjs/bot"

export async function anonymusMessage(ctx: Context, bot:Bot) {
    await ctx.reply("Привет! Введи своё сообщение.");
    var test = ""

    // bot.on("message:text", async (ctx) => {
    //     test = ctx.message.text
    // })

    test = await new Promise((resolve) => {
        bot.on("message:text", async (ctx) => {
            resolve(ctx.message.text);
        });
    });


    await ctx.reply(`Твоё сообщение: ${test}`);

}