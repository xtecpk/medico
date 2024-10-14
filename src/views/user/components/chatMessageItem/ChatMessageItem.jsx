import React, { useState } from "react";
import "./chatMessageItem.css";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const ChatMessageItem = ({ messageInfo }) => {
  const { Message, MessageTime, MemberId, MemberType } = messageInfo;
  const role = useLocation().pathname.split("/")[1] === "user" ? "client" : useLocation().pathname.split("/")[1];
  const senderNameInitial = MemberType ? MemberType[0] : role[0];

  const textWithLineBreaks = Message && Message.split("\n").join("<br>");
  const lang = useSelector((state) => state.language.value);

  const isMine = messageInfo.MemberType && (messageInfo.MemberType.toLowerCase() === role.toLocaleLowerCase());

  const formatTime = (time) => {
    const date = new Date(time);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    const strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }

  return (
    <>
      <div
        className={`user_chatMessageItem ${lang === "ar" ? "user_chatMessageItem_ar" : ""
          }
        `}>
        {!isMine && (
          <div className="user_chatMessageItem__sender_label">
            <div>
              <span className="text-uppercase ">{senderNameInitial}</span>
            </div>
          </div>
        )}
        <div
          className={`user_chatMessageItem__message_div ${isMine ? "user_chatMessageItem__message_div--mine" : ""
            }`}>
          <p
            className="user_chatMessageItem__text"
            dangerouslySetInnerHTML={{ __html: textWithLineBreaks }}></p>
          <span className="user_chatMessageItem__time">{MessageTime && formatTime(MessageTime)}</span>
        </div>
      </div>
    </>
  );
};

export default ChatMessageItem;
