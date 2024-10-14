import React, { useState, useEffect, useRef } from "react";
import Card from "../../../components/mainPageCard/MainPagesCard";
import "../signUpVerification/signUpVerification.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

const SignUpVerification = () => {
  const { t } = useTranslation();

  const inputsRef = useRef(null);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const Password = Cookies.get("Password");
  const phoneNumber = Cookies.get("PhoneNumber");
  const email = Cookies.get("Email");
  const baseURL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const inputs = inputsRef.current;

    const handleInput = (e) => {
      const target = e.target;
      const val = target.value;

      if (isNaN(val)) {
        target.value = "";
        return;
      }

      if (val !== "") {
        const next = target.nextElementSibling;
        if (next) {
          next.focus();
        }
      }

      const otpValues = Array.from(inputs.children).map((input) => input.value);
      setOtp(otpValues.join(""));
    };

    const handleKeyUp = (e) => {
      const target = e.target;
      const key = e.key.toLowerCase();

      if (key === "backspace" || key === "delete") {
        target.value = "";
        const prev = target.previousElementSibling;
        if (prev) {
          prev.focus();
        }
        return;
      }
    };

    inputs.addEventListener("input", handleInput);
    inputs.addEventListener("keyup", handleKeyUp);

    return () => {
      inputs.removeEventListener("input", handleInput);
      inputs.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  console.log(otp);
  const handleVerification = async () => {
    await axios
      .post(baseURL + "/api/verifyOTP", {
        PhoneNo: phoneNumber,
        OTP: otp,
      })
      .then((res) => {
        console.log(res);
        if (res.data.response.status) {
          login();
          // navigate("/signup/services-form");
        } else alert("Wrong OTP");
      });
  };

  const generateOTP = async () => {
    await axios
      .post(baseURL + "/api/generateOTP", {
        PhoneNo: phoneNumber,
        Email: email,
      })
      .then((res) => {
        console.log(res);
        alert("OTP sent to your email");
      });
  };

  // login temp

  const getClientByUserId = async (UserId, token) => {
    await axios
      .post(
        baseURL + "/api/getclientbyuserid",
        {
          UserId,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((response) => {
        console.log(response);
        if (response.data.response.status) {
          Cookies.set("clientId", response.data.response.data[0].ClientId, {
            expires: 30,
          });
          Cookies.set("profession", response.data.response.data[0].Type, {
            expires: 30,
          });
          Cookies.set("clientName", response.data.response.data[0].ClientName, {
            expires: 30,
          });
          navigate("/user/packages");
        }
      });
  };

  const login = async () => {
    await axios
      .post(baseURL + "/api/login", {
        PhoneNo: phoneNumber,
        Password: Password,
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          const role = response.data.user.role;
          const token = response.data.token;
          const userId = response.data.user.uid;
          Cookies.set("userId", userId, { expires: 7 });
          Cookies.set("token", token, { expires: 30 });
          Cookies.set("role", role, { expires: 30 });
          getClientByUserId(userId, token);
        }
      });
  };

  return (
    <div className="container-fluid d-flex justify-content-center mt-5 pt-5">
      <div className="signup-ver-container d-flex flex-column justify-content-center align-items-center">
        <Card>
          <h4 className="signup-ver-title text-center">
            {t("Verification.OTPVerification")}
          </h4>
          <p className="signup-ver-text text-center">
            {t("Verification.EnterOTP")}
          </p>
          <div className="d-flex justify-content-center">
            <div ref={inputsRef} className="otpInput__inner">
              <input
                className="otpInput__input"
                type="text"
                inputMode="numeric"
                maxLength="1"
              />
              <input
                className="otpInput__input"
                type="text"
                inputMode="numeric"
                maxLength="1"
              />
              <input
                className="otpInput__input"
                type="text"
                inputMode="numeric"
                maxLength="1"
              />
              <input
                className="otpInput__input"
                type="text"
                inputMode="numeric"
                maxLength="1"
              />
              <input
                className="otpInput__input"
                type="text"
                inputMode="numeric"
                maxLength="1"
              />
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <p
              className="mt-4 mb-0"
              style={{ cursor: "pointer" }}
              onClick={generateOTP}
            >
              {t("Verification.ResendOTP")}
            </p>
            <button className="btn signup-ver-btn" onClick={handleVerification}>
              {t("Verification.VerifyOTP")}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SignUpVerification;
