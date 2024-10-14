import React from 'react'
import './mainPageCard.css'

const MainPagesCard = ({children}) => {
  return (
    <div className={`main-page-card-bg`}>
      <div className='main-page-card'>
        {children}
    </div>
    </div>
  )
}

export default MainPagesCard