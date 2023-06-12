import c3, { ChartAPI } from "c3";
import React, { useEffect, useRef, useState } from "react";

import { PieChartFallback, PieChartFallbackProps } from "./PieChartFallback";

import { FormattedEntry } from "../../utils/pie";
import { LEGEND_COLORS } from "../../constants/colors";

import "./piechart.css";

interface PieChartProps extends PieChartFallbackProps {
  chartData: FormattedEntry[] | null;
}

const PieChart = (props: PieChartProps) => {
  const { chartData } = props;
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const [c3Chart, setC3Chart] = useState<ChartAPI | null>(null);

  // Redraw chart on data change
  useEffect(() => {
    if (!chartData || !chartRef.current) return;

    const newChart = c3.generate({
      bindto: chartRef.current,
      data: {
        columns: chartData,
        type: "pie",
      },
      color: {
        pattern: LEGEND_COLORS,
      },
      tooltip: {
        format: {
          value: (value, ratio) =>
            `${String(value)} \n${(ratio * 100).toFixed(1)}%`,
        },
      },
    });
    setC3Chart(newChart);
  }, [chartData]);

  // Suppress continuous resize calls that may cause stutter and bad UX
  useEffect(() => {
    if (!chartContainerRef.current || !c3Chart) return;

    const resizeChart = () => c3Chart.resize();

    const TIMEOUT_DURATION = 20;
    let resizeTimeout = setTimeout(null, TIMEOUT_DURATION);
    const resizeActionHandler = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeChart, TIMEOUT_DURATION);
    };

    const chartContainerObserver = new ResizeObserver(resizeActionHandler);
    chartContainerObserver.observe(chartContainerRef.current);

    return () => {
      clearTimeout(resizeTimeout);
      chartContainerObserver.disconnect();
    };
  }, [c3Chart]);

  if (!chartData || !chartData.length) {
    return <PieChartFallback {...props} loading={!chartData} />;
  }

  return (
    <div className="pie-chart-container" ref={chartContainerRef}>
      <div ref={chartRef} className="pie-chart" />
    </div>
  );
};

export default PieChart;
