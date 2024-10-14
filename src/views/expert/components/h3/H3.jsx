import React from "react";
import "./h3.css";

const H3 = ({ text, className = "" }) => {
  return (
    <>
      <h3 className={`${className} h3_comp`}>{text}</h3>
    </>
  );
};

export default H3;
