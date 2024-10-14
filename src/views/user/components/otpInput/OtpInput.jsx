import React, { useEffect, useRef, useState } from "react";
import "./otpInput.css";

const OtpInput = ({ setOTP }) => {
  const inputsRef = useRef(null);
  const [otp, setOtp] = useState("");

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
      setOTP && setOTP(otpValues.join(""));
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

  return (
    <>
      <div className="user_otpInput">
        <div ref={inputsRef} className="user_otpInput__inner">
          <input
            className="user_otpInput__input"
            type="text"
            inputMode="numeric"
            maxLength="1"
          />
          <input
            className="user_otpInput__input"
            type="text"
            inputMode="numeric"
            maxLength="1"
          />
          <input
            className="user_otpInput__input"
            type="text"
            inputMode="numeric"
            maxLength="1"
          />
          <input
            className="user_otpInput__input"
            type="text"
            inputMode="numeric"
            maxLength="1"
          />
          <input
            className="user_otpInput__input"
            type="text"
            inputMode="numeric"
            maxLength="1"
          />
        </div>
      </div>
    </>
  );
};

export default OtpInput;
