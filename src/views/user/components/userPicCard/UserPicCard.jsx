import React, { useEffect, useRef, useState } from "react";
import "./userPicCard.css";
import { userIcon } from "../../assets";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import H4 from "../h4/H4";

const UserPicCard = ({
  isPicCardExpanded,
  setIsPicCardExpanded,
  isLanguageToggleExpanded,
  setIsLanguageToggleExpanded,
  setIsMesgBoxExpanded,
  personalInfo
}) => {

  const role = useLocation().pathname.split("/")[1];
  const nameCardRef = useRef(null);

  const baseURL = import.meta.env.VITE_BASE_URL;
  const token = Cookies.get('token');
  const ClientId = Cookies.get('clientId');
  const ExpertId = Cookies.get('ExpertId');
  const userId = Cookies.get("userId");

  const { t } = useTranslation();
  const lang = useSelector((state) => state.language.value);
  const [userData, setUserData] = useState();
  const [adminName, setAdminName] = useState();

  const picCardClickHandler = () => {
    setIsPicCardExpanded((prevState) => !prevState);
    setIsLanguageToggleExpanded(false);
    setIsMesgBoxExpanded(false)
  };

  const clearCookies = () => {
    document.cookie.split(";").forEach(function (cookie) {
      var cookieName = cookie.split("=")[0].trim();
      document.cookie = cookieName + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
    });
  }

  const clearLocalStorage = () => {
    // Clear local storage
    localStorage.clear();
  }

  const clearCookiesAndLocalStorage = () => {
    clearCookies();
    clearLocalStorage();
  }

  const getUserInfo = async () => {
    await axios.post(baseURL + "/api/getuserbyid", {
      UserId: userId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => {
      console.log(res);
      // if (role === 'expert')
      setUserData(res.data.response.data[0]);
    })
  };

  const getCLientInfo = async () => {
    await axios.post(baseURL + "/api/getclientbyid", {
      ClientId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      console.log(res);
      localStorage.setItem("userInfo", JSON.stringify(res.data.response.data[0]))
    })
  }

  const getExpertInfo = async () => {
    await axios.post(baseURL + "/api/getexpertbyid", {
      ExpertId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      console.log(res);
      localStorage.setItem("userInfo", JSON.stringify(res.data.response.data[0]))
    })
  }

  const getAdminInfo = async () => {
    await axios.post(baseURL + "/api/getadminbyuserid", {
      UserId: userId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      console.log(res);
      setAdminName(res.data.response.data[0].AdminName);
      localStorage.setItem("userInfo", JSON.stringify(res.data.response.data[0]))
    })
  }

  useEffect(() => {
    getUserInfo()
  }, [personalInfo]);

  const closePop = (e) => {
    if (nameCardRef.current && (nameCardRef.current.contains(e.target) || nameCardRef.current == e.target)) {
      setIsPicCardExpanded(!isPicCardExpanded);
    } else {
      setIsPicCardExpanded(false)
    }
  }

  useEffect(() => {
    document.body.addEventListener('click', closePop);

    return () => {
      document.body.removeEventListener('click', closePop);
    }
  }, [isPicCardExpanded])


  useEffect(() => {
    if (role === "admin") {
      getAdminInfo();
    } else if (role === "expert") {
      getExpertInfo()
    } else {
      getCLientInfo();
    }
  }, [])

  const navigate = useNavigate();

  return (
    <>
      <div
        className={`user_pic_card_outer ${lang === "ar" ? "user_pic_card_outer_ar" : ""
          }`}>
        <button className={`user_pic_card`} ref={nameCardRef} >
          <img src={userIcon} alt="user name" />
          <H4 className="user_pic_card_name" text={(role === "user" && Cookies.get("clientName")) || (role === "expert" ? Cookies.get("expertName") : adminName) || "Loading..."} />
        </button>
        {isPicCardExpanded && (
          <div className="user_pic_card__dropdown border p-1">
            {
              role !== "admin" && <>
                <button onClick={() => navigate(`/${role}/profile`)}>{t("UserPanel.UserPicCard.EditProfile")}</button>
                <hr />
              </>
            }
            <button onClick={() => {
              clearCookiesAndLocalStorage();
              navigate("/");
            }}>{t("UserPanel.UserPicCard.Logout")}</button>
          </div>
        )}
      </div>
    </>
  );
};

export default UserPicCard;
