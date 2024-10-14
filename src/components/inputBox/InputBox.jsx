import React from "react";
import "./inputBox.css";

const InputBox = ({
  label = null,
  type,
  nameIdHtmlFor,
  placeholder,
  options,
  disabled = false,
  value = "",
  className = "",
  onChange,
  min,
  max,
  onBlur,
  dir
}) => {
  const handleCreditCardChange = (event) => {
    const inputValue = event.target.value.replace(/\D/g, "");

    const formattedValue = inputValue.replace(/(\d{4})/g, "$1-").slice(0, 19);

    onChange({ target: { name: nameIdHtmlFor, value: formattedValue } });
  };

  return (
    <>
      <div
        className={`${className} user_input_box ${disabled ? "user_input_box_disabled" : ""
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
              dir={dir}
              value={value}
              onBlur={onBlur}
              onChange={onChange}
              min={type === "number" && min ? min : null}
              max={type === "number" && max ? max : null}
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
            rows={4}
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
        {type === "credit_card" && (
          <input
            type="text"
            id={nameIdHtmlFor}
            name={nameIdHtmlFor}
            placeholder={placeholder}
            disabled={disabled}
            value={value}
            onChange={handleCreditCardChange}
            maxLength={19} // 16 digits + 3 dashes
            title="Please enter a valid credit card number in the format xxxx-xxxx-xxxx-xxxx"
          />
        )}
        {/* {type === "credit_card" && (
          <input
            type="text"
            id={nameIdHtmlFor}
            name={nameIdHtmlFor}
            placeholder={placeholder}
            disabled={disabled}
            value={value}
            onChange={handleCreditCardChange}
            maxLength={19} // 16 digits + 3 dashes
            title="Please enter a valid credit card number in the format xxxx-xxxx-xxxx-xxxx"
          />
        )} */}
      </div>
    </>
  );
};

export default InputBox;
