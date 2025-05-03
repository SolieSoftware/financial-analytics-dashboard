import React, { useState } from 'react';
import './App.css';
import { WeatherData } from './types';
import { mockWeatherData } from './mockData';
import WeatherCard from './components/WeatherCard';
import LocationSelector from './components/LocationSelector';
import ForecastPanel from './components/ForecastPanel';

const App: React.FC = () => {
  const [weatherData] = useState<WeatherData[]>(mockWeatherData);
  const [selectedLocation, setSelectedLocation] = useState<string>(weatherData[0].location);

  const currentWeather = weatherData.find(data => data.location === selectedLocation);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather Dashboard</h1>
        <LocationSelector 
          locations={weatherData.map(data => data.location)} 
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
        />
      </header>
      <main>
        {currentWeather && (
          <>
            <WeatherCard weather={currentWeather} />
            <ForecastPanel forecast={currentWeather.forecast} />
          </>
        )}
      </main>
      <footer>
        <p>Weather data is simulated for demonstration purposes</p>
      </footer>
    </div>
  );
};

export default App;
