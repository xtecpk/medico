import React from "react";
import "./inputBox.css";

const InputBox = ({
  label = null,
  type,
  nameIdHtmlFor,
  names = [],
  placeholder,
  options,
  disabled = false,
  value = "",
  values = [],
  className = "",
  onChange,
}) => {
  return (
    <>
      <div
        className={`${className} expert_input_box ${
          disabled ? "expert_input_box_disabled" : ""
        }`}>
        {label && <label htmlFor={nameIdHtmlFor}>{label}</label>}
        {(type === "text" ||
          type === "number" ||
          type === "email" ||
          type === "password") && (
          <input
            type={type}
            id={nameIdHtmlFor}
            name={nameIdHtmlFor}
            placeholder={placeholder}
            disabled={disabled}
            value={value}
            onChange={onChange}
          />
        )}
        {type === "date" && (
          <input
            type={type}
            id={nameIdHtmlFor}
            name={nameIdHtmlFor}
            placeholder={placeholder}
            disabled={disabled}
            value={value}
            onChange={onChange}
          />
        )}
        {type === "textarea" && (
          <textarea
            rows={3}
            name={nameIdHtmlFor}
            id={nameIdHtmlFor}
            value={value}
            onChange={onChange}
            placeholder={placeholder}></textarea>
        )}
        {type === "select" && (
          <select
            name={nameIdHtmlFor}
            id={nameIdHtmlFor}
            onChange={onChange}
            value={value}>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}
        {type === "time" && (
          <div className="expert_input_box__time_div">
            <input
              type={"text"}
              name={names[0]}
              value={values[0]}
              onChange={onChange}
            />
            <select name={names[1]} onChange={onChange} value={values[1]}>
              <option value={"AM"}>AM</option>
              <option value={"PM"}>PM</option>
            </select>
          </div>
        )}
      </div>
    </>
  );
};

export default InputBox;
