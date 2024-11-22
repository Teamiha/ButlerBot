// import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI } from "../config.ts";
import { saveAdminOAuthTokens, OAuthTokens } from "./calendarDB.ts";

/**
 * Скрипт для первичной авторизации админа и сохранения токенов в Deno.KV.
 * Выполняется локально.
 */

const GOOGLE_CLIENT_ID = "807770638319-l83slf1o30vd5k7cs996j18t9i7tgcch.apps.googleusercontent.com";
const REDIRECT_URI = "https://mikhail-butlerbot-63.deno.dev/oauth2callback";

async function authenticate() {
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID);
  authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "https://www.googleapis.com/auth/calendar.readonly");
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");
  authUrl.searchParams.set("state", "admin");

  console.log("Перейдите по этой ссылке для авторизации админа:");
  console.log(authUrl.toString());

  console.log("После авторизации и перенаправления на REDIRECT_URI, убедитесь, что токены сохранены в Deno.KV.");
}

authenticate();