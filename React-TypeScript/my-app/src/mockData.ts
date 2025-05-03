import { WeatherData } from './types';

export const mockWeatherData: WeatherData[] = [
  {
    location: "New York",
    temperature: 72,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 8,
    forecast: [
      { day: "Tue", high: 75, low: 60, condition: "Sunny" },
      { day: "Wed", high: 77, low: 62, condition: "Partly Cloudy" },
      { day: "Thu", high: 68, low: 55, condition: "Rainy" },
      { day: "Fri", high: 70, low: 58, condition: "Cloudy" },
      { day: "Sat", high: 73, low: 60, condition: "Sunny" }
    ]
  },
  {
    location: "San Francisco",
    temperature: 65,
    condition: "Foggy",
    humidity: 75,
    windSpeed: 10,
    forecast: [
      { day: "Tue", high: 68, low: 54, condition: "Foggy" },
      { day: "Wed", high: 70, low: 56, condition: "Partly Cloudy" },
      { day: "Thu", high: 72, low: 58, condition: "Sunny" },
      { day: "Fri", high: 71, low: 57, condition: "Sunny" },
      { day: "Sat", high: 69, low: 55, condition: "Foggy" }
    ]
  },
  {
    location: "Miami",
    temperature: 88,
    condition: "Sunny",
    humidity: 75,
    windSpeed: 6,
    forecast: [
      { day: "Tue", high: 90, low: 76, condition: "Sunny" },
      { day: "Wed", high: 91, low: 78, condition: "Partly Cloudy" },
      { day: "Thu", high: 87, low: 75, condition: "Thunderstorms" },
      { day: "Fri", high: 85, low: 74, condition: "Rainy" },
      { day: "Sat", high: 88, low: 76, condition: "Partly Cloudy" }
    ]
  }
];