import React, { useEffect, useRef } from "react";
import "./chatMessagesBox.css";
import { ChatMessageItem } from "../../components";

const ChatMessagesBox = ({ messages }) => {
  const messagesBoxRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesBoxRef.current) {
      messagesBoxRef.current.scrollTop = messagesBoxRef.current.scrollHeight;
    }
  };

  return (
    <>
      <div className="expert_chatMessageBox" ref={messagesBoxRef}>
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <ChatMessageItem key={index} message={message} />
          ))
        ) : (
          <div>{"No Messages to Display"}</div>
        )}
      </div>
    </>
  );
};

export default ChatMessagesBox;
