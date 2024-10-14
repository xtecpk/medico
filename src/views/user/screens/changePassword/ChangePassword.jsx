import React, { useEffect, useState } from "react";
import "./changePassword.css";
import { CardLayout } from "../../containers";
import { Button1, H3, InputBox } from "../../components";
import { useTranslation } from "react-i18next";
import axios from "axios";
import OtpInput from "../../../../components/otpInput/OtpInput";
import { useLocation, useNavigate } from "react-router-dom";

const ChangePassword = () => {

  const role = useLocation().pathname.split("/")[1];

  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [isSuccessMsgVisible, setIsSuccessMsgVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const { t } = useTranslation();

  const navigate = useNavigate();

  const baseURL = import.meta.env.VITE_BASE_URL;

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

  const handleSubmit = () => {
    if (validatePassword(newPassword)) {
      // Perform the password change logic here
      resetPassword()
    }
  };

  const passwordChangeHandler = (e) => {
    setNewPassword(e.target.value);
    validatePassword(e.target.value);
  };

  const resetPassword = async () => {
    await axios.post(baseURL + "/api/resetPassword", {
      email: userInfo.Email,
      newPassword: newPassword
    }).then(res => {
      console.log(res);
      if (res.data.response.status) {
        setIsSuccessMsgVisible(true);
        setTimeout(() => {
          navigate(`/${role}/profile`);
        }, 2000);
      }
    })
  }

  const handleVerification = async () => {
    await axios.post(baseURL + "/api/verifyOTP", {
      PhoneNo: userInfo.PhoneNo,
      OTP: otp
    }).then(res => {
      console.log(res);
      if (res.data.response.status) {
        setIsOtpVerified(true)
      }
      else
        alert("Wrong OTP")
    })
  };

  useEffect(() => {
    let timer;
    if (isSuccessMsgVisible) {
      timer = setTimeout(() => {
        setIsSuccessMsgVisible(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [isSuccessMsgVisible]);

  useEffect(() => {
    const userData = localStorage.getItem('userInfo');

    if (userData) {
      setUserInfo(JSON.parse(userData));
    }
  }, []);

  return (
    <>
      <CardLayout className="user_changePassword">
        {isOtpVerified ? (
          <>
            <H3 text={t("UserPanel.Profile.ChangePassword")} />
            <p>{t("UserPanel.Profile.EnterNewPassword")}</p>
            <InputBox
              type="password"
              placeholder={t("UserPanel.Profile.EnterNewPassword")}
              value={newPassword}
              onChange={passwordChangeHandler}
            />
            {passwordError && <p className="mt-3">{passwordError}</p>}
            <Button1
              text={t("UserPanel.Profile.Change")}
              className="mt-4"
              onClick={handleSubmit}
            />
          </>
        ) : (
          <>
            <H3 text={t("UserPanel.Profile.OTPVerification")} />
            <p>{t("UserPanel.Profile.OTPVerificationInfo")}</p>
            <OtpInput setOTP={setOtp} />
            <Button1
              text={t("UserPanel.Profile.Submit")}
              className="mt-4"
              onClick={handleVerification}
            />
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
