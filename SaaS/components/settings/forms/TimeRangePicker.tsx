'use client';

import React, { useState, useEffect } from 'react';

interface TimeRangePickerProps {
  start: string;
  end: string;
  onChange: (start: string, end: string) => void;
  disabled?: boolean;
}

export default function TimeRangePicker({
  start,
  end,
  onChange,
  disabled = false,
}: TimeRangePickerProps) {
  const [validationError, setValidationError] = useState<string | null>(null);
  const [localStart, setLocalStart] = useState(start);
  const [localEnd, setLocalEnd] = useState(end);

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const validateTimeRange = (startTime: string, endTime: string): boolean => {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    if (startMinutes >= endMinutes) {
      setValidationError('시작 시간은 종료 시간보다 이전이어야 합니다');
      return false;
    }

    setValidationError(null);
    return true;
  };

  useEffect(() => {
    setLocalStart(start);
    setLocalEnd(end);
  }, [start, end]);

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value;
    setLocalStart(newStart);
    
    if (validateTimeRange(newStart, localEnd)) {
      onChange(newStart, localEnd);
    }
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = e.target.value;
    setLocalEnd(newEnd);
    
    if (validateTimeRange(localStart, newEnd)) {
      onChange(localStart, newEnd);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            시작
          </label>
          <input
            type="time"
            value={localStart}
            onChange={handleStartChange}
            disabled={disabled}
            className={`
              w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800
              text-gray-900 dark:text-white
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 focus:border-blue-500
              ${disabled 
                ? 'bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-50' 
                : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
              }
            `}
          />
        </div>

        <div className="flex items-end pb-2">
          <span className="text-gray-400 dark:text-gray-500 font-medium">~</span>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            종료
          </label>
          <input
            type="time"
            value={localEnd}
            onChange={handleEndChange}
            disabled={disabled}
            className={`
              w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800
              text-gray-900 dark:text-white
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 focus:border-blue-500
              ${disabled 
                ? 'bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-50' 
                : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
              }
            `}
          />
        </div>
      </div>

      {validationError && (
        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{validationError}</span>
        </div>
      )}
    </div>
  );
}
