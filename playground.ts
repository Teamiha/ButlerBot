// const REDIRECT_URI = "http://localhost:8000/oauth2callback";
// const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];

// let accessToken = "";

//     const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPES.join(
//       " ",
//     )}&access_type=offline`;
//     ctx.reply(`Авторизуйтесь, перейдя по ссылке: ${authUrl}`);
//   });

// bot.use(
//     session<MySession, SessionData>({
//       initial: () => ({}), // Инициализируем сессию
//     }),
//   );

// bot.callbackQuery("calendarAuth", async (ctx) => {
//     const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
//     authUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID);
//     authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
//     authUrl.searchParams.set("response_type", "code");
//     authUrl.searchParams.set("scope", "https://www.googleapis.com/auth/calendar.readonly");
//     authUrl.searchParams.set("access_type", "offline");
//     authUrl.searchParams.set("prompt", "consent");
//     authUrl.searchParams.set("state", "admin");

//     await ctx.reply(`Перейдите по этой ссылке для авторизации админа: ${authUrl.toString()}`);
//   });

const tony = { Id: 703883881 };
