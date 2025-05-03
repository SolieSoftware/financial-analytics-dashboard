import React from 'react';
import { WeatherData } from '../types';

interface WeatherCardProps {
  weather: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  return (
    <div className="weather-card">
      <h2>{weather.location}</h2>
      <div className="current-conditions">
        <div className="temperature">
          <span className="temp-value">{weather.temperature}°F</span>
          <span className="condition">{weather.condition}</span>
        </div>
        <div className="details">
          <div className="detail-item">
            <span className="label">Humidity:</span>
            <span className="value">{weather.humidity}%</span>
          </div>
          <div className="detail-item">
            <span className="label">Wind:</span>
            <span className="value">{weather.windSpeed} mph</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
