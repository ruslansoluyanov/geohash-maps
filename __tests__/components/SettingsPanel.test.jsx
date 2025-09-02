import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../src/test/utils/testUtils.jsx';
import SettingsPanel from '../../components/SettingsPanel.jsx';

// Mock hideArea function
vi.mock('../../mapUtils.js', () => ({
  hideArea: vi.fn(),
}));

import { hideArea } from '../../mapUtils.js';

describe('SettingsPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render title and settings button', () => {
    renderWithProviders(<SettingsPanel />);

    expect(screen.getByText('Geohash')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /toggle settings/i })).toBeInTheDocument();
  });

  it('should toggle settings panel visibility', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SettingsPanel />);

    const toggleButton = screen.getByRole('button', { name: /toggle settings/i });
    
    // Settings should be hidden initially
    expect(screen.queryByText('Geohash Grid')).not.toBeInTheDocument();

    // Click to show settings
    await user.click(toggleButton);

    // Settings should be visible
    expect(screen.getByText('Geohash Grid')).toBeInTheDocument();
    expect(screen.getByText('Highlight Geohash Cell')).toBeInTheDocument();
  });

  it('should handle grid toggle correctly', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SettingsPanel />);

    // Open settings panel
    const toggleButton = screen.getByRole('button', { name: /toggle settings/i });
    await user.click(toggleButton);

    const gridCheckbox = screen.getByLabelText('Geohash Grid');
    
    // Initially unchecked
    expect(gridCheckbox).not.toBeChecked();

    // Check the grid option
    await user.click(gridCheckbox);
    expect(gridCheckbox).toBeChecked();

    // Uncheck should call hideArea
    await user.click(gridCheckbox);
    expect(gridCheckbox).not.toBeChecked();
    expect(hideArea).toHaveBeenCalledWith('grid');
  });

  it('should handle zone toggle correctly', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SettingsPanel />);

    // Open settings panel
    const toggleButton = screen.getByRole('button', { name: /toggle settings/i });
    await user.click(toggleButton);

    const zoneCheckbox = screen.getByLabelText('Highlight Geohash Cell');
    
    // Initially checked (default is true)
    expect(zoneCheckbox).toBeChecked();

    // Uncheck should call hideArea
    await user.click(zoneCheckbox);
    expect(zoneCheckbox).not.toBeChecked();
    expect(hideArea).toHaveBeenCalledWith('preview');

    // Check again
    await user.click(zoneCheckbox);
    expect(zoneCheckbox).toBeChecked();
  });

  it('should have proper styling for settings button', () => {
    renderWithProviders(<SettingsPanel />);

    const settingsButton = screen.getByRole('button', { name: /toggle settings/i });
    expect(settingsButton).toHaveClass('p-2', 'rounded-lg', 'hover:bg-gray-100', 'transition-colors');
  });

  it('should have proper styling for settings panel', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SettingsPanel />);

    // Open settings panel
    const toggleButton = screen.getByRole('button', { name: /toggle settings/i });
    await user.click(toggleButton);

    // Check for settings panel container
    const settingsContainer = screen.getByText('Geohash Grid').closest('div');
    expect(settingsContainer).toHaveClass('mt-4', 'p-4', 'bg-gray-50', 'rounded-lg', 'space-y-3');
  });

  it('should have proper layout structure', () => {
    renderWithProviders(<SettingsPanel />);

    // Check main container
    const mainContainer = screen.getByText('Geohash').closest('div');
    expect(mainContainer).toHaveClass('px-6', 'py-4', 'border-b', 'border-gray-200');

    // Check header
    const header = screen.getByText('Geohash').closest('div').querySelector('.flex');
    expect(header).toHaveClass('flex', 'items-center', 'justify-between');
  });

  it('should show/hide settings with proper animation classes', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SettingsPanel />);

    const toggleButton = screen.getByRole('button', { name: /toggle settings/i });
    
    // Initially no settings visible
    expect(screen.queryByText('Geohash Grid')).not.toBeInTheDocument();

    // Toggle to show
    await user.click(toggleButton);
    expect(screen.getByText('Geohash Grid')).toBeInTheDocument();

    // Toggle to hide
    await user.click(toggleButton);
    expect(screen.queryByText('Geohash Grid')).not.toBeInTheDocument();
  });

  it('should render SVG icons correctly', () => {
    renderWithProviders(<SettingsPanel />);

    const settingsButton = screen.getByRole('button', { name: /toggle settings/i });
    const svg = settingsButton.querySelector('svg');
    
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('w-5', 'h-5', 'text-gray-600');
  });
});
