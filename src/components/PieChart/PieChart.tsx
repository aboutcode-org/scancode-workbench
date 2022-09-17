import c3 from 'c3';
import { TailSpin } from 'react-loader-spinner';
import React, { useEffect, useRef } from 'react';

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

  // useEffect(() => {
  //   const intervalID = setInterval(() => {
  //     console.log("Resizing pie chart as per dom");
  //     if(c3Chart)
  //       c3Chart.resize();
  //   }, 1000);
  //   () => {
  //     clearInterval(intervalID);
  //   }
  // }, [c3Chart]);

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
    <div className='pie-chart-container'>
      <div ref={chartRef} className='pie-chart' />
    </div>
  )
}

export default PieChart