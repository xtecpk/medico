import React from 'react'
import './callToAction.css'
import {Link} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

const CallToAction = () => {
    const {t} = useTranslation()

  return (
    <div className='container-fluid cta-bg d-flex justify-content-center align-items-center'>
        <div className='cta-container d-flex flex-column gap-4 justify-content-center align-items-center'>
            <div className='cta-heading text-center'>
                <h1>{t('Home.CallToAction.Heading')}</h1>
            </div>
            <div className='cta-btn'>
                <Link to='/signup' className='btn cta-btn-signup-link'>
                    {t('Home.CallToAction.ButtonText')}
                </Link>
            </div>
        </div>
    </div>
  )
}

export default CallToAction