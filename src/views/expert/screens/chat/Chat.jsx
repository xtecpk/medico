import axios from 'axios';
import React, { useEffect, useState } from "react";
import {
  CardLayout,
  ChatLeftSidebar,
  ChatMain,
  ChatRightSidebar,
} from "../../containers";
import "./chat.css";
import { useLocation } from "react-router-dom";
import Cookies from 'js-cookie';


const Chat = () => {
  const location = useLocation().pathname.split("/")[2];
  const [chatType, setChatType] = useState("");
  const [tickets, setTickets] = useState([]);
  const [showTicketDetails, setShowTicketDetails] = useState(true);
  const [documentUploadModal, setDocumentUploadModal] = useState(false);
  const toggleDocumentUploadModal = () => {
    setDocumentUploadModal((prevState) => !prevState);
  };
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState({});
  const [messages, setMessages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [chatmembers, setChatMembers] = useState([]);

  const baseURL = import.meta.env.VITE_BASE_URL;
  const token = Cookies.get('token')
  const ExpertId = Cookies.get('ExpertId')

  const getTickets = async () => {
    await axios.post(baseURL + "/api/getticketbyexpert", {
      ExpertId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      console.log(res);
      setTickets(res.data.response.data.reverse())
    }).catch(error => {
      console.log(error);
    })

  }

  const getMessage = async () => {
    await axios.post(baseURL + "/api/getmessagebyticketno", {
      TicketNo: currentEntry.TicketNo
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      console.log(res.data);
      setMessages(res.data.response.data);
    })
  }

  const getTicketDocuments = async () => {
    await axios.post(baseURL + "/api/getticketdocument", {
      TicketNo: currentEntry.TicketNo
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then(response => {
      console.log(response);
      setDocuments(response.data.response.data)
    })
  }

  useEffect(() => {
    setChatType(location);
  }, [location]);

  useEffect(() => {
    // if (chatType === "clients-chat") {
    //   setEntries(clients);
    //   setCurrentEntry(clients[0]);
    //   setMessages(clientsDummyMessages);
    // }
    // else if (chatType === "cases-chat") {
    //   setEntries(cases);
    //   setCurrentEntry(cases[0]);
    //   setMessages(casesDummyMessages);
    // } 
    // else if (chatType === "admin-chat") {
    //   setEntries([]);
    //   setCurrentEntry({ name: "admin" });
    // } else if (chatType === "tickets") {
    getTickets().then(
      getMessage()
    );
    // }
  }, [chatType]);

  useEffect(() => {
    getMessage();
    getTicketDocuments();
  }, [currentEntry])

  useEffect(() => {
    setEntries(tickets);
    setCurrentEntry(tickets[0]);
  }, [tickets])

  const [messagesToDisplay, setMessagesToDisplay] = useState(messages);

  useEffect(() => {
    setMessagesToDisplay(
      messages
    );
  }, [currentEntry, messages]);



  const [isLeftSidebarHidden, setisLeftSidebarHidden] = useState(true);
  const toggleLeftSidebar = () => {
    setisLeftSidebarHidden((prevState) => !prevState);
  };
  const [isRightSidebarHidden, setisRightSidebarHidden] = useState(true);
  const toggleRightSidebar = () => {
    setisRightSidebarHidden((prevState) => !prevState);
  };

  return (
    <>
      <div className="expert_chat">
        <CardLayout className="mt-0 p-0 expert_chat__inner">
          {chatType !== "admin-chat" && (
            <ChatLeftSidebar
              isLeftSidebarHidden={isLeftSidebarHidden}
              toggleLeftSidebar={toggleLeftSidebar}
              chatType={chatType}
              entries={entries}
              currentEntry={currentEntry}
              setCurrentEntry={setCurrentEntry}
              setShowTicketDetails={setShowTicketDetails}
            />
          )}
          <ChatMain
            toggleLeftSidebar={toggleLeftSidebar}
            toggleRightSidebar={toggleRightSidebar}
            setMessages={setMessages}
            messagesToDisplay={messagesToDisplay}
            currentEntry={currentEntry}
            setCurrentEntry={setCurrentEntry}
            chatType={chatType}
            showTicketDetails={showTicketDetails}
            setShowTicketDetails={setShowTicketDetails}
            toggleDocumentUploadModal={toggleDocumentUploadModal}
            documentUploadModal={documentUploadModal}
            getMessage={getMessage}
            getTicketDocuments={getTicketDocuments}
          />
          <ChatRightSidebar
            isRightSidebarHidden={isRightSidebarHidden}
            currentEntry={currentEntry}
            toggleRightSidebar={toggleRightSidebar}
            chatmembers={chatmembers}
            documents={documents}
            getDocuments={chatType === "support" ? getTicketDocuments : null}
            toggleDocumentUploadModal={toggleDocumentUploadModal}
          />
        </CardLayout>
      </div>
    </>
  );
};

export default Chat;
