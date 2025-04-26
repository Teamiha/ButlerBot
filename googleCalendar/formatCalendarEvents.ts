import { GoogleCalendarEvent } from "../googleCalendar/calendarSevice.ts";

export function formatCalendarEvents(events: GoogleCalendarEvent[]): string {
  if (events.length === 0) {
    return "На завтра мероприятий не запланировано.";
  }

  const formattedEvents = events.map(event => {
    const startTime = event.start.dateTime 
      ? new Date(event.start.dateTime).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      : 'Весь день';
    
    return `🕒 ${startTime}
📍 ${event.summary}
${event.description ? `📝 ${event.description}\n` : ''}`;
  }).join('\n\n');

  return `Мероприятия на завтра:\n\n${formattedEvents}`;
}