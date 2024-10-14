import React from "react";
import "./expertDisplay.css";

const ExpertDisplay = ({ expertName, areaOfExpertise }) => {
  return (
    <>
      <div className={`expert_expertDisplay`}>
        <h5>{expertName}</h5>
        <h6>{areaOfExpertise}</h6>
      </div>
    </>
  );
};

export default ExpertDisplay;
