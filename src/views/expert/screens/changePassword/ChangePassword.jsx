import React, { useEffect, useState } from "react";
import "./changePassword.css";
import { CardLayout } from "../../containers";
import { Button1, H3, InputBox, OtpInput } from "../../components";

const ChangePassword = () => {
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSuccessMsgVisible, setIsSuccessMsgVisible] = useState(false);

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must contain at least 8 characters, including a letter, a number and a symbol."
      );
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = () => {
    if (validatePassword(newPassword)) {
      // Perform the password change logic here
      setIsSuccessMsgVisible(true);
    }
  };

  const passwordChangeHandler = (e) => {
    setNewPassword(e.target.value);
    validatePassword(e.target.value);
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

  return (
    <>
      <CardLayout className="expert_changePassword">
        {isOtpVerified ? (
          <>
            <H3 text={"Change Password"} />
            <p>Enter New Password</p>
            <InputBox
              type={"password"}
              placeholder={"Enter New Password"}
              value={newPassword}
              onChange={passwordChangeHandler}
            />
            {passwordError && <p className="mt-3">{passwordError}</p>}
            <Button1 text={"Change"} className="mt-4" onClick={handleSubmit} />
          </>
        ) : (
          <>
            <H3 text={"OTP Verification"} />
            <p>We have sent a verification code to your phone number</p>
            <OtpInput />
            <Button1
              text={"Submit"}
              className="mt-4"
              onClick={() => setIsOtpVerified(true)}
            />
          </>
        )}
      </CardLayout>
      {isSuccessMsgVisible && (
        <div className="expert_changePassword__successMsg">
          Password changed successfully
        </div>
      )}
    </>
  );
};

export default ChangePassword;
