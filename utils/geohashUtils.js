import { ZOOM_PRECISION_MAP } from '../constants.js';

// Calculate optimal precision based on zoom level
export const getOptimalPrecision = (zoom) => {
  const mapping = ZOOM_PRECISION_MAP.find(item => zoom <= item.maxZoom);
  return mapping ? mapping.precision : 9;
};

// Copy text to clipboard with visual feedback
export const copyToClipboard = async (text, buttonElement = null) => {
  try {
    await navigator.clipboard.writeText(text);
    
    if (buttonElement) {
      const originalContent = buttonElement.innerHTML;
      buttonElement.innerHTML = '<span class="flex items-center gap-2"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>Copied</span>';
      
      setTimeout(() => {
        buttonElement.innerHTML = originalContent;
      }, 2000);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

// Format precision label for UI
export const formatPrecisionLabel = (precision) => {
  const suffixes = {
    1: '',
    2: 's',
    3: 's', 
    4: 's',
    5: 's'
  };
  
  const suffix = precision === 1 ? '' : precision < 5 ? 's' : 's';
  return `${precision} character${suffix}`;
};

// Format distance for display
export const formatDistance = (precision) => {
  const distances = {
    1: '~5000km',
    2: '~630km', 
    3: '~78km',
    4: '~20km',
    5: '~2.4km',
    6: '~1.2km',
    7: '~152m',
    8: '~19m',
    9: '~2.4m'
  };
  
  return distances[precision] || '~unknown';
};
