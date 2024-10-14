import React from 'react'
import ScreensLayout from '../../layouts/ScreensLayout'
import PageNotFoundImage from '../../assets/404/404-page-not-found.png'
import './pageNotFound.css'

const PageNotFound = () => {
  return (
    <ScreensLayout>
      <div className='container-fluid d-flex justify-content-center align-items-center'>
        <div className='page-not-found'>
          <img src={PageNotFoundImage} alt="" />  
        </div>
      </div>
    </ScreensLayout>
  )
}

export default PageNotFound