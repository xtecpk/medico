import React from "react";
import "./modal.css";
import { CardLayout } from "../../containers";

const Modal = ({ children, toggleModal }) => {
  return (
    <>
      <div className="expert_modal_overlay" onClick={toggleModal}></div>
      <CardLayout className="expert_modal">
        <div className="expert_modal_inner">{children}</div>
      </CardLayout>
    </>
  );
};

export default Modal;
