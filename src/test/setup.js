import '@testing-library/jest-dom';

// Mock Leaflet
global.L = {
  map: vi.fn(() => ({
    setView: vi.fn(),
    on: vi.fn(),
    getCenter: vi.fn(() => ({ lat: 36.5625, lng: -118.125 })),
    getZoom: vi.fn(() => 6),
    removeLayer: vi.fn(),
    hasLayer: vi.fn(() => false),
    fitBounds: vi.fn(),
  })),
  tileLayer: vi.fn(() => ({
    addTo: vi.fn(),
  })),
  control: {
    zoom: vi.fn(() => ({
      addTo: vi.fn(),
    })),
  },
  marker: vi.fn(() => ({
    addTo: vi.fn(),
    bindPopup: vi.fn(),
    openPopup: vi.fn(),
  })),
  rectangle: vi.fn(() => ({
    addTo: vi.fn(),
  })),
};

// Mock window.currentMap
Object.defineProperty(window, 'currentMap', {
  writable: true,
  value: null,
});

// Mock navigator.clipboard - more robust approach
const mockClipboard = {
  writeText: vi.fn(() => Promise.resolve()),
};

Object.defineProperty(navigator, 'clipboard', {
  value: mockClipboard,
  configurable: true,
});

// Mock localStorage with actual storage behavior
const localStorageMock = (() => {
  let store = {};
  
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = String(value);
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Simple timer mocks that don't interfere with waitFor
vi.stubGlobal('setTimeout', vi.fn((fn, delay = 0) => {
  const timerId = Math.random();
  return timerId;
}));

vi.stubGlobal('clearTimeout', vi.fn());

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
  window.currentMap = null;
  localStorageMock.clear();
});
