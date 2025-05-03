import React from 'react';
import { ForecastDay } from '../types';

interface ForecastDayCardProps {
  forecast: ForecastDay;
}

const ForecastDayCard: React.FC<ForecastDayCardProps> = ({ forecast }) => {
  return (
    <div className="forecast-day-card">
      <h4>{forecast.day}</h4>
      <div className="condition">{forecast.condition}</div>
      <div className="temps">
        <span className="high">{forecast.high}°</span>
        <span className="separator">/</span>
        <span className="low">{forecast.low}°</span>
      </div>
    </div>
  );
};

export default ForecastDayCard;