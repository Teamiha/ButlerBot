import { Bot } from "@grammyjs/bot";
import { MyContext } from "./bot.ts";
import { getKv } from "./botStatic/kvClient.ts";

export async function yerevanToUTC(yerevanHour: number): Promise<number | 0> {
  if (!Number.isInteger(yerevanHour) || yerevanHour < 0 || yerevanHour > 23) {
    throw new Error("Неправильное значение часа.");
  }

  let utcHour = yerevanHour - 4;

  if (utcHour < 0) {
    utcHour += 24;
  }

  return utcHour;
}
