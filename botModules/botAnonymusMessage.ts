

bot.callbackQuery("chosenYes", async (ctx) => {
    const stage = await botChosenYes(ctx);
    ctx.session.stage = stage.stage;
  });