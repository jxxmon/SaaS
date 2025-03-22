/**
 * ApiLoader Component
 * Loading indicator for API calls with configurable styles and messages
 */

import React from 'react';

export interface ApiLoaderProps {
  /** Loading message */
  message?: string;
  /** Size of the loader */
  size?: 'small' | 'medium' | 'large';
  /** Show full screen overlay */
  fullScreen?: boolean;
  /** Custom className */
  className?: string;
  /** Inline loader (no container) */
  inline?: boolean;
  /** Color theme */
  theme?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

const sizeClasses = {
  small: 'w-4 h-4 border-2',
  medium: 'w-8 h-8 border-3',
  large: 'w-12 h-12 border-4',
};

const themeClasses = {
  primary: 'border-blue-500 border-t-transparent',
  secondary: 'border-gray-500 border-t-transparent',
  success: 'border-green-500 border-t-transparent',
  warning: 'border-yellow-500 border-t-transparent',
  danger: 'border-red-500 border-t-transparent',
};

export default function ApiLoader({
  message = 'Loading...',
  size = 'medium',
  fullScreen = false,
  className = '',
  inline = false,
  theme = 'primary',
}: ApiLoaderProps) {
  const loader = (
    <div className={}>
      <div
        className={}
      />
      {message && (
        <p className=mt-3
