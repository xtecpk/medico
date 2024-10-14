import React from "react";
import "./chatMainHeader.css";
import { expertImg, messagesIcon, userGroupIcon } from "../../assets";
import H3 from "../h3/H3";

const ChatMainHeader = ({
  chatType,
  toggleLeftSidebar,
  toggleRightSidebar,
  currentEntry,
  isForTicketsChat = false,
}) => {
  return (
    <>
      <div className={`expert_chatMain__header ${isForTicketsChat ? "expert_chatMain__header--tickets" : ""}`}>
        {chatType !== "admin-chat" && (
          <button
            onClick={toggleLeftSidebar}
            className="expert_chatMain__bars_btn">
            <img src={messagesIcon} alt="bars left" />
          </button>
        )}
        <div className="expert_chatMain__header__left">
          {chatType === "clients-chat" && (
            <img src={expertImg} alt="Abdullah" />
          )}
          <H3
            text={
              chatType === "admin-chat"
                ? "Admin"
                : (chatType === "tickets"
                  ? `${currentEntry && currentEntry.Subject}`
                  : currentEntry?.Subject)
            }
            className="m-0 text-capitalize "
          />
        </div>
        <button
          onClick={toggleRightSidebar}
          className="expert_chatMain__bars_btn">
          <img src={userGroupIcon} alt="bars right" />
        </button>
      </div>
    </>
  );
};

export default ChatMainHeader;
