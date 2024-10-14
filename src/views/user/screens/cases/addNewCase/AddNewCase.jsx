import React, { useEffect, useState } from "react";
import "./addNewCase.css";
import {
  CheckboxInput,
  H2,
  H3,
  H4,
  InputBox,
  Modal,
  Pdf,
  UploadModal,
  Button1,
} from "../../../components";
import { Dropzone } from "../../../components";
import { useTranslation } from "react-i18next";
import { CardLayout } from "../../../containers";
import { plusIcon } from "../../../assets";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import DateFormatForServer from "../../../../../components/custom/DateFormatForServer";
import { Autocomplete, TextField } from "@mui/material";

const AddNewCase = ({ fetchCases }) => {
  const location = useLocation();
  const role = location.pathname.split("/")[1];
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_BASE_URL;
  const UserClientName = Cookies.get("clientName")
  const token = Cookies.get('token');
  const ClientId = Cookies.get('clientId');
  const userId = Cookies.get('userId');

  const lang = useSelector((state) => state.language.value);
  const { t } = useTranslation();
  const [files, setFiles] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState();
  const [newCase, setNewCase] = useState({
    caseExistance: "existingCase",
    caseName: "",
    type: t("UserPanel.Cases.AddNewCasePage.PublicCourt"),
    description: "",
    status: "New",
    additionalNotes: "",
    scfhsCopyCheck: true,
    medicalCopyCheck: false,
    governmentIdCheck: true,
    nationalAddressCheck: false,
    nationalAddress: "",
  });

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

  const uploadImage = async (CaseId) => {
    await axios.post(baseURL + "/api/uploaddocumentimage", {
      CaseFile: CaseId + files[0].name.split(" ").join(""),
      docimage: files[0]
    }, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      console.log(res.data);
    })
  }

  const addDocument = async (CaseId) => {
    await axios.post(baseURL + "/api/adddocumenttocase", {
      CaseId,
      DocName: CaseId + files[0].name.split(" ").join(""),
      UploadedBy: 1,
      CaseFile: CaseId + files[0].name.split(" ").join(""),
      Description: "Case Files Upload by" + userId,
      Status: 1,
      Role: role === "admin" ? "Admin" : "Client"
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      console.log(res);
      uploadImage(CaseId)
    })
  }

  const addMemberToChat = async (ChatId) => {
    await axios.post(baseURL + "/api/addmembertochat", {
      ChatId,
      MemberId: role === "admin" ? selectedClient.ClientId : ClientId,
      MemberType: "Client",
      MemberName: role === "admin" ? selectedClient.ClientName : UserClientName,
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

  const addChat = async (caseId) => {
    await axios.post(baseURL + "/api/addchat", {
      ChatType: "case",
      ClientId: caseId,
      StartDate: DateFormatForServer(Date()),
      ChatName: newCase.caseName
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      console.log(res);
      addMemberToChat(res.data.response.data.ChatId)
    })
  };

  const addNotification = async () => {
    await axios.post(baseURL + '/api/addnotification', {
      Title: "Case Added",
      Message: `${UserClientName} added a Case`,
      NotificationType: "Case",
      ReceiverId: 13,
      ReceiverType: "admin"
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  const addNewCase = async () => {
    (ClientId || selectedClient.ClientId) && await axios.post(baseURL + "/api/addcase", {
      CaseName: newCase.caseName,
      CaseType: newCase.type,
      Status: newCase.status,
      ExistingCase: 0,
      Description: newCase.description,
      ClientId: role === "admin" ? selectedClient.ClientId : ClientId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      // toggleModal();
      console.log(res);
      if (res.data.response.status) {
        if (files.length > 0)
          addDocument(res.data.response.data.CaseId);
        addChat(res.data.response.data.CaseId)
        if (role === "user") {
          addNotification();
          fetchCases();
        }
        navigate(`/${role}/cases`)
      }
    })
  }

  const newCaseInputHandler = (e) => {
    setNewCase((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");

  const toggleModal = () => {
    setIsModalVisible((prevState) => !prevState);
  };

  const uploadSubmitClickHandler = (type) => {
    toggleModal();
    setModalType(type);
  };

  useEffect(() => {
    isModalVisible && toggleModal();
  }, [files])

  useEffect(() => {
    role === "admin" && getAllClients()
  }, [])


  return (
    <>
      <div>
        <H2 text={t("UserPanel.Cases.AddNewCase")} />
        <CardLayout className="mt-4">
          <div className="user_addNewCase_form">
            <div
              className={`user_addNewCase_form__details_div ${lang === "ar" ? "user_addNewCase_form__details_div_ar" : ""
                }`}>
              <H3
                text={t("UserPanel.Cases.AddNewCasePage.CaseDetails")}
                className="user_addNewCase_form__left_heading"
              />

              {
                role === "admin" && <>
                  <div className="user_input_box">
                    <label>Clients</label>
                    <Autocomplete
                      disablePortal
                      className='p-0'
                      size='small'
                      id="combo-box-demo"
                      onChange={(e, newValue) => setSelectedClient(newValue)}
                      options={clients}
                      sx={{ width: 300 }}
                      getOptionLabel={(option) => option.ClientName}
                      renderInput={(params) => <TextField {...params} label="Client" />}
                    />
                    {/* <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}>
                      <option>Select Client</option>
                      {
                        clients.map(client => {
                          return <option value={client.ClientId}>{client.ClientName}</option>
                        })
                      }
                    </select> */}
                  </div>
                  <br />
                </>
              }

              {/* <div className="user_addNewCase_form__radio_div">
                <input
                  defaultChecked={newCase.caseExistance === "existingCase"}
                  type="radio"
                  name="caseExistance"
                  value="existingCase"
                  id="existingCase"
                  onChange={newCaseInputHandler}
                />
                <label htmlFor="existingCase">
                  {t("UserPanel.Cases.AddNewCasePage.ExistingCourtCases")}
                </label>
              </div>
              <div className="user_addNewCase_form__radio_div">
                <input
                  type="radio"
                  name="caseExistance"
                  id="nonExistingCase"
                  value="nonExistingCase"
                  defaultChecked={newCase.caseExistance === "nonExistingCase"}
                  onChange={newCaseInputHandler}
                />
                <label htmlFor="nonExistingCase">
                  {t("UserPanel.Cases.AddNewCasePage.NonExistingCourtCases")}
                </label>
              </div> */}
              <InputBox
                label={t("UserPanel.Cases.AddNewCasePage.Name")}
                nameIdHtmlFor={"caseName"}
                type={"text"}
                placeholder={t("UserPanel.Cases.AddNewCasePage.NameOfTheCase")}
                onChange={newCaseInputHandler}
                value={newCase.caseName}
              />
              <InputBox
                label={t("UserPanel.Cases.AddNewCasePage.Type")}
                nameIdHtmlFor={"type"}
                type={"select"}
                options={[t("UserPanel.Cases.AddNewCasePage.PublicCourt"), "Insurance Disputes"]}
                onChange={newCaseInputHandler}
                value={newCase.type}
              />
              <InputBox
                label={t("UserPanel.Cases.AddNewCasePage.Description")}
                nameIdHtmlFor={"description"}
                type={"textarea"}
                placeholder={t(
                  "UserPanel.Cases.AddNewCasePage.DescriptionOfTheCase"
                )}
                onChange={newCaseInputHandler}
                value={newCase.description}
              />
              <InputBox
                label={t("UserPanel.Cases.AddNewCasePage.Status")}
                nameIdHtmlFor={"status"}
                type={"text"}
                disabled={true}
                onChange={newCaseInputHandler}
                value={newCase.status}
              />
              {/* <InputBox
                label={t("UserPanel.Cases.AddNewCasePage.AdditionalNotes")}
                nameIdHtmlFor={"additionalNotes"}
                type={"textarea"}
                placeholder={t("UserPanel.Cases.AddNewCasePage.Notes")}
                className="user_addNewCase_form__full_width_textarea"
                onChange={newCaseInputHandler}
                value={newCase.additionalNotes}
              /> */}
              <div className="user_addNewCase_form__checkboxes_div">
                {/* <CheckboxInput
                  label={t("UserPanel.Cases.AddNewCasePage.SCFHSCopy")}
                  nameIdHtmlFor={"scfhsCopyCheck"}
                  onChange={() =>
                    newCaseInputHandler({
                      target: {
                        name: "scfhsCopyCheck",
                        value: !newCase.scfhsCopyCheck,
                      },
                    })
                  }
                  onUploadClick={() =>
                    uploadSubmitClickHandler("documentUpload")
                  }
                  value={newCase.scfhsCopyCheck}
                />
                <CheckboxInput
                  label={t("UserPanel.Cases.AddNewCasePage.MedicalCopy")}
                  nameIdHtmlFor={"medicalCopyCheck"}
                  onUploadClick={() =>
                    uploadSubmitClickHandler("documentUpload")
                  }
                  onChange={() =>
                    newCaseInputHandler({
                      target: {
                        name: "medicalCopyCheck",
                        value: !newCase.medicalCopyCheck,
                      },
                    })
                  }
                  value={newCase.medicalCopyCheck}
                />
                <CheckboxInput
                  label={t("UserPanel.Cases.AddNewCasePage.GovernmentId")}
                  nameIdHtmlFor={"governmentIdCheck"}
                  onChange={() =>
                    newCaseInputHandler({
                      target: {
                        name: "governmentIdCheck",
                        value: !newCase.governmentIdCheck,
                      },
                    })
                  }
                  onUploadClick={() =>
                    uploadSubmitClickHandler("documentUpload")
                  }
                  value={newCase.governmentIdCheck}
                />
                <CheckboxInput
                  label={t("UserPanel.Cases.AddNewCasePage.NationalAddress")}
                  nameIdHtmlFor={"nationalAddressCheck"}
                  onUploadClick={() =>
                    uploadSubmitClickHandler("addressUpload")
                  }
                  onChange={() =>
                    newCaseInputHandler({
                      target: {
                        name: "nationalAddressCheck",
                        value: !newCase.nationalAddressCheck,
                      },
                    })
                  }
                  value={newCase.nationalAddressCheck}
                /> */}
              </div>
            </div>
            <div
              className={`user_addNewCase_form__documnets_div ${lang === "ar" ? "user_addNewCase_form__documnets_div_ar" : ""
                }`}>
              <H3
                text={t("UserPanel.Cases.AddNewCasePage.Documents")}
                className="text-xl-center "
              />
              <div className="user_addNewCase_form__documnets_div__top">
                <h5>{role === "admin" ? "ADMIN" : t("UserPanel.Cases.AddNewCasePage.User")}</h5>
                <button>
                  <img src={plusIcon} alt="plus icon" width={12} onClick={() => uploadSubmitClickHandler("documentUpload")} />
                </button>
              </div>
              <div>
                {files.length > 0 && files.map((file) => {
                  return <Pdf key={file.name} downloadStatus={false} name={file.name} onDeleteClick={() => setFiles([])} />
                })}
              </div>
            </div>
            <div className="user_addNewCase_form__submit_btn_div">
              <button
                type="button"
                // onClick={() => { uploadSubmitClickHandler("submit") }}>
                onClick={() => { addNewCase() }}>
                {t("UserPanel.Cases.AddNewCasePage.Submit")}
              </button>
              {/* {newCase.caseExistance === "existingCase" && (
                <p className="text-danger m-0">
                  {t("UserPanel.Cases.AddNewCasePage.PleaseUpload")}
                </p>
              )} */}
            </div>
          </div>
        </CardLayout>
        {isModalVisible && (
          <Modal toggleModal={toggleModal}>
            {(modalType === "documentUpload" ||
              modalType === "addressUpload") && (
                // <UploadModal
                //   modalType={modalType}
                //   onNationalAdressChange={newCaseInputHandler}
                //   nationalAddress={newCase.nationalAddress}
                //   toggleModal={toggleModal}
                // />
                <Dropzone
                  files={files}
                  setFiles={setFiles}
                  content={t(
                    "UserPanel.Cases.AddNewCasePage.ClickToUploadDocument"
                  )}
                />
              )}
            {modalType === "submit" && (
              <div className="user_submit_modal">
                <H3
                  text={t("UserPanel.Cases.AddNewCasePage.Agreement")}
                  className="text-center "
                />
                <p>{t("UserPanel.Cases.AddNewCasePage.AgreementText")}</p>
                <p>{t("UserPanel.Cases.AddNewCasePage.AgreementText")}</p>
                <div>
                  <p>{t("UserPanel.Cases.AddNewCasePage.Signature")}</p>
                  <Dropzone
                    files={files}
                    setFiles={setFiles}
                    content={t(
                      "UserPanel.Cases.AddNewCasePage.UploadDigitalSignature"
                    )}
                  />
                  {
                    files && files.map((file) => {
                      return <Pdf key={file.name} downloadStatus={false} name={file.name} size={file.size} />
                    })
                  }
                </div>
              </div>
            )}
            <div className="d-flex align-items-center justify-content-between mt-4 ">
              <Button1
                onClick={toggleModal}
                text={t("UserPanel.Cases.AddNewCasePage.Cancel")}
                color="gray"
              />
              <Button1
                onClick={addNewCase}
                text={t("UserPanel.Cases.AddNewCasePage.Submit")}
              />
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export default AddNewCase;
