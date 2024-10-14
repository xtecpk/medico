import React from "react";
import "./h2.css";

const H2 = ({ text, className = "" }) => {
  return (
    <>
      <h2 className={`${className} h2_comp`}>{text}</h2>
    </>
  );
};

export default H2;
