import { useState, useEffect } from 'react';

export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: true,
    permission: 'prompt' // 'prompt', 'granted', 'denied'
  });

  // Default options for better accuracy
  const defaultOptions = {
    enableHighAccuracy: true,  // Use GPS if available
    timeout: 10000,            // Wait max 10 seconds
    maximumAge: 0              // Don't use cached position
  };

  const geolocationOptions = { ...defaultOptions, ...options };

  useEffect(() => {
    let isMounted = true;
    let watchId = null;

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
        loading: false
      }));
      return;
    }

    // Check permission status (if supported)
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' })
        .then(permissionStatus => {
          if (isMounted) {
            setLocation(prev => ({
              ...prev,
              permission: permissionStatus.state
            }));
          }

          // Listen for permission changes
          permissionStatus.onchange = () => {
            if (isMounted) {
              setLocation(prev => ({
                ...prev,
                permission: permissionStatus.state
              }));
              
              // If permission granted, retry getting location
              if (permissionStatus.state === 'granted') {
                getCurrentPosition();
              }
            }
          };
        })
        .catch(() => {
          // Permissions API not supported, continue anyway
        });
    }

    const getCurrentPosition = () => {
      navigator.geolocation.getCurrentPosition(
        // Success callback
        (position) => {
          if (isMounted) {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy, // Accuracy in meters
              error: null,
              loading: false,
              permission: 'granted'
            });
          }
        },
        // Error callback
        (error) => {
          if (isMounted) {
            let errorMessage = '';
            
            switch(error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = 'Location permission denied. Please enable location access.';
                setLocation(prev => ({ ...prev, permission: 'denied' }));
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = 'Location information is unavailable. Please check your GPS or network.';
                break;
              case error.TIMEOUT:
                errorMessage = 'Location request timed out. Please try again.';
                break;
              default:
                errorMessage = 'An unknown error occurred.';
            }
            
            setLocation(prev => ({
              ...prev,
              error: errorMessage,
              loading: false
            }));
          }
        },
        geolocationOptions
      );

      // Also watch position for continuous updates (optional)
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          if (isMounted) {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              error: null,
              loading: false,
              permission: 'granted'
            });
          }
        },
        (error) => {
          // Handle watch errors silently or log them
          console.warn('Watch position error:', error);
        },
        geolocationOptions
      );
    };

    getCurrentPosition();

    // Cleanup
    return () => {
      isMounted = false;
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return location;
};