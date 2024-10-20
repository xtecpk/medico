import { useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import MainPagesCard from "../../components/mainPageCard/MainPagesCard";
import "./signIn.css";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import useSignIn from "../../hooks/useSignIn";
import HeaderWithoutCTA from "../../components/header/headerWithoutCTA";
import logo from "../../assets/home/RASAN5.jpg";
import { TfiEmail } from "react-icons/tfi";
import { FiPhone } from "react-icons/fi";
import { language } from "../../features/language/lanSlice";
import { FaRegCopyright } from "react-icons/fa6";
import google from "../../assets/signup/google.png";

const SignIn = () => {
  const { t, i18n } = useTranslation();
  const lang = useSelector((state) => state.language.value);
  const dispatch = useDispatch();

  const isAraibic = useLocation().pathname.includes("ar");

  useEffect(() => {
    if (isAraibic) {
      dispatch(language("ar"));
      i18n.changeLanguage("ar");
    }
  }, []);

  const { formData, errors, handleChange, handleSubmit, googleSignin } =
    useSignIn();

  return (
    <>
      <div
        className="container-fluid signin-container  d-flex justify-content-center align-items-center"
        style={{ minHeight: "83vh" }}
      >
        <HeaderWithoutCTA />
        {/* <div
          className={`company-infoSign d-flex flex-column justify-content-center`}
        >
          <div
            className={`company-description ${lang === "en" ? "pe-5" : ""} `}
          >
            <br />
            <div>
              <h1 className={`${lang === "en" ? "" : "text-end"}`}>
                {t("SignIn.CompanyInfo.DetailsTitle")}
              </h1>
              <p className={`${lang === "en" ? "" : "text-end"}`}>
                <b>{t("SignIn.CompanyInfo.Details1Title")}</b>
                {t("SignIn.CompanyInfo.Details1")}
              </p>
              <p className={`${lang === "en" ? "" : "text-end"}`}>
                <b>{t("SignIn.CompanyInfo.Details2Title")}</b>
                {t("SignIn.CompanyInfo.Details2")}
              </p>
            </div>
          </div>
          <div className="company-contacts">
            <h5 className={`${lang === "en" ? "" : "text-end"}`}>
              {t("SignIn.CompanyInfo.Contact")}
            </h5>
          </div>
          <div className="company-contacts">
            <div className={`${lang === "en" ? "" : "row-reverse"}`}>
              <TfiEmail />
              <span className="px-2">medmal@rasanllp.com</span>
            </div>
          </div>
          <div className="company-contacts">
            <div className={`${lang === "en" ? "" : "row-reverse"}`}>
              <FiPhone />
              <span className="px-2">011 4 200 300</span>
            </div>
          </div>
          <div className="company-contacts">
            <div className={`${lang === "en" ? "" : "row-reverse"}`}>
              <FiPhone />
              <span className="px-2">054 535 1 767</span>
            </div>
          </div>
        </div> */}
        <div className="col-md-4 d-flex signin-form justify-content-center align-items-center">
          <MainPagesCard>
            <div className="signin-form-container">
              <div className="signin-form-title">
                <span
                  className={`${lang === "en" ? "" : "text-end d-block w-100"}`}
                >
                  {t("SignIn.Heading")}
                </span>
                <p className={`${lang === "en" ? "" : "text-end"}`}>
                  {t("SignIn.Subheading")}
                </p>
              </div>

              <div className="signin-form-inputs  d-flex flex-column gap-4 py-5">
                <div className="signin-form-input">
                  <input
                    type="text"
                    name="PhoneNo"
                    id="phoneNo"
                    placeholder={t("UserPanel.Profile.NationalID")}
                    className="w-100 p-2"
                    onChange={handleChange}
                    dir={`${lang === "en" ? "ltr" : "rtl"}`}
                  />
                </div>
                {errors.PhoneNo && (
                  <span
                    className={`text-danger error-msg ${
                      lang === "en" ? "" : "text-end"
                    }`}
                  >
                    {t("SignIn.Errors.InvalidNationalId")}
                  </span>
                )}
                <div className="signin-form-input">
                  <input
                    type="password"
                    name="Password"
                    id="password"
                    placeholder={t("SignIn.Placeholders.Password")}
                    className="w-100 p-2"
                    onChange={handleChange}
                    dir={`${lang === "en" ? "ltr" : "rtl"}`}
                  />
                </div>
              </div>
              {errors.Password && (
                <span
                  className={`text-danger error-msg ${
                    lang === "en" ? "" : "text-end"
                  }`}
                >
                  {t("SignIn.Errors.InvalidPassword")}
                </span>
              )}
              {errors.WrongCredentials && (
                <span
                  className={`text-danger error-msg ${
                    lang === "en" ? "" : "text-end"
                  }`}
                >
                  {t("SignIn.Errors.InvalidCredentials")}
                </span>
              )}
              {errors.fillAllFields && (
                <span
                  className={`text-danger error-msg ${
                    lang === "en" ? "" : "text-end"
                  }`}
                >
                  {t("SignIn.Errors.FillAllFields")}
                </span>
              )}

              <div className="signin-form-button">
                <button onClick={handleSubmit}>{t("SignIn.SignIn")}</button>
              </div>
              <p className="text-center my-3">Or Sign In with</p>
              <div className="d-flex justify-content-center gap-3">
                <div className="social-media-icon d-flex">
                  <div onClick={() => googleSignin()}>
                    <img src={google} alt="logo" />
                  </div>
                  {/* <div>
                          <img src={apple} alt="logo" />
                        </div> */}
                </div>
              </div>
              <div className="signin-form-footer">
                <p className={`${lang === "en" ? "" : "text-end"}`}>
                  {t("SignIn.Prompt")}
                  <span className="mx-2">
                    <Link to={"/signup"}>{t("SignIn.PromptLink")}</Link>
                  </span>
                </p>
                <p className={`${lang === "en" ? "" : "text-end"}`}>
                  <span>
                    <Link to={"/change-password"}>
                      {t("Header.ForgotPassword")}
                    </Link>
                  </span>
                </p>
                <p className={`${lang === "en" ? "" : "text-end"}`}>
                  <span>
                    <Link
                      target="_blank"
                      to={
                        "https://medmal.rasanllp.com/%d8%a7%d9%84%d8%b4%d8%b1%d9%88%d8%b7-%d9%88%d8%a7%d9%84%d8%a3%d8%ad%d9%83%d8%a7%d9%85/"
                      }
                    >
                      {t("SignUp.TermsAndConditions")}
                    </Link>
                  </span>
                </p>
              </div>
            </div>
          </MainPagesCard>
        </div>
      </div>
      <div className="d-flex flex-wrap w-full justify-content-between m-4  mt-4">
        <p className="version my-2 min-w-[4rem]">Version 2.0 </p>
        <p className="version my-2 min-w-[4rem]">
          <FaRegCopyright /> 2024 All rights Reserved by RASAN LLP
        </p>
        <div className="d-flex min-w-[4rem] mx-3 my-2 pointer">
          <div className={`${lang === "en" ? "" : "row-reverse"}`}>
            <a href="mailto:medmal@rasanllp.com" style={{ color: "#2F4058" }}>
              <TfiEmail />
              <span className="px-2">medmal@rasanllp.com</span>
            </a>
          </div>
        </div>
        <div className="d-flex min-w-[4rem] mx-3 my-2">
          <div className={`${lang === "en" ? "" : "row-reverse"}`}>
            <FiPhone />
            <span className="px-2">011 4 200 300</span>
          </div>
        </div>
        <div className="d-flex min-w-[4rem] mx-3 my-2">
          <div className={`${lang === "en" ? "" : "row-reverse"}`}>
            <FiPhone />
            <span className="px-2">054 535 1 767</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
