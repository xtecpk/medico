import React, { useEffect, useState } from "react";
import "./changePassword.css";
import CardLayout from "../../components/cardLayout/CardLayout";
import Button1 from "../../components/button1/Button1";
import H3 from "../../components/h3/H3";
import InputBox from "../../components/inputBox/InputBox";
import OtpInput from "../../components/otpInput/OtpInput";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const ChangePassword = () => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState({
    password: "",
    confirmPassword: "",
  });
  const [changePassVisible, setChangePassVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: "",
    phoneNo: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpErr, setOtpErr] = useState("");
  const [isSuccessMsgVisible, setIsSuccessMsgVisible] = useState(false);
  const { t } = useTranslation();

  const handleChange = (event) => {
    const value = event.target.value;
    setUserInfo({
      ...userInfo,
      [event.target.name]: value,
    });
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(t("UserPanel.Profile.PasswordErrorMessage"));
      return false;
    }
    setPasswordError("");
    return true;
  };

  const generateOTP = async () => {
    await axios
      .post(baseURL + "/api/generateOTP", {
        PhoneNo: userInfo.phoneNo,
        Email: userInfo.email,
      })
      .then((res) => {
        console.log(res);
        setOtpErr("Invaid Credentials");
        if (res.data.response.status) {
          setIsOtpVerified(true);
          Cookies.set("Email", userInfo.email, { expires: 1 });
          setOtpErr(res.data.response.message);
        }
      });
  };

  const handleVerification = async () => {
    await axios
      .post(baseURL + "/api/verifyOTP", {
        PhoneNo: userInfo.phoneNo,
        OTP: otp,
      })
      .then((res) => {
        console.log(res);
        if (res.data.response.status) {
          setChangePassVisible(true);
        } else alert("Wrong OTP");
      });
  };

  const resetPassword = async () => {
    if (newPassword.password === newPassword.confirmPassword) {
      if (validatePassword(newPassword.password)) {
        await axios
          .post(baseURL + "/api/resetPassword", {
            email: Cookies.get("Email"),
            newPassword: newPassword.password,
          })
          .then((res) => {
            console.log(res);
            if (res.data.response.status) {
              setIsSuccessMsgVisible(true);
              setTimeout(() => {
                navigate("/");
              }, 2000);
            }
          });
      }
    } else {
      setPasswordError("Passwords not matching");
    }
  };

  const handleChangePasswords = (event) => {
    const value = event.target.value;
    setNewPassword({
      ...newPassword,
      [event.target.name]: value,
    });
  };

  return (
    <>
      <CardLayout className="user_changePassword">
        {!isOtpVerified ? (
          <>
            <H3 className="mb-3" text={"Reset Password"} />
            <InputBox
              type="email"
              className="mb-2"
              nameIdHtmlFor="email"
              placeholder={t("UserPanel.Profile.Email")}
              value={userInfo.email}
              onChange={handleChange}
            />
            <InputBox
              type="text"
              nameIdHtmlFor="phoneNo"
              placeholder={t("UserPanel.Profile.NationalID")}
              value={userInfo.phoneNo}
              onChange={handleChange}
            />
            {otpErr && <p className="mt-3 mb-0">{otpErr}</p>}
            <Button1
              text={t("UserPanel.Profile.Submit")}
              className="mt-3"
              onClick={generateOTP}
            />
          </>
        ) : changePassVisible ? (
          <>
            <InputBox
              type="password"
              className="mb-2"
              nameIdHtmlFor="password"
              // placeholder={t("UserPanel.Profile.Email")}
              placeholder={"Password"}
              value={newPassword.password}
              onChange={handleChangePasswords}
            />
            <InputBox
              type="password"
              nameIdHtmlFor="confirmPassword"
              // placeholder={t("UserPanel.Profile.PhoneNo")}
              placeholder={"Confirm Password"}
              value={newPassword.confirmPassword}
              onChange={handleChangePasswords}
            />
            {passwordError && <p className="mt-3 mb-0">{passwordError}</p>}
            <div
              className="d-flex align-items-center justify-content-between mt-4 "
              style={{ width: "100%" }}
            >
              <Button1
                onClick={() => navigate("/")}
                text={t("UserPanel.Cases.AddNewCasePage.Cancel")}
                color="gray"
              />
              <Button1
                text={t("UserPanel.Profile.Submit")}
                // className="mt-4"
                onClick={() => resetPassword()}
              />
            </div>
          </>
        ) : (
          <>
            <H3 text={t("UserPanel.Profile.OTPVerification")} />
            <p>{otpErr && otpErr}</p>
            <OtpInput setOTP={setOtp} />
            <div
              className="d-flex align-items-center justify-content-between mt-4 "
              style={{ width: "100%" }}
            >
              <Button1
                onClick={() => setIsOtpVerified(false)}
                text={t("UserPanel.Cases.AddNewCasePage.Cancel")}
                color="gray"
              />
              <Button1
                text={t("UserPanel.Profile.Submit")}
                // className="mt-4"
                onClick={() => handleVerification()}
              />
            </div>
          </>
        )}
      </CardLayout>
      {isSuccessMsgVisible && (
        <div className="user_changePassword__successMsg">
          {t("UserPanel.Profile.PasswordChangedSuccessMessage")}
        </div>
      )}
    </>
  );
};

export default ChangePassword;
