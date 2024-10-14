import React from "react";
import "./cardLayout.css";

const CardLayout = ({ children, className = "" }) => {
  return (
    <>
      <div className={`${className} cardLayout_card`}>{children}</div>
    </>
  );
};

export default CardLayout;
