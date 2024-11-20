import { Bot, Context } from "@grammyjs/bot"

export async function anonymusMessage(ctx: Context, bot: Bot) {
    await ctx.reply("Привет! Введи своё сообщение.");

    console.log("1-Прошло первое сообщение")
    
    const test = await new Promise<string>((resolve, reject) => {
        console.log("2-Начат процесс получение текста")
        const handler = async (ctx: Context) => {
            try {
                if (ctx.message && ctx.message.text) {
                    resolve(ctx.message.text);
                    console.log("3-Установка хендлера")
                } else {
                    reject(new Error("Message is undefined"));
                }
            } catch (error) {
                reject(error); 
            }
        };
        console.log("4-момент до Бот.Он")
        bot.on("message", handler);
        console.log("5-момент после.")
    });
    console.log("6-До переотправки полученого сообщения")
    await ctx.reply(`Твоё сообщение: ${test}`);
    console.log("7-После переотправки")

}

