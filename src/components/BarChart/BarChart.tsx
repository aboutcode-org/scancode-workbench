import React, { useRef } from 'react'

interface BarChartProps {
  chartData: {
    counts: number[],
    labels: string[],
  }
}

const BarChart = (props: BarChartProps) => {

  const { chartData } = props;
  const chartRef = useRef<HTMLDivElement | null>(null);

  return (
    <div>
      d3 Bar chart
    </div>
  )
}

export default BarChart