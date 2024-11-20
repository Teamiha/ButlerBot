export const BOT_TOKEN = Deno.env.get("BOT_TOKEN") || "";
export const OPENWEATHER_API_KEY = Deno.env.get("OPENWEATHER_API_KEY") || "";
// export const googleAIKey = Deno.env.get("GOOGLE_AI_KEY") || "";

if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN environment variable is required");
}

if (!OPENWEATHER_API_KEY) {
  throw new Error("OPENWEATHER_API_KEY environment variable is required");
}

// if (!googleAIKey) {
//   throw new Error("GOOGLE_AI_KEY environment variable is required");
// } 