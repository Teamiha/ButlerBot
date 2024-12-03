import { NEW_WEATHER_KEY } from "./config.ts";

type WeatherData = {
    temperature: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    description: string;
    dailyForecast: { time: string; temperature: number; description: string }[];
  };
  

  const latitude = 40.1792;
  const longitude = 44.4991;
  
  const url = `https://api.tomorrow.io/v4/timelines?location=${latitude},${longitude}&fields=temperature,humidity,windSpeed,temperatureApparent,weatherCode&timesteps=1h&units=metric&apikey=${NEW_WEATHER_KEY}`;
  
  export async function getWeather(): Promise<WeatherData | null> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }
      const data = await response.json();
      const intervals = data.data.timelines[0].intervals;
  
      // Текущая погода
      const currentWeather = intervals[0].values;
  
      // Прогноз на день
      const dailyForecast = intervals.slice(0, 24).map((interval: any) => ({
        time: new Date(interval.startTime).toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        temperature: interval.values.temperature,
        description: getWeatherDescription(interval.values.weatherCode),
      }));
  
      // Формируем общий объект
      const weather: WeatherData = {
        temperature: Math.round(currentWeather.temperature),
        feels_like: Math.round(currentWeather.temperatureApparent),
        humidity: currentWeather.humidity,
        wind_speed: currentWeather.windSpeed,
        description: getWeatherDescription(currentWeather.weatherCode),
        dailyForecast,
      };
  
      return weather;
    } catch (error) {
      console.error("Ошибка при запросе:", error);
      return null;
    }
  }
  
  function getWeatherDescription(code: number): string {
    const descriptions: Record<number, string> = {
      1000: "Ясно",
      1001: "Облачно",
      1100: "Переменная облачность",
      1101: "Местами облачно",
      1102: "Сильно облачно",
      2000: "Туман",
      2100: "Местами туман",
      3000: "Ветреная погода",
      3001: "Легкий ветер",
      3002: "Сильный ветер",
      4000: "Мелкий дождь",
      4001: "Дождь",
      4200: "Небольшой дождь",
      4201: "Ливень",
      5000: "Снег",
      5001: "Снег с перерывами",
      5100: "Небольшой снег",
      5101: "Снегопад",
      6000: "Мелкий дождь с заморозками",
      6001: "Дождь с заморозками",
      6200: "Легкий замерзающий дождь",
      6201: "Сильный замерзающий дождь",
      7000: "Град",
      7101: "Сильный град",
      7102: "Мелкий град",
    };
    return descriptions[code] || "Неизвестные погодные условия";
  }
  
  export function formatWeatherMessage(weather: WeatherData): string {
    const forecastText = weather.dailyForecast
      .map(
        (entry) =>
          `⏰ ${entry.time} — 🌡 ${entry.temperature}°C, 📝 ${entry.description}`
      )
      .join("\n");
  
    return `🌤 Погода в Ереване сегодня:
    
  🌡 Температура: ${weather.temperature}°C
  🤔 Ощущается как: ${weather.feels_like}°C
  💧 Влажность: ${weather.humidity}%
  🌪 Скорость ветра: ${weather.wind_speed} м/с
  📝 Описание: ${weather.description}
  
  📅 Прогноз на день:
  ${forecastText}`;
  }
  


async function testWeather() {

    const weather = await getWeather();
    if (weather) {
      console.log(formatWeatherMessage(weather));
    }

}

// testWeather();


