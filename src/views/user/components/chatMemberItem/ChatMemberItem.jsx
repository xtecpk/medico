import React from "react";
import "./chatMemberItem.css";
import { userImg, binIcon } from "../../assets";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const ChatMemberItem = ({ name, type, onDeleteClick }) => {
  const lang = useSelector((state) => state.language.value);
  const role = useLocation().pathname.split("/")[1];
  return (
    <>
      <div className="user_chatMemberItem d-flex">
        <div className="d-flex">
          <div>
            <img src={userImg} alt={name} />
          </div>
          <div
            className={`
          user_chatMemberItem__text_div
          ${lang === "ar" ? "user_chatMemberItem__text_div--ar" : ""}
          `}>
            <h5>{name}</h5>
            <span>{type}</span>
          </div>
        </div>
        <div>
          {(role === "admin" && onDeleteClick) && (
            <button onClick={onDeleteClick}>
              <img src={binIcon} alt="bin" />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatMemberItem;
