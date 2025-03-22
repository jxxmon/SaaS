'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../theme/ThemeContext';
import ToggleSwitch from '../forms/ToggleSwitch';
import ColorThemeSelector from '../forms/ColorThemeSelector';
import CustomCSSSection from './CustomCSSSection';
import { getAllColorPresets, getColorVariables } from '../../../lib/theme/colors';
import type { ThemeSettingsData, ThemeMode, ColorTheme } from '../../../types/settings';

interface ThemeOption {
  id: ThemeMode;
  name: string;
  description: string;
  icon: string;
}

const themeOptions: ThemeOption[] = [
  { id: 'light', name: 'Light', description: 'Bright theme for daytime use', icon: '☀️' },
  { id: 'dark', name: 'Dark', description: 'Dark theme for nighttime use', icon: '🌙' },
  { id: 'system', name: 'System', description: 'Follows your device settings', icon: '🖥️' },
];

export default function ThemeSettings() {
  const { theme, resolvedTheme, setTheme, primaryColor, setPrimaryColor, customCSS, setCustomCSS } = useTheme();
  const [autoSave, setAutoSave] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load autoSave preference from localStorage
    const savedAutoSave = localStorage.getItem('themeAutoSave');
    if (savedAutoSave !== null) {
      setAutoSave(savedAutoSave === 'true');
    }
  }, []);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    if (autoSave) {
      localStorage.setItem('theme', newTheme);
    }
  };

  const handleAutoSaveChange = (checked: boolean) => {
    setAutoSave(checked);
    localStorage.setItem('themeAutoSave', String(checked));
  };

  const handlePrimaryColorChange = (color: string) => {
    setPrimaryColor(color);
  };

  const handleCustomCSSChange = (css: string) => {
    setCustomCSS(css);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Theme Settings
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Choose how the platform looks. Your preference will be saved.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {themeOptions.map((option) => {
          const isActive = theme === option.id;
          return (
            <button
              key={option.id}
              onClick={() => handleThemeChange(option.id)}
              className={`
                relative p-5 rounded-xl border-2 text-left transition-all duration-200
                hover:shadow-lg hover:scale-[1.02]
                ${
                  isActive
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                }
              `}
              aria-pressed={isActive}
            >
              <div className="flex items-center justify-center w-14 h-14 mb-4 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                <span className="text-3xl">{option.icon}</span>
              </div>

              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {option.name}
              </h4>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {option.description}
              </p>

              {isActive && (
                <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Active
                </div>
              )}

              {option.id === 'system' && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                  Current system: {resolvedTheme === 'dark' ? 'Dark' : 'Light'}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Color Theme Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
        <ColorThemeSelector
          label="Primary Color"
          value={primaryColor}
          onChange={handlePrimaryColorChange}
        />
      </div>

      <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Auto Save</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
            Automatically save theme changes
          </p>
        </div>
        <ToggleSwitch
          checked={autoSave}
          onChange={handleAutoSaveChange}
          label=""
        />
      </div>

      {/* Custom CSS Section */}
      <div className="mt-8">
        <CustomCSSSection
          value={customCSS}
          onChange={handleCustomCSSChange}
        />
      </div>

      {/* Preview Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Preview
          </h4>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Live
          </span>
        </div>
        
        <div
          className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-200"
          data-theme-preview={resolvedTheme}
        >
          <div className="space-y-4">
            <div>
              <h5 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                The quick brown fox
              </h5>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                The quick brown fox jumps over the lazy dog. This is how your content will look with the current theme settings.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button 
                className="px-5 py-2.5 rounded-lg text-white font-medium transition-colors"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Submit
              </button>
              <button className="px-5 py-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium transition-colors">
                Cancel
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Color Palette
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gray-900 dark:bg-gray-100 border border-gray-200 dark:border-gray-600"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Text</span>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                ></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Primary</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Secondary</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Background</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 rounded-lg bg-gray-100 dark:bg-gray-900 text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          Current Theme
        </span>
        <span className="font-medium text-gray-900 dark:text-gray-200 capitalize">
          {theme === 'system' ? `System (${resolvedTheme})` : theme}
        </span>
      </div>
    </div>
  );
}
