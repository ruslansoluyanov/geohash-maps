import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsProvider, useSettings } from '../../contexts/SettingsContext.jsx';

// Test component to access context
const TestComponent = () => {
  const { 
    showGrid, 
    setShowGrid,
    showZone, 
    setShowZone,
    activeTab, 
    setActiveTab,
    bottomSheetHeight, 
    setBottomSheetHeight,
    fixedZonePrecision, 
    setFixedZonePrecision,
    showSettings, 
    setShowSettings
  } = useSettings();

  return (
    <div>
      <div data-testid="show-grid">{showGrid ? 'true' : 'false'}</div>
      <div data-testid="show-zone">{showZone ? 'true' : 'false'}</div>
      <div data-testid="active-tab">{activeTab}</div>
      <div data-testid="bottom-sheet-height">{bottomSheetHeight}</div>
      <div data-testid="fixed-zone-precision">{fixedZonePrecision}</div>
      <div data-testid="show-settings">{showSettings ? 'true' : 'false'}</div>
      
      <button onClick={() => setShowGrid(!showGrid)} data-testid="toggle-grid">
        Toggle Grid
      </button>
      <button onClick={() => setShowZone(!showZone)} data-testid="toggle-zone">
        Toggle Zone
      </button>
      <button onClick={() => setActiveTab('fixed')} data-testid="set-fixed-tab">
        Set Fixed Tab
      </button>
      <button onClick={() => setBottomSheetHeight(400)} data-testid="set-height">
        Set Height
      </button>
      <button onClick={() => setFixedZonePrecision(5)} data-testid="set-precision">
        Set Precision
      </button>
      <button onClick={() => setShowSettings(!showSettings)} data-testid="toggle-settings">
        Toggle Settings
      </button>
    </div>
  );
};

describe('SettingsContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should provide default context values', () => {
    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    expect(screen.getByTestId('show-grid')).toHaveTextContent('false');
    expect(screen.getByTestId('show-zone')).toHaveTextContent('true');
    expect(screen.getByTestId('active-tab')).toHaveTextContent('optimal');
    expect(screen.getByTestId('bottom-sheet-height')).toHaveTextContent('300');
    expect(screen.getByTestId('fixed-zone-precision')).toHaveTextContent('7');
    expect(screen.getByTestId('show-settings')).toHaveTextContent('false');
  });

  it('should load settings from localStorage', () => {
    localStorage.setItem('showGrid', 'true');
    localStorage.setItem('activeTab', '"search"');
    localStorage.setItem('fixedZonePrecision', '9');

    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    expect(screen.getByTestId('show-grid')).toHaveTextContent('true');
    expect(screen.getByTestId('active-tab')).toHaveTextContent('search');
    expect(screen.getByTestId('fixed-zone-precision')).toHaveTextContent('9');
  });

  it('should update showGrid setting', async () => {
    const user = userEvent.setup();

    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    const toggleButton = screen.getByTestId('toggle-grid');
    await user.click(toggleButton);

    expect(screen.getByTestId('show-grid')).toHaveTextContent('true');
    expect(localStorage.getItem('showGrid')).toBe('true');
  });

  it('should update showZone setting', async () => {
    const user = userEvent.setup();

    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    const toggleButton = screen.getByTestId('toggle-zone');
    await user.click(toggleButton);

    expect(screen.getByTestId('show-zone')).toHaveTextContent('false');
    expect(localStorage.getItem('showZone')).toBe('false');
  });

  it('should update activeTab setting', async () => {
    const user = userEvent.setup();

    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    const setFixedButton = screen.getByTestId('set-fixed-tab');
    await user.click(setFixedButton);

    expect(screen.getByTestId('active-tab')).toHaveTextContent('fixed');
    expect(localStorage.getItem('activeTab')).toBe('"fixed"');
  });

  it('should update bottomSheetHeight setting', async () => {
    const user = userEvent.setup();

    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    const setHeightButton = screen.getByTestId('set-height');
    await user.click(setHeightButton);

    expect(screen.getByTestId('bottom-sheet-height')).toHaveTextContent('400');
    expect(localStorage.getItem('bottomSheetHeight')).toBe('400');
  });

  it('should update fixedZonePrecision setting', async () => {
    const user = userEvent.setup();

    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    const setPrecisionButton = screen.getByTestId('set-precision');
    await user.click(setPrecisionButton);

    expect(screen.getByTestId('fixed-zone-precision')).toHaveTextContent('5');
    expect(localStorage.getItem('fixedZonePrecision')).toBe('5');
  });

  it('should update showSettings setting', async () => {
    const user = userEvent.setup();

    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    const toggleButton = screen.getByTestId('toggle-settings');
    await user.click(toggleButton);

    expect(screen.getByTestId('show-settings')).toHaveTextContent('true');
    expect(localStorage.getItem('showSettings')).toBe('true');
  });

  it('should handle localStorage errors gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Mock localStorage.getItem to throw error
    const originalGetItem = localStorage.getItem;
    localStorage.getItem = vi.fn(() => {
      throw new Error('localStorage error');
    });

    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    // Should still render with default values
    expect(screen.getByTestId('show-grid')).toHaveTextContent('false');

    // Restore
    localStorage.getItem = originalGetItem;
    consoleSpy.mockRestore();
  });

  it('should throw error when useSettings is used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useSettings must be used within a SettingsProvider');

    consoleSpy.mockRestore();
  });
});
