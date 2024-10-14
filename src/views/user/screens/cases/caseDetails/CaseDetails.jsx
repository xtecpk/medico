import React, { useEffect, useState } from "react";
import "./caseDetails.css";
import {
  Button1,
  CaseDetailsTable,
  ExpertDisplay,
  H2,
  H3,
  H4,
  InputBox,
  Modal,
  Pdf,
} from "../../../components";
import { useTranslation } from "react-i18next";
import { CardLayout } from "../../../containers";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import { plusIcon } from "../../../assets";
import { Dropzone } from "../../../components";
import { Alert, Snackbar } from "@mui/material";

const CaseDetails = ({ setChatCaseId }) => {
  const { t } = useTranslation();
  const lang = useSelector((state) => state.language.value);
  const caseId = useParams().caseId;
  const baseURL = import.meta.env.VITE_BASE_URL;
  const token = Cookies.get('token');
  const clientId = Cookies.get('clientId');
  const clientName = Cookies.get('clientName');
  const navigate = useNavigate();

  const modalData = {
    expertRemoval: {
      title: t("UserPanel.Cases.CaseDetailsPage.RemovalRequest"),
      message: t("UserPanel.Cases.CaseDetailsPage.RemovalRequestMsg"),
    },
    documentDeletion: {
      title: t("UserPanel.Cases.CaseDetailsPage.DeleteConfirmation"),
      message: t("UserPanel.Cases.CaseDetailsPage.DeleteConfirmationMsg"),
    },
  };


  const [currCase, setCurrCase] = useState({});
  const [currModalDataState, setCurrModalDataState] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDocModalVisible, setIsDocModalVisible] = useState(false);
  const [experts, setExperts] = useState([]);
  const [files, setFiles] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [expertId, setExpertId] = useState()

  const getExpertsByCase = async () => {
    await axios.post(baseURL + "/api/getexpertclientbycase", {
      CaseId: caseId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
      setExperts(response.data.response.data)
    });
  }

  const toggleModal = () => {
    setIsModalVisible((prevState) => !prevState);
  };
  const toggleDocModal = () => {
    setIsDocModalVisible(!isDocModalVisible);
  };


  const getCase = async () => {
    await axios.post(baseURL + "/api/getcasebyid", {
      CaseId: caseId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
      setCurrCase(response.data.response.data[0])
    })
  };

  const getcasedocument = async () => {
    await axios.post(baseURL + "/api/getcasedocument", {
      CaseId: caseId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then(res => {
      console.log(res);
      setDocuments(res.data.response.data)
    })
  }

  const deleteDocumentFromCase = async (DocumentId) => {
    await axios.post(baseURL + "/api/deletedocumentfromcase", {
      DocumentId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then(() => {
      getcasedocument()
    })
  }

  const caseUpdateHandler = (e) => {
    setCurrCase({ ...currCase, [e.target.name]: e.target.value });
  };

  const addNotification = async () => {
    await axios.post(baseURL + '/api/addnotification', {
      Title: "Remove Expert",
      Message: `${clientName} Requested to Remove Expert from Case`,
      NotificationType: "Request",
      ReceiverId: 13,
      ReceiverType: "admin"
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  const removeExpertRequest = async () => {
    console.log(expertId);
    await axios.post(baseURL + "/api/addexpertremoverequest", {
      CaseId: caseId,
      ExpertId: expertId,
      ClientId: clientId,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then((res) => {
      // getExpertsByCase()
      console.log(res);
      if (res.data.response.status) {
        toggleModal()
        setOpen(true)
        addNotification()
      }
    })
  }


  const deleteClickHandler = (state, ExpertId) => {
    setCurrModalDataState(state);
    setExpertId(ExpertId);
    toggleModal();
  };

  const addCaseFile = async () => {
    const fileName = files[0].name.split(" ").join("");
    await axios.post(baseURL + "/api/adddocumenttocase", {
      CaseId: caseId,
      DocName: fileName,
      UploadedBy: clientId,
      CaseFile: fileName,
      Status: 1,
      Description: "Documnet By Client",
      Role: "Client"
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then(res => {
      console.log(res);
      uploadCaseDocument(fileName);
    })
  }

  const uploadCaseDocument = async (CaseFile) => {
    await axios.post(baseURL + "/api/uploaddocumentimage", {
      CaseFile,
      docimage: files[0]
    }, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
      console.log(response)
      toggleDocModal()
      getcasedocument()
      setFiles([])
    })
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };


  useEffect(() => {
    files.length > 0 && addCaseFile()
  }, [files])

  useEffect(() => {
    getCase();
    getExpertsByCase();
    getcasedocument();
  }, [])

  const [editStatus, setEditStatus] = useState(false);

  return (
    <>
      <div
        className={`user_caseDetails_outer ${lang === "ar" ? "user_caseDetails_outer_ar" : ""
          }`}>
        <H2 text={t("UserPanel.Cases.CaseDetailsPage.CaseDetails")} />
        <CardLayout className="user_caseDetails__card p-md-5 ">
          <div className="user_caseDetails__left">
            <div className="user_caseDetails__cases_div">
              <div className="user_caseDetails__cases_div__header">
                <H4 text={t("UserPanel.Cases.CaseDetailsPage.Case")} />
                <Button1
                  className='px-5 py-2'
                  onClick={() => {
                    setChatCaseId(caseId);
                    navigate("/user/cases-chat");
                  }}
                  text={t("UserPanel.Sidebar.Chat")}
                />
              </div>
              {editStatus ? (
                <div className="user_caseDetails__case_div--edit">
                  <InputBox
                    label={t("UserPanel.Cases.AddNewCasePage.Name")}
                    nameIdHtmlFor={"caseName"}
                    type={"text"}
                    placeholder={t(
                      "UserPanel.Cases.AddNewCasePage.NameOfTheCase"
                    )}
                    onChange={caseUpdateHandler}
                    value={currCase.CaseName}
                  />
                  <InputBox
                    label={t("UserPanel.Cases.AddNewCasePage.Type")}
                    nameIdHtmlFor={"type"}
                    type={"select"}
                    options={[t("UserPanel.Cases.AddNewCasePage.PublicCourt")]}
                    onChange={caseUpdateHandler}
                    value={currCase.CaseType}
                  />
                  <InputBox
                    label={t("UserPanel.Cases.AddNewCasePage.Description")}
                    nameIdHtmlFor={"description"}
                    type={"textarea"}
                    placeholder={t(
                      "UserPanel.Cases.AddNewCasePage.DescriptionOfTheCase"
                    )}
                    onChange={caseUpdateHandler}
                    value={currCase.Description}
                  />
                  <InputBox
                    label={t("UserPanel.Cases.AddNewCasePage.Status")}
                    nameIdHtmlFor={"status"}
                    options={[
                      t("UserPanel.Cases.All"),
                      t("UserPanel.Cases.New"),
                      t("UserPanel.Cases.Opened"),
                      t("UserPanel.Cases.UnderReview"),
                      t("UserPanel.Cases.InProgress"),
                      t("UserPanel.Cases.Closed"),
                      t("UserPanel.Cases.Won"),
                      t("UserPanel.Cases.Lost"),
                    ]}
                    type={"select"}
                    onChange={caseUpdateHandler}
                    value={currCase.Status}
                  />
                </div>
              ) : (
                <CaseDetailsTable
                  labels={[
                    t("UserPanel.Cases.Name"),
                    t("UserPanel.Cases.Type"),
                    t("UserPanel.Cases.Status"),
                  ]}
                  details={currCase}
                />
              )}
              {editStatus && (
                <div className="w-100 d-flex justify-content-end my-5">
                  <Button1
                    onClick={() => setEditStatus(false)}
                    text={t("UserPanel.Cases.CaseDetailsPage.Update")}
                  />
                </div>
              )}
            </div>
            <div className="user_caseDetails__experts_div">
              {editStatus && (
                <div className="mb-5">
                  <H4
                    text={t("UserPanel.Cases.CaseDetailsPage.AddExpert")}
                    className="mb-4"
                  />
                  <Button1
                    text={t("UserPanel.Cases.CaseDetailsPage.AddRequest")}
                  />
                </div>
              )}
              <H4 text={t("UserPanel.Cases.Experts")} />
              <div className="user_caseDetails__experts_div__inner">
                {experts.length !== 0 ?
                  experts.map(({ ExpertName, Expertise, ExpertId }, index) => (
                    <ExpertDisplay
                      key={index}
                      editStatus={editStatus}
                      expertName={ExpertName}
                      areaOfExpertise={Expertise}
                      onDeleteClick={() => deleteClickHandler("expertRemoval", ExpertId)}
                    />
                  ))
                  :
                  <p>{t("UserPanel.Cases.NoExperts")}</p>
                }
              </div>
            </div>
          </div>
          <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              // severity="success"
              variant="filled"
              style={{ background: "#2f4058" }}
              sx={{ width: '100%' }}
            >
              Request Sent
            </Alert>
          </Snackbar>
          <div className="user_caseDetails__right">
            <H3
              text={t("UserPanel.Cases.AddNewCasePage.Documents")}
              className="text-xl-center "
            />
            <div>
              <div className="user_addNewCase_form__documnets_div__top">
                <h5>{t("UserPanel.Sidebar.Admin")}</h5>
              </div>
              {
                documents.filter(doc => doc.Role === "Admin").length > 0 ?
                  documents.filter(doc => doc.Role === "Admin").map((doc) => {
                    return (
                      <Pdf
                        name={doc.CaseFile}
                        editStatus={editStatus}
                        type={"case"}
                        onDeleteClick={() => deleteDocumentFromCase(doc.DocumentId)}
                      />
                    )
                  }) :
                  <p>{t("UserPanel.Chat.NoDocFound")}</p>
              }

            </div>
            <div>
              <div className="user_addNewCase_form__documnets_div__top">
                <h5>{t("UserPanel.Cases.AddNewCasePage.User")}</h5>
                <button>
                  <img src={plusIcon} alt="plus icon" width={12} onClick={toggleDocModal} />
                </button>
              </div>
              {
                documents.filter(doc => doc.Role === "Client").length > 0 ?
                  documents.filter(doc => doc.Role === "Client").map((doc) => {
                    return (
                      <Pdf
                        name={doc.CaseFile}
                        editStatus={editStatus}
                        type={"case"}
                        onDeleteClick={() => deleteDocumentFromCase(doc.DocumentId)}
                      />
                    )
                  }) :
                  <p>{t("UserPanel.Chat.NoDocFound")}</p>
              }
            </div>
            <div>
              <h5>{t("UserPanel.Sidebar.Experts")}</h5>
              {
                documents.filter(doc => doc.Role === "Expert").length > 0 ?
                  documents.filter(doc => doc.Role === "Expert").map((doc) => {
                    return (
                      <Pdf
                        name={doc.CaseFile}
                        editStatus={editStatus}
                        type={"case"}
                        onDeleteClick={() => deleteDocumentFromCase(doc.DocumentId)}
                      />
                    )
                  }) :
                  <p>{t("UserPanel.Chat.NoDocFound")}</p>
              }
            </div>
          </div>
        </CardLayout>
        {isModalVisible && (
          <Modal toggleModal={toggleModal}>
            <H4 text={modalData[currModalDataState].title} className="pb-2" />
            <p className="py-4 border-top">
              {modalData[currModalDataState].message}
            </p>
            <div className="d-flex align-items-center justify-content-end">
              {currModalDataState === "expertRemoval" && (
                <>
                  <Button1
                    onClick={toggleModal}
                    text={t("UserPanel.Cases.CaseDetailsPage.Cancel")}
                    color="gray"
                    className="mx-3"
                  />
                  <Button1
                    onClick={() => {
                      removeExpertRequest()
                    }}
                    text={t("UserPanel.Cases.CaseDetailsPage.Request")}
                  />
                </>
              )}
              {currModalDataState === "documentDeletion" && (
                <>
                  <Button1
                    onClick={toggleModal}
                    text={t("UserPanel.Cases.CaseDetailsPage.Cancel")}
                    color="gray"
                    className="mx-3"
                  />
                  <Button1
                    onClick={toggleModal}
                    color="red"
                    text={t("UserPanel.Cases.CaseDetailsPage.Delete")}
                  />
                </>
              )}
            </div>
          </Modal>
        )}

        {
          isDocModalVisible && (
            <Modal toggleModal={toggleDocModal}>
              <div className="user_submit_modal">
                <div>
                  <Dropzone
                    files={files}
                    setFiles={setFiles}
                    content={"Click to Upload Document +"}
                  />
                  {
                    files && files.map((file) => {
                      return <Pdf downloadStatus={false} key={file.name} name={file.name} size={file.size} />
                    })
                  }
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between mt-4 ">
                <Button1
                  onClick={toggleDocModal}
                  text={"Cancel"}
                  color="gray"
                />
                <Button1
                  text={"Submit"}
                />
              </div>
            </Modal>
          )
        }
      </div>
    </>
  );
};

export default CaseDetails;
