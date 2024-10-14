import React, { useEffect, useState } from "react";
import {
  CardLayout,
  ChatLeftSidebar,
  ChatMain,
  ChatRightSidebar,
} from "../../containers";
import { useTranslation } from "react-i18next";
import "./chat.css";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const Chat = ({ chatCaseId, setMoveToTicket, moveToTicket = false }) => {
  const { t } = useTranslation();
  const location = useLocation().pathname.split("/")[2];
  const role = useLocation().pathname.split("/")[1];
  const baseURL = import.meta.env.VITE_BASE_URL;
  const token = Cookies.get('token');
  const clientId = Cookies.get('clientId');
  const expertId = Cookies.get('ExpertId');

  const [documents, setDocuments] = useState([])
  const [experts, setExperts] = useState([])
  const [chatType, setChatType] = useState(location);
  const [documentUploadModal, setDocumentUploadModal] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [chat, setChat] = useState([]);
  // const [chats, setChats] = useState([]);
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState({});
  const [messages, setMessages] = useState([]);
  const [showTicketDetails, setShowTicketDetails] = useState(true);
  const [chatmembers, setChatmembers] = useState([]);
  const toggleDocumentUploadModal = () => {
    setDocumentUploadModal((prevState) => !prevState);
  };

  const getTcikets = async () => {
    await axios.get(baseURL + "/api/getallticket", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      setTickets(res.data.response.data.reverse());
      setCurrentEntry(res.data.response.data[0])
    })
  }

  const getMessages = async () => {
    if (chatType === 'support' && currentEntry) {
      await axios.post(baseURL + "/api/getmessagebyticketno", {
        TicketNo: currentEntry.TicketNo
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(res => {
        setMessages(res.data.response.data)
      })
    } else {
      currentEntry && await axios.post(baseURL + "/api/getconversation", {
        ChatId: currentEntry.ChatId
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(res => {
        // console.log(res);
        setMessages(res.data.response.data)
      })
    }
  }

  const getClientTcikets = async () => {
    await axios.post(baseURL + "/api/getticketbyclient", {
      ClientId: clientId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      const tempTickets = res.data.response.data;
      moveToTicket ?
        setCurrentEntry(tempTickets[tempTickets.length - 1]) :
        setCurrentEntry(res.data.response.data[0]);
      setTickets(res.data.response.data.reverse());
      getMessages()
    })
  }

  const getTicketsByExpert = async () => {
    await axios.post(baseURL + "/api/getticketbyclient", {
      ExpertId: expertId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      setTickets(res.data.response.data.reverse())
      setCurrentEntry(res.data.response.data[0])
    })
  }

  const getChatDocuments = async () => {
    await axios.post(baseURL + "/api/getchatdocument", {
      ChatId: currentEntry.ChatId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then(response => {
      // console.log(response);
      setDocuments(response.data.response.data)
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
      // console.log(response);
      setDocuments(response.data.response.data)
    })
  }

  const getChatMembers = async () => {
    await axios.post(baseURL + "/api/getchatmember", {
      ChatId: currentEntry.ChatId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then(res => {
      setChatmembers(res.data.response.data)
    })
  }

  const getChatsByType = async (Type) => {
    await axios.post(baseURL + "/api/getchatbytype", {
      Type
    }, {
      headers: {
        "Authorization": "Bearer " + token
      }
    }).then(res => {
      console.log(res);
      setChat(res.data.response.data.reverse());
    })
  }

  const getChatsByClient = async (ChatType) => {
    chatType === "admin-chat" ? await axios.post(baseURL + "/api/getchatbyclientandtype", {
      ClientId: role === "user" ? clientId : expertId,
      ChatType
    }, {
      headers: {
        "Authorization": "Bearer " + token
      }
    }).then(res => {
      // console.log(res);
      setChat(res.data.response.data.reverse())
      setCurrentEntry(res.data.response.data[0])
    })
      :
      await axios.post(baseURL + "/api/getcasechatbytypeandid", {
        Type: role === "user" ? "Client" : "Expert",
        Id: role === "user" ? clientId : expertId,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(res => {
        // console.log(res);
        setChat(res.data.response.data.reverse())
        setCurrentEntry(res.data.response.data[0])
      })
  }

  useEffect(() => {
    if (chatType === "support") {
      role === "admin" && getTcikets()
      role === "user" && getClientTcikets()
      role === "expert" && getTicketsByExpert()
    }
    else {
      const type = chatType.split("-")[0];
      role === "admin" && getChatsByType(type.slice(0, -1)).then(() => {
        setEntries(chat);
        setMessages([]);
        setDocuments([]);
      })
      role === "user" && getChatsByClient(chatType === "admin-chat" ? "client" : type.slice(0, -1)).then(() => {
        setEntries(chat);
        setMessages([])
        setDocuments([]);
      })
      role === "expert" && getChatsByClient(chatType === "admin-chat" ? "expert" : type.slice(0, -1)).then(() => {
        setEntries(chat);
        setMessages([])
        setDocuments([]);
      })
    }
  }, [chatType])

  useEffect(() => {
    if (chatType === "support")
      getTicketDocuments();
    else {
      getChatDocuments();
    }

    getMessages()
    getChatMembers()
    setShowTicketDetails(true)
  }, [currentEntry])

  useEffect(() => {
    setChatType(location);
  }, [location]);

  useEffect(() => {
    if (chatType === "experts-chat") {
      setEntries(chat);
      setCurrentEntry(chat[0])
    } else if (chatType === "cases-chat") {
      console.log(chatCaseId);
      setEntries(chat);
      setCurrentEntry(
        chatCaseId ?
          chat.filter(entry => (entry.ClientId || entry.CaseId) === parseInt(chatCaseId))[0]
          :
          chat[0]);
    } else if (chatType === "admin-chat") {
      setEntries(chat);
      setCurrentEntry(chat[0]);
    } else if (chatType === "support") {
      setEntries(tickets);
      setMessages(chat);
    } else if (chatType === "clients-chat") {
      setEntries(chat);
      setCurrentEntry(chat[0]);
      setMessages(messages && messages);
    }
  }, [chatType, tickets, chat]);

  const [messagesToDisplay, setMessagesToDisplay] = useState(messages);


  useEffect(() => {
    setMessagesToDisplay(
      messages);
  }, [messages])

  const [isLeftSidebarHidden, setisLeftSidebarHidden] = useState(true);
  const toggleLeftSidebar = () => {
    setisLeftSidebarHidden((prevState) => !prevState);
  };
  const [isRightSidebarHidden, setisRightSidebarHidden] = useState(true);
  const toggleRightSidebar = () => {
    setisRightSidebarHidden((prevState) => !prevState);
  };

  // Ticket
  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
    status: "New",
  });
  const ticketInputHandler = (e) => {
    setNewTicket((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const [createTicketModal, setCreateTicketModal] = useState(false);
  const toggleTicketModal = () => {
    setCreateTicketModal((prevState) => !prevState);
  };

  useEffect(() => {
    console.log(currentEntry);
  }, [currentEntry])


  return (
    <>
      <div className="user_chat">
        <CardLayout className="mt-0 p-0 user_chat__inner">
          {chatType !== "admin-chat" && (
            <ChatLeftSidebar
              isLeftSidebarHidden={isLeftSidebarHidden}
              toggleLeftSidebar={toggleLeftSidebar}
              chatType={chatType}
              entries={entries}
              currentEntry={currentEntry}
              setCurrentEntry={setCurrentEntry}
              getMessages={getMessages}
              // Ticket
              toggleTicketModal={toggleTicketModal}
              setShowTicketDetails={setShowTicketDetails}
            />
          )}
          <ChatMain
            toggleLeftSidebar={toggleLeftSidebar}
            toggleRightSidebar={toggleRightSidebar}
            setMessages={setMessages}
            messagesToDisplay={messages}
            currentEntry={currentEntry}
            entries={entries}
            setCurrentEntry={setCurrentEntry}
            showTicketDetails={showTicketDetails}
            setShowTicketDetails={setShowTicketDetails}
            chatType={chatType}
            getChats={chatType === "support" ? (
              role === "admin" && (() => getTcikets()) ||
              role === "user" && (() => getClientTcikets())) :
              (
                role === "admin" && (() => getChatsByType(chatType.split("-")[0].slice(0, -1))) ||
                role === "user" && (() => getChatsByClient(chatType === "admin-chat" ? "client" : chatType.split("-")[0].slice(0, -1))) ||
                role === "expert" && (() => getChatsByClient(chatType === "admin-chat" ? "expert" : chatType.split("-")[0].slice(0, -1)))
              )}
            // Ticket
            ticketInputHandler={ticketInputHandler}
            setMoveToTicket={setMoveToTicket}
            getDocuments={chatType === "support" ? getTicketDocuments : getChatDocuments}
            getMessages={getMessages}
            newTicket={newTicket}
            toggleTicketModal={toggleTicketModal}
            createTicketModal={createTicketModal}
            documentUploadModal={documentUploadModal}
            toggleDocumentUploadModal={toggleDocumentUploadModal}
          />
          <ChatRightSidebar
            isRightSidebarHidden={isRightSidebarHidden}
            toggleRightSidebar={toggleRightSidebar}
            chatmembers={chatmembers}
            currentEntry={currentEntry}
            documents={documents}
            getChatMembers={getChatMembers}
            getDocuments={chatType === "support" ? getTicketDocuments : getChatDocuments}
            toggleDocumentUploadModal={toggleDocumentUploadModal}
          />
        </CardLayout>
      </div>
    </>
  );
};

export default Chat;
