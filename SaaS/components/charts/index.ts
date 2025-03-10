/**
 * Charts components exports
 * 
 * Main exports for all chart components and utilities.
 * Types are exported from BarChart.types, utilities from BarChart.utils.
 */

export * from './BarChart.types';
export { default as BarChart } from './BarChart';
export { default as BarChartLegend } from './BarChartLegend';

export {
  calculateScales,
  calculateStackedScales,
  calculateGroupedScales,
  getBarDimensions,
  getStackedBarSegments,
  getGroupedBarPositions,
  formatAxisLabel,
  getColorClasses,
  getSeriesColor,
  colorClassMapping,
  type ColorClasses,
  type Scales,
  type BarDimensions,
  type Margins,
  type StackedBarSegment,
  type GroupedBarPosition,
} from './BarChart.utils';
