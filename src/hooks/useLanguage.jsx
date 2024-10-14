import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { language } from "../features/language/lanSlice";
import { useTranslation } from "react-i18next";


const useLanguage = () => {
    const dispatch = useDispatch();
    const { i18n } = useTranslation();
    let lang;

    useEffect(() => {
        lang = localStorage.getItem("language");
        if(lang==='en'){
        i18n.changeLanguage('en');
        }else if(lang==='ar'){
          i18n.changeLanguage('ar');
        }else{
          localStorage.setItem("language", "en");
          i18n.changeLanguage('en');
          dispatch(language('en'));
        }
      }, []);

    return lang;
};

export default useLanguage;