import React from 'react'
import {useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'

const CompanyInfo = () => {

    const lang = useSelector(state => state.language.value)
    const {t} = useTranslation();

  return (
    <>
    <div className={`company-info d-flex flex-column justify-content-between gap-5`}>
            <div className={`company-description ${lang === 'en'?'pe-5':''} `}>
              <div className={`${lang === 'en'?'':'float-end'} mb-3`}>
                <img src="" alt="Logo" />
              </div>
              <br/>
            <p className={`${lang === 'en'?'':'text-end'}`}>
            {t('SignUp.CompanyInfo.Details')} 
              </p>
            </div>
            <div className='company-contacts'>
              <h5 className={`${lang === 'en'?'':'text-end'}`}>
                {t('SignUp.CompanyInfo.Contact')} 
              </h5>
              <div className={`${lang === 'en'?'':'float-end'}`}>
                <span>support@example.com</span>
                <span> | </span>
                <span>000 - 000 - 000</span>
              </div>
            </div>
          </div>
    </>
  )
}

export default CompanyInfo