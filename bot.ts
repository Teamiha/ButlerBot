import { Bot, BotError, Context, session, SessionFlavor } from "@grammyjs/bot";
// import { BOT_TOKEN, CLIENT_ID, CLIENT_SECRET } from "./token.ts";
import { BOT_TOKEN } from "./config.ts";
import {cron} from "@cron"; 
import { startKeyboard } from "./botStatic/keyboard.ts";
import { botStart } from "./botModules/botStart.ts";
import { testCronDailyMessage, testClaudeDailyMessage, testDenoDailyMessage } from "./botModules/BotDailyMessage.ts";
import { anonymusMessage } from "./botModules/botAnonymusMessage.ts";

// import { limit } from "https://deno.land/x/grammy_ratelimiter@v1.2.0/mod.ts";



interface MySession {
    waitingForMessage?: boolean;
  }

export type MyContext = Context & SessionFlavor<MySession>;


const bot = new Bot<MyContext>(BOT_TOKEN);

bot.use(session<MySession, MyContext>())

// bot.callbackQuery("auth", (ctx) => {

bot.command("start", async (ctx) => {

    // const chatId = ctx.chat.id;
    // await ctx.reply(`ID этого чата: ${chatId}`);
    // console.log(`Chat ID: ${chatId}`);

    await botStart(ctx);
    
});

bot.callbackQuery("anonMessage", async (ctx) => {
    await anonymusMessage(ctx)
  });




// testClaudeDailyMessage(bot);
testDenoDailyMessage(bot);
testCronDailyMessage(bot);

export { bot };