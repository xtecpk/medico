import React,{useState} from 'react'
import ScreensLayout from '../../layouts/ScreensLayout'
import './contactUs.css'
import { useTranslation } from 'react-i18next'
import {useSelector} from 'react-redux'
import arrow from '../../assets/home/arrow.png'

const ContactUs = () => {

  const {t} = useTranslation()
  const lang = useSelector(state => state.language.value)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handelSubmit = () => {
    if(firstName == '' || lastName == '' || email == '' || phoneNumber == '' || message == ''){
      setError("Please fill all the fields")
      return
    }
  }

  return (
    <ScreensLayout>
      <div className='container-fluid d-flex justify-content-center align-items-center'>
      <div className='contact-us-container mt-5'>
        <div className='contact-us-heading'>
          <h1 className='text-center'>
            {t('ContactUs.Heading')}
          </h1>
        </div>
        <div className='contact-us-form'>
          {
            error && <div className='alert alert-danger d-flex justify-content-between h-[20px]'>
              <div>
                {error}
              </div>
              <div>
                <button className='btn btn-danger' onClick={()=>setError('')}>X</button>
              </div>
            </div>
          }
          <div className={`d-flex justify-content-start align-items-center gap-5 ${lang == 'en'? 'flex-row':'flex-row-reverse'}`}>
            <h1 className=''>
              {t('ContactUs.ContactUsHeading')}
            </h1>
            <div>
              <img src={arrow} alt="" className='contact-us-arrow'/>
              </div>
          </div>
          <div className='contact-us-form-container d-flex flex-column gap-4 mt-5'>
            <div className={`con-input-group w-100 gap-5`}>
              <input type="text" placeholder={t('ContactUs.Placeholders.FirstName')} onChange={(e)=>setFirstName(e.target.value)} className='contact-us-input p-3' dir={lang==='en' ?'ltr':'rtl'}/>
              <input type="text" placeholder={t('ContactUs.Placeholders.LastName')} onChange={(e)=>setLastName(e.target.value)} className='contact-us-input p-3' dir={lang==='en' ?'ltr':'rtl'}/>
            </div>
            <div className='con-input-group w-100 gap-5'>
              <input type="text" placeholder={t('ContactUs.Placeholders.Email')} onChange={(e)=>setEmail(e.target.value)} className='contact-us-input p-3' dir={lang==='en' ?'ltr':'rtl'}/>
              <div className='contact-us-input phone-number d-flex align-items-center gap-3'>
                <h3 className='phone-number-code'>
                  +966
                </h3>
              <input type="text" placeholder={t('ContactUs.Placeholders.Phone')} onChange={(e)=>setPhoneNumber(e.target.value)} className='phone-number-input p-3'/>
              </div>
            </div>
            <div className='con-input-group w-100 gap-5'>
              <input type="textarea" placeholder={t('ContactUs.Placeholders.Message')} onChange={(e)=>setMessage(e.target.value)} className='contact-us-input p-3' dir={lang==='en' ?'ltr':'rtl'}/>
                <button className='con-send-btn' onClick={handelSubmit}>{t('ContactUs.Send')}</button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </ScreensLayout>
  )
}

export default ContactUs