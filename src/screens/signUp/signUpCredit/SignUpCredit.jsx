import React, { useState, useEffect } from 'react'
import Card from '../../../components/mainPageCard/MainPagesCard'
import { Dropzone } from '../../../views/user/components'
import Button1 from '../../../components/button1/Button1'
import H3 from '../../../components/h3/H3'
import './signUpCredit.css'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import useCredit from '../../../hooks/useCredit'
import axios from 'axios'
import SignaturePad from '../../../components/signaturePad/SignaturePad'
import { Modal } from '../../../views/user/components'
import ticket from "../../../assets/signup/ticket.svg";

const SignUpCredit = () => {
  const lang = useSelector(state => state.language.value)
  const baseURL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const { formData, credit, errors, handleChange, handleSubmit, setCredit, applyPromo, setUserInfo, files, setFiles, uploadSignature, isAgreed, setIsAgreed } = useCredit()
  const [isModalVisible, setIsModalVisible] = useState(false);
  const toggleModal = () => {
    setIsModalVisible(prevState => !prevState);
  };

  const [selectedPkg, setSelectedPkg] = useState();

  useEffect(() => {
    const storedArray = localStorage.getItem('package');
    const userData = localStorage.getItem('userInfo');

    if (storedArray) {
      setSelectedPkg(JSON.parse(storedArray));
    }
    else {
      navigate("/signup/service-form")
    }
    if (userData) {
      setUserInfo(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    selectedPkg && setCredit({
      ...credit,
      amount: parseInt(selectedPkg.Fee),
      total: parseInt(selectedPkg.Fee)
    })
  }, [selectedPkg])

  const [uploadSignatureError, setUploadSignatureError] = useState(false);
  const agreeAndSubmitHandler = () => {
    if (files.length === 0) {
      setUploadSignatureError(true);
      return;
    }
    uploadSignature().then(() => {
      setIsAgreed(true);
      setUploadSignatureError(false);
      toggleModal();
    })
    // Submit
  }



  const { t } = useTranslation();
  const [showSignaturePad, setShowSignaturePad] = useState(false)

  const toggleSignaturePad = () => {
    setShowSignaturePad(!showSignaturePad)
  }


  return (
    <>
      <div className={`container-fluid d-flex flex-column justify-content-center align-items-center ${lang === "ar" ? "sign-up-credit__ar" : ""}`}>
        <h1 className='credit-heading text-center mt-5 pt-5'>
          {t('SignUp.SetUpCard')}
        </h1>
        <div className='credit-container pt-5 mb-5'>

          <Card>
            <div className={`d-flex gap-5 mb-4 mt-3`}>
              <label className={`d-flex gap-2`}>
                <input
                  type="radio"
                  value="Credit Card"
                  name='cardType'
                  onChange={handleChange}
                  checked={formData.cardType === 'Credit Card'}
                />
                <span className={`credit-type`}>{t('SignUp.CreditCard')}</span>
              </label>
              <label className={`d-flex gap-2`}>
                <input
                  type="radio"
                  value="Mada Card"
                  name='cardType'
                  onChange={handleChange}
                />
                <span className={`credit-type`}>{t('SignUp.MadaCard')}</span>
              </label>
            </div>
            {
              errors.cardType &&
              <p className={`text-danger error-msg ${lang === 'en' ? '' : 'text-end'}`}>
                {t('Credit.Errors.InvalidCardType')}
              </p>
            }
            <div>
              <div>
                <label className='card-input-label mb-2'>{t('SignUp.CardNumber')}</label>
                <input type='text' name='cardNumber' placeholder={t('SignUp.CardNumber')} className='credit-input mb-3 p-2 w-100' onChange={handleChange} />
              </div>
              {
                errors.cardNumber &&
                <p className={`text-danger error-msg ${lang === 'en' ? '' : 'text-end'}`}>
                  {t('Credit.Errors.InvalidCardNumber')}
                </p>
              }
              {/* <div className='d-flex gap-5'>

                <div>
                  <label className='card-input-label mb-2'>{t('SignUp.ExpirationDate')}</label>
                  <div className='d-flex align-items-center gap-3'>
                    <input type='text' name='expiryMonth' placeholder='MM' inputMode='numeric' maxLength='2' className='credit-input-date p-2' onChange={handleChange} />
                    <span>/</span>
                    <input type='text' name='expiryYear' placeholder='YY' inputMode='numeric' maxLength='2' className='credit-input-date p-2' onChange={handleChange} />
                  </div>
                </div>

                <div>
                  <label className='card-input-label mb-2'>CVV</label>
                  <input type='text' name='cvv' placeholder='CVV' inputMode='numeric' maxLength='4' className='credit-input mb-3 p-2 w-100' onChange={handleChange} />
                </div>

              </div> */}
            </div>
            {/* {
              errors.cvv &&
              <p className={`text-danger error-msg ${lang === 'en' ? '' : 'text-end'}`}>
                {t('Credit.Errors.InvalidCVV')}
              </p>
            }
            {
              (errors.expiryMonth || errors.expiryYear) &&
              <p className={`text-danger error-msg ${lang === 'en' ? '' : 'text-end'}`}>
                {t('Credit.Errors.InvalidExpiryDate')}
              </p>
            } */}
            {
              errors.fillAllFields &&
              <p className={`text-danger error-msg ${lang === 'en' ? '' : 'text-end'}`}>
                {t('Credit.Errors.FillAllFields')}
              </p>
            }
            <div className='mt-3'>
              <h6 className=''><b>{selectedPkg && selectedPkg.PackageName}</b>
                <br /> Package for {selectedPkg && selectedPkg.UserType}</h6>
              <div className='credit-subtotal'>
                <span className='amount-label mb-2'>{t('SignUp.Subtotal')} :  </span><span className='amount'>{selectedPkg && selectedPkg.Fee}</span>
              </div>
              {/* <div className='cerdit-vat mt-2'>
                <span className='amount-label mb-2'>VAT (15%) :  </span><span className='amount'>{!isNaN(credit.vat) && credit.vat}</span>
              </div> */}
              <div className='d-flex align-items-center gap-2 my-2'>
                <img src={ticket} alt="ticket" />
                <span className='card-input-label'>{t('SignUp.PromoCode')}</span>
                <input type='text' name='promocode' onChange={handleChange} placeholder={t('SignUp.PromoCode')} className='credit-input-promo p-2' />
                <button className='promo-btn' onClick={applyPromo}>{t('SignUp.Apply')}</button>
              </div>
              {
                errors.promo &&
                <p className={`text-danger error-msg ${lang === 'en' ? '' : 'text-end'}`}>
                  {t('Credit.Errors.InvalidPromo')}
                </p>
              }
              {
                errors.promoApplied &&
                <p className={`text-danger error-msg ${lang === 'en' ? '' : 'text-end'}`}>
                  {t('Credit.Errors.PromoAplied')}
                </p>
              }
              <div className=' d-flex justify-content-between cerdit-total mt-3'>
                <div>
                  <span className='amount-label mb-2'>{t('SignUp.Total')} :</span><span className='amount total'> {credit.total} </span><span className='currency'> {t('SignUp.SAR')} / {t('SignUp.Year')} </span>
                </div>
                <Link to='/signup/services-form' className='mt-3 change-package-link'>{t('SignUp.ChangePackage')}</Link>
              </div>
            </div>
            <p className='terms-and-privacy mt-3'>
              {t('SignUp.TermsAndPolicyText')} <Link to={lang === 'en' ? "https://medical.rasanllp.com/terms-and-conditions/" : "https://medical.rasanllp.com/الشروط-والأحكام/"} target='_blank' className='terms-and-privacy-link'>{t('SignUp.TermsOfUse')}</Link>, <Link to={"https://medical.rasanllp.com/terms-and-conditions/"} target='_blank' className='terms-and-privacy-link'>{t('SignUp.PrivacyStatement')}</Link>
            </p>
            <div className="d-flex align-items-center justify-content-between mt-4 " style={{ width: '100%' }}>
              <div>
                <input type='checkbox' id='isAgreed' className='terms-checkbox mt-2' onClick={(e) => {
                  // if (e.target.checked) {
                  toggleModal();
                  // }
                }} checked={isAgreed} />
                <label htmlFor="isAgreed">
                  <span className='terms-checkbox-label ms-2'>{t('SignUp.IAgree')}</span>
                </label>
              </div>
              {/* <div className='d-flex align-items-center gap-3 mt-2'>
                <input type='checkbox' name='isAgreed' id="isAgreed" className='terms-checkbox'/>
                <lable for="isAgreed" className='terms-checkbox-label'>{t('SignUp.IAgree')}</lable>
              </div> */}
              {
                errors.isAgreed &&
                <p className={`text-danger error-msg ${lang === 'en' ? '' : 'text-end'}`}>
                  {t('Credit.Errors.Agreed')}
                </p>
              }
            </div>
            <div className='credit-btn mt-3'>
              <button className='btn text-white w-100' onClick={handleSubmit}>{t('SignUp.Submit')}</button>
            </div>
          </Card>
          {
            showSignaturePad && <Modal toggleModal={toggleSignaturePad}>
              <SignaturePad toggleModal={() => {
                toggleSignaturePad()
                toggleModal()
              }}
                signatre={setFiles}
              />
            </Modal>
          }
        </div>
      </div>
      {isModalVisible && (
        <Modal toggleModal={toggleModal}>
          <div className="user_submit_modal">
            <H3
              text={t("SignUp.TermsAndConditions")}
              className="text-center "
            />
            <p className={lang === "en" ? "text-start" : "text-end"}>{t("SignUp.TermsAndConditionsText")}</p>
            <div>
              <p>{t("UserPanel.Cases.AddNewCasePage.Signature")}</p>
              {
                !files.length > 0 && <Dropzone
                  files={files}
                  setFiles={setFiles}
                  content={t(
                    "UserPanel.Cases.AddNewCasePage.UploadDigitalSignature"
                  )}
                />
              }
              {!files.length > 0 &&
                <p className={`text-danger error-msg ${lang === 'en' ? '' : 'text-end'}`}>
                  {t('SignUp.Errors.UploadSignatureError')}
                </p>
              }
              <div className='mt-3'>
                {
                  files.length > 0 ? <H3 text={t("SignUp.Errors.SignUploaded")} /> :
                    <>
                      <p>{t("SignUp.Errors.or")}</p>
                      <Link className='change-package-link' onClick={() => {
                        toggleSignaturePad();
                        toggleModal();
                      }}>{t("SignUp.Errors.DrawSignature")}</Link>
                    </>
                }
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between mt-4 ">
            <Button1
              onClick={toggleModal}
              text={t("UserPanel.Cases.AddNewCasePage.Cancel")}
              color="gray"
            />
            <Button1
              onClick={agreeAndSubmitHandler}
              text={t("SignUp.AgreeAndSubmit")}
            />
          </div>
        </Modal>
      )}
    </>
  )
}

export default SignUpCredit