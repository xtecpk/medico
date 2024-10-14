import React from "react";
import "./expertDisplay.css";
import { binIcon } from "../../assets";
import { useSelector } from "react-redux";

const ExpertDisplay = ({
  expertName,
  areaOfExpertise,
  editStatus,
  onDeleteClick,
}) => {
  const lang = useSelector((state) => state.language.value);
  return (
    <>
      <div
        className={`user_expertDisplay ${lang === "ar" ? "user_expertDisplay_ar" : ""
          }`}>
        <h5>{expertName}</h5>
        <h6>{areaOfExpertise && areaOfExpertise}</h6>
        {/* {editStatus && ( */}
        <button onClick={onDeleteClick}>
          <img src={binIcon} alt="bin" />
        </button>
        {/* )} */}
      </div>
    </>
  );
};

export default ExpertDisplay;
