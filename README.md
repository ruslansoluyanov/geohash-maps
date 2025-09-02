# Geohash Maps

Interactive web application for visualizing and working with geohashes on a map. Displays geohash zones, grids, and performs address geocoding.

![Geohash Maps Preview](https://img.shields.io/badge/React-18.2.0-blue) ![Vite](https://img.shields.io/badge/Vite-7.1.4-646CFF) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.12-38B2AC) ![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900)

## Key Features

- **Interactive map** with zoom and panning
- **Geocoding** - address and coordinate search
- **Geohash visualization** - zone and grid display
- **Flexible settings** - precision, display modes
- **Responsive design** - works on all devices
- **Fast performance** powered by Vite and React

## Operating Modes

### Fixed Tab
- Set geohash precision from 1 to 9 characters
- Display geohash zone for current map center
- Show/hide geohash grid

### Optimal Tab
- Automatic optimal precision calculation
- Adapts to current map zoom level
- Smart optimization for better perception

### Search Tab
- Address geocoding via Nominatim API
- Coordinate search
- Automatic navigation to found locations

## Tech Stack

- **Frontend**: React 18.2.0 + Vite 7.1.4
- **Styling**: TailwindCSS 4.1.12 + CSS Modules
- **Maps**: Leaflet 1.9.4 + OpenStreetMap
- **Testing**: Vitest 3.2.4 + React Testing Library
- **Geocoding**: Nominatim API
- **Geohash**: Custom algorithm implementation

## Quick Start

### Prerequisites
- Node.js >= 16.0.0
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ruslansoluyanov/geohash-maps.git
   cd geohash-maps
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Check code with linter

## Configuration

### Map Settings
Main map configuration is in `mapUtils.js`:
- Initial coordinates and zoom
- Layer styles
- Performance settings

### Styling
Project uses TailwindCSS with additional CSS modules:
- `index.css` - global styles
- `leaflet-custom.css` - Leaflet styles
- `triple-map.css` - triple map styles
- `zoom-controls.css` - control element styles

## Testing

Project includes comprehensive test suite:

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Coverage
- UI Components
- React Contexts
- Custom Hooks
- Geohash Utilities
- Search Functions

## APIs and External Services

### Nominatim API
Free Nominatim API is used for geocoding:
- Address search
- Reverse geocoding
- Autocomplete

### OpenStreetMap
Cartographic data provided by OpenStreetMap:
- Free and open maps
- High quality data
- Global coverage

## Performance

- **Fast loading** - optimized Vite build
- **Lazy loading** - components loaded on demand
- **Caching** - settings saved in localStorage
- **Efficient updates** - React memoization and optimizations

## License

This project is distributed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/) - for powerful UI framework
- [Vite](https://vitejs.dev/) - for incredibly fast build tool
- [Leaflet](https://leafletjs.com/) - for excellent map library
- [TailwindCSS](https://tailwindcss.com/) - for utility-first CSS
- [OpenStreetMap](https://www.openstreetmap.org/) - for free maps
- [Nominatim](https://nominatim.org/) - for geocoding

---

**Star the project if it was helpful!**
