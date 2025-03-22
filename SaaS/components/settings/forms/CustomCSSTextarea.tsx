'use client';

import React, { useState } from 'react';

interface CustomCSSTextareaProps {
  value: string;
  onChange: (value: string) => void;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  label?: string;
}

export default function CustomCSSTextarea({
  value,
  onChange,
  enabled,
  onEnabledChange,
  label = 'Custom CSS',
}: CustomCSSTextareaProps) {
  const [showPreview, setShowPreview] = useState(false);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleToggleClick = () => {
    onEnabledChange(!enabled);
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const placeholder = `/* Enter your custom CSS here */
.example {
  color: var(--color-primary);
  background: var(--color-background);
}

/* Use CSS variables for theming */
.custom-element {
  border-radius: 0.5rem;
  padding: 1rem;
}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {label}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
            Add custom CSS to override application styles
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {enabled ? 'Enabled' : 'Disabled'}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={handleToggleClick}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full
              transition-colors duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              dark:focus:ring-offset-gray-900
              ${enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
              cursor-pointer
            `}
          >
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white
                transition-transform duration-200 ease-in-out
                ${enabled ? 'translate-x-6' : 'translate-x-1'}
              `}
            />
          </button>
        </div>
      </div>

      {enabled ? (
        <>
          <div className="space-y-2">
            <textarea
              value={value}
              onChange={handleTextareaChange}
              placeholder={placeholder}
              spellCheck={false}
              className={`
                w-full px-3 py-2 border rounded-lg text-sm transition-colors resize-y
                bg-gray-50 dark:bg-gray-900
                text-gray-900 dark:text-gray-100
                placeholder-gray-400 dark:placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500
                font-mono h-48
              `}
            />
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={togglePreview}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {value.length} characters
              </div>
            </div>
          </div>

          {showPreview && (
            <div className="mt-4">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                CSS Preview
              </div>
              <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <pre className="text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap overflow-x-auto">
                  {value || <span className="text-gray-400 dark:text-gray-500 italic">No CSS entered yet</span>}
                </pre>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Custom CSS is currently disabled. Enable the toggle above to add custom styles.
          </p>
        </div>
      )}
    </div>
  );
}