import React, { useEffect, useState } from "react";
import "./checkboxInput.css";
import { useTranslation } from "react-i18next";

const CheckboxInput = ({
  label,
  nameIdHtmlFor,
  value,
  onChange,
  onUploadClick,
}) => {
  const { t } = useTranslation();
  const [isUploadAvailable, setisUploadAvailable] = useState(true);

  useEffect(() => {
    if (value === true) {
      setisUploadAvailable(false);
    } else {
      setisUploadAvailable(true);
    }
  }, [value]);

  return (
    <>
      <div className="checkbox_input">
        <input
          type="checkbox"
          name={nameIdHtmlFor}
          id={nameIdHtmlFor}
          defaultChecked={value}
          onChange={onChange}
        />
        <label htmlFor={nameIdHtmlFor}>{label}</label>
        {isUploadAvailable && (
          <button
            type="button"
            onClick={onUploadClick}
            className={`checkbox_input_upload`}>
            {t("UserPanel.Cases.AddNewCasePage.Upload")}
          </button>
        )}
      </div>
    </>
  );
};

export default CheckboxInput;
