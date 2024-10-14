import React, { useEffect, useRef, useState } from "react";
import "./index.css";
import { useTranslation } from "react-i18next";
import { Route, Routes } from "react-router-dom";
import { Header, Sidebar } from "./containers/";
import Modal from "../user/components/modal/Modal";
import dashboardVideo from '../../assets/signup/dashboard.mp4'
import {
  AddNewCase,
  Billing,
  CaseDetails,
  Cases,
  ChangePassword,
  Chat,
  Home,
  PackageDetails,
  Packages,
  Profile,
} from "./screens";
import { useSelector } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import useAuthentication from "../../hooks/useAuthentication";
import { notification } from "antd";

const User = () => {
  const userBaseMainRef = useRef(null);
  const lang = useSelector((state) => state.language.value);
  const { t } = useTranslation();
  const baseURL = import.meta.env.VITE_BASE_URL;
  const token = Cookies.get("token");
  const profession = Cookies.get("profession");
  const ClientId = Cookies.get("clientId");
  const authenticate = useAuthentication();

  const [cases, setCases] = useState([]);
  const [isSidebarHidden, setIsSidebarHidden] = useState(true);
  const [availablePackages, setAvailablePackages] = useState();
  const [chatCaseId, setChatCaseId] = useState();
  const [moveToTicket, setMoveToTicket] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarHidden((prevState) => !prevState);
  };

  const fetchCases = async () => {
    await axios
      .post(
        baseURL + "/api/getcasebyclient",
        {
          ClientId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setCases(response.data.response.data.reverse());
      });
  };

  const getPackagesByType = async () => {
    await axios
      .post(baseURL + "/api/getpackagebyusertype", {
        UserType: profession,
      })
      .then((res) => {
        console.log(res);
        setAvailablePackages(res.data.response.data);
      });
  };

  useEffect(() => {
    if (isSidebarHidden) {
      userBaseMainRef.current.classList.add("user_main_full_width");
    } else {
      userBaseMainRef.current.classList.remove("user_main_full_width");
    }
  }, [isSidebarHidden]);

  useEffect(() => {
    // setTimeout(() => {
    //   notification.config({
    //     duration: 3000,
    //   });
    //   notification.open({
    //     message: "Dummy Notification!",
    //     description: "Lorem is Lorem ipsum dolor sit amet, consectet"
    //   })
    // }, 5000);

    getPackagesByType();
    fetchCases();
  }, []);

  useEffect(() => {
    profession && getPackagesByType();
  }, [profession]);
  useEffect(() => {
    setIsModalVisible(true);
  }, []);
  const toggleVideoModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const [isModalVisible, setIsModalVisible] = useState(false);
  return (
    <>
      {isModalVisible && (
        <Modal toggleModal={toggleVideoModal} className="video_modal">
          <h3 className="mb-3">Learn how it works !</h3>
          <video
            src={dashboardVideo}
            className="actualVideo"
            autoPlay
            loop
            controls
          ></video>
        </Modal>
      )}
      <div className={`user_base ${lang === "ar" ? "user_base_ar" : " "}`}>
        <div className="user_base_inner">
          <Sidebar
            isSidebarHidden={isSidebarHidden}
            toggleSidebar={toggleSidebar}
          />
          <Header
            toggleSidebar={toggleSidebar}
            isSidebarHidden={isSidebarHidden}
          />
          <main
            ref={userBaseMainRef}
            className={`user_base_main ${lang === "ar" ? "user_base_main_ar" : ""
              }`}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/packages"
                element={
                  <>
                    <Packages availablePackages={availablePackages} />
                  </>
                }
              />
              <Route
                path="/packages/:packageId"
                element={
                  <>
                    <PackageDetails
                      setMoveToTicket={setMoveToTicket}
                      availablePackages={availablePackages}
                    />
                  </>
                }
              />
              <Route
                path="/cases"
                element={
                  <>
                    <Cases fetchCases={fetchCases} cases={cases} />
                  </>
                }
              />
              <Route
                path="/cases/add-new-case"
                element={
                  <>
                    <AddNewCase fetchCases={fetchCases} />
                  </>
                }
              />
              <Route
                path="/cases/:caseId"
                element={
                  <>
                    <CaseDetails setChatCaseId={setChatCaseId} />
                  </>
                }
              />
              {/* <Route path="/experts-chat" element={<Chat />} /> */}
              <Route
                path="/cases-chat"
                element={<Chat chatCaseId={chatCaseId} />}
              />
              <Route path="/admin-chat" element={<Chat />} />
              <Route
                path="/support"
                element={
                  <Chat
                    moveToTicket={moveToTicket}
                    setMoveToTicket={setMoveToTicket}
                  />
                }
              />
              <Route path="/billing" element={<Billing />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/change-password" element={<ChangePassword />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
};

export default User;
