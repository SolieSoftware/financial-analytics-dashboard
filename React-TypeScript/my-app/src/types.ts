export interface WeatherData {
    location: string;
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    forecast: ForecastDay[];
  }

  export interface ForecastDay {
    day: string;
    high: number;
    low: number;
    condition: string;
  }