import React from "react";
import "./button1.css";

const Button1 = ({
  text,
  onClick,
  icon,
  color = "blue",
  className = "",
  type = "button",
}) => {
  return (
    <>
      <button
        type={type}
        onClick={onClick}
        className={`${className} user_button1 ${
          color === "gray" ? "user_button1--gray" : ""
        } ${color === "red" ? "user_button1--red" : ""}`}>
        {icon && <img src={icon} alt={text} />}
        {text && <span>{text}</span>}
      </button>
    </>
  );
};

export default Button1;
