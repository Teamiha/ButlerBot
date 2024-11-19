import { webhookCallback } from "@grammyjs/bot";
import { bot } from "./bot.ts";

// Get the token from environment variable
const BOT_TOKEN = Deno.env.get("BOT_TOKEN");
if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN is not set");
}

const handleUpdate = webhookCallback(bot, "std/http", { timeoutMilliseconds: 30000 });

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const incomingPath = url.pathname.slice(1);
    
    if (req.method === "POST" && (
      incomingPath === BOT_TOKEN || 
      incomingPath.startsWith(BOT_TOKEN)
    )) {
      const response = await handleUpdate(req);
      return response;
    }
    
    console.log("⚠️ Unhandled request path");
    return new Response("OK");
  } catch (err) {
    console.error("❌ Error processing request:", err);
    return new Response("Error", { status: 500 });
  }
});