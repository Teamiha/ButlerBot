import { Context } from "@grammyjs/bot";
import { hasAccess, updateUser } from "../db.ts";
import { startKeyboard } from "../botStatic/keyboard.ts";

export async function botStart(ctx: Context) {
  const userId = ctx.from?.id;
  const userName = ctx.from?.username;

  if (userId) {
    const userHasAccess = await hasAccess(userId);

    if (userHasAccess === true) {
      await ctx.reply("Добро пожаловать! Выберите действие:", {
        reply_markup: startKeyboard,
      });
    }
    if (userHasAccess === false) {
      await ctx.reply("У вас нет доступа к этому боту.")
      ;
    }
  }
}
