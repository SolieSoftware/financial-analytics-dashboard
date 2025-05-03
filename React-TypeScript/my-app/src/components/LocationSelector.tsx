import React from 'react';

interface LocationSelectorProps {
  locations: string[];
  selectedLocation: string;
  onLocationChange: (location: string) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ 
  locations, 
  selectedLocation, 
  onLocationChange 
}) => {
  return (
    <div className="location-selector">
      <label htmlFor="location">Select Location:</label>
      <select 
        id="location"
        value={selectedLocation}
        onChange={(e) => onLocationChange(e.target.value)}
      >
        {locations.map(location => (
          <option key={location} value={location}>
            {location}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationSelector;