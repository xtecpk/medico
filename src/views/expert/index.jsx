import React, { useEffect, useRef, useState } from "react";
import "./index.css";
import { Sidebar } from "./containers";
import { Route, Routes } from "react-router-dom";
import {
  CaseDetails,
  Cases,
  Home,
  Chat2,
  Profile,
} from "./screens";
import Cookies from "js-cookie";
import axios from "axios";
import { UserPicCard } from "../user/components";
import { barsIcon } from "./assets";
import useAuthentication from "../../hooks/useAuthentication";
import Chat from "../user/screens/chat/Chat";
import { ChangePassword } from "../user/screens";
import { useTranslation } from "react-i18next";
import { language } from "../../features/language/lanSlice";
import { useDispatch } from "react-redux";
import { Header } from "../user/containers";


const Expert = () => {
  const { i18n } = useTranslation();
  const expertBaseMainRef = useRef(null);
  const [isSidebarHidden, setIsSidebarHidden] = useState(true);
  const [isPicCardExpanded, setIsPicCardExpanded] = useState(false);
  const [chatCaseId, setChatCaseId] = useState();
  const [isLanguageToggleExpanded, setIsLanguageToggleExpanded] =
    useState(false);
  const [cases, setCases] = useState([]);
  const toggleSidebar = () => {
    setIsSidebarHidden((prevState) => !prevState);
  };
  const [personalInfo, setPersonalInfo] = useState({
    ExpertName: "",
    Valid: "",
    Experience: "",
    Email: "",
    PhoneNo: "",
    Expertise: "",
    Address: "",
    // workingHoursStart: workingHoursStartSt,
    // workingHoursEnd: workingHoursEndSt,
    // status: "active",
  });

  const baseURL = import.meta.env.VITE_BASE_URL;
  const token = Cookies.get('token');
  const userId = Cookies.get('userId');
  const authenticate = useAuthentication();
  const dispatch = useDispatch();

  const getCases = async (ExpertId) => {
    console.log(Expert);
    await axios.post(baseURL + "/api/getcasebyexpert", {
      ExpertId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      console.log(res);
      setCases(res.data.response.data.reverse())
    })
  }

  const getExpertInfo = async () => {
    await axios.post(baseURL + "/api/getexpertbyuserid", {
      UserId: userId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      console.log(res);
      Cookies.set('ExpertId', res.data.response.data[0].ExpertId, { expires: 30 });
      Cookies.set('expertName', res.data.response.data[0].ExpertName, { expires: 30 });
      getCases(res.data.response.data[0].ExpertId)
    })
  }


  useEffect(() => {
    getExpertInfo()
  }, [])

  useEffect(() => {
    if (isSidebarHidden) {
      expertBaseMainRef.current.classList.add("expert_main_full_width");
    } else {
      expertBaseMainRef.current.classList.remove("expert_main_full_width");
    }
  }, [isSidebarHidden]);

  useEffect(() => {
    i18n.changeLanguage("en");
    dispatch(language("en"));

    if (authenticate) {
      console.log('authentication complete');
    }
    else {
      console.log('not authentication complete');
    }
  }, [])

  return (
    <>
      <div className={`expert_base`}>
        <div className="expert_base_inner">
          <Sidebar
            isSidebarHidden={isSidebarHidden}
            toggleSidebar={toggleSidebar}
          />
          <Header />
          <button className={`expert_bars_btn`} onClick={toggleSidebar}>
            <img src={barsIcon} alt="bars" />
          </button>
          <main ref={expertBaseMainRef} className={`expert_base_main`}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cases" element={<Cases cases={cases} getCases={getCases} />} />
              <Route
                path="/cases/:caseId"
                element={<CaseDetails setChatCaseId={setChatCaseId} />}
              />
              <Route path="/admin-chat" element={<Chat />} />
              <Route path="/clients-chat" element={<Chat chatCaseId={chatCaseId} />} />
              <Route path="/cases-chat" element={<Chat />} />
              <Route path="/tickets" element={<Chat2 />} />
              <Route path="/profile" element={<Profile
                personalInfo={personalInfo}
                setPersonalInfo={setPersonalInfo}
              />} />
              <Route path="/change-password" element={<ChangePassword />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
};

export default Expert;
