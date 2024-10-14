import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { GoBellFill } from "react-icons/go";
import "./NotificationsBox.css";
import { H3, H4 } from "../../components";
import {
  DateFormatForUser,
  getTime,
} from "../../../../components/custom/DateFormatForServer";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { IoMailOpenOutline } from "react-icons/io5";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const notificationRoutes = [
  {
    title: "Bank Payment",
    path: "/payments",
  },
  {
    title: "SignUp New User",
    path: "/clients",
  },
  {
    title: "Profile Edit Request",
    path: "/profile-requests",
  },
  {
    title: "Ticket Added",
    path: "/support",
  },
  {
    title: "Assigned Case",
    path: "/cases",
  },
  {
    title: "Case Added",
    path: "/cases",
  },
];

const NotificationsBox = ({
  isMesgBoxExpanded,
  setIsPicCardExpanded,
  setIsMesgBoxExpanded,
  setIsLanguageToggleExpanded,
  notifications = [],
  getNotifications,
  unreadNotificationsCount = 0,
}) => {
  const token = Cookies.get("token");
  const baseURL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const toggleMsgBox = () => {
    setIsMesgBoxExpanded(!isMesgBoxExpanded);
    setIsLanguageToggleExpanded(false);
    setIsPicCardExpanded(false);
  };

  const bellIconRef = useRef(null);
  const boxRef = useRef(null);

  const closePop = (e) => {
    if (
      bellIconRef.current &&
      (bellIconRef.current.contains(e.target) ||
        bellIconRef.current == e.target)
    ) {
      setIsMesgBoxExpanded(!isMesgBoxExpanded);
    } else {
      setIsMesgBoxExpanded(false);
    }
  };

  useEffect(() => {
    document.body.addEventListener("click", closePop);

    return () => {
      document.body.removeEventListener("click", closePop);
    };
  }, [isMesgBoxExpanded]);

  const lang = useSelector((state) => state.language.value);

  const readNotification = async (notificationId) => {
    await axios
      .post(
        baseURL + "/api/updatereadflag",
        {
          NotificationId: notificationId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        getNotifications();
      });
  };

  return (
    <div
      ref={bellIconRef}
      className={`mx-2 p-2  user_pic_card_outer ${
        lang === "ar" ? "user_pic_card_outer_ar" : ""
      }`}
    >
      <div className="notification_bell ">
        {unreadNotificationsCount > 0 && (
          <div className="notications_count">
            <p>{unreadNotificationsCount}</p>
          </div>
        )}
        <GoBellFill className="pointer" fontSize={20} />
      </div>

      {isMesgBoxExpanded && (
        <div className="user_pic_card__dropdown border" ref={boxRef}>
          <div className="messagesBox mb-3">
            <H3 text={"Notifications"} className="mb-3 mx-3 mt-3 " />

            <div className="notification_box px-3">
              {notifications.length > 0 ? (
                notifications.map((notification) => {
                  const route = notificationRoutes.find(
                    (route) => route.title === notification.NotificationTitle
                  );
                  return (
                    <>
                      <div
                        className={`notification_info pointer ${
                          notification.ReadStatus === 1 ? "isRead" : ""
                        }`}
                        onClick={() => {
                          readNotification(notification.NotificationId);
                          if (route)
                            navigate(
                              `/${notification.ReceiverType}${route.path}`
                            );
                        }}
                      >
                        <div className="notification_details">
                          <b>{notification.NotificationTitle}</b>
                          <p>{notification.Message}</p>
                        </div>
                        <div className="notification_time">
                          <p>{getTime(notification.NotificationDate)}</p>
                          <p>
                            {DateFormatForUser(notification.NotificationDate)}
                          </p>
                        </div>
                        <div className="read_icon">
                          {notification.ReadStatus === 0 ? (
                            <IoMailOpenOutline
                              style={{ fontSize: "22px" }}
                              onClick={() =>
                                readNotification(notification.NotificationId)
                              }
                            />
                          ) : (
                            <MdOutlineMarkEmailRead
                              style={{ fontSize: "22px" }}
                            />
                          )}
                        </div>
                      </div>
                    </>
                  );
                })
              ) : (
                <p className="text-center no_notification">
                  No Notifications Yet
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsBox;
