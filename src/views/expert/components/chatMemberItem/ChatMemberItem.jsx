import React from "react";
import "./chatMemberItem.css";
import { expertImg } from "../../assets";

const ChatMemberItem = ({ name, type }) => {
  return (
    <>
      <div className="expert_chatMemberItem">
        <div>
          <img src={expertImg} alt={name} />
        </div>
        <div className={`expert_chatMemberItem__text_div`}>
          <h5>{name}</h5>
          <span>{type}</span>
        </div>
      </div>
    </>
  );
};

export default ChatMemberItem;
