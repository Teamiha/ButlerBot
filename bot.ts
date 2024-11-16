import { Bot, BotError, Context, session, SessionFlavor } from "@grammyjs/bot";
import { BOT_TOKEN, CLIENT_ID, CLIENT_SECRET } from "./token.ts";
import { startKeyboard } from "./keyboard.ts";

const REDIRECT_URI = "http://localhost:8000/oauth2callback";
const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];

let accessToken = "";

const bot = new Bot(BOT_TOKEN);

bot.callbackQuery("auth", (ctx) => {
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPES.join(
      " ",
    )}&access_type=offline`;
    ctx.reply(`Авторизуйтесь, перейдя по ссылке: ${authUrl}`);
  });




bot.command("start", async (ctx) => {
    await ctx.reply("Start:", {
        reply_markup: startKeyboard,
      });
  });


bot.start();