// import { Context } from "@grammyjs/bot";
// import { getUserParametr, updateUser } from "../db.ts";
// import { getDate } from "../helpers.ts";
// import { startKeyboard } from "../botStatic/keyboard.ts";

// export async function botStart(ctx: Context) {
//   const userId = ctx.from?.id;
//   const userName = ctx.from?.username;

//   if (userId) {
//     const userFirstTime = await getUserParametr(userId, "isFirstTime");
//     const userNameDB = await getUserParametr(userId, "userName");
//     if (userNameDB !== userName && userName !== undefined) {
//       await updateUser(userId, "userName", userName);
//     }
//     if (userFirstTime === true) {
//       await ctx.reply(
//         `В честь первого посещения, вы получаете бесплатный билет!
//                 Можете сразу начать гадать!`,
//       );
//       await updateUser(userId, "isFirstTime", false);
//       await updateUser(userId, "firstVisitDate", await getDate());
//     }
//     await updateUser(userId, "lastVisitDate", await getDate());
//   }

//   await ctx.reply("Добро пожаловать! Выберите действие:", {
//     reply_markup: startKeyboard,
//   });

//   return { userId }; 
// }
