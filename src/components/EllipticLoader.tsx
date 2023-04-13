import React from 'react'
import { ThreeDots } from  'react-loader-spinner'

interface EllipticLoaderProps {
  color?: string,
  width?: number,
  radius?: number,
  height?: number,
  ariaLabel?: string,
  wrapperClass?: string,
}

const EllipticLoader = (props: EllipticLoaderProps) => {
  return (
    <ThreeDots
      height={28}
      width={40}
      radius={12}
      color="#3898fc"
      ariaLabel="loading data..."
      {...props}
    />
  )
}

export default EllipticLoader