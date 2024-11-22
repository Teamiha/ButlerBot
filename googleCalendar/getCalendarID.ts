import { getAdminOAuthTokensRemoute } from "../adminRemoute.ts";


export interface Calendar {
    id: string;
    summary: string;
    description?: string;
    location?: string;
    timeZone?: string;
    // Другие поля по необходимости
  }
  
  export async function listAllCalendars(): Promise<Calendar[]> {
    const tokens = await getAdminOAuthTokensRemoute();
    if (!tokens || !tokens.access_token) {
      throw new Error("OAuth токены админа недоступны.");
    }
  
    const url = "https://www.googleapis.com/calendar/v3/users/me/calendarList";
  
    try {
      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${tokens.access_token}`,
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Ошибка при получении списка календарей:", errorText);
        throw new Error(`Google Calendar API error: ${response.statusText}`);
      }
  
      const data = await response.json();
  
      const calendars: Calendar[] = data.items.map((item: any) => ({
        id: item.id,
        summary: item.summary,
        description: item.description,
        location: item.location,
        timeZone: item.timeZone,
      }));
  
      return calendars;
    } catch (error) {
      console.error("Ошибка при обращении к Google Calendar API:", error);
      throw error;
    }
  }
  
  
async function getCalendarID() {
    try {
        const calendars = await listAllCalendars();
        calendars.forEach((calendar) => {
          console.log(`Название: ${calendar.summary}, ID: ${calendar.id}`);
        });
      } catch (error) {
        console.error("Не удалось получить список календарей:", error);
      }
}

getCalendarID();