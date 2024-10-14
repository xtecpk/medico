import React from "react";
import "./button1.css";

const Button1 = ({ text, onClick, icon, color = "blue", className = "" }) => {
  return (
    <>
      <button
        onClick={onClick}
        className={`${className} expert_button1 ${
          color === "gray" ? "expert_button1--gray" : ""
        } ${color === "red" ? "expert_button1--red" : ""}`}>
        {icon && <img src={icon} alt={text} />}
        {text && <span>{text}</span>}
      </button>
    </>
  );
};

export default Button1;
