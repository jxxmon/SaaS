/**
 * BarChart utility functions for calculations and color mappings
 * Pure functions with no React dependencies
 */

// Type definitions
export type ColorVariant = 'blue' | 'green' | 'purple' | 'orange' | 'gray';

export interface ColorClasses {
  bar: string;
  hover: string;
  text: string;
  light: string;
}

export interface Scales {
  yScale: (value: number) => number;
  xScale: (index: number) => number;
  maxValue: number;
}

export interface BarDimensions {
  barWidth: number;
  groupWidth: number;
  spacing: number;
}

export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface SingleSeriesDataPoint {
  label: string;
  value: number;
}

export interface MultiSeriesDataPoint {
  label: string;
  series: Array<{
    name: string;
    value: number;
    colorVariant?: ColorVariant;
  }>;
}

export type BarChartData = SingleSeriesDataPoint[] | MultiSeriesDataPoint[];

// Stacked bar segment interface
export interface StackedBarSegment {
  seriesIndex: number;
  seriesName: string;
  value: number;
  y: number;
  height: number;
  colorVariant: ColorVariant;
}

// Grouped bar position interface
export interface GroupedBarPosition {
  seriesIndex: number;
  seriesName: string;
  value: number;
  x: number;
  width: number;
  height: number;
  colorVariant: ColorVariant;
}

// Color class mapping
const colorClassMapping: Record<ColorVariant, ColorClasses> = {
  blue: {
    bar: "fill-blue-500",
    hover: "fill-blue-600",
    text: "text-blue-700",
    light: "bg-blue-50"
  },
  green: {
    bar: "fill-green-500",
    hover: "fill-green-600",
    text: "text-green-700",
    light: "bg-green-50"
  },
  purple: {
    bar: "fill-purple-500",
    hover: "fill-purple-600",
    text: "text-purple-700",
    light: "bg-purple-50"
  },
  orange: {
    bar: "fill-orange-500",
    hover: "fill-orange-600",
    text: "text-orange-700",
    light: "bg-orange-50"
  },
  gray: {
    bar: "fill-gray-400",
    hover: "fill-gray-500",
    text: "text-gray-600",
    light: "bg-gray-50"
  }
};

// Export the color mapping for reference
export { colorClassMapping };

/**
 * Calculate scales for bar chart rendering
 * @param data - Chart data (single or multi-series)
 * @param height - Available height for chart
 * @param width - Available width for chart
 * @param margins - Chart margins {top, right, bottom, left}
 * @returns Object containing yScale, xScale, and maxValue
 */
export function calculateScales(
  data: BarChartData,
  height: number,
  width: number,
  margins: Margins
): Scales {
  // Handle empty data case
  if (data.length === 0) {
    return {
      yScale: () => 0,
      xScale: () => 0,
      maxValue: 0
    };
  }

  // Calculate available space for chart area
  const chartHeight = height - margins.top - margins.bottom;
  const chartWidth = width - margins.left - margins.right;

  // Find maximum value across all data points
  let maxValue = 0;
  
  if (isMultiSeriesData(data)) {
    // Multi-series data: find max across all values arrays
    for (const point of data) {
      const pointMax = Math.max(...point.series.map(s => s.value));
      if (pointMax > maxValue) maxValue = pointMax;
    }
  } else {
    // Single series data: find max across values
    for (const point of data) {
      if (point.value > maxValue) maxValue = point.value;
    }
  }

  // Handle edge case where all values are zero or negative
  if (maxValue <= 0) {
    maxValue = 1; // Default to 1 for scaling
  }

  // Create y-scale function (inverted for SVG coordinate system)
  const yScale = (value: number): number => {
    return chartHeight - (value / maxValue) * chartHeight;
  };

  // Create x-scale function
  const xScale = (index: number): number => {
    return (index / data.length) * chartWidth;
  };

  return {
    yScale,
    xScale,
    maxValue
  };
}

/**
 * Calculate scales for stacked bar charts
 * @param data - Multi-series chart data
 * @param height - Available height for chart
 * @param width - Available width for chart
 * @param margins - Chart margins {top, right, bottom, left}
 * @param hiddenSeries - Set of hidden series names
 * @returns Object containing yScale, xScale, and maxTotal
 */
export function calculateStackedScales(
  data: MultiSeriesDataPoint[],
  height: number,
  width: number,
  margins: Margins,
  hiddenSeries: Set<string> = new Set()
): { scales: Scales; maxTotal: number } {
  // Handle empty data case
  if (data.length === 0) {
    return {
      scales: {
        yScale: () => 0,
        xScale: () => 0,
        maxValue: 0
      },
      maxTotal: 0
    };
  }

  // Calculate available space for chart area
  const chartHeight = height - margins.top - margins.bottom;
  const chartWidth = width - margins.left - margins.right;

  // Find maximum total value (sum of all series per label)
  let maxTotal = 0;
  for (const point of data) {
    const total = point.series
      .filter(s => !hiddenSeries.has(s.name))
      .reduce((sum, s) => sum + s.value, 0);
    if (total > maxTotal) maxTotal = total;
  }

  // Handle edge case where all values are zero
  if (maxTotal <= 0) {
    maxTotal = 1;
  }

  // Create y-scale function (inverted for SVG coordinate system)
  const yScale = (value: number): number => {
    return chartHeight - (value / maxTotal) * chartHeight;
  };

  // Create x-scale function
  const xScale = (index: number): number => {
    return (index / data.length) * chartWidth;
  };

  return {
    scales: {
      yScale,
      xScale,
      maxValue: maxTotal
    },
    maxTotal
  };
}

/**
 * Calculate scales for grouped bar charts
 * @param data - Multi-series chart data
 * @param height - Available height for chart
 * @param width - Available width for chart
 * @param margins - Chart margins {top, right, bottom, left}
 * @param hiddenSeries - Set of hidden series names
 * @returns Object containing yScale, xScale, and maxValue
 */
export function calculateGroupedScales(
  data: MultiSeriesDataPoint[],
  height: number,
  width: number,
  margins: Margins,
  hiddenSeries: Set<string> = new Set()
): { scales: Scales; maxValue: number } {
  // Handle empty data case
  if (data.length === 0) {
    return {
      scales: {
        yScale: () => 0,
        xScale: () => 0,
        maxValue: 0
      },
      maxValue: 0
    };
  }

  // Calculate available space for chart area
  const chartHeight = height - margins.top - margins.bottom;
  const chartWidth = width - margins.left - margins.right;

  // Find maximum value across all visible series
  let maxValue = 0;
  for (const point of data) {
    for (const series of point.series) {
      if (!hiddenSeries.has(series.name) && series.value > maxValue) {
        maxValue = series.value;
      }
    }
  }

  // Handle edge case where all values are zero
  if (maxValue <= 0) {
    maxValue = 1;
  }

  // Create y-scale function (inverted for SVG coordinate system)
  const yScale = (value: number): number => {
    return chartHeight - (value / maxValue) * chartHeight;
  };

  // Create x-scale function
  const xScale = (index: number): number => {
    return (index / data.length) * chartWidth;
  };

  return {
    scales: {
      yScale,
      xScale,
      maxValue
    },
    maxValue
  };
}

/**
 * Get stacked bar segments for a data point
 * @param dataPoint - Multi-series data point
 * @param seriesNames - Array of series names
 * @param maxTotal - Maximum total value for scaling
 * @param chartHeight - Available chart height
 * @param colorVariants - Array of color variants
 * @param hiddenSeries - Set of hidden series names
 * @returns Array of stacked bar segments
 */
export function getStackedBarSegments(
  dataPoint: MultiSeriesDataPoint,
  seriesNames: string[],
  maxTotal: number,
  chartHeight: number,
  colorVariants: ColorVariant[],
  hiddenSeries: Set<string>
): StackedBarSegment[] {
  const segments: StackedBarSegment[] = [];
  let cumulativeHeight = 0;

  dataPoint.series.forEach((series, index) => {
    const seriesName = series.name || seriesNames[index] || `Series ${index + 1}`;
    
    // Skip hidden series
    if (hiddenSeries.has(seriesName)) {
      return;
    }

    const height = (series.value / maxTotal) * chartHeight;
    const colorVariant = series.colorVariant || getSeriesColor(index, colorVariants);

    segments.push({
      seriesIndex: index,
      seriesName,
      value: series.value,
      y: cumulativeHeight,
      height,
      colorVariant
    });

    cumulativeHeight += height;
  });

  return segments;
}

/**
 * Get grouped bar positions for a data point
 * @param dataPoint - Multi-series data point
 * @param seriesNames - Array of series names
 * @param maxValue - Maximum value for scaling
 * @param chartHeight - Available chart height
 * @param groupWidth - Width of the entire group
 * @param colorVariants - Array of color variants
 * @param hiddenSeries - Set of hidden series names
 * @returns Array of grouped bar positions
 */
export function getGroupedBarPositions(
  dataPoint: MultiSeriesDataPoint,
  seriesNames: string[],
  maxValue: number,
  chartHeight: number,
  groupWidth: number,
  colorVariants: ColorVariant[],
  hiddenSeries: Set<string>
): GroupedBarPosition[] {
  const positions: GroupedBarPosition[] = [];
  
  // Filter out hidden series
  const visibleSeries = dataPoint.series.filter((series, index) => {
    const seriesName = series.name || seriesNames[index] || `Series ${index + 1}`;
    return !hiddenSeries.has(seriesName);
  });

  const visibleCount = visibleSeries.length;
  if (visibleCount === 0) return positions;

  // Calculate individual bar width
  const barWidth = groupWidth / dataPoint.series.length;

  dataPoint.series.forEach((series, index) => {
    const seriesName = series.name || seriesNames[index] || `Series ${index + 1}`;
    
    // Skip hidden series
    if (hiddenSeries.has(seriesName)) {
      return;
    }

    const height = (series.value / maxValue) * chartHeight;
    const colorVariant = series.colorVariant || getSeriesColor(index, colorVariants);

    positions.push({
      seriesIndex: index,
      seriesName,
      value: series.value,
      x: index * barWidth,
      width: barWidth,
      height,
      colorVariant
    });
  });

  return positions;
}

/**
 * Calculate bar dimensions based on available width and spacing
 * @param dataLength - Number of data points (or groups for multi-series)
 * @param availableWidth - Available width for bars (chart width minus margins)
 * @param barSpacing - Desired spacing between bars as a percentage (0-1)
 * @param seriesCount - Number of series (for grouped charts)
 * @returns Object containing barWidth, groupWidth, and spacing
 */
export function getBarDimensions(
  dataLength: number,
  availableWidth: number,
  barSpacing: number = 0.2,
  seriesCount: number = 1
): BarDimensions {
  // Validate inputs
  if (dataLength <= 0) {
    return {
      barWidth: 0,
      groupWidth: 0,
      spacing: 0
    };
  }

  if (availableWidth <= 0) {
    return {
      barWidth: 0,
      groupWidth: 0,
      spacing: 0
    };
  }

  // Clamp barSpacing to reasonable range
  const spacingRatio = Math.max(0, Math.min(0.5, barSpacing));
  
  // Calculate group width (space allocated to each data point/group)
  const groupWidth = availableWidth / dataLength;
  
  // Calculate spacing between bars within a group
  const spacing = groupWidth * spacingRatio;
  
  // Calculate actual bar width (remaining space after spacing)
  // For grouped charts, divide by series count
  const barWidth = (groupWidth - spacing) / seriesCount;

  return {
    barWidth: Math.max(0, barWidth),
    groupWidth,
    spacing
  };
}

/**
 * Format axis label values for display
 * Converts large numbers to abbreviated format (k, M, etc.)
 * @param value - Numeric value to format
 * @returns Formatted string representation
 */
export function formatAxisLabel(value: number): string {
  // Handle edge cases
  if (value === 0) return "0";
  if (value < 0) return `-${formatAxisLabel(-value)}`;
  
  const absValue = Math.abs(value);
  
  // Format based on magnitude
  if (absValue >= 1_000_000_000) {
    // Billions
    const formatted = (absValue / 1_000_000_000).toFixed(1);
    return `${formatted.replace(/\.0$/, '')}B`;
  } else if (absValue >= 1_000_000) {
    // Millions
    const formatted = (absValue / 1_000_000).toFixed(1);
    return `${formatted.replace(/\.0$/, '')}M`;
  } else if (absValue >= 1_000) {
    // Thousands
    const formatted = (absValue / 1_000).toFixed(1);
    return `${formatted.replace(/\.0$/, '')}k`;
  } else if (absValue < 0.01) {
    // Very small numbers - use scientific notation
    return absValue.toExponential(1);
  } else if (absValue < 1) {
    // Small decimals - show 2 decimal places
    return absValue.toFixed(2);
  } else if (absValue < 10) {
    // Single digit numbers - show 1 decimal place
    return absValue.toFixed(1);
  } else {
    // Whole numbers
    return Math.round(absValue).toString();
  }
}

/**
 * Get Tailwind CSS classes for a color variant
 * @param colorVariant - Color variant name
 * @returns Object containing Tailwind classes for bar, hover, text, and light background
 */
export function getColorClasses(colorVariant: ColorVariant): ColorClasses {
  // Return the color classes from the mapping, default to gray if not found
  return colorClassMapping[colorVariant] || colorClassMapping.gray;
}

/**
 * Get color variant for a series by index (cycles through available colors)
 * @param seriesIndex - Index of the series (0-based)
 * @param colorVariants - Array of available color variants
 * @returns Color variant for the series
 */
export function getSeriesColor(
  seriesIndex: number,
  colorVariants: ColorVariant[] = ['blue', 'green', 'purple', 'orange', 'gray']
): ColorVariant {
  // Handle empty color variants array
  if (colorVariants.length === 0) {
    return 'gray';
  }
  
  // Use modulo to cycle through available colors
  const index = seriesIndex % colorVariants.length;
  return colorVariants[index];
}

/**
 * Type guard to check if data is multi-series
 * @param data - Chart data to check
 * @returns True if data is multi-series, false if single series
 */
export function isMultiSeriesData(data: BarChartData): data is MultiSeriesDataPoint[] {
  if (data.length === 0) return false;
  
  // Check the first item to determine the structure
  const firstItem = data[0];
  return 'series' in firstItem && Array.isArray(firstItem.series);
}
