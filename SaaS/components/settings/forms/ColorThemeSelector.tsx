'use client';

import React from 'react';
import { ColorPreset, getAllColorPresets } from '../../../lib/theme/colors';

interface ColorThemeSelectorProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  disabled?: boolean;
}

export default function ColorThemeSelector({
  value,
  onChange,
  label,
  disabled = false,
}: ColorThemeSelectorProps) {
  const colorPresets = getAllColorPresets();

  const handleClick = (colorId: string) => {
    if (!disabled) {
      onChange(colorId);
    }
  };

  const content = (
    <div
      role="radiogroup"
      aria-label={label || 'Select primary color'}
      className="grid grid-cols-4 sm:grid-cols-8 gap-3"
    >
      {colorPresets.map((preset: ColorPreset) => {
        const isActive = preset.id === value;

        return (
          <button
            key={preset.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={preset.name}
            disabled={disabled}
            onClick={() => handleClick(preset.id)}
            className={`
              relative flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              dark:focus:ring-offset-gray-900
              ${isActive
                ? 'border-blue-500 ring-2 ring-blue-500/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div
              className="w-10 h-10 rounded-full shadow-sm"
              style={{ backgroundColor: preset.hex }}
            />
            <span className="mt-2 text-xs font-medium text-gray-700 dark:text-gray-300">
              {preset.name}
            </span>
            {isActive && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );

  if (label) {
    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        {content}
      </div>
    );
  }

  return content;
}
