import React from 'react';
import { ForecastDay } from '../types';
import ForecastDayCard from './ForecastDayCard';

interface ForecastPanelProps {
  forecast: ForecastDay[];
}

const ForecastPanel: React.FC<ForecastPanelProps> = ({ forecast }) => {
  return (
    <div className="forecast-panel">
      <h3>5-Day Forecast</h3>
      <div className="forecast-days">
        {forecast.map((day, index) => (
          <ForecastDayCard key={index} forecast={day} />
        ))}
      </div>
    </div>
  );
};

export default ForecastPanel;