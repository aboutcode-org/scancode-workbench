import React from 'react'
import { Link } from 'react-router-dom'

import { ROUTES } from '../../constants/routes'
import AddFileImage from '../../assets/images/AddFiles.png';

import './importFallback.css';

const ImportFallback = () => {
  return (
    <div className='import-fallback'>
      <Link to={ROUTES.HOME}>
        <img src={AddFileImage} draggable={false} onDragStart={() => false} />
      </Link>
      <br/>
      <h2>
        Please {'  '}
        <Link to={ROUTES.HOME}>
          import a file
        </Link> {'  '}
        to view this page
      </h2>

      <div className='credits'>
        <a href="https://storyset.com/work">
          Work illustrations by Storyset
        </a>
      </div>
    </div>
  )
}

export default ImportFallback