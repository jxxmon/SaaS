/**
 * BarChartLegend component
 * 
 * Displays a legend for multi-series bar charts with color swatches
 * and interactive toggle functionality to show/hide series.
 */

import React from 'react';
import { ColorVariant } from './BarChart.types';
import { getColorClasses } from './BarChart.utils';

interface LegendSeries {
  name: string;
  colorVariant: ColorVariant;
}

interface BarChartLegendProps {
  series: LegendSeries[];
  hiddenSeries: Set<string>;
  onToggle: (seriesName: string) => void;
  position?: 'below' | 'inline';
}

export function BarChartLegend({
  series,
  hiddenSeries,
  onToggle,
  position = 'below'
}: BarChartLegendProps) {
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-200 ${
        position === 'inline' ? 'absolute top-0 right-0 bg-white/90 px-4 py-2 rounded-lg shadow-sm' : ''
      }`}
    >
      {series.map((item) => {
        const isHidden = hiddenSeries.has(item.name);
        const colorClasses = getColorClasses(item.colorVariant);

        return (
          <button
            key={item.name}
            onClick={() => onToggle(item.name)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-gray-100 ${
              isHidden ? 'opacity-50' : 'opacity-100'
            }`}
            title={isHidden ? 'Click to show' : 'Click to hide'}
          >
            {/* Color swatch */}
            <span
              className={`w-4 h-4 rounded ${colorClasses.bar.replace('fill-', 'bg-')} ${
                isHidden ? 'bg-gray-300' : ''
              }`}
              style={{
                backgroundColor: isHidden ? undefined : undefined
              }}
            />
            
            {/* Series name */}
            <span
              className={`text-sm font-medium ${
                isHidden ? 'text-gray-400 line-through' : 'text-gray-700'
              }`}
            >
              {item.name}
            </span>

            {/* Hidden indicator */}
            {isHidden && (
              <span className="text-xs text-gray-400">(hidden)</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default BarChartLegend;
