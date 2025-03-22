'use client';

import React from 'react';

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  rows?: number;  // default: 4
  maxLength?: number;
  showCharCount?: boolean;  // default: false
  className?: string;
  id?: string;
}

export default function TextArea({
  label,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  rows = 4,
  maxLength,
  showCharCount = false,
  className = '',
  id,
}: TextAreaProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const textareaId = id || `textarea-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const errorId = `${textareaId}-error`;
  const charCountId = `${textareaId}-char-count`;

  const ariaDescribedBy = [
    error ? errorId : null,
    showCharCount ? charCountId : null,
  ].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`space-y-2 ${className}`}>
      <label 
        htmlFor={textareaId}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <textarea
        id={textareaId}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        aria-invalid={!!error}
        aria-describedby={ariaDescribedBy}
        className={`
          w-full px-3 py-2 border rounded-lg text-sm transition-colors resize-y
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-gray-100
          placeholder-gray-400 dark:placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800
          ${error 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
        `}
      />
      <div className="flex justify-between items-start">
        {error && (
          <p 
            id={errorId}
            className="text-sm text-red-600 dark:text-red-400 mt-1"
          >
            {error}
          </p>
        )}
        {showCharCount && (
          <div className="ml-auto">
            <p 
              id={charCountId}
              className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right"
            >
              {value.length}
              {maxLength && `/${maxLength}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}