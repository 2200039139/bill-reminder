import React, { useState, useEffect } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { useOrganizations } from '../hooks/useOrganizations';
import OrganizationList from '../components/Organization/OrganizationList';
import OrganizationSearch from '../components/Organization/OrganizationSearch';
import LocationFilter from '../components/Location/LocationFilter';
import { FaMapMarkerAlt, FaSpinner, FaExclamationTriangle, FaSearch } from 'react-icons/fa';

const HomePage = () => {
  const [searchRadius, setSearchRadius] = useState(50);
  const [manualLocation, setManualLocation] = useState(null);
  const [searchCity, setSearchCity] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  
  const { 
    latitude, 
    longitude, 
    accuracy,
    error: locationError, 
    loading: locationLoading,
    permission 
  } = useGeolocation({ enableHighAccuracy: true, timeout: 10000 });

  // Use manual location if set, otherwise use detected location
  const currentLat = manualLocation?.lat || latitude;
  const currentLon = manualLocation?.lon || longitude;
  const currentCity = manualLocation?.city || 'your location';

  const { 
    organizations, 
    loading: orgsLoading, 
    error: orgsError,
    searchTerm,
    searchOrganizations,
    refreshOrganizations
  } = useOrganizations(currentLat, currentLon, searchRadius);

  // Update active search term when searchTerm changes
  useEffect(() => {
    setActiveSearchTerm(searchTerm);
  }, [searchTerm]);

  // Extract city from search term if it matches known cities
  useEffect(() => {
    if (searchTerm) {
      const knownCities = ['Vijayawada', 'Hyderabad', 'Visakhapatnam', 'Chennai', 'Bangalore', 'Mumbai', 'Delhi'];
      const matchedCity = knownCities.find(city => 
        searchTerm.toLowerCase().includes(city.toLowerCase())
      );
      if (matchedCity) {
        setSearchCity(matchedCity);
      } else {
        setSearchCity('');
      }
    } else {
      setSearchCity('');
    }
  }, [searchTerm]);

  const handleLocationChange = (lat, lon, city) => {
    setManualLocation({ lat, lon, city });
    setSearchCity(''); // Clear search city when manually changing location
  };

  const handleRadiusChange = (radius) => {
    setSearchRadius(radius);
    setTimeout(refreshOrganizations, 100);
  };

  const handleSearch = (term) => {
    searchOrganizations(term);
    setActiveSearchTerm(term);
  };

  // Determine what location text to display
  const getLocationDisplayText = () => {
    if (activeSearchTerm) {
      if (searchCity) {
        return `Search results for "${activeSearchTerm}" in ${searchCity}`;
      }
      return `Search results for "${activeSearchTerm}"`;
    }
    if (manualLocation) {
      return `Showing organizations near ${manualLocation.city}`;
    }
    if (latitude && longitude) {
      return 'Showing organizations near your location';
    }
    return 'Showing all organizations';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="container-custom py-16 md:py-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Local Organizations in India
          </h1>
          <p className="text-xl mb-8">
            Find and connect with organizations near you in Vijayawada, Hyderabad, and across India
          </p>
          
          <OrganizationSearch onSearch={handleSearch} initialValue={activeSearchTerm} />
        </div>
      </section>

      {/* Location Filter - Only show when not searching */}
      {!activeSearchTerm && (
        <section className="container-custom py-4">
          <LocationFilter 
            onRadiusChange={handleRadiusChange}
            currentRadius={searchRadius}
            onLocationChange={handleLocationChange}
          />
        </section>
      )}

      {/* Location Status */}
      <section className="container-custom py-2">
        {locationLoading && !manualLocation && !activeSearchTerm && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
            <FaSpinner className="w-5 h-5 text-blue-500 animate-spin flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-700 font-medium">Detecting your location...</p>
              <p className="text-sm text-blue-600 mt-1">Please wait while we find organizations near you</p>
            </div>
          </div>
        )}
        
        {/* Location Display - Updated to show correct info */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
          {activeSearchTerm ? (
            <FaSearch className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          ) : (
            <FaMapMarkerAlt className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p className={`${activeSearchTerm ? 'text-blue-700' : 'text-green-700'} font-medium`}>
              {getLocationDisplayText()}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {organizations.length} {organizations.length === 1 ? 'organization' : 'organizations'} found
              {!activeSearchTerm && currentLat && currentLon && ` within ${searchRadius} km`}
            </p>
            {activeSearchTerm && searchCity && (
              <p className="text-xs text-gray-500 mt-1">
                Filtering by location: {searchCity}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Organizations List */}
      <section className="container-custom py-8 pb-16">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {activeSearchTerm ? `Search Results` : `Organizations`}
            </h2>
          </div>
          
          <button
            onClick={refreshOrganizations}
            className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-700 bg-white rounded-lg shadow-sm hover:shadow transition-all"
            disabled={orgsLoading}
          >
            <FaSpinner className={`w-4 h-4 ${orgsLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
        
        <OrganizationList 
          organizations={organizations}
          loading={orgsLoading}
          error={orgsError}
        />
      </section>
    </div>
  );
};

export default HomePage;