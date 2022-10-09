import c3, { ChartAPI } from 'c3';
import { TailSpin } from 'react-loader-spinner';
import React, { useEffect, useRef, useState } from 'react';

import { FormattedEntry } from '../../utils/pie';
import { LEGEND_COLORS } from '../../constants/colors';

import NoDataImage from '../../assets/images/no-data.png';
import './piechart.css';

interface ChartProps {
  chartData: FormattedEntry[] | null,
}

const PieChart = (props: ChartProps) => {
  const { chartData } = props;
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const [c3Chart, setC3Chart] = useState<ChartAPI | null>(null);

  useEffect(() => {
    if(!chartData || !chartRef.current)
      return;
    
    const newChart = c3.generate({
      bindto: chartRef.current,
      data: {
        columns: chartData,
        type : 'pie',
      },
      color: {
        pattern: LEGEND_COLORS,
      }
    });
    setC3Chart(newChart);
  }, [chartData]);

  useEffect(() => {
    if(!chartContainerRef.current || !c3Chart)
      return;

    const resizeChart = () => c3Chart.resize();

    let resizeTimeout = setTimeout(null, 100);
    const resizeActionHandler = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeChart, 100);
    };

    const chartContainerObserver = new ResizeObserver(resizeActionHandler);
    chartContainerObserver.observe(chartContainerRef.current);
    
    return () => {
      clearTimeout(resizeTimeout);
      chartContainerObserver.disconnect();
    }
  }, [c3Chart]);


  if(!chartData || !chartData.length){
    return (
      <div className='fallback-container'>
        {
          !chartData ?
          <TailSpin
            radius={5}
            height={100}
            width={100}
            color="#3898fc" 
            ariaLabel="loading-chart"
          />
          :
          <img src={NoDataImage} />
        }
      </div>
    )
  }

  return (
    <div className='pie-chart-container' ref={chartContainerRef}>
      <div ref={chartRef} className='pie-chart' />
    </div>
  )
}

export default PieChart