import React, { useState } from "react";
import { Button1, H2, H3, InputBox } from "../../../user/components";
import { CardLayout } from "../../../user/containers";
import ClientAvatar from "./clientAvatar.png";
import "./Expert.css";
import axios from "axios";
import Dropzone from "../dropzone/Dropzone";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import AdressModal from "../../../../screens/signUp/adressModal/AdressModal";

const AddExpert = ({ type = "experts" }) => {
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_BASE_URL;
  const token = Cookies.get("token");

  const [isAdressModal, setIsAdressModal] = useState(true);
  const toggleAdressModal = () => {
    setIsAdressModal(!isAdressModal);
  };

  const [expertInfo, setExpertInfo] = useState({
    name: "",
    yearsOfExperience: "",
    expertise: "",
    email: "",
    phoneNo: "",
    nationalAddress: "",
    password: "",
    status: "active",
    clientType: "Non-Doctor",
    ContactNo: "",
  });
  const [errors, setErrors] = useState();

  const changeExpert = (e) => {
    setExpertInfo({
      ...expertInfo,
      [e.target.name]: e.target.value,
    });
  };

  // adress
  const [adressObj, setAdressObj] = useState({
    line1: "",
    city: "",
    state: "",
    country: "",
    zip: "",
  });
  const [adress, setadress] = useState("");

  const addExpert = async () => {
    await axios
      .post(
        baseURL + "/api/addexpert",
        {
          PhoneNo: expertInfo.phoneNo,
          UserPassword: expertInfo.password,
          Email: expertInfo.email,
          Experience: expertInfo.yearsOfExperience,
          ExpertName: expertInfo.name,
          Address: adress,
          Expertise: expertInfo.expertise,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        if (res.data.response.status) {
          enableUser(res.data.response.data.UserId);
          navigate("/admin/experts");
        } else {
          const { message } = res.data.response.data;
          if (message.includes("PhoneNo_UNIQUE")) {
            setErrors("Phone Number Already Exists");
          } else {
            setErrors("Email already Exists");
          }
        }
      });
  };

  const enableUser = async (UserId) => {
    await axios
      .post(
        baseURL + "/api/enableuser",
        {
          UserId: UserId,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
        if (res.data.response.status) {
        }
      });
  };

  const addClient = async () => {
    await axios
      .post(
        baseURL + "/api/addclient",
        {
          PhoneNo: expertInfo.phoneNo,
          UserPassword: expertInfo.password,
          Email: expertInfo.email,
          ClientName: expertInfo.name,
          Experience: expertInfo.yearsOfExperience,
          Address: expertInfo.nationalAddress,
          Speciality: expertInfo.expertise,
          Type: expertInfo.clientType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        if (res.data.response.status) {
          enableUser(res.data.response.data.UserId);
          navigate("/admin/clients");
        } else {
          const { message } = res.data.response.data;
          if (message.includes("PhoneNo_UNIQUE")) {
            setErrors("Phone Number Already Exists");
          } else {
            setErrors("Email already Exists");
          }
        }
      });
  };

  const handleSubmit = () => {
    // const phoneRegex = /^(?:\+966)?(?:00966)?(?:05)?[0-9]{8}$/;
    // if (!phoneRegex.test(expertInfo.phoneNo)) {
    //   setErrors("Invalid National ID");
    //   return;
    // }

    if (type === "experts") {
      addExpert();
    } else {
      addClient();
    }
    // type === "experts" ? addExpert : addClient
  };

  return (
    <>
      <H2 text={`Add ${type}`} className="mb-4"></H2>
      <CardLayout className="expertsCrd">
        <div className="expert_profile__info_div_outer mb-5">
          <H3 text={"Personal Information"} />
          <div className="expert_profile__info_div_inner">
            {/* <div className="expert_profile__picture_div">
                            <h5>{"Profile Picture"}</h5>
                            <Dropzone
                                content={<img src={ClientAvatar} alt="user" />}
                                className="align-items-start h-auto bg-transparent"
                            />
                            <img src={ClientAvatar} alt="" />
                        </div> */}
            <InputBox
              value={expertInfo.name}
              nameIdHtmlFor={"name"}
              label={"Name"}
              type={"text"}
              onChange={changeExpert}
            />
            <InputBox
              value={expertInfo.yearsOfExperience}
              nameIdHtmlFor={"yearsOfExperience"}
              label={"Years Of Experience"}
              type={"number"}
              onChange={changeExpert}
            />

            <div style={{ position: "relative" }}>
              <div className={`user_input_box`}>
                <label>Adress</label>
                <input
                  type="adress"
                  value={adress}
                  name="adress"
                  id="adress"
                  placeholder={"Adress"}
                  className={`w-100 p-2 pointer user_input_box_disabled`}
                  onClick={toggleAdressModal}
                  readOnly
                />
              </div>
              {isAdressModal || (
                <AdressModal
                  boolState={setIsAdressModal}
                  adress={adressObj}
                  handleAdress={setadress}
                  setAdress={setAdressObj}
                />
              )}
            </div>
            <InputBox
              value={expertInfo.expertise}
              nameIdHtmlFor={"expertise"}
              label={"Expertise"}
              type={"text"}
              onChange={changeExpert}
            />
            {type === "clients" && (
              <InputBox
                value={expertInfo.clientType}
                nameIdHtmlFor={"clientType"}
                label={"Type"}
                options={[
                  "Non-Doctor",
                  "Surgeon",
                  "Non-Surgeon",
                  "Aesthetic-Group",
                ]}
                type={"select"}
                onChange={changeExpert}
              />
            )}
          </div>
        </div>
        <H3 text={"Account Credentials"} />
        <div className="expert_profile__info_div_inner">
          <InputBox
            value={expertInfo.email}
            nameIdHtmlFor={"email"}
            label={"Email"}
            type={"email"}
            onChange={changeExpert}
          />
          <InputBox
            value={expertInfo.phoneNo}
            nameIdHtmlFor={"phoneNo"}
            label={"National ID"}
            type={"number"}
            onChange={changeExpert}
          />
          <InputBox
            value={expertInfo.ContactNo}
            nameIdHtmlFor={"ContactNo"}
            label={"Contact No"}
            type={"number"}
            onChange={changeExpert}
          />
          {/* <InputBox
                        value={expertInfo.nationalAddress}
                        nameIdHtmlFor={"nationalAddress"}
                        label={"National Address"}
                        type={"text"}
                        onChange={changeExpert}
                    /> */}
          <InputBox
            value={expertInfo.password}
            nameIdHtmlFor={"password"}
            label={"Password"}
            type={"password"}
            onChange={changeExpert}
          />
        </div>
        <div className="d-flex justify-content-end">
          <span className={`text-danger error-msg text-end mb-3`}>
            {errors}
          </span>
        </div>
        <div className="d-flex justify-content-end">
          {/* <NavLink to={`/admin/${type}`}> */}
          <Button1 text={"Add"} onClick={handleSubmit} />
          {/* </NavLink> */}
        </div>
      </CardLayout>
    </>
  );
};

export default AddExpert;
