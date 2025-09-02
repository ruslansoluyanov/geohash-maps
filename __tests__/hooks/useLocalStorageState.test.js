import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorageState } from '../../hooks.js';

describe('useLocalStorageState', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should return default value when localStorage is empty', () => {
    const { result } = renderHook(() => 
      useLocalStorageState('test-key', 'default-value')
    );

    const [state] = result.current;
    expect(state).toBe('default-value');
  });

  it('should load value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'));

    const { result } = renderHook(() => 
      useLocalStorageState('test-key', 'default-value')
    );

    const [state] = result.current;
    expect(state).toBe('stored-value');
  });

  it('should update state and localStorage', () => {
    const { result } = renderHook(() => 
      useLocalStorageState('test-key', 'initial')
    );

    const [, setValue] = result.current;

    act(() => {
      setValue('new-value');
    });

    const [newState] = result.current;
    expect(newState).toBe('new-value');
    expect(localStorage.getItem('test-key')).toBe('"new-value"');
  });

  it('should handle object values', () => {
    const defaultObject = { count: 0 };
    const newObject = { count: 42, name: 'test' };

    const { result } = renderHook(() => 
      useLocalStorageState('object-key', defaultObject)
    );

    const [, setValue] = result.current;

    act(() => {
      setValue(newObject);
    });

    const [state] = result.current;
    expect(state).toEqual(newObject);
    expect(JSON.parse(localStorage.getItem('object-key'))).toEqual(newObject);
  });

  it('should handle array values', () => {
    const defaultArray = [];
    const newArray = [1, 2, 3];

    const { result } = renderHook(() => 
      useLocalStorageState('array-key', defaultArray)
    );

    const [, setValue] = result.current;

    act(() => {
      setValue(newArray);
    });

    const [state] = result.current;
    expect(state).toEqual(newArray);
    expect(JSON.parse(localStorage.getItem('array-key'))).toEqual(newArray);
  });

  it('should handle boolean values', () => {
    const { result } = renderHook(() => 
      useLocalStorageState('boolean-key', false)
    );

    const [, setValue] = result.current;

    act(() => {
      setValue(true);
    });

    const [state] = result.current;
    expect(state).toBe(true);
    expect(JSON.parse(localStorage.getItem('boolean-key'))).toBe(true);
  });

  it('should handle number values', () => {
    const { result } = renderHook(() => 
      useLocalStorageState('number-key', 0)
    );

    const [, setValue] = result.current;

    act(() => {
      setValue(123);
    });

    const [state] = result.current;
    expect(state).toBe(123);
    expect(JSON.parse(localStorage.getItem('number-key'))).toBe(123);
  });

  it('should handle localStorage getItem errors gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    // Mock localStorage.getItem to throw error
    const originalGetItem = localStorage.getItem;
    localStorage.getItem = vi.fn(() => {
      throw new Error('localStorage error');
    });

    const { result } = renderHook(() => 
      useLocalStorageState('error-key', 'default')
    );

    const [state] = result.current;
    expect(state).toBe('default');
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to load error-key from localStorage:',
      expect.any(Error)
    );

    // Restore
    localStorage.getItem = originalGetItem;
    consoleSpy.mockRestore();
  });

  it('should handle localStorage setItem errors gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    // Mock localStorage.setItem to throw error
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = vi.fn(() => {
      throw new Error('Storage quota exceeded');
    });

    const { result } = renderHook(() => 
      useLocalStorageState('error-key', 'initial')
    );

    const [, setValue] = result.current;

    act(() => {
      setValue('new-value');
    });

    // State should still update even if localStorage fails
    const [state] = result.current;
    expect(state).toBe('new-value');
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to save error-key to localStorage:',
      expect.any(Error)
    );

    // Restore
    localStorage.setItem = originalSetItem;
    consoleSpy.mockRestore();
  });

  it('should handle invalid JSON in localStorage', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    localStorage.setItem('invalid-json-key', 'invalid-json{');

    const { result } = renderHook(() => 
      useLocalStorageState('invalid-json-key', 'default')
    );

    const [state] = result.current;
    expect(state).toBe('default');
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should work with different keys independently', () => {
    const { result: result1 } = renderHook(() => 
      useLocalStorageState('key1', 'default1')
    );
    
    const { result: result2 } = renderHook(() => 
      useLocalStorageState('key2', 'default2')
    );

    const [, setValue1] = result1.current;
    const [, setValue2] = result2.current;

    act(() => {
      setValue1('value1');
      setValue2('value2');
    });

    expect(result1.current[0]).toBe('value1');
    expect(result2.current[0]).toBe('value2');
    expect(localStorage.getItem('key1')).toBe('"value1"');
    expect(localStorage.getItem('key2')).toBe('"value2"');
  });

  it('should maintain referential equality for setValue function', () => {
    const { result, rerender } = renderHook(() => 
      useLocalStorageState('test-key', 'initial')
    );

    const [, setValue1] = result.current;
    
    rerender();
    
    const [, setValue2] = result.current;
    
    expect(setValue1).toBe(setValue2);
  });
});
