import React, { useState } from 'react';
import bars from '../../assets/header/bars.svg';
import cross from '../../assets/header/x.svg';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BsChevronDown } from "react-icons/bs";
import { useDispatch, useSelector } from 'react-redux';
import { language } from '../../features/language/lanSlice';
import './header.css';

const SmallScreenMenu = () => {
    const [toggle, setToggle] = useState(false)
    const { t, i18n } = useTranslation();
    const lang = useSelector(state => state.language.value);
    const dispatch = useDispatch();

    const changeLanguage = (lng) => {
        if (lng === 'ar') {
            dispatch(language('ar'))
            toggleMenu()
        } else {
            dispatch(language('en'))
            toggleMenu()
        }
        i18n.changeLanguage(lng);
    };
    const toggleMenu = () => {
        setToggle((prev) => !prev)
    }

    return (
        <div>
            <div className='ham-icon' onClick={toggleMenu}>
                <img src={bars} alt="bars" />
            </div>
            <div className={`ham-menu ${!toggle ? 'd-none' : 'd-flex justify-content-center align-items-center'}`}>
                <img src={cross} alt="cross" className={`cross-icon`} onClick={toggleMenu} />
                <ul className={`list-unstyled d-flex flex-column justify-content-center align-items-center gap-5`}>
                    <li className='pointer'><Link to={'https://medmal.rasanllp.com/'} className='link' onClick={toggleMenu}>{t("Header.Home")}</Link></li>
                    <li className='pointer'><Link to={'https://medmal.rasanllp.com/#services'} className='link'>{t("Header.Services")}</Link></li>
                    <li className='pointer'><Link to={'https://medmal.rasanllp.com/blog/'} className='link'>{t("Header.Blogs")}</Link></li>
                    <li className='pointer'><Link to={'https://medmal.rasanllp.com/#contact'} className='link'>{t("Header.ContactUs")}</Link></li>
                    <li className='lan-nav-item pointer'>{lang == 'en' ? 'English' : 'العربية'} <BsChevronDown className='bi-chevron-down' />
                        <ul className='list-unstyled lan-dropdown border rounded p-2'>
                            <li className='pointer px-3 py-1 border-bottom' onClick={() => changeLanguage('en')}>English</li>
                            <li className='pointer px-3' onClick={() => changeLanguage('ar')}>العربية</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default SmallScreenMenu