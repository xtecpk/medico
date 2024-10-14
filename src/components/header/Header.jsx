import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BsChevronDown } from "react-icons/bs";
import { useDispatch, useSelector } from 'react-redux';
import { language } from '../../features/language/lanSlice'
import '../header/header.css'
import SmallScreenMenu from './SmallScreenMenu';
import logo from '../../assets/home/RASAN5.jpg'

const Header = () => {
    const { t, i18n } = useTranslation();
    const lang = useSelector(state => state.language.value);
    const dispatch = useDispatch();

    const changeLanguage = (lng) => {
        if (lng === 'ar') {
            dispatch(language('ar'))
            localStorage.setItem('language', 'ar');
        } else {
            dispatch(language('en'))
            localStorage.setItem('language', 'en');
        }
        i18n.changeLanguage(lng);
    };

    return (
        <div className='header-container d-flex justify-content-center py-3'>
            <div className={`d-flex ${lang == 'en' ? '' : 'flex-row-reverse'}  justify-content-between header mx-3 p-2`}>
                <div className={lang == 'en' ? 'd-flex' : 'd-flex flex-row-reverse'}>
                    <div className={lang == 'en' ? 'me-5' : 'ms-5'}>
                        <Link to={'https://medmal.rasanllp.com/'}>
                            <img src={logo} alt="Logo" style={{ maxHeight: '50px' }} />
                        </Link>
                    </div>
                    <ul className={`navigation-bar list-unstyled align-items-center gap-5 max-width-[1200px] ${lang == 'en' ? 'ms-5' : 'flex-row-reverse me-5'}`}>
                        <li className='pointer'>
                            <Link to={'https://medmal.rasanllp.com/'} className='link'>{t("Header.Home")}</Link>
                        </li>
                        <li className='pointer'>
                            <Link to={'https://medmal.rasanllp.com/#services'} className='link'>{t("Header.Services")}</Link>
                            {/* <a href={'https://medmal.rasanllp.com/#services'} className='link'>{t("Header.Services")}</a> */}
                        </li>
                        <li className='pointer'>
                            <Link to={'https://medmal.rasanllp.com/blog/'} className='link'>{t("Header.Blogs")}</Link>
                            {/* <a href={'https://medmal.rasanllp.com/blog/'} className='link'>{t("Header.Blogs")}</a> */}
                        </li>
                        <li className='pointer'>
                            <Link to={'https://medmal.rasanllp.com/#contact'} className='link'>{t("Header.ContactUs")}</Link>
                            {/* <a href={'https://medmal.rasanllp.com/#contact'} className='link'>{t("Header.ContactUs")}</a> */}
                        </li>
                        <li className='lan-nav-item pointer'>{lang == 'en' ? 'english' : 'العربية'} <BsChevronDown className='bi-chevron-down' />
                            <ul className='list-unstyled lan-dropdown border rounded p-2'>
                                <li className='pointer px-3 py-1 border-bottom' onClick={() => changeLanguage('en')}>english</li>
                                <li className='pointer px-3' onClick={() => changeLanguage('ar')}>العربية</li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div className='d-flex gap-3'>
                    <div>
                        <Link to="/signin" className='btn text-decoration-none header-sign-in-link'>{t("Header.SignIn")}</Link>
                    </div>
                    <div>
                        <Link to="/signup" className='btn text-decoration-none header-sign-up-link'>{t("Header.SignUp")}</Link>
                    </div>
                    <SmallScreenMenu />
                </div>

            </div>
        </div>
    )
}

export default Header