import React from "react";
import "./modal.css";
import CardLayout from "../cardLayout/CardLayout";

const Modal = ({ children, toggleModal }) => {
  return (
    <>
      <div className="user_modal_overlay" onClick={toggleModal}></div>
      <CardLayout className="user_modal">
        <div className="user_modal_inner">{children}</div>
      </CardLayout>
    </>
  );
};

export default Modal;
