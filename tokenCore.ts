// let accessToken = "";

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

// Функция запускает сервер и возвращает токены после авторизации
export async function getOAuthTokens(): Promise<Tokens> {
  console.log("Запуск сервера для авторизации...");

  return new Promise((resolve, reject) => {
    Deno.serve({ port: 8000 }, async (req) => {
      const url = new URL(req.url, `http://localhost:8000`);

      if (url.pathname === "/oauth2callback") {
        const code = url.searchParams.get("code");
        if (!code) {
          return new Response("Не передан код авторизации", { status: 400 });
        }

        try {
          const tokenResponse = await fetch(
            "https://oauth2.googleapis.com/token",
            {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({
                code,
                client_id: "your-client-id.apps.googleusercontent.com",
                client_secret: "your-client-secret",
                redirect_uri: "http://localhost:8000/oauth2callback",
                grant_type: "authorization_code",
              }).toString(),
            },
          );

          const tokenData = await tokenResponse.json();
          if (
            tokenResponse.ok && tokenData.access_token &&
            tokenData.refresh_token
          ) {
            console.log("Токены получены:", tokenData);
            resolve({
              accessToken: tokenData.access_token,
              refreshToken: tokenData.refresh_token,
            });
            return new Response("Авторизация успешна! Можно закрыть это окно.");
          } else {
            console.error("Ошибка получения токена:", tokenData);
            reject(new Error("Ошибка получения токена"));
            return new Response("Ошибка авторизации", { status: 500 });
          }
        } catch (err) {
          console.error("Ошибка во время запроса токена:", err);
          reject(err);
          return new Response("Ошибка сервера", { status: 500 });
        }
      }

      return new Response("Страница не найдена", { status: 404 });
    });
  });
}
