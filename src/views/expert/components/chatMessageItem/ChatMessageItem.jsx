import React from "react";
import "./chatMessageItem.css";

const ChatMessageItem = ({ message }) => {
  const { Message, MessageTime, isMine, sender } = message;
  const senderNameInitial = sender ? sender[0] : "A";

  const textWithLineBreaks = Message && Message.split("\n").join("<br>");

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
      <div className={`expert_chatMessageItem`}>
        {!isMine && (
          <div className="expert_chatMessageItem__sender_label">
            <div>
              <span className="text-uppercase ">{senderNameInitial}</span>
            </div>
          </div>
        )}
        <div
          className={`expert_chatMessageItem__message_div ${isMine ? "expert_chatMessageItem__message_div--mine" : ""
            }`}>
          <p
            className="expert_chatMessageItem__text"
            dangerouslySetInnerHTML={{ __html: textWithLineBreaks }}></p>
          <span className="expert_chatMessageItem__time">{formatTime(MessageTime)}</span>
        </div>
      </div>
    </>
  );
};

export default ChatMessageItem;
