import { Bot, BotError, Context, session, SessionFlavor } from "@grammyjs/bot";
import { BOT_TOKEN } from "./token.ts";

const bot = new Bot(BOT_TOKEN);

bot.command("start", async (ctx) => {
  await ctx.reply("Hello")
  });


bot.start();