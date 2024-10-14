import React, { useState } from "react";
import "./dropzone.css";
import { t } from "i18next";

const Dropzone = ({ content, className = "", setFiles, files }) => {

  const [isErrorVisible, setIsErrorVisible] = useState(false)

  const uploadFile = (event) => {

    const imgFile = event.target.files[0];

    const fileType = imgFile.type;
    if (fileType === 'image/png' || fileType === 'image/jpeg' || fileType === 'application/pdf') {
      setFiles([imgFile]);
      setIsErrorVisible(false);
    } else {
      setFiles([]);
      setIsErrorVisible(true);
    }
  }

  return (
    <>
      <label htmlFor="dropzone-file" className={`dropzone_label ${className}`}>
        {content}
        <input id="dropzone-file" type="file" onChange={uploadFile} />
      </label>
      {
        isErrorVisible && <p className='error-msg'>{t("UserPanel.Home.InvalidFileType")}</p>
      }
    </>
  );
};

export default Dropzone;
