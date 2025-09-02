// mapUtils.js - Map utilities
import { decodeGeohash, encodeGeohash } from './geohash.js';
import L from 'leaflet';

// Import custom Leaflet CSS without problematic properties
import './leaflet-custom.css';
import './zoom-controls.css';

export const initMap = (onMapMove, initialPosition) => {
  return new Promise((resolve) => {
    // Check if map already exists
    if (window.currentMap) {
      // Map already exists, skipping initialization
      resolve(window.currentMap);
      return;
    }
    
    const defaultPosition = [36.5625, -118.125]; // Geohash 9q
    const defaultZoom = 6;
    
    const position = initialPosition 
      ? [initialPosition.lat, initialPosition.lng] 
      : defaultPosition;
    const zoom = initialPosition ? initialPosition.zoom : defaultZoom;
    
    const map = L.map('map', {
      zoomControl: false // Disable default zoom control
    }).setView(position, zoom);

    // Add custom zoom control with better styling
    L.control.zoom({
      position: 'topright',
      zoomInText: '+',
      zoomOutText: '−',
      zoomInTitle: 'Zoom in',
      zoomOutTitle: 'Zoom out'
    }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Update live geohash on map move
    const updateGeohashFromMap = () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      onMapMove(center.lat, center.lng, zoom);
    };

    // Initial geohash
    updateGeohashFromMap();

    // Update geohash on map events
    map.on('moveend', updateGeohashFromMap);
    map.on('zoomend', updateGeohashFromMap);

    window.currentMap = map;
    resolve(map);
  });
};

export const updateMapMarker = (lat, lng, name) => {
  if (window.currentMap) {
    window.currentMap.setView([lat, lng], 13);

    // Remove existing markers
    if (window.currentMarker) {
      window.currentMap.removeLayer(window.currentMarker);
    }

    // Add new marker
    window.currentMarker = L.marker([lat, lng])
      .addTo(window.currentMap)
      .bindPopup(`<b>${name}</b><br>Lat: ${lat.toFixed(6)}<br>Lng: ${lng.toFixed(6)}`)
      .openPopup();
  }
};

// Helper function to get overlay configuration
const getOverlayConfig = (type) => {
  const configs = {
    pulse: {
      color: '#10b981',
      weight: 2,
      opacity: 0.8,
      fillColor: '#10b981',
      fillOpacity: 0.2,
      className: 'geohash-overlay'
    },
    zone: {
      color: '#FF6B35',
      weight: 3,
      opacity: 0.8,
      fill: false,
      fillColor: 'transparent',
      fillOpacity: 0,
      interactive: false,
      className: 'zone-crosshair'
    }
  };
  return configs[type] || configs.zone;
};

// Helper function to create animation styles
const createAnimationStyle = (className, type) => {
  if (type === 'pulse') {
    return `
      .${className} {
        animation: pulse-geohash 2s infinite;
      }
      @keyframes pulse-geohash {
        0% { opacity: 0.8; }
        50% { opacity: 0.4; }
        100% { opacity: 0.8; }
      }
    `;
  } else if (type === 'zone') {
    return `
      .${className} {
        animation: zone-pulse 3s infinite ease-in-out;
        box-shadow: 0 0 10px rgba(255, 107, 53, 0.3);
      }
      @keyframes zone-pulse {
        0% { opacity: 0.8; box-shadow: 0 0 10px rgba(255, 107, 53, 0.3); }
        50% { opacity: 0.4; box-shadow: 0 0 20px rgba(255, 107, 53, 0.6); }
        100% { opacity: 0.8; box-shadow: 0 0 10px rgba(255, 107, 53, 0.3); }
      }
    `;
  }
  return '';
};

export const showArea = (geohash, options = {}) => {
  if (!window.currentMap || !window.L) return;

  const {
    type = 'zone',
    precision,
    autoHide = false,
    autoHideDelay = 5000
  } = options;

  // Remove existing overlays based on type
  if (type === 'pulse' || type === 'geohash') {
    hideArea('geohash');
  } else if (type === 'zone' || type === 'preview') {
    hideArea('preview');
  }

  const decoded = decodeGeohash(geohash);
  const config = getOverlayConfig(type);

  const overlay = L.rectangle(decoded.bounds, config).addTo(window.currentMap);

  // Store overlay reference
  if (type === 'pulse' || type === 'geohash') {
    window.currentGeohashOverlay = overlay;
  } else {
    window.currentPreviewOverlay = overlay;
  }

  // Add animation styles
  const animationStyle = createAnimationStyle(config.className, type);
  if (animationStyle) {
    let style = document.getElementById(`${config.className}-style`);
    if (!style) {
      style = document.createElement('style');
      style.id = `${config.className}-style`;
      document.head.appendChild(style);
    }
    style.textContent = animationStyle;
  }

  // Fit map to bounds for pulse type
  if (type === 'pulse') {
    window.currentMap.fitBounds(decoded.bounds, { padding: [20, 20] });
  }

  // Auto-hide if requested
  if (autoHide) {
    setTimeout(() => {
      hideArea(type === 'pulse' ? 'geohash' : 'preview');
    }, autoHideDelay);
  }

  return { geohash, precision, type };
};

export const showPreviewArea = (geohash, options = {}) => {
  if (!window.currentMap) return;

  // Remove existing preview
  if (window.currentPreviewOverlay) {
    window.currentMap.removeLayer(window.currentPreviewOverlay);
  }

  const decoded = decodeGeohash(geohash);

  // Default options
  const {
    opacity = 0.8,
    weight = 3,
    color = '#FF6B35', // Orange color for zone display
  } = options;

  // Create zone rectangle as a "crosshair" style overlay
  window.currentPreviewOverlay = L.rectangle(decoded.bounds, {
    color,
    weight,
    opacity,
    fill: false,  // Completely disable fill
    fillColor: 'transparent', // Additional safety
    fillOpacity: 0, // Additional safety
    interactive: false,
    className: 'zone-crosshair'
  }).addTo(window.currentMap);

  // Add or update crosshair animation and styling
  let existingStyle = document.getElementById('zone-crosshair-style');
  if (!existingStyle) {
    existingStyle = document.createElement('style');
    existingStyle.id = 'zone-crosshair-style';
    document.head.appendChild(existingStyle);
  }

  existingStyle.textContent = `
    .zone-crosshair {
      animation: zone-pulse 3s infinite ease-in-out;
      box-shadow: 0 0 10px rgba(255, 107, 53, 0.3);
    }
    @keyframes zone-pulse {
      0% { opacity: ${opacity}; box-shadow: 0 0 10px rgba(255, 107, 53, 0.3); }
      50% { opacity: ${opacity * 0.6}; box-shadow: 0 0 20px rgba(255, 107, 53, 0.6); }
      100% { opacity: ${opacity}; box-shadow: 0 0 10px rgba(255, 107, 53, 0.3); }
    }
  `;
};

export const hideArea = (type) => {
  if (!window.currentMap) return;

  if ((type === 'preview' || type === 'zone') && window.currentPreviewOverlay) {
    window.currentMap.removeLayer(window.currentPreviewOverlay);
    window.currentPreviewOverlay = null;
  }

  if ((type === 'geohash' || type === 'pulse') && window.currentGeohashOverlay) {
    window.currentMap.removeLayer(window.currentGeohashOverlay);
    window.currentGeohashOverlay = null;
  }

  if (type === 'grid' && window.currentGeohashGrid) {
    window.currentGeohashGrid.forEach(rectangle => {
      if (window.currentMap.hasLayer(rectangle)) {
        window.currentMap.removeLayer(rectangle);
      }
    });
    window.currentGeohashGrid = [];
  }
};

// Show geohash grid overlay
export const showGeohashGrid = (precision) => {
  if (!window.currentMap) return;

  // Remove existing grid
  hideArea('grid');

  // Get map bounds
  const bounds = window.currentMap.getBounds();
  const north = bounds.getNorth();
  const south = bounds.getSouth();
  const east = bounds.getEast();
  const west = bounds.getWest();

  // Generate grid rectangles for the specified precision
  const gridRectangles = [];

  // Calculate step size based on precision
  // For lower precision (larger cells), use fewer divisions
  // For higher precision (smaller cells), use more divisions
  const divisions = Math.max(4, Math.min(12, 16 - precision * 2));
  const latStep = (north - south) / divisions;
  const lngStep = (east - west) / divisions;

  // Create grid of geohash cells
  for (let lat = south; lat < north; lat += latStep) {
    for (let lng = west; lng < east; lng += lngStep) {
      // Generate geohash for this cell center
      const cellGeohash = encodeGeohash(lat + latStep/2, lng + lngStep/2, precision);

      // Decode to get actual boundaries
      const decoded = decodeGeohash(cellGeohash);

      // Create rectangle for this geohash cell
      const rectangle = L.rectangle(decoded.bounds, {
        color: '#64748b',
        weight: 1,
        opacity: 0.3,
        fill: false,  // Completely disable fill
        interactive: false
      });

      rectangle.addTo(window.currentMap);
      gridRectangles.push(rectangle);
    }
  }

  window.currentGeohashGrid = gridRectangles;
};

// Update grid when zoom changes
export const updateGeohashGrid = (precision) => {
  if (window.currentGeohashGrid && window.currentGeohashGrid.length > 0) {
    showGeohashGrid(precision);
  }
};
