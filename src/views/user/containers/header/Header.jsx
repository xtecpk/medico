import React, { useEffect, useState } from "react";
import "./header.css";
import { LanguageToggle, UserPicCard } from "../../components";
import { barsIcon, xIcon } from "../../assets";
import { useSelector } from "react-redux";
import NotificationsBox from "../NotificationsSection/NotificationsBox";
import { useLocation } from "react-router-dom";
import { notification } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import notification_sound from "../../../../assets/notification_sound/notification_sound.wav"

const Header = ({ toggleSidebar, isSidebarHidden }) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const lang = useSelector((state) => state.language.value);
  const role = useLocation().pathname.split("/")[1];
  const token = Cookies.get('token')
  const clientId = Cookies.get("clientId")
  const expertId = Cookies.get("ExpertId")

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState([]);
  const [isPicCardExpanded, setIsPicCardExpanded] = useState(false);
  const [isMesgBoxExpanded, setIsMesgBoxExpanded] = useState(false);
  const [isLanguageToggleExpanded, setIsLanguageToggleExpanded] =
    useState(false);


  const getAdminNotifications = async () => {
    await axios.post(baseURL + "/api/getnotificationbyreceivertype", {
      ReceiverType: role
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      setNotifications(res.data.response.data.reverse());
    })
  }

  const getUserNotifications = async () => {
    await axios.post(baseURL + "/api/getnotificationbyreceiverid", {
      ReceiverId: role === "expert" ? expertId : clientId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      setNotifications(res.data.response.data.reverse());
    })
  }

  useEffect(() => {
    role === "admin" ? getAdminNotifications() : getUserNotifications();

    const intervalId = setInterval(() => {
      role === "admin" ? getAdminNotifications() : getUserNotifications();
    }, 9000);

    return () => clearInterval(intervalId);
  }, [])

  useEffect(() => {
    setShowNotifications(notifications.filter(notification => notification.ReadStatus === 0))
  }, [notifications])

  useEffect(() => {
    if (showNotifications.length > 0)
      document.getElementById("notificationSound").play()
    for (const notificatio_item of showNotifications) {
      notification.config({
        duration: 4
      })
      notification.open({
        message: notificatio_item.NotificationTitle,
        description: notificatio_item.Message,
      });
    }
  }, [showNotifications.length])

  return (
    <>
      <div className="user_header"></div>
      <button
        className={`user_header_bars_btn ${lang === "ar" ? "user_header_bars_btn_ar" : ""
          }`}
        onClick={toggleSidebar}>
        <img src={isSidebarHidden ? barsIcon : xIcon} alt="ham icon" />
      </button>

      <audio id="notificationSound" src={notification_sound} preload="auto"></audio>

      <div className={` ${lang === "ar" ? "right_headerBox_ar" : "right_headerBox"}`}>
        <UserPicCard
          isPicCardExpanded={isPicCardExpanded}
          setIsPicCardExpanded={setIsPicCardExpanded}
          setIsMesgBoxExpanded={setIsMesgBoxExpanded}
          isLanguageToggleExpanded={isLanguageToggleExpanded}
          setIsLanguageToggleExpanded={setIsLanguageToggleExpanded}
        />
        <NotificationsBox
          setIsPicCardExpanded={setIsPicCardExpanded}
          setIsMesgBoxExpanded={setIsMesgBoxExpanded}
          isMesgBoxExpanded={isMesgBoxExpanded}
          setIsLanguageToggleExpanded={setIsLanguageToggleExpanded}
          notifications={notifications}
          unreadNotificationsCount={showNotifications.length}
          getNotifications={role === "admin" ? getAdminNotifications : getUserNotifications}
        />
        {
          role === "user" && <LanguageToggle
            isPicCardExpanded={isPicCardExpanded}
            setIsPicCardExpanded={setIsPicCardExpanded}
            isLanguageToggleExpanded={isLanguageToggleExpanded}
            setIsMesgBoxExpanded={setIsMesgBoxExpanded}
            setIsLanguageToggleExpanded={setIsLanguageToggleExpanded}
          />
        }
      </div>
    </>
  );
};

export default Header;
