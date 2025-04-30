import { GoogleCalendarEvent } from "../googleCalendar/calendarSevice.ts";

export function formatCalendarEvents(events: GoogleCalendarEvent[]): string {
  if (events.length === 0) {
    return "Мероприятия: нет";
  }

  const formattedEvents = events.map(event => {
    const startTime = event.start.dateTime 
      ? new Date(event.start.dateTime).toLocaleTimeString('ru-RU', { 
          hour: '2-digit', 
          minute: '2-digit',
          timeZone: 'Asia/Yerevan'
        })
      : '00:00';
    
    const endTime = event.end.dateTime 
      ? new Date(event.end.dateTime).toLocaleTimeString('ru-RU', { 
          hour: '2-digit', 
          minute: '2-digit',
          timeZone: 'Asia/Yerevan'
        })
      : '23:59';

    // Извлекаем место проведения из описания или используем дефолтное значение
    const location = event.location || "Место не указано"; // Предполагаем, что место указано в поле location

    return `⌚ ${startTime} - ${endTime}, ${location}\n📍 ${event.summary}`;
  }).join('\n\n');

  return `Мероприятия:\n\n${formattedEvents}`;
}