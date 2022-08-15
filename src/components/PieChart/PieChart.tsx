import c3 from 'c3';
import React, { useEffect, useRef } from 'react'

import { FormattedEntry } from '../../utils/pie';
import { LEGEND_COLORS } from '../../constants/colors';

interface ChartProps {
  chartData: FormattedEntry[] | null,
}

const PieChart = (props: ChartProps) => {

  const { chartData } = props;
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if(!chartData || !chartRef.current)
      return;

    c3.generate({
      bindto: chartRef.current,
      data: {
        columns: chartData,
        type : 'pie',
      },
      color: {
        pattern: LEGEND_COLORS,
      }
    });
  }, [chartData]);
  
  return (
    <div ref={chartRef} />
  )
}

export default PieChart