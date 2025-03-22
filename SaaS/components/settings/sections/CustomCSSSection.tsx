'use client';

import React, { useState, useCallback, useEffect } from 'react';
import TextArea from '../forms/TextArea';
import SectionHeader from '../forms/SectionHeader';

interface CustomCSSSectionProps {
  value: string;
  onChange: (css: string) => void;
  disabled?: boolean;
}

const validateCSS = (css: string): string | null => {
  if (!css.trim()) return null;

  const openBraces = (css.match(/{/g) || []).length;
  const closeBraces = (css.match(/}/g) || []).length;

  if (openBraces !== closeBraces) {
    return `Unbalanced braces: ${openBraces} opening, ${closeBraces} closing`;
  }

  const dangerousPatterns = [
    'expression(',
    'javascript:',
    '@import',
    '<script',
    'behavior:',
    '-moz-binding'
  ];

  for (const pattern of dangerousPatterns) {
    if (css.toLowerCase().includes(pattern)) {
      return `Potentially dangerous CSS detected: ${pattern}`;
    }
  }

  return null;
};

export default function CustomCSSSection({
  value,
  onChange,
  disabled = false,
}: CustomCSSSectionProps) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validationError = validateCSS(value);
    setError(validationError);
  }, [value]);

  const handleChange = useCallback((newValue: string) => {
    onChange(newValue);
  }, [onChange]);

  const handleReset = useCallback(() => {
    onChange('');
  }, [onChange]);

  const isValid = !error;
  const hasValue = value.trim().length > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <SectionHeader
        title="Custom CSS"
        description="Add your own CSS to customize the appearance"
        icon="🎨"
      />

      <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200 whitespace-pre-line">
          {`💡 Custom CSS is applied globally. Be careful with selectors.

Example:
.my-custom-class {
  color: var(--color-primary);
  font-size: 1.2rem;
}`}
        </p>
      </div>

      <div className="mt-6">
        <TextArea
          label="Custom CSS Code"
          value={value}
          onChange={handleChange}
          placeholder="/* Enter your custom CSS here */\n.my-class {\n  color: blue;\n}"
          rows={6}
          showCharCount={true}
          maxLength={5000}
          error={error || undefined}
          disabled={disabled}
        />
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          {isValid ? (
            <>
              <svg
                className="w-5 h-5 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-sm text-green-600 dark:text-green-400">
                {hasValue ? 'Valid CSS' : 'Ready for input'}
              </span>
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm text-red-600 dark:text-red-400">
                {error}
              </span>
            </>
          )}
        </div>

        <button
          onClick={handleReset}
          disabled={!hasValue || disabled}
          className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 
                     disabled:text-gray-400 disabled:cursor-not-allowed
                     border border-red-300 hover:border-red-400 rounded-lg
                     transition-colors"
        >
          Reset CSS
        </button>
      </div>
    </div>
  );
}
