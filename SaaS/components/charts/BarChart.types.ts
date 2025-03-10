/**
 * BarChart component type definitions
 * 
 * This file contains all TypeScript interfaces and types for the BarChart component.
 * Follows the design system patterns established in the project.
 */

/**
 * Color variants that match the design system
 */
export type ColorVariant = 'blue' | 'green' | 'purple' | 'orange' | 'gray';

/**
 * Chart variant types
 */
export type ChartVariant = 'default' | 'stacked' | 'grouped';

/**
 * Chart orientation options
 */
export type ChartOrientation = 'vertical' | 'horizontal';

/**
 * Single series data point for bar charts
 */
export interface BarChartDataPoint {
  /** Label for the data point (x-axis label) */
  label: string;
  /** Numeric value for the bar height */
  value: number;
  /** Optional color variant for this specific bar */
  colorVariant?: ColorVariant;
}

/**
 * Multi-series data point for grouped or stacked bar charts
 */
export interface MultiSeriesDataPoint {
  /** Label for the data point (x-axis label) */
  label: string;
  /** Array of series data for this label */
  series: Array<{
    /** Name of the series */
    name: string;
    /** Numeric value for this series at this label */
    value: number;
    /** Optional color variant for this series */
    colorVariant?: ColorVariant;
  }>;
}

/**
 * Main props interface for the BarChart component
 */
export interface BarChartProps {
  /** Chart data - can be single series or multi-series */
  data: BarChartDataPoint[] | MultiSeriesDataPoint[];
  
  /** Names of series (required for multi-series charts) */
  seriesNames?: string[];
  
  /** Chart width (number in pixels or CSS string) */
  width?: number | string;
  
  /** Chart height (number in pixels or CSS string) */
  height?: number | string;
  
  /** Chart orientation */
  orientation?: ChartOrientation;
  
  /** Chart variant type */
  variant?: ChartVariant;
  
  /** Color variants to use for series (overrides default colors) */
  colorVariants?: ColorVariant[];
  
  /** Bar corner radius in pixels */
  barRadius?: number;
  
  /** Spacing between bars in pixels */
  barSpacing?: number;
  
  /** Whether to show grid lines */
  showGrid?: boolean;
  
  /** Grid line color */
  gridColor?: string;
  
  /** Whether to show values on bars */
  showValues?: boolean;
  
  /** Function to format displayed values */
  valueFormatter?: (value: number) => string;
  
  /** X-axis label */
  xAxisLabel?: string;
  
  /** Y-axis label */
  yAxisLabel?: string;
  
  /** Whether to show axis labels */
  showAxisLabels?: boolean;
  
  /** Callback when a bar is clicked */
  onBarClick?: (data: {
    label: string;
    value: number;
    seriesIndex?: number;
    seriesName?: string;
  }) => void;
  
  /** Custom tooltip formatter function */
  tooltipFormatter?: (data: {
    label: string;
    value: number;
    seriesIndex?: number;
    seriesName?: string;
  }) => string;
  
  /** Whether to animate chart transitions */
  animated?: boolean;
  
  /** Animation duration in milliseconds */
  animationDuration?: number;
  
  /** Delay between animations in milliseconds */
  animationDelay?: number;
  
  /** Whether to animate on hover */
  hoverAnimation?: boolean;
  
  /** Whether the chart should be responsive */
  responsive?: boolean;
  
  /** Minimum height for responsive charts */
  minHeight?: number;
  
  /** Minimum width for responsive charts */
  minWidth?: number;
  
  /** ARIA label for accessibility */
  ariaLabel?: string;
  
  /** Unique ID for the chart (for accessibility and testing) */
  chartId?: string;
}

/**
 * Default props for BarChart component
 */
export const defaultBarChartProps: Partial<BarChartProps> = {
  orientation: 'vertical',
  variant: 'default',
  barRadius: 4,
  barSpacing: 8,
  showGrid: true,
  gridColor: '#e5e7eb',
  showValues: false,
  showAxisLabels: true,
  animated: true,
  animationDuration: 500,
  animationDelay: 50,
  hoverAnimation: true,
  responsive: true,
  minHeight: 300,
  minWidth: 400,
  colorVariants: ['blue', 'green', 'purple', 'orange', 'gray'],
};

/**
 * Type guard to check if data is single series
 */
export function isSingleSeriesData(data: BarChartDataPoint[] | MultiSeriesDataPoint[]): data is BarChartDataPoint[] {
  return Array.isArray(data) && data.length > 0 && 'value' in data[0];
}

/**
 * Type guard to check if data is multi-series
 */
export function isMultiSeriesData(data: BarChartDataPoint[] | MultiSeriesDataPoint[]): data is MultiSeriesDataPoint[] {
  return Array.isArray(data) && data.length > 0 && 'series' in data[0];
}