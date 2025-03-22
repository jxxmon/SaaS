'use client';

import React from 'react';

interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: string | React.ReactNode;
}

export default function SectionHeader({
  title,
  description,
  icon,
}: SectionHeaderProps) {
  return (
    <div className="pb-4 mb-6 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex-shrink-0">
            {typeof icon === 'string' ? (
              <span className="text-2xl">{icon}</span>
            ) : (
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                {icon}
              </div>
            )}
          </div>
        )}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
