import React from 'react'
import { ProgressBar } from 'react-bootstrap';
import { BallTriangle } from  'react-loader-spinner'

import './progressLoader.css';

interface ProgressLoaderProps {
  progress: number,
}
const ProgressLoader = (props: ProgressLoaderProps) => {
  return (
    <div className='progress-loader'>
      <BallTriangle
          height={150}
          width={150}
          color="#3D7BFF"
          wrapperStyle={{}}
          wrapperClass="spinner"
          visible={true}
          ariaLabel='oval-loading'
        />
        {/* <Oval
          height={150}
          width={150}
          color="#3D7BFF"
          wrapperStyle={{}}
          wrapperClass="spinner"
          visible={true}
          ariaLabel='oval-loading'
          secondaryColor="#D2E2FD"
          strokeWidth={2}
          strokeWidthSecondary={2}
        /> */}
      <h4>
        { props.progress } %
      </h4>
      <ProgressBar animated now={props.progress} />
    </div>
  )
}

export default ProgressLoader