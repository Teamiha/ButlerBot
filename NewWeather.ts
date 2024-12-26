import { NEW_WEATHER_KEY } from "./config.ts";

type WeatherData = {
    temperature: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    description: string;
    averageDayTemp: number;
    minNightTemp: number;
    intervals: any[];
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
  
      const currentWeather = intervals[0].values;
      
      const nightTemperatures = intervals.slice(0, 9).map((interval: any) => interval.values.temperature);
      const minNightTemp = Math.round(Math.min(...nightTemperatures));

      const dayTemperatures = intervals.slice(10, 21).map((interval: any) => interval.values.temperature);
      const averageDayTemp = Math.round(
        dayTemperatures.reduce((sum: number, temp: number) => sum + temp, 0) / dayTemperatures.length
      );

      const weather: WeatherData = {
        temperature: Math.round(currentWeather.temperature),
        feels_like: Math.round(currentWeather.temperatureApparent),
        humidity: currentWeather.humidity,
        wind_speed: currentWeather.windSpeed,
        description: getWeatherDescription(currentWeather.weatherCode),
        averageDayTemp,
        minNightTemp,
        intervals,
      };
  
      return weather;
    } catch (error) {
      console.error("Ошибка при запросе:", error);
      return null;
    }
  }
  
  function getWeatherDescription(code: number): string {
    const descriptions: Record<number, string> = {
      1000: "☀️",
      1001: "☁️",
      1100: "🌤",
      1101: "🌥",
      1102: "☁️",
      2000: "🌫",
      2100: "🌫",
      3000: "💨",
      3001: "🌬",
      3002: "🌪",
      4000: "🌧",
      4001: "🌧🌧",
      4200: "🌦",
      4201: "⛈⛈",
      5000: "🌨",
      5001: "🌨",
      5100: "🌨",
      5101: "❄️❄️",
      6000: "🌧❄️",
      6001: "🌧❄️",
      6200: "🌧❄️",
      6201: "⛈❄️",
      7000: "🌨🗿",
      7101: "🌨🗿",
      7102: "🌨🗿",
    };
    return descriptions[code] || "❓";
  }
  
  export function formatWeatherMessage(weather: WeatherData): string {
    const morningTemp = Math.round(weather.intervals[9].values.temperature);
    const dayTemp = Math.round(
      weather.intervals.slice(13, 17).reduce((sum, interval) => sum + interval.values.temperature, 0) / 4
    );
    const eveningTemp = Math.round(
      weather.intervals.slice(18, 22).reduce((sum, interval) => sum + interval.values.temperature, 0) / 4
    );

    const morningWeather = getWeatherDescription(weather.intervals[9].values.weatherCode);
    const dayWeather = getWeatherDescription(weather.intervals[14].values.weatherCode);
    const eveningWeather = getWeatherDescription(weather.intervals[19].values.weatherCode);
    const nightWeather = getWeatherDescription(weather.intervals[0].values.weatherCode);

    // Функция для форматирования температуры с выравниванием
    const formatTemp = (temp: number): string => {
      if (temp > 0) {
        return `${' '.repeat(2)}${temp}`; // Добавляем фиксированный отступ после эмодзи
      } else {
        return `${' '.repeat(1)}${temp}`; // Добавляем фиксированный отступ после эмодзи
      }
    };


    return `Ночь${' '.repeat(5)}${nightWeather}${formatTemp(weather.minNightTemp)}

Завтра:
Утро${' '.repeat(6)}${morningWeather}${formatTemp(morningTemp)}
День${' '.repeat(6)}${dayWeather}${formatTemp(dayTemp)}
Вечер${' '.repeat(4)}${eveningWeather}${formatTemp(eveningTemp)}

Влажность${' '.repeat(2)}${weather.humidity}%
Ветер${' '.repeat(6)}${weather.wind_speed} м/с`;
}
  
async function testWeather() {

    const weather = await getWeather();
    if (weather) {
      console.log(formatWeatherMessage(weather));
    }

}

// testWeather();


