import React from 'react'
import Header from '../components/header/Header'
import Footer from '../components/footer/Footer'

const ScreensLayout = ({children}) => {
    
  return (
    <div className='screen-layout'>
        <Header/>
            <div className='screen-layout-content'>
                {children}
            </div>
        <Footer/>
    </div>
  )
}

export default ScreensLayout