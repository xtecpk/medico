import React from "react";
import "./h4.css";

const H4 = ({ text, className = "" }) => {
  return (
    <>
      <h4 className={`${className} h4_comp`}>{text}</h4>
    </>
  );
};

export default H4;
