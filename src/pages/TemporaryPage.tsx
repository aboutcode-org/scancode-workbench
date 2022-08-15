import React from 'react'

const TemporaryPage = (props: {text: string }) => {
  return (
    <div className='text-center'>
      <br/><br/>
      { props.text }
      <br/><br/>
    </div>
  )
}

export default TemporaryPage