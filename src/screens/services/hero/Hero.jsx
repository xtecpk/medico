import React from 'react'
import './hero.css'
import { useTranslation } from 'react-i18next'
import {useSelector} from 'react-redux'

const Hero = () => {

    const {t} = useTranslation()
    const lang = useSelector(state => state.language.value)

  return (
    <div className='container-fluid ser-hero-bg d-flex justify-content-center align-items-center'>
        <div className='ser-hero-container'>
            <div className='ser-hero-heading'>
                <h1 className={lang === 'en'?'text-start':'text-end'}>{t('Services.Hero.Heading')}</h1>
                <p className={lang === 'en'?'text-start':'text-end'}>{t('Services.Hero.Subheading')}</p>
            </div>
            <div>
              
            </div>
        </div>
    </div>
  )
}

export default Hero