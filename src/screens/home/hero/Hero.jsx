import React from 'react'
import './hero.css'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import arrow from '../../../assets/home/arrow.png'
import banner from "../../../assets/home/bannerImg.jpg"

const Hero = () => {
    const { t } = useTranslation();
    const lang = useSelector(state => state.language.value);

    return (
        <div className='d-block w-100 hero-outer-container'>
            <div className='d-flex justify-content-center container-fluid'>
                <div className={`hero-container ${lang == 'en' ? 'ltr' : 'rtl'}`} >
                    <div className="row mt-7">
                        <div className={`col-md-5 col-sm-12 mb-3 hero-text d-flex flex-column w-40 ${lang == 'en' ? 'ltr' : 'rtl'}`}>
                            <span className={`d-inline-block hero-heading ${lang == 'en' ? '' : 'text-end'}`}><strong>{t("Home.Hero.HeroHeading1")}</strong></span>
                            <span className={`d-inline-block hero-heading ${lang == 'en' ? '' : 'text-end'}`}>{t("Home.Hero.HeroHeading2")}</span>
                            <span className={`d-inline-block hero-subheading mt-5 ${lang == 'en' ? '' : 'text-end'}`}>{t("Home.Hero.HeroSubheading")}</span>
                            <div className={`mt-5 d-flex ${lang == 'en' ? '' : ' justify-content-end'}`}>
                                <img src={arrow} alt="" />
                            </div>
                        </div>
                        <div className={`col-md-7 col-sm-12 
                        hero-image-bg ${lang == 'en' ? 'ltr fade-out-right' : 'rtl fade-out-left'}
                       
                        `}>
                            <img src={banner} alt="" className='hero-image' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero