import React from 'react'
import { Link } from 'react-router-dom'

import { ROUTES } from '../constants/routes'

const PageNotFound = () => {
  return (
    <div className='text-center'>
      <div className='display-4'>
        <br/><br/>
        4 0 4
      </div>
      <br/>
      <h3 className='display-2'>
          ¯\_(ツ)_/¯
        <br/><br/>
      </h3>
      <h3>
        Don't venture places,
        <Link to={ROUTES.HOME} className='m-2'>
          Go back Home
        </Link>
      </h3>
    </div>
  )
}

export default PageNotFound