import React, { useState } from 'react'
import "./AdressModal.css"
import { Button1 } from '../../../views/user/components';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const AdressModal = ({ boolState, handleAdress, adress, setAdress, topClass }) => {

    const { t } = useTranslation();
    const lang = useSelector(state => state.language.value);

    const handleSubmit = (e) => {
        e.preventDefault();
        boolState(true);
    }


    const handleChange = (event) => {
        const value = event.target.value
        setAdress({
            ...adress,
            [event.target.name]: value
        })
    }

    const line1 = adress.line1 || '';
    const roomNo = (adress.room && (' / ' + adress.room)) || '';
    const city = (adress.city && (' / ' + adress.city)) || '';
    const adState = (adress.state && (' / ' + adress.state)) || '';
    const postCode = (adress.zip && (' / ' + adress.zip)) || '';
    const country = (adress.country && (' / ' + adress.country)) || '';

    handleAdress(line1 + roomNo + city + adState + postCode + country)

    return (
        <div className={`adressmodal mb-3 ${topClass} ${lang === "en" ? "" : "modal-right"}`}>
            <div className="card" style={{ marginBottom: '0px' }}>
                <div className="card-header" style={{ background: '#f8f4f4' }}>
                    <h4 className="card-title">{t("SignUp.Placeholders.Adress")}</h4>
                </div>
                <div className="card-body">
                    <div className="basic-form">
                        <form onSubmit={handleSubmit}>
                            <div className="col-md-12 mb-2">
                                <input type="text" id='adressInput1' onChange={handleChange} value={adress.line1} name='line1' className="form-control input-default " placeholder={t("SignUp.Placeholders.AdressLine")} />
                            </div>
                            {/* <div className="col-md-12 mb-2">
                                <input type="text" id='adressInput2' onChange={handleChange} value={adress.room} name='room' className="form-control input-default " placeholder="Room / Suite / Apt #" />
                            </div> */}
                            <div className="col-md-12 mb-2">
                                <input type="text" id='adressInput3' onChange={handleChange} value={adress.city} name='city' className="form-control input-default " placeholder={t("SignUp.Placeholders.City")} />
                            </div>
                            <div className="col-md-12 mb-2">
                                <input type="text" id='adressInput4' onChange={handleChange} value={adress.state} name='state' className="form-control input-default " placeholder={t("SignUp.Placeholders.State")} />
                            </div>
                            <div className="col-md-12 mb-2">
                                <input type="text" id='adressInput5' onChange={handleChange} value={adress.zip} name='zip' className="form-control input-default " placeholder={t("SignUp.Placeholders.Zip")} />
                            </div>
                            <div className="col-md-12 mb-2">
                                <input type="text" id='adressInput6' onChange={handleChange} value={adress.country} name='country' className="form-control input-default " placeholder={t("SignUp.Placeholders.Country")} />
                            </div>
                            <div className="col-md-12 mt-3 text-end">
                                <Button1 onClick={handleSubmit} text={t("SignUp.Placeholders.Done")} />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdressModal
