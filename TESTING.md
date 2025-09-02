# Test Documentation

## Test Structure

The project uses **Vitest** as the main testing framework with **React Testing Library** support for component testing.

### 📁 Test File Structure

```
__tests__/
├── components/           # React component tests
│   ├── OptimalTab.test.jsx
│   ├── SearchTab.test.jsx
│   └── SettingsPanel.test.jsx
├── contexts/            # React Context provider tests
│   ├── MapContext.test.jsx
│   ├── SettingsContext.test.jsx
│   └── GeocodingContext.test.jsx
├── hooks/               # Custom hook tests
│   ├── useLocalStorageState.test.js
│   └── useGeohashZones.test.js
├── geohash.test.js      # Core geohash function tests
├── geohashUtils.test.js # Utility function tests
└── searchUtils.test.js  # Search function tests

src/test/
├── setup.js             # Test environment configuration
└── utils/
    └── testUtils.js     # Helper functions for tests
```

## 🧪 Test Types

### Unit Tests
- **geohash.test.js** - Testing geohash encoding/decoding
- **geohashUtils.test.js** - Utility functions
- **searchUtils.test.js** - Geocoding functions
- **hooks/** - Custom React hooks

### Component Tests
- **components/** - UI component testing
- **contexts/** - React Context provider testing

### Integration Tests
- Context interaction tests
- Component tests with providers

## 🚀 Running Tests

```bash
# Run all tests
npm test

# Run tests once (CI mode)
npm run test:run

# Run with code coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run with UI interface
npm run test:ui
```

## 📊 Code Coverage

Code coverage is configured using **v8**:
- HTML reports available in `coverage/index.html`
- JSON reports for CI/CD
- Configuration and test files are excluded

## 🛠️ Test Environment Setup

### Mocks
- **Leaflet** - Fully mocked for DOM-free operation
- **localStorage** - Mock for local storage testing
- **navigator.clipboard** - Mock for clipboard testing
- **fetch** - Mock for HTTP requests

### Helper Functions
- **renderWithProviders** - Render components with all providers
- **createMockGeohash** - Create mock geohash data
- **createMockSearchResult** - Create mock search results

## 📝 Test Examples

### Component Test
```javascript
import { renderWithProviders } from '../../src/test/utils/testUtils.js';
import OptimalTab from '../../components/OptimalTab.jsx';

it('should display geohash data correctly', () => {
  renderWithProviders(<OptimalTab />);
  
  expect(screen.getByText('Current Hash')).toBeInTheDocument();
  expect(screen.getByTestId('copy-button')).toBeInTheDocument();
});
```

### Context Test
```javascript
import { useSettings } from '../../contexts/SettingsContext.jsx';

it('should update showGrid setting', async () => {
  const user = userEvent.setup();
  renderWithProviders(<TestComponent />);
  
  await user.click(screen.getByTestId('toggle-grid'));
  
  expect(screen.getByTestId('show-grid')).toHaveTextContent('true');
});
```

### Hook Test
```javascript
import { renderHook, act } from '@testing-library/react';
import { useLocalStorageState } from '../hooks.js';

it('should update state and localStorage', () => {
  const { result } = renderHook(() => 
    useLocalStorageState('test-key', 'initial')
  );
  
  act(() => {
    result.current[1]('new-value');
  });
  
  expect(result.current[0]).toBe('new-value');
});
```

## 🎯 Feature Coverage

### ✅ Covered by Tests
- [x] All core geohash functions (encode/decode)
- [x] Utility functions
- [x] Address search functions
- [x] React Context providers
- [x] Custom hooks
- [x] Main UI components
- [x] Error handling
- [x] localStorage operations

### 🔄 Planned
- [ ] E2E tests with Playwright
- [ ] Performance tests
- [ ] Visual regression tests
- [ ] Accessibility tests

## 🐛 Test Debugging

### Useful Commands
```bash
# Run specific test
npm test geohash.test.js

# Run with verbose output
npm test -- --reporter=verbose

# Debug in browser
npm run test:ui
```

### Common Issues
1. **Mock not working** - Check import order
2. **Async tests failing** - Use `waitFor` for async operations
3. **Context unavailable** - Use `renderWithProviders`

## 📈 Quality Metrics

Target metrics:
- **Code coverage**: >90%
- **Function coverage**: >95%
- **Branch coverage**: >85%
- **Execution time**: <30s for full suite

## 🤝 Contributing

When adding new features:
1. Add corresponding unit tests
2. Ensure edge case coverage
3. Update mocks if necessary
4. Check overall code coverage
