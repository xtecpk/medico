import React, { useEffect, useState } from "react";
import "./profile.css";
import { CardLayout } from "../../containers";
import {
  H2,
  H3,
  InputBox,
  Dropzone,
  Button1,
  ProfileUploadBox,
  UploadModal,
  Modal,
} from "../../components";
import { dummyImg, user2Img } from "../../assets";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Cookies from "js-cookie";
import DocumentUpload from "./DocumentUpload";
import FileFinder from "../../../../components/custom/FileFinder";
import { Alert, Snackbar } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AdressModal from "../../../../screens/signUp/adressModal/AdressModal";
import { useSelector } from "react-redux";
import SignaturePad from "../../../../components/signaturePad/SignaturePad";
import DateFormatForServer from "../../../../components/custom/DateFormatForServer";

const Profile = () => {
  const { t } = useTranslation();
  const baseURL = import.meta.env.VITE_BASE_URL;
  const token = Cookies.get("token");
  const ClientId = Cookies.get("clientId");
  const navigate = useNavigate();
  const location = useLocation().pathname.split("/")[2];
  const userId = Cookies.get("userId");
  const lang = useSelector((state) => state.language.value);

  const [editAllowed, setEditAllowed] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [adressObj, setAdressObj] = useState({
    line1: "",
    city: "",
    state: "",
    country: "",
    zip: "",
  });
  const [adress, setadress] = useState("");
  const [personalInfo, setPersonalInfo] = useState({
    ClientName: "",
    Experience: "",
    Speciality: "",
    Email: "",
    PhoneNo: "",
    Address: "",
  });
  const [files, setFiles] = useState([]);
  const [showSignaturePad, setShowSignaturePad] = useState(false);

  const toggleSignaturePad = () => {
    setShowSignaturePad(!showSignaturePad);
  };
  const [uploadSignatureError, setUploadSignatureError] = useState(false);
  const [docName, setDocName] = useState();
  const [signature, setSignature] = useState([]);
  const [signatureFile, setSignatureFile] = useState([]);
  const [userFiles, setUserFiles] = useState([]);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [signModalVisible, setSignModalVisible] = useState(false);

  const toggleSignModal = () => {
    setSignModalVisible(!signModalVisible);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const handleClose3 = () => {
    setOpen3(false);
  };

  const getSignature = async () => {
    await axios
      .post(
        baseURL + "/api/getsignfile",
        {
          UserId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        setSignature(
          res.data.response.data.result.length > 0 &&
            res.data.response.data.result[0].SignatureImage
        );
      });
  };

  const getCLientInfo = async () => {
    await axios
      .post(
        baseURL + "/api/getclientbyid",
        {
          ClientId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        setPersonalInfo(res.data.response.data[0]);
        // setadress(res.data.response.data[0].Address)
      });
  };

  const infoChangeHandler = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const toggleUploadModal = () => {
    setIsUploadModalVisible((prevState) => !prevState);
  };

  const disAllowToEdit = async () => {
    await axios
      .post(
        baseURL + "/api/updateallowclientedit",
        {
          ClientId,
          AllowEdit: 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        getCLientInfo();
      });
  };

  const uploadSignature = async () => {
    if (signatureFile.length > 0) {
      const fileName = signatureFile[0].name.split(" ").join("");

      await axios
        .post(
          baseURL + "/api/addusersignature",
          {
            UserId: userId,
            ImageFile: `${userId}_${fileName}`,
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        .then(async (res) => {
          console.log(res.data);
          if (res.data.response.status) {
            await axios
              .post(
                baseURL + "/api/uploadsignature",
                {
                  ImageFile: `${userId}_${fileName}`,
                  signimage: signatureFile[0],
                },
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: "Bearer " + token,
                  },
                }
              )
              .then((res) => {
                console.log(res.data);
              });
          }
        });
    }
  };

  const updateClientInfo = async () => {
    await axios
      .post(
        baseURL + "/api/updateclient",
        {
          ...personalInfo,
          Address: adress,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        setOpen(true);
        disAllowToEdit();
      });
  };

  const getClientDocuments = async () => {
    await axios
      .post(
        baseURL + "/api/getclientdocument",
        {
          ClientId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setUserFiles(res.data.response.data);
      });
  };

  const addNotification = async () => {
    await axios.post(
      baseURL + "/api/addnotification",
      {
        Title: "Profile Edit Request",
        Message: `${personalInfo.ClientName} wants to edit his Profile`,
        NotificationType: "Reqest",
        ReceiverId: 13,
        ReceiverType: "admin",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const addEditRequest = async () => {
    await axios
      .post(
        baseURL + "/api/addeditprofilerequest",
        {
          ClientId,
          RequestDate: DateFormatForServer(Date()),
          Display: "None",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setOpen3(true);
        addNotification();
      });
  };

  const sendOtp = async () => {
    await axios
      .post(
        baseURL + "/api/generateOTP",
        {
          PhoneNo: personalInfo.PhoneNo,
          Email: personalInfo.Email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setOpen1(true);
        const timer = setTimeout(() => {
          navigate("/user/change-password");
        }, 3000);

        return () => clearTimeout(timer);
      });
  };

  const deleteClientDocument = async (docId) => {
    await axios
      .post(
        baseURL + "/api/deletedocumentfromclient",
        {
          DocumentId: docId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setOpen2(true);
        getClientDocuments();
      });
  };

  useEffect(() => {
    if (adress) {
      const splitAdress = adress.split("/");
      setAdressObj({
        line1: splitAdress[0] || "",
        city: splitAdress[1] || "",
        state: splitAdress[2] || "",
        country: splitAdress[3] || "",
        zip: splitAdress[4] || "",
      });
    }
  }, [personalInfo]);

  const agreeAndSubmitHandler = () => {
    if (signatureFile.length === 0) {
      setUploadSignatureError(true);
      return;
    }
    uploadSignature().then(() => {
      setUploadSignatureError(false);
      toggleSignModal();
    });
    // Submit
  };

  useEffect(() => {
    getCLientInfo();
    getClientDocuments();
    getSignature();
  }, []);

  useEffect(() => {
    setEditAllowed(Boolean(personalInfo.AllowEdit) || false);
  }, [personalInfo]);

  // useEffect(() => {
  //   uploadSignature().then(getSignature);
  // }, [signatureFile])

  console.log(personalInfo);

  return (
    <>
      <div className="user_profile">
        <H2 text={t("UserPanel.Profile.UserProfile")} />
        <CardLayout className="p-4 p-lg-5">
          <div className="user_profile__info_div_outer">
            <H3 text={t("UserPanel.Profile.PersonalInformation")} />
            <div className="user_profile__personal_info_div">
              <div className="user_profile__picture_div">
                <h5>{t("UserPanel.Profile.ProfilePicture")}</h5>
                <img
                  className="pointer profile-pic"
                  onClick={
                    editAllowed &&
                    (() => {
                      toggleUploadModal();
                      setDocName("profile_pic");
                    })
                  }
                  src={
                    userFiles.length > 0
                      ? FileFinder(`profile_pic of ${ClientId}`, userFiles)
                        ? `${baseURL}/client/${FileFinder(
                            `profile_pic of ${ClientId}`,
                            userFiles
                          )}`
                        : user2Img
                      : user2Img
                  }
                  alt="user"
                />
              </div>
              <InputBox
                value={personalInfo && personalInfo.ClientName}
                nameIdHtmlFor={"ClientName"}
                label={t("UserPanel.Profile.Name")}
                type={"text"}
                onChange={infoChangeHandler}
                disabled={true}
              />
              <InputBox
                value={personalInfo && personalInfo.Experience}
                nameIdHtmlFor={"Experience"}
                label={t("UserPanel.Profile.YearsOfExperience")}
                type={"number"}
                onChange={infoChangeHandler}
                disabled={!editAllowed}
              />
              <InputBox
                value={personalInfo && personalInfo.Speciality}
                nameIdHtmlFor={"Speciality"}
                label={t("UserPanel.Profile.Speciality")}
                type={"text"}
                onChange={infoChangeHandler}
                disabled={!editAllowed}
              />
              <div
                className="signup-form-input"
                style={{ position: "relative" }}
              >
                <div className={`user_input_box`}>
                  <label>Adress</label>
                  <input
                    type="adress"
                    value={adress}
                    name="adress"
                    id="adress"
                    placeholder={t("SignUp.Placeholders.Adress")}
                    className={`w-100 p-2 pointer user_input_box_disabled`}
                    onClick={
                      editAllowed && (() => setIsModalVisible(!isModalVisible))
                    }
                    dir={`${lang === "en" ? "ltr" : "rtl"}`}
                    readOnly
                  />
                </div>

                {isModalVisible || (
                  <AdressModal
                    boolState={setIsModalVisible}
                    adress={adressObj}
                    handleAdress={setadress}
                    setAdress={setAdressObj}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="user_profile__info_div_outer mt-5">
            <H3 text={t("UserPanel.Profile.AccountCredentials")} />
            <div className="user_profile__personal_info_div">
              <InputBox
                value={personalInfo && personalInfo.Email}
                nameIdHtmlFor={"Email"}
                label={t("UserPanel.Profile.Email")}
                type={"email"}
                onChange={infoChangeHandler}
                disabled={!editAllowed}
              />
              <InputBox
                value={personalInfo && personalInfo.ContactNo}
                nameIdHtmlFor={"ContactNo"}
                label={t("UserPanel.Profile.PhoneNo")}
                type={"number"}
                onChange={infoChangeHandler}
                disabled={!editAllowed}
              />
              <InputBox
                value={personalInfo && personalInfo.PhoneNo}
                nameIdHtmlFor={"contactNo"}
                label={t("UserPanel.Profile.NationalID")}
                type={"number"}
                onChange={infoChangeHandler}
                disabled={!editAllowed}
              />
            </div>
          </div>
          <div className="my-5">
            {editAllowed ? (
              <Button1
                text={t("UserPanel.Profile.SaveChanges")}
                onClick={updateClientInfo}
                className="ms-auto "
              />
            ) : (
              <Button1
                text={t("UserPanel.Profile.RequestEdit")}
                onClick={addEditRequest}
                className="ms-auto "
              />
            )}
          </div>
          <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              // severity="success"
              variant="filled"
              style={{ background: "#2f4058" }}
              sx={{ width: "100%" }}
            >
              Profile Updated
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
              OTP Sent to Email
            </Alert>
          </Snackbar>

          <Snackbar open={open2} autoHideDuration={3000} onClose={handleClose2}>
            <Alert
              onClose={handleClose2}
              // severity="success"
              variant="filled"
              style={{ background: "#2f4058" }}
              sx={{ width: "100%" }}
            >
              Document Deleted!
            </Alert>
          </Snackbar>

          <Snackbar open={open3} autoHideDuration={3000} onClose={handleClose3}>
            <Alert
              onClose={handleClose3}
              // severity="success"
              variant="filled"
              style={{ background: "#2f4058" }}
              sx={{ width: "100%" }}
            >
              Request Sent!
            </Alert>
          </Snackbar>
          <ProfileUploadBox
            text={t("UserPanel.Profile.SCFHSCopy")}
            buttonText={
              FileFinder(`SCFHS-Registration of ${ClientId}`, userFiles)
                ? t("UserPanel.Profile.Download")
                : t("UserPanel.Profile.Upload")
            }
            onClick={
              !FileFinder(`SCFHS-Registration of ${ClientId}`, userFiles) &&
              (() => {
                toggleUploadModal();
                setDocName("SCFHS-Registration");
              })
            }
            onDelete={
              editAllowed &&
              FileFinder(`SCFHS-Registration of ${ClientId}`, userFiles) &&
              (() =>
                deleteClientDocument(
                  FileFinder(
                    `SCFHS-Registration of ${ClientId}`,
                    userFiles,
                    true
                  )
                ))
            }
            buttonType={
              FileFinder(`SCFHS-Registration of ${ClientId}`, userFiles)
                ? "link"
                : "button"
            }
            to={
              FileFinder(`SCFHS-Registration of ${ClientId}`, userFiles) &&
              `${baseURL}/client/${FileFinder(
                `SCFHS-Registration of ${ClientId}`,
                userFiles
              )}`
            }
            image={
              userFiles.length > 0 &&
              FileFinder(`SCFHS-Registration of ${ClientId}`, userFiles) &&
              `${baseURL}/client/${FileFinder(
                `SCFHS-Registration of ${ClientId}`,
                userFiles
              )}`
            }
          />

          <ProfileUploadBox
            text={t("UserPanel.Profile.MedicalCopy")}
            buttonText={
              FileFinder(
                `Medical-Malpractice-Insurance of ${ClientId}`,
                userFiles
              )
                ? t("UserPanel.Profile.Download")
                : t("UserPanel.Profile.Upload")
            }
            onClick={
              !FileFinder(
                `Medical-Malpractice-Insurance of ${ClientId}`,
                userFiles
              ) &&
              (() => {
                toggleUploadModal();
                setDocName("Medical-Malpractice-Insurance");
              })
            }
            onDelete={
              editAllowed &&
              FileFinder(
                `Medical-Malpractice-Insurance of ${ClientId}`,
                userFiles
              ) &&
              (() =>
                deleteClientDocument(
                  FileFinder(
                    `Medical-Malpractice-Insurance of ${ClientId}`,
                    userFiles,
                    true
                  )
                ))
            }
            buttonType={
              FileFinder(
                `Medical-Malpractice-Insurance of ${ClientId}`,
                userFiles
              )
                ? "link"
                : "button"
            }
            to={
              FileFinder(
                `Medical-Malpractice-Insurance of ${ClientId}`,
                userFiles
              ) &&
              `${baseURL}/client/${FileFinder(
                `Medical-Malpractice-Insurance of ${ClientId}`,
                userFiles
              )}`
            }
            image={
              userFiles.length > 0 &&
              FileFinder(
                `Medical-Malpractice-Insurance of ${ClientId}`,
                userFiles
              ) &&
              `${baseURL}/client/${FileFinder(
                `Medical-Malpractice-Insurance of ${ClientId}`,
                userFiles
              )}`
            }
          />

          <ProfileUploadBox
            text={t("UserPanel.Profile.GovernmentId")}
            buttonText={
              FileFinder(`Government-ID of ${ClientId}`, userFiles)
                ? t("UserPanel.Profile.Download")
                : t("UserPanel.Profile.Upload")
            }
            onClick={
              !FileFinder(`Government-ID of ${ClientId}`, userFiles) &&
              (() => {
                toggleUploadModal();
                setDocName("Government-ID");
              })
            }
            onDelete={
              editAllowed &&
              FileFinder(`Government-ID of ${ClientId}`, userFiles) &&
              (() =>
                deleteClientDocument(
                  FileFinder(`Government-ID of ${ClientId}`, userFiles, true)
                ))
            }
            buttonType={
              FileFinder(`Government-ID of ${ClientId}`, userFiles)
                ? "link"
                : "button"
            }
            to={
              FileFinder(`Government-ID of ${ClientId}`, userFiles) &&
              `${baseURL}/client/${FileFinder(
                `Government-ID of ${ClientId}`,
                userFiles
              )}`
            }
            image={
              userFiles.length > 0 &&
              FileFinder(`Government-ID of ${ClientId}`, userFiles) &&
              `${baseURL}/client/${FileFinder(
                `Government-ID of ${ClientId}`,
                userFiles
              )}`
            }
          />

          <ProfileUploadBox
            text={t("UserPanel.Profile.Passport")}
            buttonText={
              FileFinder(`Passport of ${ClientId}`, userFiles)
                ? t("UserPanel.Profile.Download")
                : t("UserPanel.Profile.Upload")
            }
            onClick={
              !FileFinder(`Passport of ${ClientId}`, userFiles) &&
              (() => {
                toggleUploadModal();
                setDocName("Passport");
              })
            }
            onDelete={
              editAllowed &&
              FileFinder(`Passport of ${ClientId}`, userFiles) &&
              (() =>
                deleteClientDocument(
                  FileFinder(`Passport of ${ClientId}`, userFiles, true)
                ))
            }
            buttonType={
              FileFinder(`Passport of ${ClientId}`, userFiles)
                ? "link"
                : "button"
            }
            to={
              FileFinder(`Passport of ${ClientId}`, userFiles) &&
              `${baseURL}/client/${FileFinder(
                `Passport of ${ClientId}`,
                userFiles
              )}`
            }
            image={
              userFiles.length > 0 &&
              FileFinder(`Passport of ${ClientId}`, userFiles) &&
              `${baseURL}/client/${FileFinder(
                `Passport of ${ClientId}`,
                userFiles
              )}`
            }
          />

          <ProfileUploadBox
            text={t("UserPanel.Profile.NationalAddressProof")}
            buttonText={
              FileFinder(`National-Adress of ${ClientId}`, userFiles)
                ? t("UserPanel.Profile.Download")
                : t("UserPanel.Profile.Upload")
            }
            onClick={
              !FileFinder(`National-Adress of ${ClientId}`, userFiles) &&
              (() => {
                toggleUploadModal();
                setDocName("National-Adress");
              })
            }
            onDelete={
              editAllowed &&
              FileFinder(`National-Adress of ${ClientId}`, userFiles) &&
              (() =>
                deleteClientDocument(
                  FileFinder(`National-Adress of ${ClientId}`, userFiles, true)
                ))
            }
            buttonType={
              FileFinder(`National-Adress of ${ClientId}`, userFiles)
                ? "link"
                : "button"
            }
            to={
              FileFinder(`National-Adress of ${ClientId}`, userFiles) &&
              `${baseURL}/client/${FileFinder(
                `National-Adress of ${ClientId}`,
                userFiles
              )}`
            }
            image={
              userFiles.length > 0 &&
              FileFinder(`National-Adress of ${ClientId}`, userFiles) &&
              `${baseURL}/client/${FileFinder(
                `National-Adress of ${ClientId}`,
                userFiles
              )}`
            }
          />
          {/* <ProfileUploadBox
            text={t("UserPanel.Profile.Agreement")}
            buttonText={FileFinder(`Agreement of ${ClientId}`, userFiles) ? t("UserPanel.Profile.Download") : t("UserPanel.Profile.Upload")}
            onClick={!FileFinder(`Agreement of ${ClientId}`, userFiles) && (() => {
              toggleUploadModal()
              setDocName("Agreement")
            })}
            buttonType={FileFinder(`Agreement of ${ClientId}`, userFiles) ? "link" : "button"}
            to={FileFinder(`Agreement of ${ClientId}`, userFiles) && `${baseURL}/client/${FileFinder(`Agreement of ${ClientId}`, userFiles)}`}
            image={userFiles.length > 0 && (FileFinder(`Agreement of ${ClientId}`, userFiles) && `${baseURL}/client/${FileFinder(`Agreement of ${ClientId}`, userFiles)}`)}
          /> */}
          <ProfileUploadBox
            text={t("UserPanel.Cases.AddNewCasePage.Signature")}
            buttonText={
              signature
                ? t("UserPanel.Profile.Download")
                : t("UserPanel.Profile.Upload")
            }
            buttonType={signature ? "link" : "button"}
            onClick={!signature && toggleSignModal}
            image={`${baseURL}/signs/${signature}`}
            to={`${baseURL}/signs/${signature}`}
          />
          <ProfileUploadBox
            text={t("UserPanel.Profile.Password")}
            buttonText={t("UserPanel.Profile.ChangePassword")}
            buttonType="button"
            onClick={() => {
              // navigate("/user/change-password")
              sendOtp();
            }}
          />
        </CardLayout>

        {showSignaturePad && (
          <Modal toggleModal={toggleSignaturePad}>
            <SignaturePad
              toggleModal={() => {
                toggleSignaturePad();
                toggleSignModal();
              }}
              signatre={setSignatureFile}
            />
          </Modal>
        )}

        {isUploadModalVisible && (
          <Modal toggleModal={toggleUploadModal}>
            <DocumentUpload
              toggleUploadModal={toggleUploadModal}
              id={docName}
              docName={docName}
              getDocuments={getClientDocuments}
              profileDocs={userFiles}
              content={t(
                "UserPanel.Cases.AddNewCasePage.ClickToUploadDocument1"
              )}
              // setProfileDocs={setProfileDocs}
            />
            <div className="d-flex align-items-center justify-content-between mt-4 ">
              <Button1
                onClick={toggleUploadModal}
                text={t("UserPanel.Cases.AddNewCasePage.Cancel")}
                color="gray"
              />
              <Button1
                onClick={toggleUploadModal}
                text={t("UserPanel.Cases.AddNewCasePage.Submit")}
              />
            </div>
          </Modal>
        )}

        {signModalVisible && (
          <Modal toggleModal={toggleSignModal}>
            <div className="user_submit_modal">
              <H3
                text={t("SignUp.TermsAndConditions")}
                className="text-center "
              />
              <p className={lang === "en" ? "text-start" : "text-end"}>
                {t("SignUp.TermsAndConditionsText")}
              </p>
              <div>
                <p>{t("UserPanel.Cases.AddNewCasePage.Signature")}</p>
                {!signatureFile.length > 0 && (
                  <Dropzone
                    files={signatureFile}
                    setFiles={setSignatureFile}
                    content={t(
                      "UserPanel.Cases.AddNewCasePage.UploadDigitalSignature"
                    )}
                  />
                )}
                {!signatureFile.length > 0 && (
                  <p
                    className={`text-danger error-msg ${
                      lang === "en" ? "" : "text-end"
                    }`}
                  >
                    {t("SignUp.Errors.UploadSignatureError")}
                  </p>
                )}
                <div className="mt-3">
                  {signatureFile.length > 0 ? (
                    <H3 text={t("SignUp.Errors.SignUploaded")} />
                  ) : (
                    <>
                      <p>{t("SignUp.Errors.or")}</p>
                      <Link
                        className="change-package-link"
                        onClick={() => {
                          toggleSignaturePad();
                          toggleSignModal();
                        }}
                      >
                        {t("SignUp.Errors.DrawSignature")}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between mt-4 ">
              <Button1
                onClick={toggleSignModal}
                text={t("UserPanel.Cases.AddNewCasePage.Cancel")}
                color="gray"
              />
              <Button1
                onClick={agreeAndSubmitHandler}
                text={t("SignUp.AgreeAndSubmit")}
              />
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export default Profile;
