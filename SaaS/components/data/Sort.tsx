/**
 * Sort Component
 * Sort configuration UI for data tables
 */

import React from 'react';
import { ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';

export interface SortOption<T> {
  key: keyof T;
  label: string;
  direction: 'asc' | 'desc' | null;
}

export interface SortProps<T> {
  options: SortOption<T>[];
  onChange: (option: SortOption<T>) => void;
  className?: string;
}

export default function Sort<T extends Record<string, any>>({
  options,
  onChange,
  className = '',
}: SortProps<T>) {
  const handleSortClick = (option: SortOption<T>) => {
    let newDirection: 'asc' | 'desc' | null = 'asc';
    
    if (option.direction === 'asc') {
      newDirection = 'desc';
    } else if (option.direction === 'desc') {
      newDirection = null;
    } else {
      newDirection = 'asc';
    }
    
    onChange({
      ...option,
      direction: newDirection,
    });
  };

  const getSortIcon = (direction: 'asc' | 'desc' | null) => {
    if (direction === 'asc') {
      return <ChevronUp className=w-4
