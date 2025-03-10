import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { BarChartProps, BarChartDataPoint, MultiSeriesDataPoint, ChartVariant } from './BarChart.types';
import {
  calculateScales,
  getBarDimensions,
  formatAxisLabel,
  getColorClasses,
  getSeriesColor,
  Margins,
  ColorVariant,
  isMultiSeriesData,
  calculateStackedScales,
  calculateGroupedScales,
  getStackedBarSegments,
  getGroupedBarPositions
} from './BarChart.utils';
import { BarChartLegend } from './BarChartLegend';

interface BarChartComponentProps extends BarChartProps {}

// Breakpoint definitions
const breakpoints = {
  sm: 640,   // Mobile
  md: 768,   // Tablet
  lg: 1024,  // Desktop
  xl: 1280   // Large desktop
};

// Default margins for different breakpoints
const defaultMargins: Record<string, Margins> = {
  mobile: { top: 20, right: 10, bottom: 40, left: 40 },
  tablet: { top: 30, right: 20, bottom: 60, left: 60 },
  desktop: { top: 40, right: 30, bottom: 80, left: 70 }
};

const defaultProps = {
  width: "100%",
  height: 400,
  orientation: "vertical" as const,
  variant: "default" as ChartVariant,
  colorVariants: ['blue', 'green', 'purple', 'orange', 'gray'] as ColorVariant[],
  barRadius: 4,
  barSpacing: 0.2,
  showGrid: true,
  gridColor: "gray-200",
  showValues: false,
  showAxisLabels: true,
  animated: true,
  animationDuration: 600,
  animationDelay: 50,
  hoverAnimation: true,
  responsive: true,
  minHeight: 200,
  minWidth: 300,
  ariaLabel: "Bar chart displaying data visualization"
};

// Custom hook for ResizeObserver with debounce
function useResizeObserver(
  ref: React.RefObject<HTMLElement>,
  delay: number = 100
) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateDimensions = (entries: ResizeObserverEntry[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        const entry = entries[0];
        if (entry) {
          const { width, height } = entry.contentRect;
          setDimensions({ width, height });
        }
      }, delay);
    };

    // Check for ResizeObserver support
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateDimensions);
      observer.observe(element);

      // Initial measurement
      const rect = element.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });

      return () => {
        observer.disconnect();
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    } else {
      // Fallback to window resize
      const handleResize = () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          const rect = element.getBoundingClientRect();
          setDimensions({ width: rect.width, height: rect.height });
        }, delay);
      };

      handleResize();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [ref, delay]);

  return dimensions;
}

// Custom hook for breakpoint detection
function useBreakpoint(width: number) {
  return useMemo(() => {
    if (width < breakpoints.sm) return 'mobile';
    if (width < breakpoints.md) return 'sm';
    if (width < breakpoints.lg) return 'md';
    if (width < breakpoints.xl) return 'lg';
    return 'xl';
  }, [width]);
}

// Custom hook for reduced motion preference
function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * BarChart component for displaying data visualization
 * 
 * Supports single series, stacked, and grouped bar chart variants.
 * Features include responsive sizing, animations, tooltips, legends,
 * and interactive click handlers.
 * 
 * @param props - BarChart component properties
 * @returns SVG bar chart component
 * 
 * @example
 * // Single series
 * <BarChart
 *   data={[{ label: 'Jan', value: 100 }]}
 *   showValues
 * />
 * 
 * @example
 * // Stacked multi-series
 * <BarChart
 *   data={[
 *     { label: 'Q1', series: [{ name: 'A', value: 100 }, { name: 'B', value: 50 }] }
 *   ]}
 *   variant="stacked"
 * />
 */
export default function BarChart({
  data,
  seriesNames,
  width = defaultProps.width,
  height = defaultProps.height,
  orientation = defaultProps.orientation,
  variant = defaultProps.variant,
  colorVariants = defaultProps.colorVariants,
  barRadius = defaultProps.barRadius,
  barSpacing = defaultProps.barSpacing,
  showGrid = defaultProps.showGrid,
  gridColor = defaultProps.gridColor,
  showValues: showValuesProp = defaultProps.showValues,
  showAxisLabels = defaultProps.showAxisLabels,
  animated: animatedProp = defaultProps.animated,
  animationDuration = defaultProps.animationDuration,
  animationDelay = defaultProps.animationDelay,
  hoverAnimation = defaultProps.hoverAnimation,
  responsive = defaultProps.responsive,
  minHeight = defaultProps.minHeight,
  minWidth = defaultProps.minWidth,
  ariaLabel = defaultProps.ariaLabel,
  valueFormatter,
  xAxisLabel,
  yAxisLabel,
  onBarClick,
  tooltipFormatter,
  chartId
}: BarChartComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeDimensions = useResizeObserver(containerRef as React.RefObject<HTMLElement>, 100);
  const breakpoint = useBreakpoint(resizeDimensions.width);
  const prefersReducedMotion = useReducedMotion();
  
  // Determine effective animation settings
  const animated = animatedProp && !prefersReducedMotion;
  const showValues = breakpoint === 'mobile' ? false : showValuesProp;
  
  const [hoveredBar, setHoveredBar] = useState<{ index: number; seriesIndex?: number; value: number; label: string; seriesName?: string } | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [animationProgress, setAnimationProgress] = useState(animated ? 0 : 1);
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());
  const [valueLabelsVisible, setValueLabelsVisible] = useState(false);

  // Get responsive margins based on breakpoint
  const margins = useMemo(() => {
    if (breakpoint === 'mobile') return defaultMargins.mobile;
    if (breakpoint === 'sm' || breakpoint === 'md') return defaultMargins.tablet;
    return defaultMargins.desktop;
  }, [breakpoint]);

  // Get responsive font sizes
  const fontSizes = useMemo(() => {
    if (breakpoint === 'mobile') {
      return { axis: 10, label: 9, title: 11 };
    }
    if (breakpoint === 'sm' || breakpoint === 'md') {
      return { axis: 11, label: 10, title: 12 };
    }
    return { axis: 12, label: 11, title: 14 };
  }, [breakpoint]);

  // Calculate actual dimensions based on responsive mode
  const dimensions = useMemo(() => {
    if (responsive && resizeDimensions.width > 0) {
      const actualWidth = Math.max(resizeDimensions.width, minWidth);
      const actualHeight = Math.max(
        resizeDimensions.height || (typeof height === 'number' ? height : 400),
        minHeight
      );
      return { width: actualWidth, height: actualHeight };
    } else {
      const actualWidth = typeof width === 'number' ? width : 800;
      const actualHeight = typeof height === 'number' ? height : 400;
      return { width: actualWidth, height: actualHeight };
    }
  }, [width, height, responsive, minWidth, minHeight, resizeDimensions]);

  // Animation effect with improved easing
  useEffect(() => {
    if (!animated) {
      setAnimationProgress(1);
      setValueLabelsVisible(true);
      return;
    }

    setAnimationProgress(0);
    setValueLabelsVisible(false);

    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      // Enhanced easing: cubic-bezier(0.34, 1.56, 0.64, 1) - ease-out-back
      const eased = 1 + 2.70158 * Math.pow(progress - 1, 3) + 1.70158 * Math.pow(progress - 1, 2);
      setAnimationProgress(Math.max(0, Math.min(1, eased)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Show value labels after bar animation completes
        setTimeout(() => {
          setValueLabelsVisible(true);
        }, 200);
      }
    };

    const timer = setTimeout(() => {
      requestAnimationFrame(animate);
    }, 100);

    return () => clearTimeout(timer);
  }, [animated, animationDuration, data]);

  // Reset value labels visibility when data changes
  useEffect(() => {
    if (!animated) {
      setValueLabelsVisible(true);
    }
  }, [data, animated]);

  // Extract series information for multi-series charts
  const seriesInfo = useMemo(() => {
    if (variant === 'default') {
      return {
        names: seriesNames || ['Value'],
        count: 1,
        isMultiSeries: false
      };
    }

    // For multi-series variants
    const multiData = data as MultiSeriesDataPoint[];
    if (multiData.length === 0) {
      return { names: seriesNames || [], count: 0, isMultiSeries: true };
    }

    // Extract series names from data or use provided seriesNames
    const names = seriesNames || multiData[0].series.map((s, i) => s.name || `Series ${i + 1}`);
    return {
      names,
      count: names.length,
      isMultiSeries: true
    };
  }, [data, seriesNames, variant]);

  // Calculate chart scales and dimensions
  const { scales, chartWidth, chartHeight, barDimensions, maxValue } = useMemo(() => {
    if (dimensions.width === 0 || dimensions.height === 0) {
      return {
        scales: { yScale: () => 0, xScale: () => 0, maxValue: 0 },
        chartWidth: 0,
        chartHeight: 0,
        barDimensions: { barWidth: 0, groupWidth: 0, spacing: 0 },
        maxValue: 0
      };
    }

    const chartW = dimensions.width - margins.left - margins.right;
    const chartH = dimensions.height - margins.top - margins.bottom;

    let scales;
    let maxVal;

    if (variant === 'stacked' && isMultiSeriesData(data)) {
      const result = calculateStackedScales(data, dimensions.height, dimensions.width, margins, hiddenSeries);
      scales = result.scales;
      maxVal = result.maxTotal;
    } else if (variant === 'grouped' && isMultiSeriesData(data)) {
      const result = calculateGroupedScales(data, dimensions.height, dimensions.width, margins, hiddenSeries);
      scales = result.scales;
      maxVal = result.maxValue;
    } else {
      scales = calculateScales(data as BarChartDataPoint[], dimensions.height, dimensions.width, margins);
      maxVal = scales.maxValue;
    }

    const barDims = getBarDimensions(data.length, chartW, barSpacing, variant === 'grouped' ? seriesInfo.count : 1);

    return {
      scales,
      chartWidth: chartW,
      chartHeight: chartH,
      barDimensions: barDims,
      maxValue: maxVal
    };
  }, [dimensions, data, barSpacing, variant, seriesInfo.count, hiddenSeries, margins]);

  // Generate grid lines
  const gridLines = useMemo(() => {
    if (!showGrid || maxValue === 0) return [];

    const lines: Array<{ y: number; value: number }> = [];
    const numLines = 5;
    for (let i = 0; i <= numLines; i++) {
      const value = (maxValue / numLines) * i;
      const y = scales.yScale(value);
      lines.push({ y, value });
    }
    return lines;
  }, [showGrid, scales, maxValue]);

  // Handle mouse move for tooltip positioning
  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      });
    }
  }, []);

  // Handle bar hover
  const handleBarHover = useCallback((index: number, value: number, label: string, seriesIndex?: number, seriesName?: string) => {
    setHoveredBar({ index, value, label, seriesIndex, seriesName });
  }, []);

  // Handle bar leave
  const handleBarLeave = useCallback(() => {
    setHoveredBar(null);
  }, []);

  // Handle bar click
  const handleBarClick = useCallback((label: string, value: number, seriesIndex?: number, seriesName?: string) => {
    if (onBarClick) {
      onBarClick({ label, value, seriesIndex, seriesName });
    }
  }, [onBarClick]);

  // Handle legend toggle
  const handleLegendToggle = useCallback((seriesName: string) => {
    setHiddenSeries((prev: Set<string>) => {
      const next = new Set(prev);
      if (next.has(seriesName)) {
        next.delete(seriesName);
      } else {
        next.add(seriesName);
      }
      return next;
    });
  }, []);

  // Format tooltip content
  const getTooltipContent = useCallback(() => {
    if (!hoveredBar) return '';
    
    if (tooltipFormatter) {
      return tooltipFormatter({
        label: hoveredBar.label,
        value: hoveredBar.value,
        seriesIndex: hoveredBar.seriesIndex,
        seriesName: hoveredBar.seriesName
      });
    }
    
    const formattedValue = valueFormatter 
      ? valueFormatter(hoveredBar.value)
      : formatAxisLabel(hoveredBar.value);
    
    if (hoveredBar.seriesName) {
      return `${hoveredBar.seriesName}: ${formattedValue}`;
    }
    
    return `${hoveredBar.label}: ${formattedValue}`;
  }, [hoveredBar, tooltipFormatter, valueFormatter]);

  // Get color classes for a bar
  const getBarColorClasses = useCallback((index: number) => {
    const colorVariant = getSeriesColor(index, colorVariants);
    return getColorClasses(colorVariant);
  }, [colorVariants]);

  // Calculate minimum touch target size (44px)
  const minTouchTarget = 44;
  const touchTargetPadding = useMemo(() => {
    if (barDimensions.barWidth >= minTouchTarget) return 0;
    return (minTouchTarget - barDimensions.barWidth) / 2;
  }, [barDimensions.barWidth]);

  // Render default bars (single series)
  const renderDefaultBars = () => {
    const singleData = data as BarChartDataPoint[];
    
    return singleData.map((item, index) => {
      const x = margins.left + scales.xScale(index) + barDimensions.spacing / 2;
      const barHeight = (item.value / maxValue) * chartHeight * animationProgress;
      const y = margins.top + chartHeight - barHeight;
      const colorClasses = getBarColorClasses(index);
      const isHovered = hoveredBar?.index === index;
      const staggerDelay = index * animationDelay;

      return (
        <g key={`bar-${index}`} style={{ pointerEvents: 'all' }}>
          {/* Touch target overlay for mobile */}
          <rect
            x={x - touchTargetPadding}
            y={y}
            width={barDimensions.barWidth + touchTargetPadding * 2}
            height={barHeight}
            fill="transparent"
            className="cursor-pointer"
            onMouseEnter={() => handleBarHover(index, item.value, item.label)}
            onMouseLeave={handleBarLeave}
            onClick={() => handleBarClick(item.label, item.value)}
          />
          <rect
            x={x}
            y={y}
            width={barDimensions.barWidth}
            height={barHeight}
            rx={barRadius}
            ry={barRadius}
            className={`${isHovered ? colorClasses.hover : colorClasses.bar} ${
              hoverAnimation && !prefersReducedMotion ? 'transition-all duration-200 cursor-pointer' : 'cursor-pointer'
            }`}
            style={{
              transitionDelay: animated ? `${staggerDelay}ms` : '0ms',
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
              filter: isHovered ? 'drop-shadow(0 8px 25px -5px rgba(0, 0, 0, 0.1))' : 'none',
              transform: isHovered && hoverAnimation && !prefersReducedMotion ? 'scale(1.03)' : 'scale(1)',
              transformOrigin: `${x + barDimensions.barWidth / 2}px ${y + barHeight}px`,
            }}
          />
          {/* Value labels with animation */}
          {showValues && (
            <text
              x={x + barDimensions.barWidth / 2}
              y={y - 5}
              textAnchor="middle"
              className={`${colorClasses.text} font-medium`}
              fontSize={fontSizes.label}
              style={{
                opacity: valueLabelsVisible ? 1 : 0,
                transform: valueLabelsVisible ? 'translateY(0)' : 'translateY(5px)',
                transition: prefersReducedMotion ? 'none' : 'opacity 300ms ease-out, transform 300ms ease-out',
                transitionDelay: `${staggerDelay + 200}ms`,
              }}
            >
              {valueFormatter ? valueFormatter(item.value) : formatAxisLabel(item.value)}
            </text>
          )}
        </g>
      );
    });
  };

  // Render stacked bars
  const renderStackedBars = () => {
    const multiData = data as MultiSeriesDataPoint[];
    
    return multiData.map((item, groupIndex) => {
      const groupX = margins.left + scales.xScale(groupIndex) + barDimensions.spacing / 2;
      const segments = getStackedBarSegments(
        item,
        seriesInfo.names,
        maxValue,
        chartHeight,
        colorVariants,
        hiddenSeries
      );

      return (
        <g key={`stack-${groupIndex}`}>
          {segments.map((segment, segmentIndex) => {
            const colorClasses = getColorClasses(segment.colorVariant);
            const isHovered = hoveredBar?.index === groupIndex && hoveredBar?.seriesIndex === segment.seriesIndex;
            const barHeight = segment.height * animationProgress;
            const y = margins.top + chartHeight - segment.y - barHeight;
            const staggerDelay = (groupIndex * seriesInfo.count + segmentIndex) * animationDelay;

            return (
              <g key={`segment-${groupIndex}-${segmentIndex}`} style={{ pointerEvents: 'all' }}>
                {/* Touch target overlay */}
                <rect
                  x={groupX - touchTargetPadding}
                  y={y}
                  width={barDimensions.barWidth + touchTargetPadding * 2}
                  height={barHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => handleBarHover(groupIndex, segment.value, item.label, segment.seriesIndex, segment.seriesName)}
                  onMouseLeave={handleBarLeave}
                  onClick={() => handleBarClick(item.label, segment.value, segment.seriesIndex, segment.seriesName)}
                />
                <rect
                  x={groupX}
                  y={y}
                  width={barDimensions.barWidth}
                  height={barHeight}
                  rx={segmentIndex === segments.length - 1 ? barRadius : 0}
                  ry={segmentIndex === segments.length - 1 ? barRadius : 0}
                  className={`${isHovered ? colorClasses.hover : colorClasses.bar} ${
                    hoverAnimation && !prefersReducedMotion ? 'transition-all duration-200 cursor-pointer' : 'cursor-pointer'
                  }`}
                  style={{
                    transitionDelay: animated ? `${staggerDelay}ms` : '0ms',
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    filter: isHovered ? 'drop-shadow(0 8px 25px -5px rgba(0, 0, 0, 0.1))' : 'none',
                    transform: isHovered && hoverAnimation && !prefersReducedMotion ? 'scale(1.03)' : 'scale(1)',
                    transformOrigin: `${groupX + barDimensions.barWidth / 2}px ${y + barHeight}px`,
                  }}
                />
              </g>
            );
          })}
          {/* Total value label for stacked bars */}
          {showValues && segments.length > 0 && (
            <text
              x={groupX + barDimensions.barWidth / 2}
              y={margins.top + chartHeight - (segments[segments.length - 1]?.y || 0) - (segments[segments.length - 1]?.height || 0) * animationProgress - 5}
              textAnchor="middle"
              className="fill-gray-700 font-medium"
              fontSize={fontSizes.label}
              style={{
                opacity: valueLabelsVisible ? 1 : 0,
                transform: valueLabelsVisible ? 'translateY(0)' : 'translateY(5px)',
                transition: prefersReducedMotion ? 'none' : 'opacity 300ms ease-out, transform 300ms ease-out',
              }}
            >
              {valueFormatter 
                ? valueFormatter(segments.reduce((sum, s) => sum + s.value, 0))
                : formatAxisLabel(segments.reduce((sum, s) => sum + s.value, 0))
              }
            </text>
          )}
        </g>
      );
    });
  };

  // Render grouped bars
  const renderGroupedBars = () => {
    const multiData = data as MultiSeriesDataPoint[];
    
    return multiData.map((item, groupIndex) => {
      const groupX = margins.left + scales.xScale(groupIndex) + barDimensions.spacing / 2;
      const barPositions = getGroupedBarPositions(
        item,
        seriesInfo.names,
        maxValue,
        chartHeight,
        barDimensions.barWidth,
        colorVariants,
        hiddenSeries
      );

      return (
        <g key={`group-${groupIndex}`}>
          {barPositions.map((barPos, barIndex) => {
            const colorClasses = getColorClasses(barPos.colorVariant);
            const isHovered = hoveredBar?.index === groupIndex && hoveredBar?.seriesIndex === barPos.seriesIndex;
            const barHeight = barPos.height * animationProgress;
            const y = margins.top + chartHeight - barHeight;
            const staggerDelay = (groupIndex * seriesInfo.count + barIndex) * animationDelay;

            return (
              <g key={`bar-${groupIndex}-${barIndex}`} style={{ pointerEvents: 'all' }}>
                {/* Touch target overlay */}
                <rect
                  x={groupX + barPos.x - touchTargetPadding}
                  y={y}
                  width={barPos.width + touchTargetPadding * 2}
                  height={barHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => handleBarHover(groupIndex, barPos.value, item.label, barPos.seriesIndex, barPos.seriesName)}
                  onMouseLeave={handleBarLeave}
                  onClick={() => handleBarClick(item.label, barPos.value, barPos.seriesIndex, barPos.seriesName)}
                />
                <rect
                  x={groupX + barPos.x}
                  y={y}
                  width={barPos.width}
                  height={barHeight}
                  rx={barRadius}
                  ry={barRadius}
                  className={`${isHovered ? colorClasses.hover : colorClasses.bar} ${
                    hoverAnimation && !prefersReducedMotion ? 'transition-all duration-200 cursor-pointer' : 'cursor-pointer'
                  }`}
                  style={{
                    transitionDelay: animated ? `${staggerDelay}ms` : '0ms',
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    filter: isHovered ? 'drop-shadow(0 8px 25px -5px rgba(0, 0, 0, 0.1))' : 'none',
                    transform: isHovered && hoverAnimation && !prefersReducedMotion ? 'scale(1.03)' : 'scale(1)',
                    transformOrigin: `${groupX + barPos.x + barPos.width / 2}px ${y + barHeight}px`,
                  }}
                />
                {/* Value labels */}
                {showValues && (
                  <text
                    x={groupX + barPos.x + barPos.width / 2}
                    y={y - 5}
                    textAnchor="middle"
                    className={`${colorClasses.text} font-medium`}
                    fontSize={fontSizes.label}
                    style={{
                      opacity: valueLabelsVisible ? 1 : 0,
                      transform: valueLabelsVisible ? 'translateY(0)' : 'translateY(5px)',
                      transition: prefersReducedMotion ? 'none' : 'opacity 300ms ease-out, transform 300ms ease-out',
                      transitionDelay: `${staggerDelay + 200}ms`,
                    }}
                  >
                    {valueFormatter ? valueFormatter(barPos.value) : formatAxisLabel(barPos.value)}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      );
    });
  };

  // Render bars based on variant
  const renderBars = () => {
    switch (variant) {
      case 'stacked':
        return renderStackedBars();
      case 'grouped':
        return renderGroupedBars();
      default:
        return renderDefaultBars();
    }
  };

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div
        ref={containerRef}
        className="flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200"
        style={{
          width: typeof width === 'number' ? width : '100%',
          height: typeof height === 'number' ? height : 400,
          minHeight,
          minWidth
        }}
        aria-label={ariaLabel}
      >
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-gray-500 text-sm">No data available</p>
        </div>
      </div>
    );
  }

  const viewBoxWidth = dimensions.width || 800;
  const viewBoxHeight = dimensions.height || 400;

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="relative"
        style={{
          width: typeof width === 'number' ? width : '100%',
          height: typeof height === 'number' ? height : 400,
          minHeight,
          minWidth
        }}
        onMouseMove={handleMouseMove}
        aria-label={ariaLabel}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={ariaLabel}
        >
          <defs>
            {/* Gradient definitions for bars */}
            {colorVariants.map((color, index) => {
              const colorClasses = getColorClasses(color);
              const baseColor = colorClasses.bar.replace('fill-', '');
              return (
                <linearGradient
                  key={`gradient-${color}`}
                  id={`bar-gradient-${color}`}
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" className={`stop-${baseColor}`} stopColor="currentColor" stopOpacity="0.9" />
                  <stop offset="100%" className={`stop-${baseColor}`} stopColor="currentColor" stopOpacity="0.7" />
                </linearGradient>
              );
            })}
          </defs>

          {/* Grid lines layer */}
          {showGrid && (
            <g className="grid-lines">
              {gridLines.map((line: { y: number; value: number }, index: number) => (
                <line
                  key={`grid-${index}`}
                  x1={margins.left}
                  y1={margins.top + line.y}
                  x2={margins.left + chartWidth}
                  y2={margins.top + line.y}
                  className={`stroke-${gridColor}`}
                  strokeWidth={1}
                  strokeDasharray="4,4"
                  opacity={0.5}
                />
              ))}
            </g>
          )}

          {/* Y-axis */}
          <g className="y-axis">
            <line
              x1={margins.left}
              y1={margins.top}
              x2={margins.left}
              y2={margins.top + chartHeight}
              className="stroke-gray-400"
              strokeWidth={1}
            />
            {/* Y-axis labels */}
            {gridLines.map((line: { y: number; value: number }, index: number) => (
              <text
                key={`y-label-${index}`}
                x={margins.left - 10}
                y={margins.top + line.y + 4}
                textAnchor="end"
                className="fill-gray-600"
                fontSize={fontSizes.axis}
              >
                {formatAxisLabel(line.value)}
              </text>
            ))}
            {/* Y-axis title */}
            {showAxisLabels && yAxisLabel && (
              <text
                x={breakpoint === 'mobile' ? 15 : 20}
                y={margins.top + chartHeight / 2}
                textAnchor="middle"
                transform={`rotate(-90, ${breakpoint === 'mobile' ? 15 : 20}, ${margins.top + chartHeight / 2})`}
                className="fill-gray-700 font-medium"
                fontSize={fontSizes.title}
              >
                {yAxisLabel}
              </text>
            )}
          </g>

          {/* X-axis */}
          <g className="x-axis">
            <line
              x1={margins.left}
              y1={margins.top + chartHeight}
              x2={margins.left + chartWidth}
              y2={margins.top + chartHeight}
              className="stroke-gray-400"
              strokeWidth={1}
            />
            {/* X-axis labels */}
            {data.map((item, index) => {
              const x = margins.left + scales.xScale(index) + barDimensions.groupWidth / 2;
              return (
                <text
                  key={`x-label-${index}`}
                  x={x}
                  y={margins.top + chartHeight + (breakpoint === 'mobile' ? 15 : 20)}
                  textAnchor="middle"
                  className="fill-gray-600"
                  fontSize={fontSizes.axis}
                  transform={breakpoint !== 'mobile' ? `rotate(-30, ${x}, ${margins.top + chartHeight + 20})` : undefined}
                >
                  {item.label}
                </text>
              );
            })}
            {/* X-axis title */}
            {showAxisLabels && xAxisLabel && (
              <text
                x={margins.left + chartWidth / 2}
                y={viewBoxHeight - (breakpoint === 'mobile' ? 5 : 10)}
                textAnchor="middle"
                className="fill-gray-700 font-medium"
                fontSize={fontSizes.title}
              >
                {xAxisLabel}
              </text>
            )}
          </g>

          {/* Bars layer */}
          <g className="bars">
            {renderBars()}
          </g>
        </svg>

        {/* Tooltip */}
        {hoveredBar && (
          <div
            className="absolute z-50 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg pointer-events-none"
            style={{
              left: Math.min(mousePosition.x + 10, dimensions.width - 150),
              top: Math.max(mousePosition.y - 40, 10),
              transition: prefersReducedMotion ? 'none' : 'opacity 150ms ease-out, transform 150ms ease-out',
            }}
          >
            <div className="font-medium">{hoveredBar.label}</div>
            <div className="text-gray-300">{getTooltipContent()}</div>
            {/* Tooltip arrow */}
            <div className="absolute w-2 h-2 bg-gray-900 rotate-45 -bottom-1 left-4"></div>
          </div>
        )}
      </div>

      {/* Legend for multi-series charts */}
      {variant !== 'default' && seriesInfo.names.length > 0 && (
        <BarChartLegend
          series={seriesInfo.names.map((name: string, index: number) => ({
            name,
            colorVariant: getSeriesColor(index, colorVariants),
          }))}
          hiddenSeries={hiddenSeries}
          onToggle={handleLegendToggle}
        />
      )}
    </div>
  );
}
