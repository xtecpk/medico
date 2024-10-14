import React, { useEffect, useState } from "react";
import {
  H2,
  Dropzone,
  Button1,
  Modal,
  InputBox,
  H4,
  H3,
} from "../../../user/components";
import { CardLayout } from "../../../user/containers";
import clientAvatar from "./clientAvatar.png";
import MembrshipDetails from "./MembrshipDetails";
import ContactInfo from "./ContactInfo";
import ClientCases from "./ClientCases";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import FileFinder from "../../../../components/custom/FileFinder";
import PaymentsDetails from "./PaymentsDetails";
import { Alert, Snackbar } from "@mui/material";

const ClientDetails = () => {
  const location = useLocation();
  const baseURL = import.meta.env.VITE_BASE_URL;
  const token = Cookies.get("token");
  const clientId = location.pathname.split("/").pop();

  const [refresher, setRefresher] = useState(1);
  const [clientInfo, setClientData] = useState();
  const [clientCases, setClientCases] = useState();
  const [membershipDetails, setMembershipDetails] = useState();
  const [userFiles, setUserFiles] = useState([]);
  const [imgFile, setImgFile] = useState([]);
  const [packages, setPackages] = useState([]);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [isResetPassVisible, setIsResetPassVisible] = useState(false);
  const toggleUploadModal = () => {
    setIsUploadModalVisible((prevState) => !prevState);
  };
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [imgPath, setImgPath] = useState();

  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
    error: null,
  });

  const handleChangePass = (event) => {
    setPasswords({
      ...passwords,
      [event.target.name]: event.target.value,
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const buttonsTxt = [
    "Membership",
    "Payment Details",
    "Contact Information",
    "Cases",
  ];

  const getClientbyId = async () => {
    await axios
      .post(
        baseURL + "/api/getclientbyid",
        {
          ClientId: clientId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setClientData(res.data.response.data[0]);
        getPackagesByType(res.data.response.data[0].Type);
      });
  };

  const getCasesOfCLient = async () => {
    await axios
      .post(
        baseURL + "/api/getcasebyclient",
        {
          ClientId: clientId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setClientCases(res.data.response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getMemberShipDetails = async () => {
    await axios
      .post(
        baseURL + "/api/getcontractbyclient",
        {
          ClientId: clientId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setMembershipDetails(
          res.data.response.data.filter((record) => record.Status == 1)[0]
        );
      });
  };

  const enableUser = async () => {
    await axios
      .post(
        baseURL + "/api/enableuser",
        {
          UserId: clientInfo.UserId,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
        if (res.data.response.status) {
          setMessage("Enabled");
          setOpen(true);
        }
      });
  };

  const disableUser = async () => {
    await axios
      .post(
        baseURL + "/api/disableuser",
        {
          UserId: clientInfo.UserId,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
        if (res.data.response.status) {
          setMessage("Disabled");
          setOpen(true);
        }
      });
  };

  const updateClientStatus = async (event) => {
    if (event.target.value == 1) {
      enableUser();
    } else {
      disableUser();
    }
    await axios
      .post(
        baseURL + "/api/updateclient",
        {
          ...clientInfo,
          Valid: event.target.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        getClientbyId();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getPackagesByType = async (type) => {
    await axios
      .post(
        baseURL + "/api/getpackagebyusertype",
        {
          UserType: type,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
        setPackages(res.data.response.data);
      });
  };

  const getClientDocuments = async () => {
    await axios
      .post(
        baseURL + "/api/getclientdocument",
        {
          ClientId: clientId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        setUserFiles(res.data.response.data);
        setRefresher(refresher + 1);
      });
  };

  const uploadClientImage = async (fileName) => {
    await axios
      .post(
        baseURL + "/api/uploadclientimage",
        {
          ClientFile: `${clientId}-${fileName}`,
          clientimage: imgFile[0],
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        toggleUploadModal();
        getClientDocuments();
        setImgFile([]);
        console.log(res);
      });
  };

  const addProfileImage = async () => {
    const fileName = `profileImg${imgFile[0].name.split(" ").join("")}`;
    console.log(fileName);
    await axios
      .post(
        baseURL + "/api/adddocumenttoclient",
        {
          ClientId: clientId,
          UploadedBy: "Admin",
          Status: 1,
          ClientFile: `${clientId}-${fileName}`,
          Description: `profile_pic of ${clientId}`,
          DocName: `${clientId}-${fileName}`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        uploadClientImage(fileName);
      });
  };

  const handleResetPassword = async () => {
    if (passwords.password !== passwords.confirmPassword) {
      setPasswords({
        ...passwords,
        error: "Passwords do not match",
      });
    } else {
      await axios
        .post(
          baseURL + "/api/resetpassword",
          {
            email: clientInfo.Email,
            newPassword: passwords.password,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log(res);
          setPasswords({
            password: "",
            confirmPassword: "",
            error: null,
          });
          setIsResetPassVisible(false);
          setMessage("Password Reset");
          setOpen(true);
        });
    }
  };

  useEffect(() => {
    getClientbyId();
    getCasesOfCLient();
    getMemberShipDetails();
    getClientDocuments();
  }, []);

  const [activeInx, setActiveIndx] = useState(0);

  const showContent = (index) => {
    setActiveIndx(index);
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
        // getClientDocuments();
      });
  };

  useEffect(() => {
    const profileImgId = FileFinder(
      `profile_pic of ${clientId}`,
      userFiles,
      true
    );

    if (imgFile.length > 0) {
      if (FileFinder(`profile_pic of ${clientId}`, userFiles)) {
        deleteClientDocument(profileImgId).then(() => addProfileImage());
      } else {
        addProfileImage();
      }
    }
  }, [imgFile]);

  return (
    <>
      <H2 text={"CLIENT"} className="mb-4" />
      <CardLayout className="mb-5">
        <div className="row">
          <div className="col-md-2">
            {refresher && (
              <img
                className="pointer profile-pic"
                onClick={() => {
                  toggleUploadModal();
                }}
                src={
                  (userFiles.length > 0 &&
                    (FileFinder(`profile_pic of ${clientId}`, userFiles)
                      ? `${baseURL}/client/${FileFinder(
                          `profile_pic of ${clientId}`,
                          userFiles
                        )}`
                      : clientAvatar)) ||
                  clientAvatar
                }
                alt="user"
              />
            )}
          </div>
          <div className="col-md-10">
            <div
              className="flex_box px-3"
              style={{ justifyContent: "space-between" }}
            >
              <div>
                <h5>{clientInfo ? clientInfo.ClientName : "Name"}</h5>
                <p className="blurTxt font-weight-bold">
                  {clientInfo ? clientInfo.Type : "Type"}
                </p>
              </div>
              <select
                name=""
                value={clientInfo && clientInfo.Valid}
                id=""
                onChange={updateClientStatus}
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-md-2">
            <p className="blurTxt headingBlur">SPECIALITY</p>
            <p>{clientInfo && clientInfo.Speciality}</p>
          </div>
          <div id="mid-line" className="col-md-1 mx-5"></div>
          <div className="col-md-3" style={{ marginLeft: "2rem" }}>
            <p className="blurTxt headingBlur">YEAR OF EXPERIENCE</p>
            <p>{clientInfo && clientInfo.Experience}</p>
          </div>
          <div className="col-md-5 d-flex justify-content-end align-items-center">
            <Button1
              text={"Reset Password"}
              onClick={() => setIsResetPassVisible(true)}
            />
          </div>
        </div>
      </CardLayout>

      <div className="row mt-3">
        <div className="col-md-3 buttonsBox">
          {buttonsTxt.map((text, index) => {
            return (
              <button
                className={`user_sidebar__link ${
                  activeInx === index
                    ? "user_sidebar__link--active"
                    : "bg-white"
                }`}
                onClick={() => showContent(index)}
              >
                {text}
              </button>
            );
          })}
        </div>
        <div className="col-md-9">
          {activeInx === 0 ? (
            <MembrshipDetails
              getMemberShipDetails={getMemberShipDetails}
              packages={packages}
              membership={membershipDetails}
            />
          ) : activeInx === 1 ? (
            <PaymentsDetails />
          ) : activeInx === 2 ? (
            <ContactInfo
              phNo={clientInfo && clientInfo.PhoneNo}
              adress={clientInfo && clientInfo.Address}
              email={clientInfo && clientInfo.Email}
              getClientDocuments={getClientDocuments}
              contact={clientInfo && clientInfo.ContactNo}
              userFiles={userFiles}
              userId={clientInfo && clientInfo.UserId}
            />
          ) : (
            <ClientCases cases={clientCases} />
          )}
        </div>
        {isUploadModalVisible && (
          <Modal toggleModal={toggleUploadModal}>
            <Dropzone
              content={"Click to Upload Document +"}
              setFiles={setImgFile}
            />
            <div className="d-flex align-items-center justify-content-between mt-4 ">
              <Button1
                onClick={toggleUploadModal}
                text={"Cancel"}
                color="gray"
              />
              <Button1 onClick={toggleUploadModal} text={"Submit"} />
            </div>
          </Modal>
        )}
        {isResetPassVisible && (
          <Modal toggleModal={() => setIsResetPassVisible(false)}>
            <H3 text={"Reset Password"} />
            <InputBox
              type={"password"}
              className="my-3"
              value={passwords.password}
              nameIdHtmlFor={"password"}
              placeholder={"Password"}
              onChange={handleChangePass}
            />
            <InputBox
              type={"password"}
              value={passwords.confirmPassword}
              nameIdHtmlFor={"confirmPassword"}
              placeholder={"Confirm Password"}
              onChange={handleChangePass}
            />
            <p className="mt-3 error-msg">{passwords.error}</p>
            <div className="d-flex align-items-center justify-content-between mt-4 ">
              <Button1
                onClick={() => setIsResetPassVisible(false)}
                text={"Cancel"}
                color="gray"
              />
              <Button1 onClick={handleResetPassword} text={"Reset Password"} />
            </div>
          </Modal>
        )}
      </div>

      <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          variant="filled"
          style={{ background: "#2f4058" }}
          sx={{ width: "100%" }}
        >
          Client {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ClientDetails;
