import axios from 'axios';
import React, { useEffect, useState } from "react";
import "./profile.css";
import { CardLayout } from "../../containers";
import { H2, H3, InputBox, Button1, H4 } from "../../components";
import { user2Img } from "../../assets";
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { Alert, Snackbar } from '@mui/material';
import FileFinder from '../../../../components/custom/FileFinder';
import { Modal, Dropzone } from '../../../user/components';
import AdressModal from '../../../../screens/signUp/adressModal/AdressModal';

const Profile = ({ personalInfo, setPersonalInfo }) => {

  const baseURL = import.meta.env.VITE_BASE_URL;
  const token = Cookies.get('token');
  const ExpertId = Cookies.get('ExpertId');

  const navigate = useNavigate();

  const [imageData, setImageData] = useState();
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [workingHoursStartSt, setWorkingHoursStartSt] = useState({
    time: "10:00",
    amPm: "AM",
  });
  const [workingHoursEndSt, setWorkingHoursEndSt] = useState({
    time: "8:00",
    amPm: "AM",
  });
  const [adressObj, setAdressObj] = useState({
    line1: "",
    city: "",
    state: "",
    country: "",
    zip: "",
  });
  const [adress, setadress] = useState("");
  const [profilePic, setProfilePic] = useState();
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [imgFile, setImgFile] = useState([]);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const toggleUploadModal = () => {
    setIsUploadModalVisible((prevState) => !prevState);
  };

  const toggleAddressModal = () => {
    setIsModalVisible(!isModalVisible)
  }

  const handleClose = () => {
    setOpen(false)
  }
  const handleClose1 = () => {
    setOpen1(false)
  }

  const getExpertDetails = async () => {
    await axios.post(`${baseURL}/api/getexpertbyid`, {
      ExpertId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
      console.log(response.data);
      setPersonalInfo(response.data.response.data[0])
      setadress(response.data.response.data[0].Address)
    })
  }

  const infoChangeHandler = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  const timeChangeHandler = (e, type) => {
    if (type === "workingHoursStart") {
      setWorkingHoursStartSt({
        ...workingHoursStartSt,
        [e.target.name]: e.target.value,
      });
    } else if (type === "workingHoursEnd") {
      setWorkingHoursEndSt({
        ...workingHoursEndSt,
        [e.target.name]: e.target.value,
      });
    }
    setPersonalInfo({
      ...personalInfo,
      [type]: {
        ...personalInfo[type],
        [e.target.name]: e.target.value,
      },
    });
  };

  const getExpertProfileImg = async () => {
    await axios.post(baseURL + "/api/getexpertprofilepicture", {
      ExpertId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    }).then(res => {
      console.log(res);
      setImageData(res.data.response.data[0].ImageFile)
    })
  }

  const uploadImage = async (FileName) => {
    await axios.post(baseURL + "/api/uploadexpertprofileimage", {
      FileName,
      expertimage: imgFile[0]
    }, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      }
    }).then(res => {
      console.log(res);
      getExpertProfileImg();
      toggleUploadModal();
    })
  }

  const addProfileImage = async (fileName) => {

    await axios.post(baseURL + "/api/updateexperprofileimage", {
      ExpertId,
      ImageFile: fileName
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).then(res => {
      console.log(res);
      uploadImage(fileName)
    })
  }

  const updateExpertDetails = async () => {
    await axios.post(`${baseURL}/api/updateexpert`, {
      // ExpertId: 5,
      // ExpertName: personalInfo.ExpertName,
      // Valid: personalInfo.Valid,
      // Experience: personalInfo.Experience,
      // Email: personalInfo.Email,
      // PhoneNo: personalInfo.PhoneNo,
      // Expertise: personalInfo.Expertise,
      // StartTime: personalInfo.StartTime,
      // EndTime: personalInfo.EndTime,
      ...personalInfo,
      Address: adress,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
      console.log(response.data);
      getExpertDetails();
      setOpen(true)
    })
  }

  const sendOtp = async () => {
    await axios.post(baseURL + "/api/generateOTP", {
      PhoneNo: personalInfo.PhoneNo,
      Email: personalInfo.Email
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      setOpen1(true)
      console.log(res);
      const timer = setTimeout(() => {
        navigate("/expert/change-password")
      }, 3000);

      return () => clearTimeout(timer);
    })
  }

  useEffect(() => {
    getExpertDetails();
    getExpertProfileImg();
  }, []);


  useEffect(() => {
    if (adress) {
      const splitAdress = adress.split("/");
      setAdressObj({
        line1: splitAdress[0] || "",
        city: splitAdress[1] || "",
        state: splitAdress[2] || "",
        country: splitAdress[3] || "",
        zip: splitAdress[4] || "",
      })
    }
  }, [personalInfo])

  useEffect(() => {
    if (imgFile.length > 0) {
      const fileName = `${ExpertId}-${imgFile[0].name.split(" ").join("")}`;
      addProfileImage(fileName);
    }
  }, [imgFile])

  return (
    <>
      <div className="expert_profile">
        <H2 text={"Expert Profile"} />
        <CardLayout className="p-4 p-lg-5">
          <div className="expert_profile__info_div_outer">
            <H3 text={"Personal Information"} />
            <div className="expert_profile__info_div_inner">
              <div className="expert_profile__picture_div">
                <h5>{"Profile Picture"}</h5>
                <img className="pointer profile-pic"
                  onClick={() => {
                    toggleUploadModal();
                  }}
                  src={imageData ? `https://app.rasanllp.com/medical/profile/expert/${imageData}` : user2Img
                  }
                  alt="user"
                />
              </div>
              <InputBox
                value={personalInfo.ExpertName}
                nameIdHtmlFor={"ExpertName"}
                label={"Name"}
                type={"text"}
                onChange={infoChangeHandler}
              />
              <InputBox
                value={personalInfo.Experience}
                nameIdHtmlFor={"Experience"}
                label={"Years Of Experience"}
                type={"number"}
                onChange={infoChangeHandler}
              />
              <InputBox
                value={personalInfo.Expertise}
                nameIdHtmlFor={"Expertise"}
                label={"Expertise"}
                type={"text"}
                onChange={infoChangeHandler}
              />
              <div className='signup-form-input' style={{ position: 'relative' }}>
                <div
                  className={`user_input_box`}>
                  <label >National Address</label>
                  <input type="adress"
                    value={adress}
                    name="adress"
                    id="adress" placeholder={"National Address"}
                    className={`w-100 p-2 pointer user_input_box_disabled`}
                    onClick={toggleAddressModal}
                    readOnly
                  />
                </div>

                {
                  (isModalVisible) || <AdressModal boolState={setIsModalVisible} adress={adressObj} handleAdress={setadress} setAdress={setAdressObj} />
                }
              </div>
            </div>
          </div>
          <div className="expert_profile__info_div_outer mt-5">
            <H3 text={"Account Credentials"} />
            <div className="expert_profile__info_div_inner">
              <InputBox
                value={personalInfo.Email}
                nameIdHtmlFor={"Email"}
                label={"Email"}
                type={"email"}
                onChange={infoChangeHandler}
              />
              <InputBox
                value={personalInfo.PhoneNo}
                nameIdHtmlFor={"PhoneNo"}
                label={"Phone No"}
                type={"number"}
                onChange={infoChangeHandler}
              />
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
              Profile Updated
            </Alert>
          </Snackbar>
          <Snackbar open={open1} autoHideDuration={3000} onClose={handleClose1}>
            <Alert
              onClose={handleClose}
              // severity="success"
              variant="filled"
              style={{ background: "#2f4058" }}
              sx={{ width: '100%' }}
            >
              OTP Sent to Email
            </Alert>
          </Snackbar>
          <div className="expert_profile__info_div_outer mt-5">
            <H3 text={"Working Hours"} />
            <div className="expert_profile__info_div_inner">
              <InputBox
                values={[workingHoursStartSt.time, workingHoursStartSt.amPm]}
                names={["time", "amPm"]}
                label={"StartTime"}
                type={"time"}
                onChange={(e) => timeChangeHandler(e, "workingHoursStart")}
              />
              <InputBox
                values={[workingHoursEndSt.time, workingHoursEndSt.amPm]}
                names={["time", "amPm"]}
                label={"EndTime"}
                type={"time"}
                onChange={(e) => timeChangeHandler(e, "workingHoursEnd")}
              />
              {/* <InputBox
                value={personalInfo.Valid === 1 ? "active" : "inactive"}
                nameIdHtmlFor={"Valid"}
                label={"Status"}
                type={"select"}
                options={["active", "inactive"]}
                onChange={infoChangeHandler}
              /> */}
            </div>
          </div>
          <div>
            <Button1 text={"Save Changes"} onClick={updateExpertDetails} className="my-5 px-3 ms-auto " />
          </div>
          <div className="expert_profile__password_div">
            <H4 text={"Password"} className="mb-0" />
            {/* <Link
              to={"/expert/change-password"}
              className="expert_profile__password_link">

            </Link> */}
            <Button1 text={" Change Password"}
              onClick={sendOtp}
            />
          </div>
        </CardLayout>
        {isUploadModalVisible && (
          <Modal toggleModal={toggleUploadModal}>
            <Dropzone setFiles={setImgFile} content={"Click to Upload Document +"} />
            <div className="d-flex align-items-center justify-content-between mt-4 ">
              <Button1
                onClick={toggleUploadModal}
                text={"Cancel"}
                color="gray"
              />
              <Button1
                onClick={toggleUploadModal}
                text={"Submit"}
              />
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export default Profile;
