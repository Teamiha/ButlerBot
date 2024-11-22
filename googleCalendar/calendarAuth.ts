/**
 * Скрипт для первичной авторизации админа и сохранения токенов в Deno.KV.
 * Выполняется локально.
 */

const GOOGLE_CLIENT_ID = "";
const REDIRECT_URI = "";

async function authenticate() {
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID);
  authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set(
    "scope",
    "https://www.googleapis.com/auth/calendar.readonly",
  );
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");
  authUrl.searchParams.set("state", "admin");

  console.log("Перейдите по этой ссылке для авторизации админа:");
  console.log(authUrl.toString());

  console.log(
    "После авторизации и перенаправления на REDIRECT_URI, убедитесь, что токены сохранены в Deno.KV.",
  );
}

// authenticate();
