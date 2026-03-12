import React, { useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';

const LocationFilter = ({ onRadiusChange, currentRadius, onLocationChange }) => {
  const [customLocation, setCustomLocation] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);

  const indianCities = [
    { name: 'Vijayawada', lat: 16.5062, lon: 80.6480 },
    { name: 'Hyderabad', lat: 17.4435, lon: 78.3772 },
    { name: 'Visakhapatnam', lat: 17.7930, lon: 83.3760 },
    { name: 'Chennai', lat: 13.0827, lon: 80.2707 },
    { name: 'Bangalore', lat: 12.9716, lon: 77.5946 },
    { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
    { name: 'Delhi', lat: 28.6139, lon: 77.2090 }
  ];

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    onLocationChange(city.lat, city.lon, city.name);
    setShowCustomInput(false);
  };

  const handleCustomLocation = () => {
    setShowCustomInput(!showCustomInput);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customLocation.trim()) {
      // For demo, just use the first city as fallback
      // In production, you'd integrate with Google Places API
      const fallbackCity = indianCities[0];
      setSelectedCity({ name: customLocation, lat: fallbackCity.lat, lon: fallbackCity.lon });
      onLocationChange(fallbackCity.lat, fallbackCity.lon, customLocation);
      setShowCustomInput(false);
      setCustomLocation('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Radius Selector */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Radius:</label>
          <select 
            value={currentRadius}
            onChange={(e) => onRadiusChange(parseInt(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
          >
            <option value={10}>10 km</option>
            <option value={20}>20 km</option>
            <option value={50}>50 km</option>
            <option value={100}>100 km</option>
          </select>
        </div>

        {/* City Quick Select */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Near:</span>
          <div className="flex flex-wrap gap-2">
            {indianCities.slice(0, 3).map(city => (
              <button
                key={city.name}
                onClick={() => handleCitySelect(city)}
                className={`px-3 py-1 rounded-lg text-sm transition ${
                  selectedCity?.name === city.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700'
                }`}
              >
                {city.name}
              </button>
            ))}
            <button
              onClick={handleCustomLocation}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition flex items-center space-x-1"
            >
              <FaSearch className="w-3 h-3" />
              <span>Other City</span>
            </button>
          </div>
        </div>
      </div>

      {/* Custom Location Input */}
      {showCustomInput && (
        <form onSubmit={handleCustomSubmit} className="mt-4 relative">
          <input
            type="text"
            placeholder="Enter city name (e.g., Vijayawada, Guntur, etc.)"
            value={customLocation}
            onChange={(e) => setCustomLocation(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-20 text-gray-900 bg-white"
          />
          <button
            type="submit"
            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Go
          </button>
          <button
            type="button"
            onClick={() => setShowCustomInput(false)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        </form>
      )}

      {/* Current Location Info */}
      <div className="mt-3 text-xs text-gray-500 flex items-center space-x-1">
        <FaMapMarkerAlt className="text-green-500" />
        <span>
          {selectedCity 
            ? `Showing organizations near ${selectedCity.name} within ${currentRadius} km`
            : `Showing organizations within ${currentRadius} km of your selected location`
          }
        </span>
      </div>
    </div>
  );
};

export default LocationFilter;