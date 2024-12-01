import { OPENWEATHER_API_KEY } from "./config.ts";

const YEREVAN_CITY_ID = "616052"; // Код города Еревана





interface WeatherData {
  temperature: number;
  feels_like: number;
  humidity: number;
  description: string;
  wind_speed: number;
}

export async function getTodayWeather(): Promise<WeatherData> {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?id=${YEREVAN_CITY_ID}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=ru`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      temperature: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      wind_speed: data.wind.speed,
    };
  } catch (error) {
    console.error("Ошибка при получении погоды:", error);
    throw new Error("Не удалось получить данные о погоде");
  }
}

// Функция для форматирования данных о погоде в текстовое сообщение
export function formatWeatherMessage(weather: WeatherData): string {
  return `🌤 Погода в Ереване сегодня:
  
🌡 Температура: ${weather.temperature}°C
🤔 Ощущается как: ${weather.feels_like}°C
💧 Влажность: ${weather.humidity}%
🌪 Скорость ветра: ${weather.wind_speed} м/с
📝 Описание: ${weather.description}`;
}