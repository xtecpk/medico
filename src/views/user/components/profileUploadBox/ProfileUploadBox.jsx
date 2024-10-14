import React from "react";
import "./profileUploadBox.css";
import Button1 from "../button1/Button1";
import { Link } from "react-router-dom";
import { binIcon } from "../../assets";

const ProfileUploadBox = ({
  text,
  buttonText,
  onClick,
  buttonType = "button",
  image = null,
  to,
  onDelete
}) => {
  return (
    <>
      <div className="case_profileUploadBox">
        <div className="case_profileUploadBox__text_img">
          <h4>{text}</h4>
          {image && <img src={image} alt="" />}
        </div>
        <div className="d-flex">

          {buttonType === "button" && (
            <Button1 text={buttonText} onClick={onClick} />
          )}
          {buttonType === "link" && (
            <a href={to}
              rel="noreferrer" download={to} target="_blank" className="case_profileUploadBox__linkButton">
              {buttonText}
            </a>
          )}{
            onDelete &&
            <button className="outline_delete mx-4 px-2 delDoc" onClick={onDelete}>
              <img src={binIcon} alt="" />
            </button>
            // * <Button1 text={"Delete"} className='mx-3 px-4 outline_delete' />
          }
        </div>
      </div>
    </>
  );
};

export default ProfileUploadBox;
