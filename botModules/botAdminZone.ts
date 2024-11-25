import { MyContext } from "../bot.ts";
import { SUPERUSER } from "../config.ts";
import { adminKeyboard } from "../botStatic/keyboard.ts";
import { getKv } from "../botStatic/kvClient.ts";

async function hasAdminAccess(userId: number): Promise<boolean> {
  if (userId === Number(SUPERUSER)) {
    return true;
  }

  const kv = await getKv();

  const result = await kv.get<number[]>(["reltubBot", "adminList"]);
  const adminList = result.value || [];

  return adminList.includes(userId);
}

export async function botAdminZone(ctx: MyContext) {
  if (ctx.from) {
    const adminAccess = await hasAdminAccess(ctx.from.id);
    if (!adminAccess) {
      await ctx.reply("У вас нет доступа к этой команде.");
      return;
    } else {
      await ctx.editMessageReplyMarkup({
        reply_markup: adminKeyboard,
      });
    }
  }
}
