// searchUtils.js - Address search utilities

export const searchAddress = async (address) => {
  if (!address || !address.trim()) {
    throw new Error('Please enter an address');
  }

  let locationData = null;
  const searchQuery = address.trim();

  // Method 1: geocode.maps.co
  try {
    const geocodeResponse = await fetch(
      `https://geocode.maps.co/search?q=${encodeURIComponent(searchQuery)}&limit=1&format=json`
    );

    if (geocodeResponse.ok) {
      const geocodeData = await geocodeResponse.json();
      if (geocodeData && geocodeData.length > 0) {
        const location = geocodeData[0];
        locationData = {
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lon),
          name: location.display_name,
          source: 'geocode.maps.co'
        };
      }
    }
  } catch (e) {
    // geocode.maps.co unavailable
  }

  // Method 2: photon.komoot.io
  if (!locationData) {
    try {
      const photonResponse = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&limit=1&lang=en`
      );

      if (photonResponse.ok) {
        const photonData = await photonResponse.json();
        if (photonData && photonData.features && photonData.features.length > 0) {
          const feature = photonData.features[0];
          const coords = feature.geometry.coordinates;
          locationData = {
            lat: coords[1],
            lng: coords[0],
            name: feature.properties.name || feature.properties.city || searchQuery,
            source: 'photon.komoot.io'
          };
        }
      }
    } catch (e) {
      // photon.komoot.io unavailable
    }
  }

  // Method 3: local database
  if (!locationData) {
    const locationDatabase = {
      'moscow red square': { lat: 55.7539, lng: 37.6208, name: 'Red Square, Moscow' },
      'moscow kremlin': { lat: 55.7520, lng: 37.6175, name: 'Moscow Kremlin, Moscow' },
      'moscow': { lat: 55.7558, lng: 37.6176, name: 'Moscow, Russia' },
      'red square': { lat: 55.7539, lng: 37.6208, name: 'Red Square, Moscow' },
      'saint petersburg': { lat: 59.9311, lng: 30.3609, name: 'Saint Petersburg' },
      'palace square': { lat: 59.9387, lng: 30.3162, name: 'Palace Square, SPb' },
      'new york': { lat: 40.7128, lng: -74.0060, name: 'New York, USA' },
      'times square': { lat: 40.7580, lng: -73.9855, name: 'Times Square, NYC' },
      'london': { lat: 51.5074, lng: -0.1278, name: 'London, UK' },
      'paris': { lat: 48.8566, lng: 2.3522, name: 'Paris, France' },
      'tokyo': { lat: 35.6762, lng: 139.6503, name: 'Tokyo, Japan' },
      'beijing': { lat: 39.9042, lng: 116.4074, name: 'Beijing, China' }
    };

    const searchKey = searchQuery.toLowerCase().trim();

    if (locationDatabase[searchKey]) {
      locationData = { ...locationDatabase[searchKey], source: 'local database' };
    } else {
      for (const [key, value] of Object.entries(locationDatabase)) {
        if (key.includes(searchKey) || searchKey.includes(key)) {
          locationData = { ...value, source: 'local database' };
          break;
        }
      }
    }
  }

  if (!locationData) {
    throw new Error('Address not found. Try a city name or landmark');
  }

  return locationData;
};
