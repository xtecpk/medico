import React, { useEffect, useRef, useState } from "react";
import "./chatMain.css";
import {
  Button1,
  CreateTicketForm,
  H3,
  InputBox,
  Modal,
  UploadModal,
} from "../../components";
import {
  messagesIcon,
  sendIcon,
  userGroupIcon,
  userImg,
} from "../../assets";
import ChatMessagesBox from "../chatMessagesBox/ChatMessagesBox";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { TicketDetails } from "../../../expert/components";
import Cookies from "js-cookie";
import DateFormatForServer from "../../../../components/custom/DateFormatForServer";
import CreateTicketModal from "../../screens/tickets/CreateTicketModal";
import { getClientName, getExpertName } from "../../../../components/custom/GetName";
import { Autocomplete, TextField } from "@mui/material";

const ChatMain = ({
  toggleLeftSidebar,
  toggleRightSidebar,
  messagesToDisplay,
  setMessages,
  currentEntry,
  showTicketDetails,
  setCurrentEntry,
  setShowTicketDetails,
  chatType,
  entries,
  // Ticket
  ticketInputHandler,
  getChats,
  newTicket,
  setMoveToTicket,
  createTicketModal,
  toggleTicketModal,
  documentUploadModal,
  toggleDocumentUploadModal,
  getMessages,
  getDocuments
}) => {
  const { t } = useTranslation();
  const location = useLocation().pathname.split('/')[2];
  const role = useLocation().pathname.split('/')[1];
  const textareaRef = useRef();
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_BASE_URL;
  const token = Cookies.get('token');
  const clientID = Cookies.get('clientId');
  const ExpertId = Cookies.get('ExpertId');


  const [cases, setCases] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [clients, setClients] = useState([]);
  const [experts, setExperts] = useState([]);
  const [selectedClient, setSelectedClient] = useState();
  const [selectedExpert, setSelectedExpert] = useState();
  const [chatName, setChatName] = useState();
  const [caseId, setCaseId] = useState("");

  const sendMessageToTicket = async () => {
    await axios.post(baseURL + "/api/addmessagetoticket", {
      TicketNo: currentEntry.TicketNo,
      MemberId: 1,
      MemberType: role === "user" ? "Client" : role,
      Message: newMessage,
      MessageTime: DateFormatForServer(Date()),
      DocumentId: 0
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      getMessages()
    }).catch(error => {
      console.log(error);
    })
  };

  const sendMessageToChat = async (ChatId) => {
    await axios.post(baseURL + "/api/addmessagetochat", {
      ChatId: ChatId || currentEntry.ChatId,
      MemberId: 1,
      MemberType: role === "user" ? "Client" : role,
      Message: newMessage,
      MessageTime: DateFormatForServer(Date()),
      DocumentId: 0
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      console.log(res);
      getMessages()
    })
  }

  const addUserChat = async () => {
    await axios.post(baseURL + "/api/addchat", {
      ChatType: role === "user" ? "client" : "expert",
      ClientId: role === "user" ? clientID : ExpertId,
      StartDate: DateFormatForServer(Date()),
      ChatName: role === "user" ? Cookies.get("clientName") : Cookies.get("expertName")
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      console.log(res);
      sendMessageToChat(res.data.response.data.ChatId)
      getChats();
    })
  }

  // const addAdminChat = async () => {
  //   await axios.post(baseURL + "/api/addchat", {
  //     ChatType: role,
  //     ClientId: role === "user" ? clientID : ExpertId,
  //     StartDate: DateFormatForServer(Date()),
  //   }, {
  //     headers: {
  //       'Authorization': `Bearer ${token}`
  //     }
  //   }).then(res => {
  //     getChats();
  //   })
  // }

  const sendMessageHandler = () => {
    if (newMessage.trim() == "") return;
    setNewMessage("");
    textareaRef.current.rows = 1;

    if (!currentEntry) {
      addUserChat();
      return;
    }

    if (location == "support") {
      sendMessageToTicket()
    }
    else {
      sendMessageToChat()
    }

  };

  const adjustTextareaRows = () => {
    const textarea = textareaRef.current;
    textarea && (textarea.style.height = "auto")
    textarea && (textarea.style.height = `${textarea.scrollHeight}px`);
  };

  const addChat = async () => {
    console.log(chatType.split("-")[0].slice(0, -1));
    await axios.post(baseURL + "/api/addchat", {
      ChatType: chatType.split("-")[0].slice(0, -1),
      ClientId: chatType === "cases-chat" ? caseId : (chatType === "experts-chat" ? selectedExpert.ExpertId : selectedClient.ClientId),
      StartDate: DateFormatForServer(Date()),
      ChatName: (chatType === "clients-chat" && getClientName(clients, selectedClient.ClientId)) || (chatType === "experts-chat" && getExpertName(experts, selectedExpert.ExpertId))
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      console.log(res);
      getChats();
      toggleTicketModal()
    }).catch(error => {
      console.log(error);
    })
  };

  useEffect(() => {
    adjustTextareaRows();
  }, [newMessage]);

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

  const getCases = async () => {
    await axios.get(baseURL + "/api/getallcase", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      setCases(res.data.response.data);
    }).catch(error => {
      console.log(error);
    })
  }

  const getAllClients = async () => {
    await axios.get(baseURL + "/api/getallclient", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      setClients(res.data.response.data)
    }).catch(error => {
      console.log(error);
    })
  }

  const getAllExperts = async () => {
    await axios.get(baseURL + "/api/getallexperts", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      console.log(res);
      setExperts(res.data.response.data)
    })
  }

  useEffect(() => {
    getAllClients();
    getCases();
    getAllExperts();
  }, []);

  useEffect(() => {
    if (chatType === "clients-chat") {
      setClients(clients.filter(client => {
        return !entries.some(entry => entry.ClientId === client.ClientId)
      }))
    }
    else if (chatType === "experts-chat") {
      setExperts(experts.filter(client => {
        return !entries.some(entry => entry.ClientId === client.ExpertId)
      }))
    }
  }, [entries])


  // setTimeout(() => {
  //   getChats();
  // }, 2000);

  return (
    <>
      <div className="user_chatMain">
        <div className="user_chatMain__header">
          {chatType !== "admin-chat" && (
            <button
              onClick={toggleLeftSidebar}
              className="user_chatMain__bars_btn">
              {/* <img src={messagesIcon} alt="bars left" /> */}
              <img src={messagesIcon} alt="bars left" />
            </button>
          )}
          <div className="user_chatMain__header__left">
            {chatType === "experts-chat" && (
              <img src={userImg} alt="Abdullah" />
            )}
            <H3
              text={
                (chatType === "admin-chat" && t("UserPanel.Chat.Admin"))
                || ((chatType === "support" && currentEntry) ? `#${currentEntry[Object.keys(currentEntry)[0]]}` : "")
                || (chatType === "cases-chat" && currentEntry && (currentEntry.ChatName || currentEntry.CaseName || ("#" + currentEntry.ChatId)))
                || (chatType === "experts-chat" && currentEntry && (currentEntry.ChatName || ("#" + currentEntry.ChatId)))
                || (chatType === "clients-chat" && currentEntry && (currentEntry.ChatName || ("#" + currentEntry.ChatId)))
              }
              className="m-0 text-capitalize "
            />
          </div>
          {
            (currentEntry && chatType === "cases-chat") && <Button1 text={t("UserPanel.Cases.CaseDetailsPage.Case")} onClick={() => navigate(`/${role}/cases/${currentEntry.CaseId || currentEntry.ClientId}`)} />
          }
          <button
            onClick={toggleRightSidebar}
            className="user_chatMain__bars_btn">
            {/* <img src={userGroupIcon} alt="bars right" /> */}
            <img src={userGroupIcon} alt="bars right" />
          </button>
        </div>
        {(showTicketDetails && chatType === "support") ?

          (currentEntry ? <TicketDetails
            getTickets={getChats}
            ticketDetails={currentEntry}
            setTicketDetails={setCurrentEntry}
            setShowTicketDetails={setShowTicketDetails}
          /> :
            <p className="text-center mt-5">No Ticket Found</p>
          )
          :
          <>
            <ChatMessagesBox messages={messagesToDisplay} />
            {
              currentEntry ? <div className="user_chatMain__input_div">
                <textarea
                  ref={textareaRef}
                  type="text"
                  rows="1"
                  value={newMessage}
                  placeholder={t("UserPanel.Chat.TypeAMessage")}
                  onInput={textareaInputHandler}
                  onKeyDown={(e) => {
                    textareaKeyUpHandler(e);
                  }}></textarea>
                <button onClick={sendMessageHandler} className="p-0">
                  <img src={sendIcon} alt="send" />
                </button>
              </div> :
                (((role === "user" || role === "expert") && chatType !== "cases-chat") && <div className="user_chatMain__input_div">
                  <textarea
                    ref={textareaRef}
                    type="text"
                    rows="1"
                    value={newMessage}
                    placeholder={t("UserPanel.Chat.TypeAMessage")}
                    onInput={textareaInputHandler}
                    onKeyDown={(e) => {
                      textareaKeyUpHandler(e);
                    }}></textarea>
                  <button onClick={sendMessageHandler} className="p-0">
                    <img src={sendIcon} alt="send" />
                  </button>
                </div>)
            }
          </>}
        {(createTicketModal && chatType !== "support") && (
          <Modal className="overflowVisible" toggleModal={toggleTicketModal}>
            {location === "clients-chat" && <>
              <H3 text={"Client"} />
              <div className="user_input_box modalDrop">
                <Autocomplete
                  style={{ width: '100%' }}
                  className='p-0 mt-2'
                  id="combo-box-demo"
                  onChange={(e, newValue) => setSelectedClient(newValue)}
                  options={clients}
                  size='small'
                  sx={{ width: 300 }}
                  getOptionLabel={(option) => option.ClientName}
                  renderInput={(params) => <TextField {...params} label="Client" />}
                />
              </div>
              {/* 
                <select onChange={(e) => setSelectedClient(e.target.value)} >
                  <option value="">Select Client...</option>
                  {
                    clients.map((client) => {
                      return <option value={client.ClientId}>{client.ClientName}</option>
                    })
                  }
                </select>
               */}
            </>}
            {location === "experts-chat" && <>
              <H3 text={"Expert"} className="mb-3" />
              <div className="user_input_box">
                <Autocomplete
                  style={{ width: '100%' }}
                  className='p-0 mt-2'
                  size='small'
                  id="combo-box-demo"
                  onChange={(e, newValue) => setSelectedExpert(newValue)}
                  options={experts}
                  sx={{ width: 300 }}
                  getOptionLabel={(option) => option.ExpertName}
                  renderInput={(params) => <TextField {...params} label="Expert" />}
                />
              </div>
            </>}
            {/* {location === "cases-chat" && <>
              <H3 text={"Case"} className="mb-3" />
              <div className="user_input_box">
                <select onChange={(e) => setCaseId(e.target.value)} >
                  <option value="">Select Case...</option>
                  {
                    cases.map((client) => {
                      return <option value={client.CaseId}>{client.CaseName}</option>
                    })
                  }
                </select>
              </div>
            </>} */}
            <div className="d-flex align-items-center justify-content-between mt-4 ">
              <Button1
                onClick={toggleTicketModal}
                text={t("UserPanel.Cases.AddNewCasePage.Cancel")}
                color="gray"
              />
              <Button1
                onClick={addChat}
                text={t("UserPanel.Cases.AddNewCasePage.Submit")}
              />
            </div>
          </Modal>
        )}

        {
          createTicketModal && chatType === "support" && <CreateTicketModal setMoveToTicket={setMoveToTicket} getTickets={getChats} toggleTicketModal={toggleTicketModal} />
        }

        {documentUploadModal && (
          <Modal toggleModal={toggleDocumentUploadModal}>
            <UploadModal
              modalType={"documentUpload"}
              toggleModal={toggleDocumentUploadModal}
              currentEntry={currentEntry}
              getTicketDocuments={getDocuments}
            />
            <div className="d-flex align-items-center justify-content-between mt-4 ">
              <Button1
                onClick={toggleDocumentUploadModal}
                text={t("UserPanel.Cases.AddNewCasePage.Cancel")}
                color="gray"
              />
              <Button1
                onClick={toggleDocumentUploadModal}
                text={t("UserPanel.Cases.AddNewCasePage.Submit")}
              />
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export default ChatMain;
