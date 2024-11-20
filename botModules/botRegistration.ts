import type { SessionData } from "../bot.ts";
import type { MyContext } from "../bot.ts";

export async function botAskName(
  ctx: MyContext,
): Promise<SessionData & { name?: string }> {
  const currentStage = ctx.session.stage;

  const newStage = "askBirthDate";
  await ctx.reply("Какая у вас дата рождения? Напишите в формате ДД.ММ.ГГГГ");

  return { stage: newStage, name };
}
