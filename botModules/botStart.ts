import { MyContext } from "../bot.ts";
import { hasAccess, updateUser } from "../db.ts";
import { startKeyboard, registrationKeyboard } from "../botStatic/keyboard.ts";

export async function botStart(ctx: MyContext) {
  const userId = ctx.from?.id;
  const userName = ctx.from?.username;

  if (userId) {
    const userHasAccess = await hasAccess(userId);

    if (userHasAccess === true) {
      await ctx.reply("Добро пожаловать! Выберите действие:", {
        reply_markup: startKeyboard,
      });
    }
    
    if (userName === "") {
      await ctx.reply("Пожалуйста, пройдите регистрацию.", {
        reply_markup: registrationKeyboard,
      });
    }



    if (userHasAccess === false) {
      await ctx.reply("У вас нет доступа к этому боту.")
    //   @userinfobot
      ;
    }
  }
}
