import React from 'react'
import './footer.css'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Arrow from '../../assets/home/arrow.png'

const Footer = () => {

    const {t} = useTranslation()
    const lang = useSelector(state => state.language.value)

    const handleScrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth', 
        });
    };

  return (
    <div className='container-fluid d-flex justify-content-center align-items-center'>
        <div className='footer-container d-flex flex-wrap justify-content-between gap-3'>
            <div className='footer-image d-flex flex-column gap-3'>
                <img src="" alt="Logo" />
                <h3 className='company-address'>
                ABC Company<br/>123 Riyadh Street<br/>Riyadh, Saudi Arabia
                </h3>
            </div>
            <div className='footer-contacts d-flex flex-column gap-3'>
                <h3 className='phone-no'>
                    +966 14847 9797
                </h3>
                <h3 className='email'>
                    abc@gmail.com
                </h3>
                <div className='social-links'>
                    <h3>{t('Footer.FollowUs')}</h3>
                    <div className='links'>
                        <img src="" alt="" />
                        <img src="" alt="" />
                        <img src="" alt="" />
                    </div>
                </div>
            </div>
            <div className='arrow-up'>
                <img src={Arrow} alt="" onClick={handleScrollToTop}/>
            </div>
        </div>
    </div>
  )
}

export default Footer