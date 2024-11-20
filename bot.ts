import { Bot, BotError, Context, session, SessionFlavor } from "@grammyjs/bot";
// import { BOT_TOKEN, CLIENT_ID, CLIENT_SECRET } from "./token.ts";
import { BOT_TOKEN } from "./config.ts";
import { startKeyboard } from "./botStatic/keyboard.ts";
import { botStart } from "./botModules/botStart.ts";
import { testCronDailyMessage, testClaudeDailyMessage, testDenoDailyMessage } from "./botModules/BotDailyMessage.ts";
import { CHAT_ID } from "./botStatic/constance.ts";
import { sendMessageToGroup } from "./botModules/botSendMessageToGroup.ts";

// import { limit } from "https://deno.land/x/grammy_ratelimiter@v1.2.0/mod.ts";



export interface SessionData {
    stage:
      | "anonMessage"
      | "askName"
      | "askBirthDate"
      | "null";
  }

export type MyContext = Context & SessionFlavor<SessionData>;


const bot = new Bot<MyContext>(BOT_TOKEN);



  bot.use(session({
    initial: (): SessionData => ({
      stage: "null",
    }),
  }));

// bot.callbackQuery("auth", (ctx) => {

bot.command("start", async (ctx) => {

    if (ctx.chat.type !== "private") {
        await ctx.reply("Доступ к меню доступен только в личном диалоге с ботом.");
        return;
      }

    // const chatId = ctx.chat.id;
    // await ctx.reply(`ID этого чата: ${chatId}`);
    // console.log(`Chat ID: ${chatId}`);

    await botStart(ctx);
    
});

bot.callbackQuery("anonMessage", async (ctx) => {
    ctx.session.stage = "anonMessage";
    await ctx.reply("Напиши своё сообщение:");
  });

bot.on("message:text", async (ctx) => {
    if (ctx.session.stage === "anonMessage") {
        const messageText = ctx.message.text;

        ctx.session.stage = "null";

        await sendMessageToGroup(bot, CHAT_ID, messageText);

        await ctx.reply("Ваше анонимное сообщение отправлено!");
    }
});


// testClaudeDailyMessage(bot);
testDenoDailyMessage(bot);
testCronDailyMessage(bot);

export { bot };