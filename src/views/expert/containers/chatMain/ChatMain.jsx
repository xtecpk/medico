import React, { useEffect, useRef, useState } from "react";
import "./chatMain.css";
import {
  H3,
  // ChatMessagesBox,
  TicketDetails,
  Modal,
  Button1,
  ChatMainHeader,
} from "../../components";
import { sendIcon } from "../../assets";
import axios from "axios";
import Cookies from "js-cookie";
import { ChatMessagesBox } from "../../../user/containers";
import DateFormatForServer from "../../../../components/custom/DateFormatForServer";
import { UploadModal } from "../../../user/components";

const ChatMain = ({
  toggleLeftSidebar,
  toggleRightSidebar,
  messagesToDisplay,
  setMessages,
  currentEntry,
  setCurrentEntry,
  chatType,
  showTicketDetails,
  setShowTicketDetails,
  toggleDocumentUploadModal,
  documentUploadModal,
  getMessage,
  getTicketDocuments
}) => {
  const textareaRef = useRef();
  const [newMessage, setNewMessage] = useState("");

  const baseURL = import.meta.env.VITE_BASE_URL;
  const token = Cookies.get('token');

  const sendMessageHandler = () => {
    if (newMessage.trim() == "") return;
    setNewMessage("");
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        text: newMessage,
        time: "12:00",
        isMine: true,
        sender: null,
        sentTo: currentEntry.name,
      },
    ]);
    textareaRef.current.rows = 1;
    sendMessageToTicket();
  };

  useEffect(() => {
    adjustTextareaRows();
  }, [newMessage]);

  const adjustTextareaRows = () => {
    const textarea = textareaRef.current;
    textarea && (textarea.style.height = "auto");
    textarea && (textarea.style.height = `${textarea.scrollHeight}px`);
  };

  const textareaInputHandler = (e) => {
    const lines = e.target.value.split(/\r?\n/).length;
    textareaRef.current.rows = lines;
    setNewMessage(e.target.value);
    if (e.target.value == "") {
      textareaRef.current.rows = 1;
    }
  };

  const textareaKeyUpHandler = (e) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      sendMessageHandler();
    }
  };

  const sendMessageToTicket = async () => {
    await axios.post(baseURL + "/api/addmessagetoticket", {
      TicketNo: currentEntry.TicketNo,
      MemberId: 1,
      MemberType: "Expert",
      Message: newMessage,
      MessageTime: DateFormatForServer(Date()),
      // MessageTime: newMessage.time,
      DocumentId: 0
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      console.log(res);
      getMessage()
    }).catch(error => {
      console.log(error);
    })
  };



  return (
    <>
      <div className="expert_chatMain">
        {chatType === "tickets" && showTicketDetails ? (
          <>
            <ChatMainHeader
              chatType={chatType}
              toggleLeftSidebar={toggleLeftSidebar}
              toggleRightSidebar={toggleRightSidebar}
              currentEntry={currentEntry}
              isForTicketsChat={true}
            />
            <TicketDetails
              ticketDetails={currentEntry}
              setTicketDetails={setCurrentEntry}
              setShowTicketDetails={setShowTicketDetails}
            />
          </>
        ) : (
          <>
            <ChatMainHeader
              chatType={chatType}
              toggleLeftSidebar={toggleLeftSidebar}
              toggleRightSidebar={toggleRightSidebar}
              currentEntry={currentEntry}
            />
            <ChatMessagesBox messages={messagesToDisplay} />
            <div className="expert_chatMain__input_div">
              <textarea
                ref={textareaRef}
                type="text"
                rows="1"
                value={newMessage}
                placeholder={"Type a message..."}
                onInput={textareaInputHandler}
                onKeyDown={(e) => {
                  textareaKeyUpHandler(e);
                }}></textarea>
              <button onClick={sendMessageHandler} className="p-0">
                <img src={sendIcon} alt="send" />
              </button>
            </div>
          </>
        )}
        {documentUploadModal && (
          <Modal toggleModal={toggleDocumentUploadModal}>
            <UploadModal
              modalType="documentUpload"
              toggleModal={toggleDocumentUploadModal}
              currentEntry={currentEntry}
              getTicketDocuments={getTicketDocuments}
            />
            <div className="d-flex align-items-center justify-content-between mt-4 ">
              <Button1
                onClick={toggleDocumentUploadModal}
                text={"Cancel"}
                color="gray"
              />
              <Button1 onClick={toggleDocumentUploadModal} text={"Submit"} />
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export default ChatMain;
