import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI } from "../config.ts";
import { getAdminOAuthTokens, saveAdminOAuthTokens, OAuthTokens } from "./calendarDB.ts";


async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  const url = "https://oauth2.googleapis.com/token";

  const params = new URLSearchParams();
  params.append("client_id", GOOGLE_CLIENT_ID);
  params.append("client_secret", GOOGLE_CLIENT_SECRET);
  params.append("refresh_token", refreshToken);
  params.append("grant_type", "refresh_token");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Не удалось обновить access_token:", errorText);
      return null;
    }

    const data = await response.json();
    const newAccessToken = data.access_token;
    const expiresIn = data.expires_in; // В секундах

    // Обновляем токены в Deno.KV
    const tokens = await getAdminOAuthTokens();
    if (tokens) {
      tokens.access_token = newAccessToken;
      if (expiresIn) {
        tokens.expiry_date = Date.now() + expiresIn * 1000;
      }
      await saveAdminOAuthTokens(tokens);
    }

    return newAccessToken;

  } catch (error) {
    console.error("Ошибка при обновлении access_token:", error);
    return null;
  }
}


export async function getCalendarEventsForTomorrow(): Promise<GoogleCalendarEvent[]> {
  const tokens = await getAdminOAuthTokens();
  if (!tokens || !tokens.access_token) {
    throw new Error("OAuth токены админа недоступны.");
  }

  let accessToken = tokens.access_token;

  // Проверяем, истек ли access_token
  if (tokens.expiry_date && Date.now() >= tokens.expiry_date) {
    if (tokens.refresh_token) {
      const refreshedToken = await refreshAccessToken(tokens.refresh_token);
      if (refreshedToken) {
        accessToken = refreshedToken;
      } else {
        throw new Error("Не удалось обновить access_token.");
      }
    } else {
      throw new Error("Refresh token отсутствует. Требуется повторная авторизация.");
    }
  }

  // Определяем время завтрашнего дня в ISO формате
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const timeMin = new Date(tomorrow);
  timeMin.setHours(0, 0, 0, 0);
  const timeMinISOString = timeMin.toISOString();

  const timeMax = new Date(tomorrow);
  timeMax.setHours(23, 59, 59, 999);
  const timeMaxISOString = timeMax.toISOString();

  // Формируем URL запроса к Google Calendar API
  const calendarId = "primary";
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?timeMin=${encodeURIComponent(timeMinISOString)}&timeMax=${encodeURIComponent(timeMaxISOString)}&singleEvents=true&orderBy=startTime`;

  try {
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Ошибка при получении событий календаря:", errorText);
      throw new Error(`Google Calendar API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.items as GoogleCalendarEvent[] || [];

  } catch (error) {
    console.error("Ошибка при обращении к Google Calendar API:", error);
    throw error;
  }
}

interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
}