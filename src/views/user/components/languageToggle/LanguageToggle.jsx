import React, { useEffect, useRef } from "react";
import "./languageToggle.css";
import { globeIcon } from "../../assets";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { language } from "../../../../features/language/lanSlice";

const LanguageToggle = ({
  isLanguageToggleExpanded,
  setIsLanguageToggleExpanded,
  isPicCardExpanded,
  setIsMesgBoxExpanded,
  setIsPicCardExpanded,
}) => {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.language.value);
  const changeLanguage = (lng) => {
    if (lng === "ar") {
      dispatch(language("ar"));
    } else {
      dispatch(language("en"));
    }
    i18n.changeLanguage(lng);
  };

  const globeIconRef = useRef(null);

  const closePop = (e) => {
    if (globeIconRef.current && (globeIconRef.current.contains(e.target) || globeIconRef.current == e.target)) {
      setIsLanguageToggleExpanded(!isLanguageToggleExpanded);
    } else {
      setIsLanguageToggleExpanded(false)
    }
  }

  useEffect(() => {
    document.body.addEventListener('click', closePop);

    return () => {
      document.body.removeEventListener('click', closePop);
    }
  }, [isLanguageToggleExpanded])

  const langugeToggleClickHandler = () => {
    setIsLanguageToggleExpanded((prevState) => !prevState);
    setIsPicCardExpanded(false);
    setIsMesgBoxExpanded(false)
  };

  return (
    <>
      <div
        className={`user_language_change mx-2 ${lang === "ar" ? "user_language_change--ar" : ""
          }`}>
        <button
          ref={globeIconRef}
          className="d-flex align-items-center justify-content-center border-0 bg-transparent p-2">
          <img src={globeIcon} alt="globe" />
        </button>
        {isLanguageToggleExpanded && (
          <div className="user_language_change__dropdown border p-1">
            <button
              className="font_english"
              onClick={() => {
                changeLanguage("en");
                setIsLanguageToggleExpanded(false);
              }}>
              English
            </button>
            <hr />
            <button
              className="font_arabic"
              onClick={() => {
                changeLanguage("ar");
                setIsLanguageToggleExpanded(false);
              }}>
              العربية
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default LanguageToggle;
