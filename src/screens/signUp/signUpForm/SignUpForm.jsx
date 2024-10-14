import React, { useEffect, useRef, useState } from "react";
import MainPagesCard from "../../../components/mainPageCard/MainPagesCard";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import "./signUpForm.css";
import useSignUp from "../../../hooks/useSignUp";
import { FaArrowLeft } from "react-icons/fa";
import logo from "../../../assets/home/RASAN5.jpg";
import AdressModal from "../adressModal/AdressModal";
import { language } from "../../../features/language/lanSlice";
import { FiEyeOff } from "react-icons/fi";
import { FiEye } from "react-icons/fi";
import { TfiEmail } from "react-icons/tfi";
import { FiPhone } from "react-icons/fi";
import apple from "../../../assets/signup/apple.png";
import google from "../../../assets/signup/google.png";
import { useGoogleLogin, useGoogleOAuth } from "@react-oauth/google";
import axios from "axios";
import SignUpPageVideo from "../../../assets/signup/signup.mp4";

const SignUpForm = () => {
  const { t, i18n } = useTranslation();

  const lang = useSelector((state) => state.language.value);
  const isAraibic = useLocation().pathname.includes("ar");
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAraibic) {
      dispatch(language("ar"));
      i18n.changeLanguage("ar");
    }
  }, []);

  const {
    formData,
    errors,
    setFormData,
    handleChange,
    handleSubmit,
    isNext,
    isGoogleSignin,
    setIsGoogleSignin,
  } = useSignUp();

  const [isModalVisible, setIsModalVisible] = useState(true);
  const [passwordVisible1, setPasswordVisible1] = useState(false);
  const [passwordVisible2, setPasswordVisible2] = useState(false);
  const [adressObj, setAdressObj] = useState({
    line1: "",
    city: "",
    state: "",
    country: "",
    zip: "",
  });

  const [adress, setadress] = useState();
  const [pages, setPages] = useState({
    firstPage: true,
    secondPage: false,
  });

  const googleSignin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      console.log(codeResponse);
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${codeResponse.access_token}`
      );
      console.log(response);
      setFormData({
        email: response.data.email,
        fullName: response.data.name,
      });
      setIsGoogleSignin(codeResponse.access_token);
      setPages({
        firstPage: false,
        secondPage: true,
      });
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  const nextPage = () => {
    if (isNext()) {
      setPages({
        firstPage: false,
        secondPage: true,
      });
    }
  };
  console.log(formData.adress);

  const prevPage = () => {
    setPages({
      firstPage: true,
      secondPage: false,
    });
  };

  useEffect(() => {
    setFormData({
      ...formData,
      adress,
    });
  }, [adress]);

  return (
    <div className="signUp_box d-flex justify-content-center align-items-center">
      <div className="signup-container  d-flex justify-content-center align-items-center gap-5 signUpBox">
        <div className="video_container ">
          <div className="d-flex flex-direction-column align-items-center ">
            <h1 className="">How to Sign up ! </h1>
            <video
              className="videoClass"
              autoPlay={true}
              loop
              src={SignUpPageVideo}
              controls
            ></video>
          </div>
        </div>
        {/* <div
          className={`company-info d-flex flex-column justify-content-center`}
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
        <div className="signup-form mt-5 ">
          <MainPagesCard>
            <div className="signup-form-container">
              <div className="signup-form-title">
                <span
                  className={`${lang === "en" ? "" : "text-end d-block w-100"}`}
                >
                  {t("SignUp.Heading")}
                </span>
                <p className={`${lang === "en" ? "" : "text-end"}`}>
                  {t("SignUp.Subheading")}
                </p>
              </div>

              <div className="signup-form-inputs">
                {
                  <div
                    className={`signup-form-inputs  d-flex flex-column gap-3 py-3 ${
                      pages.firstPage ? "d-block" : "d-none"
                    }`}
                  >
                    <div className="signup-form-input">
                      <input
                        type="text"
                        name="fullName"
                        id="fullname"
                        value={formData.fullName}
                        placeholder={t("SignUp.Placeholders.FullName")}
                        className="w-100 p-2"
                        onChange={handleChange}
                        dir={`${lang === "en" ? "ltr" : "rtl"}`}
                      />
                    </div>
                    <div className="signup-form-input">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        placeholder={t("SignUp.Placeholders.Email")}
                        className="w-100 p-2"
                        onChange={handleChange}
                        dir={`${lang === "en" ? "ltr" : "rtl"}`}
                      />
                    </div>
                    <div className="signup-form-input">
                      <input
                        type="text"
                        name="phoneNumber"
                        id="PhoneNumber"
                        placeholder={t("UserPanel.Profile.NationalID")}
                        className="w-100 p-2"
                        onChange={handleChange}
                        dir={`${lang === "en" ? "ltr" : "rtl"}`}
                      />
                      {errors.phoneNumber && (
                        <p
                          className={`text-danger error-msg m-0 pt-1 ${
                            lang === "en" ? "" : "text-end"
                          }`}
                        >
                          {t("SignUp.Errors.InvalidNationalId")}
                        </p>
                      )}
                      {/* {
                  phoneNoAlreadyExist && 
                    <p className={`text-danger error-msg ${lang === 'en' ? '' : 'text-end'}`}>
                      {t('SignUp.Errors.PhoneNoAlreadyExists')}
                    </p>
                  } */}
                    </div>

                    {/* <div className="signup-form-input">
                      <input
                        type="adress"
                        value={formData.adress}
                        name="adress"
                        id="adress"
                        placeholder={t("SignUp.Placeholders.Adress")}
                        className="w-100 p-2 pointer"
                        onClick={() => setIsModalVisible(!isModalVisible)}
                        onChange={handleChange}
                        dir={`${lang === "en" ? "ltr" : "rtl"}`}
                        readOnly
                      />
                      {isModalVisible || (
                        <AdressModal
                          boolState={setIsModalVisible}
                          adress={adressObj}
                          handleAdress={setadress}
                          setAdress={setAdressObj}
                        />
                      )}
                    </div> */}

                    <div className="signup-form-input passwordInput d-flex">
                      <input
                        type={passwordVisible1 ? "text" : "password"}
                        name="password"
                        id="password"
                        placeholder={t("SignUp.Placeholders.Password")}
                        className="w-100 p-2"
                        onChange={handleChange}
                        dir={`${lang === "en" ? "ltr" : "rtl"}`}
                      />
                      <span
                        onClick={() => setPasswordVisible1(!passwordVisible1)}
                      >
                        {passwordVisible1 ? <FiEye /> : <FiEyeOff />}
                      </span>
                    </div>
                    <div className="signup-form-input d-flex passwordInput">
                      <input
                        type={passwordVisible2 ? "text" : "password"}
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder={t("SignUp.Placeholders.ConfirmPassword")}
                        className="w-100 p-2"
                        onChange={handleChange}
                        dir={`${lang === "en" ? "ltr" : "rtl"}`}
                      />
                      <span
                        onClick={() => setPasswordVisible2(!passwordVisible2)}
                      >
                        {passwordVisible2 ? <FiEye /> : <FiEyeOff />}
                      </span>
                    </div>
                    <div>
                      {errors.password && (
                        <span
                          className={`text-danger error-msg ${
                            lang === "en" ? "" : "text-end"
                          }`}
                        >
                          {t("SignUp.Errors.InvalidPassword")}
                        </span>
                      )}
                      {errors.confirmPassword && (
                        <span
                          className={`text-danger error-msg ${
                            lang === "en" ? "" : "text-end"
                          }`}
                        >
                          {t("SignUp.Errors.PasswordMismatch")}
                        </span>
                      )}
                      {errors.fillAllFields && (
                        <span
                          className={`text-danger error-msg ${
                            lang === "en" ? "" : "text-end"
                          }`}
                        >
                          {t("SignUp.Errors.FillAllFields")}
                        </span>
                      )}
                    </div>
                    <div className="signup-form-button">
                      <button onClick={nextPage}>{t("SignUp.Next")}</button>
                    </div>

                    <p className="text-center m-0">Or Sign up with</p>
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
                  </div>
                }

                {
                  <div
                    className={`d-flex flex-column gap-4 mt-2 ${
                      pages.secondPage ? "d-block" : "d-none"
                    }`}
                  >
                    <div className="pointer" onClick={prevPage}>
                      <span className="text-primary">
                        <FaArrowLeft /> {t("SignUp.Back")}
                      </span>
                    </div>
                    <div
                      className={`signup-form-input d-flex flex-column gap-1 ${
                        lang === "en" ? "" : "text-end"
                      }`}
                    >
                      {isGoogleSignin && (
                        <div className="signup-form-input">
                          <input
                            type="text"
                            name="phoneNumber"
                            id="PhoneNumber"
                            placeholder={t("UserPanel.Profile.NationalID")}
                            className="w-100 mb-3 p-2"
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                phoneNumber: e.target.value,
                                password: e.target.value,
                                confirmPassword: e.target.value,
                              });
                            }}
                            dir={`${lang === "en" ? "ltr" : "rtl"}`}
                          />
                          {errors.phoneNumber && (
                            <p
                              className={`text-danger error-msg m-0 pt-1 ${
                                lang === "en" ? "" : "text-end"
                              }`}
                            >
                              {t("SignUp.Errors.InvalidNationalId")}
                            </p>
                          )}
                        </div>
                      )}
                      <span
                        className={`profession-heading ${
                          lang === "en" ? "" : "text-end"
                        }`}
                      >
                        {t("SignUp.Placeholders.Profession")}
                      </span>
                      <div
                        className={`d-flex flex-column gap-3 ${
                          lang === "en" ? "" : ""
                        }`}
                      >
                        <label
                          className={`d-flex gap-2 ${
                            lang === "en" ? "" : "text-end flex-row-reverse"
                          }`}
                        >
                          <input
                            type="radio"
                            value="Doctor"
                            name="profession"
                            onChange={handleChange}
                          />
                          <span
                            className={`profession-type ${
                              lang === "en" ? "" : "text-end"
                            }`}
                          >
                            {t("SignUp.Placeholders.Doctor")}
                          </span>
                        </label>

                        {formData.profession === "Doctor" && (
                          <div>
                            <p
                              className={`profession-heading ${
                                lang === "en" ? "ms-3" : "text-end me-3"
                              }`}
                            >
                              {t("SignUp.DoctorType")}
                            </p>
                            <div
                              className={`d-flex gap-3 ${
                                lang === "en" ? "ms-3" : "flex-row-reverse me-3"
                              }`}
                            >
                              <label
                                className={`d-flex gap-2 ${
                                  lang === "en"
                                    ? ""
                                    : "text-end flex-row-reverse "
                                }`}
                              >
                                <input
                                  type="radio"
                                  value="Surgeon"
                                  name="doctorType"
                                  onChange={handleChange}
                                />
                                <span
                                  className={`profession-type ${
                                    lang === "en" ? "" : "text-end"
                                  }`}
                                >
                                  {t("SignUp.Placeholders.Surgeon")}
                                </span>
                              </label>
                              <label
                                className={`d-flex gap-2 ${
                                  lang === "en"
                                    ? ""
                                    : "text-end flex-row-reverse "
                                }`}
                              >
                                <input
                                  type="radio"
                                  value="Non-Surgeon"
                                  name="doctorType"
                                  onChange={handleChange}
                                  checked={
                                    formData.doctorType === "Non-Surgeon"
                                  }
                                />
                                <span
                                  className={`profession-type ${
                                    lang === "en" ? "" : "text-end"
                                  }`}
                                >
                                  {t("SignUp.Placeholders.NonSurgeon")}
                                </span>
                              </label>
                            </div>
                            {errors.doctorType && (
                              <span
                                className={`text-danger error-msg ${
                                  lang === "en" ? "" : "text-end"
                                }`}
                              >
                                {t("SignUp.Errors.InvalidDoctorType")}
                              </span>
                            )}
                          </div>
                        )}
                        {formData.profession === "Doctor" &&
                          (formData.doctorType === "Surgeon" ||
                            formData.doctorType === "Non-Surgeon") && (
                            <div>
                              <p
                                className={`profession-heading ${
                                  lang === "en" ? "ms-5" : "text-end me-5 "
                                }`}
                              >
                                {t("SignUp.SurgeonType")}
                              </p>
                              <div
                                className={`d-flex flex-column mb-3 ${
                                  lang === "en" ? "ms-5" : "text-end me-5 "
                                }`}
                              >
                                <span
                                  className={`profession-type ${
                                    lang === "en" ? "" : "text-end"
                                  }`}
                                >
                                  {t("SignUp.Placeholders.PlasticAndCosmesis")}
                                </span>
                                <span
                                  className={`profession-type ${
                                    lang === "en" ? "" : "text-end"
                                  }`}
                                >
                                  {t("SignUp.Placeholders.Dermatology")}
                                </span>
                                <span
                                  className={`profession-type ${
                                    lang === "en" ? "" : "text-end"
                                  }`}
                                >
                                  {t("SignUp.Placeholders.Aneasthesia")}
                                </span>
                                <span
                                  className={`profession-type ${
                                    lang === "en" ? "" : "text-end"
                                  }`}
                                >
                                  {t(
                                    "SignUp.Placeholders.ObstetricAndGynacology"
                                  )}
                                </span>
                                <span
                                  className={`profession-type ${
                                    lang === "en" ? "" : "text-end"
                                  }`}
                                >
                                  {t("SignUp.Placeholders.EmergencyMedicine")}
                                </span>
                              </div>
                              <div
                                className={`d-flex gap-2 ${
                                  lang === "en" ? "ms-5" : "me-5"
                                }`}
                              >
                                <label
                                  className={`d-flex gap-2 ${
                                    lang === "en"
                                      ? ""
                                      : "text-end flex-row-reverse "
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    value="Yes"
                                    name="isAestheticGroup"
                                    onChange={handleChange}
                                  />
                                  <span
                                    className={`profession-type ${
                                      lang === "en" ? "" : "text-end"
                                    }`}
                                  >
                                    {t("SignUp.Placeholders.Yes")}
                                  </span>
                                </label>
                                <label
                                  className={`d-flex gap-2 ${
                                    lang === "en"
                                      ? ""
                                      : "text-end flex-row-reverse "
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    value="No"
                                    name="isAestheticGroup"
                                    onChange={handleChange}
                                    checked={formData.isAestheticGroup === "No"}
                                  />
                                  <span
                                    className={`profession-type ${
                                      lang === "en" ? "" : "text-end"
                                    }`}
                                  >
                                    {t("SignUp.Placeholders.No")}
                                  </span>
                                </label>
                              </div>
                              {errors.isAestheticGroup && (
                                <span
                                  className={`text-danger error-msg ${
                                    lang === "en" ? "" : "text-end"
                                  }`}
                                >
                                  {t("SignUp.Errors.InvalidSurgeonType")}
                                </span>
                              )}
                            </div>
                          )}
                      </div>

                      <label
                        className={`d-flex gap-2 mt-2 ${
                          lang === "en" ? "" : "text-end flex-row-reverse "
                        }`}
                      >
                        <input
                          type="radio"
                          name="profession"
                          value="Non-Medical Professional"
                          onChange={handleChange}
                        />
                        <span
                          className={`profession-type ${
                            lang === "en" ? "" : "text-end"
                          }`}
                        >
                          {t("SignUp.Placeholders.NonDoctor")}
                        </span>
                      </label>
                      {formData.profession === "Non-Medical Professional" && (
                        <div>
                          <p
                            className={`profession-heading ${
                              lang === "en" ? "ms-5" : "text-end me-5 "
                            }`}
                          >
                            {t("SignUp.SurgeonType")}
                          </p>
                          <div
                            className={`d-flex flex-column mb-3 ${
                              lang === "en" ? "ms-5" : "text-end me-5 "
                            }`}
                          >
                            <span
                              className={`profession-type ${
                                lang === "en" ? "" : "text-end"
                              }`}
                            >
                              {t("SignUp.Placeholders.PlasticAndCosmesis")}
                            </span>
                            <span
                              className={`profession-type ${
                                lang === "en" ? "" : "text-end"
                              }`}
                            >
                              {t("SignUp.Placeholders.Dermatology")}
                            </span>
                            <span
                              className={`profession-type ${
                                lang === "en" ? "" : "text-end"
                              }`}
                            >
                              {t("SignUp.Placeholders.Aneasthesia")}
                            </span>
                            <span
                              className={`profession-type ${
                                lang === "en" ? "" : "text-end"
                              }`}
                            >
                              {t("SignUp.Placeholders.ObstetricAndGynacology")}
                            </span>
                            <span
                              className={`profession-type ${
                                lang === "en" ? "" : "text-end"
                              }`}
                            >
                              {t("SignUp.Placeholders.EmergencyMedicine")}
                            </span>
                          </div>
                          <div
                            className={`d-flex gap-2 ${
                              lang === "en" ? "ms-5" : "me-5"
                            }`}
                          >
                            <label
                              className={`d-flex gap-2 ${
                                lang === "en"
                                  ? ""
                                  : "text-end flex-row-reverse "
                              }`}
                            >
                              <input
                                type="radio"
                                value="Yes"
                                name="isAestheticGroup"
                                onChange={handleChange}
                              />
                              <span
                                className={`profession-type ${
                                  lang === "en" ? "" : "text-end"
                                }`}
                              >
                                {t("SignUp.Placeholders.Yes")}
                              </span>
                            </label>
                            <label
                              className={`d-flex gap-2 ${
                                lang === "en"
                                  ? ""
                                  : "text-end flex-row-reverse "
                              }`}
                            >
                              <input
                                type="radio"
                                value="No"
                                name="isAestheticGroup"
                                onChange={handleChange}
                                checked={formData.isAestheticGroup === "No"}
                              />
                              <span
                                className={`profession-type ${
                                  lang === "en" ? "" : "text-end"
                                }`}
                              >
                                {t("SignUp.Placeholders.No")}
                              </span>
                            </label>
                          </div>
                          {errors.isAestheticGroup && (
                            <span
                              className={`text-danger error-msg ${
                                lang === "en" ? "" : "text-end"
                              }`}
                            >
                              {t("SignUp.Errors.InvalidSurgeonType")}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {errors.profession && (
                      <span
                        className={`text-danger error-msg ${
                          lang === "en" ? "" : "text-end"
                        }`}
                      >
                        {t("SignUp.Errors.InvalidProfession")}
                      </span>
                    )}

                    <div
                      className={`signup-form-input d-flex flex-column ${
                        lang === "en" ? "" : "text-end"
                      }`}
                    >
                      <span
                        className={`profession-heading ${
                          lang === "en" ? "" : "text-end"
                        }`}
                      >
                        {t("SignUp.Placeholders.ExistingCourtCase")}
                      </span>
                      <div
                        className={`d-flex gap-4 ${
                          lang === "en" ? "" : "flex-row-reverse"
                        }`}
                      >
                        <label
                          className={`d-flex gap-2 ${
                            lang === "en" ? "" : "text-end flex-row-reverse"
                          }`}
                        >
                          <input
                            type="radio"
                            value="Yes"
                            name="isExistingCase"
                            onChange={handleChange}
                          />
                          <span
                            className={`profession-type ${
                              lang === "en" ? "" : "text-end"
                            }`}
                          >
                            {t("SignUp.Placeholders.Yes")}
                          </span>
                        </label>
                        <label
                          className={`d-flex gap-2 ${
                            lang === "en" ? "" : "text-end flex-row-reverse"
                          }`}
                        >
                          <input
                            type="radio"
                            value="No"
                            name="isExistingCase"
                            onChange={handleChange}
                          />
                          <span
                            className={`profession-type ${
                              lang === "en" ? "" : "text-end"
                            }`}
                          >
                            {t("SignUp.Placeholders.No")}
                          </span>
                        </label>
                      </div>
                      {errors.existingCase && (
                        <span
                          className={`text-danger error-msg ${
                            lang === "en" ? "" : "text-end"
                          }`}
                        >
                          {t("SignUp.Errors.InvalidExistingCourtCase")}
                        </span>
                      )}
                      {errors.invalidPhoneNo && (
                        <span
                          className={`text-danger error-msg ${
                            lang === "en" ? "" : "text-end"
                          }`}
                        >
                          {t("SignUp.Errors.InvalidExistingCourtCase")}
                        </span>
                      )}
                    </div>
                    {errors.fillAllFields && (
                      <span
                        className={`text-danger error-msg ${
                          lang === "en" ? "" : "text-end"
                        }`}
                      >
                        {t("SignUp.Errors.FillAllFields")}
                      </span>
                    )}
                    {errors.copyEmail && (
                      <span
                        className={`text-danger error-msg ${
                          lang === "en" ? "" : "text-end"
                        }`}
                      >
                        {t("SignUp.Errors.EmailAlreadyExists")}
                      </span>
                    )}
                    {errors.copyPhNo && (
                      <span
                        className={`text-danger error-msg ${
                          lang === "en" ? "" : "text-end"
                        }`}
                      >
                        {t("SignUp.Errors.PhoneNoAlreadyExists")}
                      </span>
                    )}
                    <div className="signup-form-button">
                      <button onClick={handleSubmit}>
                        {t("SignUp.SignUp")}
                      </button>
                    </div>
                  </div>
                }
              </div>

              <div className="signup-form-footer">
                <p className={`${lang === "en" ? "" : "text-end"}`}>
                  {t("SignUp.Prompt")}
                  <span className="mx-2">
                    <Link to={"/"}>{t("SignUp.PromptLink")}</Link>
                  </span>
                </p>
              </div>
            </div>
          </MainPagesCard>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
