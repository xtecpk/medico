import React from "react";
import "./chatLeftbarItemLayout.css";

const ChatLeftbarItemLayout = ({
  children,
  value,
  currentValue,
  setCurrentValue,
  toggleSidebar,
  setShowTicketDetails
}) => {
  const handleClick = () => {
    setCurrentValue(value);
    toggleSidebar();
    setShowTicketDetails(true)
  };


  return (
    <>
      <button
        className={`user_chatLeftbarItemLayout ${currentValue === value ? "user_chatLeftbarItemLayout--active" : ""
          }`}
        onClick={handleClick}>
        {children}
      </button>
    </>
  );
};

export default ChatLeftbarItemLayout;
