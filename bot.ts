import { Bot, BotError, Context, session, SessionFlavor } from "@grammyjs/bot";
// import { BOT_TOKEN, CLIENT_ID, CLIENT_SECRET } from "./token.ts";
import { BOT_TOKEN } from "./config.ts";
import {cron} from "@cron"; 
import { startKeyboard } from "./botStatic/keyboard.ts";
import { botStart } from "./botModules/botStart.ts";
import { testCronDailyMessage, testClaudeDailyMessage, testDenoDailyMessage } from "./botModules/BotDailyMessage.ts";
import { anonymusMessage } from "./botModules/botAnonymusMessage.ts";
import { CHAT_ID } from "./botStatic/constance.ts";
import { sendMessageToGroup } from "./botModules/botSendMessageToGroup.ts";

// import { limit } from "https://deno.land/x/grammy_ratelimiter@v1.2.0/mod.ts";



export interface SessionData {
    stage:
      | "waitingForMessage"
      | "null";
    anonoymusMassage: string;
    waitingForMessage: boolean;
  }

export type MyContext = Context & SessionFlavor<SessionData>;


const bot = new Bot<MyContext>(BOT_TOKEN);



  bot.use(session({
    initial: (): SessionData => ({
      stage: "null",
      anonoymusMassage: "",
      waitingForMessage: false,
    }),
  }));

// bot.callbackQuery("auth", (ctx) => {

bot.command("start", async (ctx) => {

    // const chatId = ctx.chat.id;
    // await ctx.reply(`ID этого чата: ${chatId}`);
    // console.log(`Chat ID: ${chatId}`);

    await botStart(ctx);
    
});

bot.callbackQuery("anonMessage", async (ctx) => {
    ctx.session.waitingForMessage = true;
    await ctx.reply("Напиши своё сообщение:");
  });

bot.on("message:text", async (ctx) => {
    if (ctx.session.waitingForMessage) {
        // Retrieve the user's message
        const messageText = ctx.message.text;

        // Reset the session flag
        ctx.session.waitingForMessage = false;

        // Send the anonymous message to the specified group
        await sendMessageToGroup(bot, 526827458, messageText);

        // Optionally, inform the user that their message has been sent
        await ctx.reply("Ваше анонимное сообщение отправлено!");
    }
});


// testClaudeDailyMessage(bot);
testDenoDailyMessage(bot);
testCronDailyMessage(bot);

export { bot };