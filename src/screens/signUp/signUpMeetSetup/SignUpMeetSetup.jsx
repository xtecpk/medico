import React, { useEffect } from 'react'
import '../signUpMeetSetup/signUpMeetSetup.css'
import Card from '../../../components/mainPageCard/MainPagesCard'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import useMeetSetupVerification from '../../../hooks/useMeetSetupVerification'
import { useLocation } from 'react-router-dom'
import { language } from '../../../features/language/lanSlice'

const SignUpMeetSetup = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const lang = useSelector(state => state.language.value);
  const isAraibic = useLocation().pathname.split('/').pop() === "ar";

  useEffect(() => {
    if (isAraibic) {
      dispatch(language("ar"))
      i18n.changeLanguage("ar");
    }
  }, [])

  const { formData, errors, handleChange, handleSubmit, isSuccessMsgVisible } = useMeetSetupVerification();


  return (
    <div className='container-fluid d-flex justify-content-center align-items-center'>
      <div className='meet-setup-container d-flex flex-column mb-5'>
        <h2 className='meet-setup-heading text-center'>
          {t('MeetSetup.Heading')}
        </h2>
        <p className='meet-setup-subheading text-center mb-5'>{t('MeetSetup.Subheading')}</p>
        <Card>
          <form className='d-flex flex-column justify-content-center gap-3' onSubmit={handleSubmit}>
            <input type='text' name='fullName' value={formData.fullName} placeholder={t('MeetSetup.Placeholders.FullName')} className='meet-setup-input' dir={lang === 'en' ? 'ltr' : 'rtl'} onChange={handleChange} />
            <input type='text' name='email' value={formData.email} placeholder={t('MeetSetup.Placeholders.Email')} className='meet-setup-input' dir={lang === 'en' ? 'ltr' : 'rtl'} onChange={handleChange} />
            <input type='text' name='adress' value={formData.adress} placeholder="Adress" className='meet-setup-input' dir={lang === 'en' ? 'ltr' : 'rtl'} onChange={handleChange} />
            {
              errors.email &&
              <p className={`text-danger error-msg ${lang === 'en' ? '' : 'text-end'}`}>
                {t('MeetSetup.Errors.InvalidEmail')}
              </p>
            }
            <input type='text' name='phoneNumber' value={formData.phoneNumber} placeholder={t('MeetSetup.Placeholders.PhoneNumber')} className='meet-setup-input' dir={lang === 'en' ? 'ltr' : 'rtl'} onChange={handleChange} />
            {
              errors.phoneNumber &&
              <p className={`text-danger error-msg ${lang === 'en' ? '' : 'text-end'}`}>
                {t('MeetSetup.Errors.InvalidPhoneNUmber')}
              </p>
            }
            <input type='date' name='date' placeholder={t('MeetSetup.Placeholders.PreferredDate')} className='meet-setup-input' dir={lang === 'en' ? 'ltr' : 'rtl'} onChange={handleChange} />
            {
              errors.fillAllFields &&
              <p className={`text-danger error-msg ${lang === 'en' ? '' : 'text-end'}`}>
                {t('MeetSetup.Errors.FillAllFields')}
              </p>
            }
            <button className='btn meet-setup-btn'>{t('MeetSetup.Send')}</button>
          </form>
        </Card>
      </div>
      {isSuccessMsgVisible && (
        <div className="user_changePassword__successMsg">
          We have receieved your meeting request , we will get back to you shortly .
        </div>
      )}
    </div>
  )
}

export default SignUpMeetSetup