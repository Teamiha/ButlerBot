import { MyContext } from "../bot.ts";
import { hasAccess, getUserParametr } from "../db.ts";
import { startKeyboard, registrationKeyboard } from "../botStatic/keyboard.ts";

export async function botStart(ctx: MyContext) {
  const userId = ctx.from?.id;
  const userName = ctx.from?.username;

  if (userId) {
    const userHasAccess = await hasAccess(userId);
    const userNameDB = await getUserParametr(userId, "nickName");

    if (userHasAccess === false) {
        await ctx.reply(`У вас нет доступа к этому боту.
          Напишите @userinfobot, узнайте свой UserId и отправьте его администратору.
          `);
      return;
    }   

    if (userNameDB !== userName && userName !== undefined) {
        await ctx.reply("Пожалуйста, пройдите регистрацию.", {
            reply_markup: registrationKeyboard,
      });  
      return;
    };  

    if (userHasAccess === true) {
      await ctx.reply("Добро пожаловать! Выберите действие:", {
        reply_markup: startKeyboard,
      });
    }

   


  }


}
