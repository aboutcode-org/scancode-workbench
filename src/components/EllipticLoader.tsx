import React from 'react'
import { ThreeDots } from  'react-loader-spinner'

const EllipticLoader = () => {
  return (
    <ThreeDots 
      height="28" 
      width="40" 
      radius="12"
      color="#3898fc" 
      ariaLabel="three-dots-loading"
      wrapperClass="value"
      visible={true}
    />
  )
}

export default EllipticLoader