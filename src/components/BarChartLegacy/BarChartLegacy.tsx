import c3 from 'c3';
import React, { useEffect, useRef } from 'react';

import './BarChartLegacy.css';

interface BarChartProps {
  chartData: {
    counts: number[],
    labels: string[],
  }
}

const BarChartLegacy = (props: BarChartProps) => {

  const { chartData } = props;
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if(!chartData || !chartRef.current)
      return;
    
    c3.generate({
      bindto: chartRef.current,
      size: {
        height: 1200
      },
      bar: {
          width: 40
      },
      padding: {
          left: 60
      },
      color: {
          pattern: ['#FABF62', '#ACB6DD']
      },
      data: {
        x: 'x',
        columns: [
            ['x', ...chartData.labels],
            ['y', ...chartData.counts],
            // ['x', 'Category1', 'Category2'],
            // ['value', 300, 400]
        ],
        type: 'bar',
        color: () =>'#0000FF',
      },
      axis: {
          rotated: true,
          x: {
              type: 'category'
          }
      },
      tooltip: {
          grouped: false
      },
      legend: {
          show: false
      }
    });
  }, [chartData]);

  return (
    <div className='rChart uvcharts' ref={chartRef}>
    </div>
  )
}

export default BarChartLegacy