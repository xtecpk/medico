import React, { useEffect, useState } from "react";
import { CardLayout } from "../../../user/containers";
import {
  Button1,
  CaseDetailsTable,
  CasesDisplayTable,
  ExpertDisplay,
  H3,
  H4,
  InputBox,
  Modal,
  Pdf,
  UploadModal,
} from "../../../user/components";
import deleteIcon from "../support/deleteIcon.svg";
import plusIcon from "./plus.svg";
import axios from "axios";
import { Dropzone } from "../../../user/components";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  getExpertName,
  getMemberIdByName,
} from "../../../../components/custom/GetName";
import { Alert, Autocomplete, Snackbar, TextField } from "@mui/material";

const CaseDetails = ({ role = null, type = "cases", setChatCaseId }) => {
  const location = useLocation();
  const baseURL = import.meta.env.VITE_BASE_URL;
  const token = Cookies.get("token");
  const navigate = useNavigate();

  const userId =
    type === "cases"
      ? location.pathname.split("/").pop()
      : location.pathname.split("/")[3];

  const [clients, setClients] = useState([]);
  const [experts, setExperts] = useState([]);
  const [caseDetails, setCaseDetails] = useState({});
  const [memberDetails, setMemberDetails] = useState([]);
  const [editStatus, setEditStatus] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState();
  const [files, setFiles] = useState([]);
  const [caseChatId, setCaseChatId] = useState();
  const [chatMembers, setChatMembers] = useState([]);
  const [documents, setDocuments] = useState([]);

  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };

  const getClients = async () => {
    await axios
      .get(baseURL + "/api/getallclient", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        setClients(res.data.response.data);
      });
  };

  const getExperts = async () => {
    await axios
      .get(baseURL + "/api/getallexperts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        setExperts(
          res.data.response.data.filter((expert) => {
            return !memberDetails.some(
              (member) => member.ExpertId === expert.ExpertId
            );
          })
        );
      });
  };

  const getCaseById = async () => {
    await axios
      .post(
        baseURL + "/api/getcasebyid",
        {
          CaseId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setCaseDetails(res.data.response.data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getCientInfo = async () => {
    await axios
      .post(
        baseURL + "/api/getexpertclientbycase",
        {
          CaseId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setMemberDetails(res.data.response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addNotification = async (title, message, recieverId) => {
    await axios.post(
      baseURL + "/api/addnotification",
      {
        Title: title,
        Message: message,
        NotificationType: "Request",
        ReceiverId: recieverId,
        ReceiverType: "user",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  console.log(caseDetails);

  const addExpertToCase = async () => {
    selectedExpert &&
      (await axios
        .post(
          baseURL + "/api/addexperttocase",
          {
            CaseId: userId,
            ExpertId: selectedExpert.ExpertId,
            ExpertEmail: selectedExpert.Email,
            ExpertName: selectedExpert.ExpertName,
            ClientEmail: caseDetails
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log(res);
          addExpertToChat();
          addNotification(
            "Assigned Case",
            "You're assigned a new case",
            selectedExpert.ExpertId
          );
          addNotification(
            "Assigned Expert to Case",
            `${selectedExpert.ExpertName} is assigned to your case - ${caseDetails.CaseName}`,
            caseDetails.ClientId
          );
          getCientInfo();
        })
        .catch((error) => {
          console.log(error);
          selectedExpert();
        }));
  };

  const removeMemberFromChat = async (ExpertId) => {
    caseChatId &&
      (await axios
        .post(
          baseURL + "/api/removememberfromchat",
          {
            ChatId: caseChatId,
            MemberId: ExpertId,
            MemberType: "Expert",
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        .then((response) => {
          console.log(response);
          setOpen(true);
        }));
  };

  const removeExpertFromCase = async (ExpertId) => {
    await axios
      .post(
        baseURL + "/api/removexpertfromcase",
        {
          CaseId: userId,
          ExpertId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.data.response.status) {
          removeMemberFromChat(ExpertId);
          getCientInfo();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addExpertToChat = async () => {
    caseChatId &&
      (await axios
        .post(
          baseURL + "/api/addmembertochat",
          {
            ChatId: caseChatId,
            MemberId: selectedExpert.ExpertId,
            MemberType: "Expert",
            MemberName: getExpertName(experts, selectedExpert.ExpertId),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log(res);
          setOpen1(true);
        }));
  };

  const getCaseChat = async () => {
    await axios
      .post(
        baseURL + "/api/getchatbyclientandtype",
        {
          ClientId: userId,
          ChatType: "Case",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setCaseChatId(res.data.response.data[0].ChatId);
      });
  };

  const getChatMembers = async () => {
    await axios
      .post(
        baseURL + "/api/getchatmember",
        {
          ChatId: caseChatId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setChatMembers(res.data.response.data);
      });
  };

  useEffect(() => {
    caseChatId && getChatMembers();
  }, [caseChatId]);

  useEffect(() => {
    getCaseById();
    getClients();
    getExperts();
    getCaseChat();
    getCientInfo();
    getcasedocument();
  }, []);

  const [currModalDataState, setCurrModalDataState] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");

  const toggleModal = () => {
    setIsModalVisible((prevState) => !prevState);
  };

  const caseUpdateHandler = (e) => {};

  const newCaseInputHandler = (e) => {
    setNewCase((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const deleteClickHandler = (state) => {
    setCurrModalDataState(state);
    toggleModal();
  };

  const changeStatus = async (event) => {
    console.log(event.target.value);
    await axios
      .post(
        baseURL + "/api/updatecase",
        {
          ...caseDetails,
          Status: event.target.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        getCaseById();
      });
  };

  const uploadSubmitClickHandler = (type) => {
    toggleModal();
    setModalType(type);
  };

  const getcasedocument = async () => {
    await axios
      .post(
        baseURL + "/api/getcasedocument",
        {
          CaseId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        setDocuments(res.data.response.data);
      });
  };

  const deleteDocumentFromCase = async (DocumentId) => {
    await axios
      .post(
        baseURL + "/api/deletedocumentfromcase",
        {
          DocumentId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        getcasedocument();
      });
  };

  const addCaseFile = async () => {
    const fileName = files[0].name.split(" ").join("");
    await axios
      .post(
        baseURL + "/api/adddocumenttocase",
        {
          CaseId: userId,
          DocName: fileName,
          UploadedBy: 1,
          CaseFile: fileName,
          Status: 1,
          Description: "Documnet By Admin",
          Role: "Admin",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        uploadCaseDocument(fileName);
      });
  };

  const uploadCaseDocument = async (CaseFile) => {
    await axios
      .post(
        baseURL + "/api/uploaddocumentimage",
        {
          CaseFile,
          docimage: files[0],
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        toggleModal();
        setFiles([]);
        getcasedocument();
      });
  };

  useEffect(() => {
    files.length > 0 && addCaseFile();
  }, [files]);

  useEffect(() => {
    getExperts();
  }, [memberDetails]);

  return (
    <>
      <CardLayout className="user_caseDetails__card p-md-5 ">
        <div className="user_caseDetails__left">
          <div className="user_caseDetails__cases_div">
            <div className="user_caseDetails__cases_div__header">
              <H4 text={"Case"} />
              {role === "admin" && (
                <Button1
                  className="px-5 py-2"
                  onClick={() => {
                    setChatCaseId(userId);
                    navigate("/admin/cases-chat");
                  }}
                  text={"Chat"}
                />
              )}
            </div>
            <div className="row my-4 mb-5">
              <div className="col-md-12 d-flex my-2">
                <H4 text={"NAME"} className="support_light_txt" />
                <p>{caseDetails && caseDetails.CaseName}</p>
              </div>
              <div className="col-md-12 d-flex my-2">
                <H4 text={"TYPE"} className="support_light_txt" />
                <p>{caseDetails && caseDetails.CaseType}</p>
              </div>
              <div className="col-md-12 d-flex my-2">
                <H4 text={"STATUS"} className="support_light_txt" />
                <select
                  onChange={changeStatus}
                  value={caseDetails && caseDetails.Status}
                >
                  <option value="New">NEW</option>
                  <option value="Open">OPEN</option>
                  <option value="Won">WON</option>
                  <option value="Lost">LOST</option>
                  <option value="Under Review">UNDER REVIEW</option>
                  <option value="In Progress">IN PROGRESS</option>
                  <option value="Closed">CLOSED</option>
                </select>
              </div>
            </div>
            {editStatus && (
              <div className="w-100 d-flex justify-content-end my-5">
                <Button1 onClick={() => setEditStatus(false)} text={"Update"} />
              </div>
            )}
          </div>
          <div className="user_caseDetails__experts_div">
            <H4 text={"Client"} />
            <div className="row my-4 mb-5">
              {!caseDetails ? (
                <div className="row my-4">
                  <div className="col-md-12 d-flex">
                    <select
                      name=""
                      id=""
                      className="px-2"
                      style={{ width: "70%", marginRight: "1rem" }}
                    >
                      <option value="">Client Name</option>
                      {clients.length > 0 &&
                        clients.map((client, index) => {
                          return (
                            <option value={client.ClientId}>
                              {client.ClientName}
                            </option>
                          );
                        })}
                    </select>
                    <Button1 text={"Add"} />
                  </div>
                </div>
              ) : (
                <table className="user_caseDetailsTable">
                  <tbody>
                    <tr>
                      <td className="user_user_caseDetailsTable_label">ID</td>
                      <td className="user_user_caseDetailsTable_value">
                        {caseDetails && (caseDetails.ClientId || "")}
                      </td>
                    </tr>
                    <tr>
                      <td className="user_user_caseDetailsTable_label">Name</td>
                      <td className="user_user_caseDetailsTable_value">
                        {caseDetails && (caseDetails.ClientName || "")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <div className="user_caseDetails__experts_div">
            {editStatus && (
              <div className="mb-5">
                <H4 text={"AddExpert"} className="mb-4" />
                <Button1 text={"AddRequest"} />
              </div>
            )}
            <H4 text={"Experts"} />
            <div className="row my-4">
              <div className="col-md-12 d-flex">
                {experts.length > 0 && (
                  <Autocomplete
                    disablePortal
                    className="p-0"
                    size="small"
                    id="combo-box-demo"
                    onChange={(e, newValue) => setSelectedExpert(newValue)}
                    options={experts}
                    sx={{ width: 300 }}
                    getOptionLabel={(option) => option.ExpertName}
                    renderInput={(params) => (
                      <TextField {...params} label="Expert" />
                    )}
                  />
                )}
                {/* <select name="" id="" value={selectedExpert} onChange={e => setSelectedExpert(e.target.value)} className='px-2' style={{ width: "70%", marginRight: "1rem" }}>
                                    <option value="0">Expert Name</option>
                                    {
                                        experts.length > 0 && experts.map((expert, index) => {
                                            return (
                                                <option value={expert.ExpertId}>{expert.ExpertName}</option>
                                            )
                                        })
                                    }
                                </select> */}
                <Button1
                  text={"Add"}
                  className="mx-3"
                  onClick={addExpertToCase}
                />
              </div>
            </div>
            <div className="row expert_cards_box">
              {memberDetails &&
                memberDetails.map((member) => {
                  return (
                    <div className="col-lg-6 col-md-12 my-3">
                      <CardLayout className="p-4">
                        <div className="row">
                          <div className="col-md-10">
                            <H4 text={member.ExpertName} />
                            <p>{member.Expertise}</p>
                          </div>
                          <div className="col-md-2 d-flex text-center align-items-center">
                            <img
                              src={deleteIcon}
                              alt=""
                              onClick={() =>
                                removeExpertFromCase(member.ExpertId)
                              }
                            />
                          </div>
                        </div>
                      </CardLayout>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <div className="user_caseDetails__right">
          <H3 text={"Documents"} className="text-xl-center " />
          <div>
            <div className="user_addNewCase_form__documnets_div__top">
              <h5>{role === "admin" ? "ADMIN" : "User"}</h5>
              <button>
                <img
                  src={plusIcon}
                  alt="plus icon"
                  width={12}
                  onClick={toggleModal}
                />
              </button>
            </div>
            {documents.filter((doc) => doc.Role.toLowerCase() === "admin")
              .length > 0 ? (
              documents
                .filter((doc) => doc.Role.toLowerCase() === "admin")
                .map((doc) => {
                  return (
                    <Pdf
                      name={doc.CaseFile}
                      editStatus={editStatus}
                      type={"case"}
                      onDeleteClick={() =>
                        deleteDocumentFromCase(doc.DocumentId)
                      }
                    />
                  );
                })
            ) : (
              <p>No Document Found</p>
            )}
          </div>
          <div>
            <h5>{"User"}</h5>
            {documents.filter((doc) => doc.Role === "Client").length > 0 ? (
              documents
                .filter((doc) => doc.Role === "Client")
                .map((doc) => {
                  return (
                    <Pdf
                      name={doc.CaseFile}
                      editStatus={editStatus}
                      type={"case"}
                      onDeleteClick={() =>
                        deleteDocumentFromCase(doc.DocumentId)
                      }
                    />
                  );
                })
            ) : (
              <p>No Document Found</p>
            )}
          </div>
          <div>
            <h5>{"Expert"}</h5>
            {documents.filter((doc) => doc.Role === "Expert").length > 0 ? (
              documents
                .filter((doc) => doc.Role === "Expert")
                .map((doc) => {
                  return (
                    <Pdf
                      name={doc.CaseFile}
                      editStatus={editStatus}
                      type={"case"}
                      onDeleteClick={() =>
                        deleteDocumentFromCase(doc.DocumentId)
                      }
                    />
                  );
                })
            ) : (
              <p>No Document Found</p>
            )}
          </div>
        </div>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            // severity="success"
            variant="filled"
            style={{ background: "#2f4058" }}
            sx={{ width: "100%" }}
          >
            Expert Removed Successfully
          </Alert>
        </Snackbar>

        <Snackbar open={open1} autoHideDuration={3000} onClose={handleClose1}>
          <Alert
            onClose={handleClose1}
            // severity="success"
            variant="filled"
            style={{ background: "#2f4058" }}
            sx={{ width: "100%" }}
          >
            Expert Added Successfully
          </Alert>
        </Snackbar>
      </CardLayout>
      {isModalVisible && (
        <Modal toggleModal={toggleModal}>
          <div className="user_submit_modal">
            <div>
              <Dropzone
                files={files}
                setFiles={setFiles}
                content={"Click to Upload Document +"}
              />
              {files &&
                files.map((file) => {
                  return (
                    <Pdf
                      downloadStatus={false}
                      key={file.name}
                      name={file.name}
                      size={file.size}
                    />
                  );
                })}
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between mt-4 ">
            <Button1 onClick={toggleModal} text={"Cancel"} color="gray" />
            <Button1 text={"Submit"} />
          </div>
        </Modal>
      )}
    </>
  );
};

export default CaseDetails;
