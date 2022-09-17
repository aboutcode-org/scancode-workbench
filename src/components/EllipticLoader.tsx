import React from 'react'
import { ThreeDots } from  'react-loader-spinner'

interface EllipticLoaderProps {
  height?: number,
  width?: number,
  color?: string,
  radius?: number,
}
const EllipticLoader = (props: EllipticLoaderProps) => {
  return (
    <ThreeDots
      height="28"
      width="40" 
      radius="12"
      color="#3898fc" 
      ariaLabel="loading-data"
      wrapperClass="value"
      visible={true}
      {...props}
    />
  )
}

export default EllipticLoader