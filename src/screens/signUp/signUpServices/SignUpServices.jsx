import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import './signUpServices.css'
import Card from '../../../components/mainPageCard/MainPagesCard'
import { useNavigate } from 'react-router-dom'
import { service } from '../../../features/service/serviceSlice'
import Cookies from 'js-cookie'
import axios from 'axios'

const SignUpServices = () => {
    const lang = useSelector(state => state.language.value)
    const baseURL = import.meta.env.VITE_BASE_URL;
    const profession = Cookies.get('profession')
    const token = Cookies.get('token');

    const [services, setServices] = useState([]);
    const [error, setErrors] = useState(false);


    const [selectedService, setSelectedService] = useState(0);

    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const text = "Membership value without VAT"

    const getPackagesByType = async () => {
        await axios.post(baseURL + "/api/getpackagebyusertype", {
            // Valid: 1,
            UserType: profession
        },
        ).then(res => {
            console.log(res);
            setServices(res.data.response.data)
        })
    }

    const handleService = (index) => {
        setSelectedService(index);
    };

    console.log(selectedService);
    useEffect(() => {
        getPackagesByType()
    }, [])

    const handleNext = () => {
        if (selectedService === -1) {
            setErrors(true)
            return;
        }
        localStorage.setItem('package', JSON.stringify(services[selectedService]));
        navigate('/signup/credit');
    };

    return (
        <div className='container-fluid d-flex justify-content-center align-items-center'>
            <div className='signup-services-container mt-5 pt-5 d-flex flex-column justify-content-center align-items-center gap-3'>
                <h1 className='services-heading text-center'>
                    {t('SignUpServices.Heading')}
                </h1>
                {/* <p className='services-subheading text-center mt-4'>
                    {t('SignUpServices.Subheading')}
                </p> */}
                <p className='services-type text-center mt-3'>
                    {profession}
                </p>
                <div className='services-cards justify-content-center d-flex gap-5'>
                    {
                        services.length > 0 ? services.map((service, index) => {
                            return (
                                <div key={index} className={`service-card-outer ${selectedService === index ? 'selected-service' : ''} `} onClick={() => handleService(index)}>
                                    <Card >
                                        <div className='service-card pointer d-flex  flex-column justify-content-center align-items-start h-100 w-100'>
                                            <h1 className='service-type mt-3'>
                                                {service.PackageName}
                                            </h1>
                                            <p className='service-description mt-3'>
                                                {service.Description}
                                            </p>
                                            <h3 className='service-type mt-3'>
                                                {service.UserType}
                                            </h3>
                                            <p className='service-amount mt-3'>
                                                {service.Fee} <span className='currency'>SAR</span>
                                            </p>
                                            <p className='service-text'>
                                                {text}
                                            </p>
                                        </div>
                                    </Card>
                                </div>
                            )
                        }) :
                            <p>No Packages Found</p>
                    }
                </div>

                {
                    error && <p className={`text-danger error-msg ${lang === 'en' ? '' : 'text-end'}`}>
                        Please Select a Package
                    </p>
                }
                <button className='btn signup-services-btn text-white mt-5' onClick={handleNext}>{t('SignUpServices.Next')}</button>
            </div>
        </div>
    )
}

export default SignUpServices