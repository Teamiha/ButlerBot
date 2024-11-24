import type { UserData } from "./db.ts";
import type { OAuthTokens } from "./googleCalendar/calendarDB.ts";
import type { GoogleCalendarEvent } from "./googleCalendar/calendarSevice.ts";
import { refreshAccessToken } from "./googleCalendar/calendarSevice.ts";
import { getAdminOAuthTokens } from "./googleCalendar/calendarDB.ts";

const kv = await Deno.openKv(
  "https://api.deno.com/databases/2e98651c-42ea-4252-87db-2d523699ec9b/connect",
);

async function grantAccess(userId: number) {
  const result = await kv.get<number[]>(["reltubBot", "accessList"]);
  const accessList = result.value || [];

  if (!accessList.includes(userId)) {
    accessList.push(userId);
    await kv.set(["reltubBot", "accessList"], accessList);
  }
}

export async function getUser(userId: number) {
  const user = await kv.get<UserData>(["reltubBot", "userId:", userId]);
  return user.value;
}

// async function getAdminOAuthTokens() {
//   const result = await kv.get<OAuthTokens>(["admin", "oauthTokens"]);
//   return result.value;
// }

export async function getAdminOAuthTokensRemoute(): Promise<
  OAuthTokens | null
> {
  const result = await kv.get<OAuthTokens>(["admin", "oauthTokens"]);

  return result.value || null;
}

async function getGoogleEvents(): Promise<GoogleCalendarEvent[]> {
  try {
    const events: GoogleCalendarEvent[] = [];

    // Получаем все записи с префиксом "Google_event"
    const eventsIterator = kv.list<GoogleCalendarEvent>({
      prefix: ["reltubBot", "Google_event"],
    });

    for await (const entry of eventsIterator) {
      events.push(entry.value);
    }

    console.log(`Получено ${events.length} событий из Deno.kv`);
    return events;
  } catch (error) {
    console.error("Ошибка при получении событий из Deno.kv:", error);
    return [];
  }
}

async function getGoogleEventById(
  eventId: string,
): Promise<GoogleCalendarEvent | null> {
  try {
    const event = await kv.get<GoogleCalendarEvent>([
      "reltubBot",
      "Google_event",
      `event:${eventId}`,
    ]);
    return event.value;
  } catch (error) {
    console.error(`Ошибка при получении события ${eventId} из Deno.kv:`, error);
    return null;
  }
}

// async function addAdmin(userId: number) {
//   await kv.delete(["reltubBot", "adminList"], userId);
// }

export async function addAdmin(userId: number) {
    const result = await kv.get<number[]>(["reltubBot", "adminList"]);
    const adminList = result.value || [];
  
    if (!adminList.includes(userId)) {
      adminList.push(userId);
      await kv.set(["reltubBot", "adminList"], adminList);
    }
  }

// grantAccess(526827458)
// console.log(await getUser(526827458));
// console.log(await getAdminOAuthTokensRemoute());

// console.log(await getGoogleEvents());
// addAdmin(526827458);    
