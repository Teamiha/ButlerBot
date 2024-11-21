import { Bot } from "@grammyjs/bot";
import { CHAT_ID } from "../botStatic/constance.ts";
import { MyContext } from "../bot.ts";

const schedule: Deno.CronSchedule = {
  minute: 0,
  hour: 11,
  dayOfMonth: 0,
  month: 0,
  dayOfWeek: 0,
};
