export const BOT_TOKEN = Deno.env.get("BOT_TOKEN") || "";
export const OPENWEATHER_API_KEY = Deno.env.get("OPENWEATHER_API_KEY") || "";
export const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID") || "";
export const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET") || "";
export const REDIRECT_URI = Deno.env.get("REDIRECT_URI") ||
  "https://yourdomain.com/oauth2callback";

export const SUPERUSER = Deno.env.get("SUPERUSER") || "";

export const NEW_WEATHER_KEY = Deno.env.get("NEW_WEATHER_KEY") || "";

if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN environment variable is required");
}

if (!OPENWEATHER_API_KEY) {
  throw new Error("OPENWEATHER_API_KEY environment variable is required");
}

if (!GOOGLE_CLIENT_ID) {
  throw new Error("GOOGLE_CLIENT_ID environment variable is required");
}

if (!GOOGLE_CLIENT_SECRET) {
  throw new Error("GOOGLE_CLIENT_SECRET environment variable is required");
}

if (!REDIRECT_URI) {
  throw new Error("REDIRECT_URI environment variable is required");
}

if (!SUPERUSER) {
  throw new Error("SUPERUSER environment variable is required");
}

if (!NEW_WEATHER_KEY) {
  throw new Error("NEW_WEATHER_KEY environment variable is required");
}
