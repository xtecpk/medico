import React, { useEffect, useState } from "react";
import "./chatRightSidebar.css";
import { plusIcon, xIcon } from "../../assets";
import { Button1, ChatMemberItem, H3, Modal, Pdf } from "../../components";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { Alert, Snackbar } from "@mui/material";

const ChatRightSidebar = ({
  isRightSidebarHidden,
  toggleRightSidebar,
  chatmembers,
  documents,
  getDocuments,
  currentEntry,
  toggleDocumentUploadModal,
  getChatMembers,
  type = null
}) => {
  const { t } = useTranslation();
  const lang = useSelector((state) => state.language.value);
  const role = useLocation().pathname.split("/")[1];
  const token = Cookies.get('token');
  const chatType = useLocation().pathname.split("/")[2];
  const baseURL = import.meta.env.VITE_BASE_URL;

  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);
  const [memberType, setMemberType] = useState("Client");
  const [errVisible, setErrVisible] = useState(false);
  const [clients, setClients] = useState([]);
  const [experts, setExperts] = useState([]);
  const [ticketClient, setTicketClient] = useState("loading...");
  const [memberInfo, setmemberInfo] = useState();
  const [clientExists, setClientExists] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false)
  }

  const deleteDocFromTicket = async (DocumentId) => {
    await axios.post(baseURL + "/api/removedocumentfromticket", {
      DocumentId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(() => {
      getDocuments()
    });
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

  const deleteDocFromChat = async (DocumentId) => {
    await axios.post(baseURL + "/api/removedocumentfromchat", {
      DocumentId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => {
      getDocuments();
      console.log(res);
    });
  }

  const toggleModal = () => {
    setAddMemberModalVisible(!addMemberModalVisible)
  }

  const addMemberToCase = async () => {
    console.log(memberInfo, memberType);
    if (!memberInfo) {
      setErrVisible(true);
      return
    }
    setErrVisible(false);

    await axios.post(baseURL + "/api/addmembertochat", {
      ChatId: currentEntry.ChatId,
      MemberId: memberType === "Client" ? memberInfo.ClientId : memberInfo.ExpertId,
      MemberType: memberType,
      MemberName: memberType === "Client" ? memberInfo.ClientName : memberInfo.ExpertName,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      console.log(res);
      toggleModal()
      getChatMembers()
    })
  }

  const getClientDetails = async () => {
    await axios.post(baseURL + "/api/getclientbyid", {
      ClientId: currentEntry.ClientId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      console.log(res);
      setTicketClient(res.data.response.data.length > 0 && res.data.response.data[0].ClientName)
    })
  }

  const removeMemberFromChat = async (memberId, memberType) => {
    await axios.post(baseURL + "/api/removememberfromchat", {
      ChatId: currentEntry.ChatId,
      MemberId: memberId,
      MemberType: memberType,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      console.log(res);
      getChatMembers();
      setOpen(true)
    })
  }

  useEffect(() => {
    getAllClients();
    getAllExperts();
  }, [])

  useEffect(() => {
    setClientExists(
      chatmembers.find(member => member.MemberType === "Client") ? true : false
    )
  }, [chatmembers])

  useEffect(() => {
    getClientDetails();
  }, [currentEntry])

  useEffect(() => {
    setMemberType(clientExists ? "Expert" : "Client")
  })

  return (
    <>
      <div
        className={`user_chatRightSidebar ${isRightSidebarHidden ? "user_chatRightSidebar--hidden" : ""
          } ${lang === "ar" ? "user_chatRightSidebar_ar" : ""}`}>
        <button
          onClick={toggleRightSidebar}
          className="user_chatRightSidebar__close_btn">
          <img src={xIcon} alt="x" />
        </button>
        {
          chatType === "cases-chat" && <div className="user_chatRightSidebar__top">
            <div className="d-flex align-items-center justify-content-between">
              <H3 text={((type === "support") ? t("UserPanel.Chat.Ticket") : t("UserPanel.Chat.ChatMembers"))} />
              {
                role === "admin" && <Button1
                  icon={plusIcon}
                  className="p-2 rounded-5"
                  onClick={() => {
                    toggleModal()
                  }}
                />
              }
            </div>
            <div className="user_chatRightSidebar__chatMembers_div">
              {chatmembers.length > 0 ? chatmembers.map(({ MemberType, MemberName, ChatMember }, index) => (
                <ChatMemberItem key={index} name={MemberName} type={MemberType === "Expert" ? MemberType : `Client ID: ${ChatMember}`} onDeleteClick={() => removeMemberFromChat(ChatMember, MemberType)} />
              )) :
                <p>{t("UserPanel.Chat.NoChatMembers")}</p>}
            </div>
          </div>
        }

        {
          (role === "admin" && chatType === "support") && <>
            {currentEntry && <>
              <H3 text={"Client"} className="mb-3" />
              <ChatMemberItem key={"index"} name={ticketClient} type={`Client ID: ${currentEntry?.ClientId}`} />
            </>}
          </>
        }

        <div className="user_chatRightSidebar__bottom">
          <H3 text={t("UserPanel.Cases.AddNewCasePage.Documents")} />
          {
            ((role === "expert" && chatType === "admin-chat") || (role === "admin" && chatType === "experts-chat")) || <div>
              <div className="d-flex align-items-center justify-content-between">
                <h5>{t("UserPanel.Cases.AddNewCasePage.User")}</h5>
                {
                  role === "user" && <Button1
                    icon={plusIcon}
                    onClick={() => {
                      toggleDocumentUploadModal();
                      toggleRightSidebar();
                    }}
                  />
                }
              </div>
              {documents.length > 0 && documents
                .filter((doc) => doc.Role === "user").length > 0 ?
                documents
                  .filter((doc) => doc.Role === "user")
                  .map((doc, index) => (
                    <Pdf key={index} name={doc.DocumentName || doc.DocName}
                      type={chatType === "support" ? "ticket" : "chat"}
                      onDeleteClick={chatType === "support" ? (() => deleteDocFromTicket(doc.DocumentId)) : (() => deleteDocFromChat(doc.DocumentId))} />
                  )) :
                <p>{t("UserPanel.Chat.NoDocFound")}</p>}
            </div>
          }
          {
            ((role === "user" && chatType === "admin-chat") || (role === "admin" && chatType === "clients-chat")) || <div>
              <div className="d-flex align-items-center justify-content-between">
                <h5>{t("UserPanel.Cases.Experts")}</h5>
                {
                  role === "expert" && <Button1
                    icon={plusIcon}
                    onClick={() => {
                      toggleDocumentUploadModal();
                      toggleRightSidebar();
                    }}
                  />
                }
              </div>
              {documents.length > 0 && documents
                .filter((doc) => doc.Role.toLowerCase() === "expert").length > 0 ?
                documents
                  .filter((doc) => doc.Role.toLowerCase() === "expert")
                  .map((doc, index) => (
                    <Pdf key={index} name={doc.DocumentName || doc.DocName}
                      type={chatType === "support" ? "ticket" : "chat"}
                      onDeleteClick={chatType === "support" ? (() => deleteDocFromTicket(doc.DocumentId)) : (() => deleteDocFromChat(doc.DocumentId))} />
                  )) :
                <p>{t("UserPanel.Chat.NoDocFound")}</p>}
            </div>
          }
          <div>
            <div className="d-flex align-items-center justify-content-between">
              <h5>{t("UserPanel.Chat.Admin")}</h5>
              {
                role === "admin" && <Button1
                  icon={plusIcon}
                  onClick={() => {
                    toggleDocumentUploadModal();
                    toggleRightSidebar();
                  }}
                />
              }
            </div>
            {documents.length > 0 && documents
              .filter((doc) => doc.Role.toLowerCase() === "admin").length > 0 ?
              documents
                .filter((doc) => doc.Role.toLowerCase() === "admin")
                .map((doc, index) => (
                  <Pdf
                    key={index}
                    name={doc.DocumentName || doc.DocName}
                    onDeleteClick={chatType === "support" ? (() => deleteDocFromTicket(doc.DocumentId)) : (() => deleteDocFromChat(doc.DocumentId))}
                    type={chatType === "support" ? "ticket" : "chat"}
                  />
                )) :
              <p>{t("UserPanel.Chat.NoDocFound")}</p>}
          </div>
        </div>
      </div>

      <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          variant="filled"
          style={{ background: "#2f4058" }}
          sx={{ width: '100%' }}
        >
          Member Removed from Chat
        </Alert>
      </Snackbar>

      {
        addMemberModalVisible && <Modal toggleModal={toggleModal}>
          <div className="row">
            {!clientExists && <div className={`pointer memberType col-md-6 text-center py-1 ${memberType === "Client" ? "active_type" : ""}`} onClick={() => {
              setMemberType("Client")
              setmemberInfo()
            }}>Client</div>
            }
            <div className={`pointer memberType ${!clientExists ? "col-md-6" : "col-md-12"} text-center py-1 ${memberType === "Expert" ? "active_type" : ""}`} onClick={() => {
              setMemberType("Expert")
              setmemberInfo()
            }}>Expert</div>
          </div>
          <div className="row p-3 pt-4">
            {
              (memberType === "Client" && !clientExists) ? <select className="col-md-12" onChange={(e) => {
                setmemberInfo(clients[e.target.value])
              }}>
                <option value="0">Client</option>
                {
                  clients.map((client, index) => {
                    return <option value={index}>{client.ClientName}</option>
                  })
                }
              </select> :
                <select className="col-md-12" onChange={(e) => {
                  setmemberInfo(experts[e.target.value])
                }}>
                  <option value="0">Expert</option>
                  {
                    experts.map((expert, index) => {
                      return <option value={index}>{expert.ExpertName}</option>
                    })
                  }
                </select>
            }
          </div>
          {
            errVisible && <span className={`text-danger error-msg`}>
              Please Select {memberType}
            </span>
          }
          <div className="d-flex justify-content-end">
            <Button1 text={"Add"} onClick={addMemberToCase} />
          </div>
        </Modal >
      }
    </>
  );
};

export default ChatRightSidebar;
