import "./App.css";
import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./screens/signUp";
import SignIn from "./screens/signIn";
import Home from "./screens/home";
import Services from "./screens/services";
import BlogPages from "./screens/blogs";
import ContactUs from "./screens/contactUs";
import PageNotFound from "./screens/pageNotFound";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import User from "./views/user";
import Expert from "./views/expert";
import Admin from "./views/admin";
import ChangePassword from "./screens/changePassword/ChangePassword";

function App() {
  const lang = useSelector((state) => state.language.value);
  const { i18n } = useTranslation();


  useEffect(() => {
    if (lang === 'ar') {
      document.body.className = "araibicFont";
    }
    else {
      document.body.className = "";
    }
  }, [lang])

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, []);

  return (
    <>
      <Router>
        <Routes>
          {/* <Route exect path="/" element={<Home />} /> */}
          <Route path="/services" element={<Services />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/blogs/*" element={<BlogPages />} />
          <Route path="/" element={<SignIn />} />
          <Route path="/signin/ar" element={<SignIn />} />
          <Route exect path="/signup/*" element={<SignUp />} />
          <Route exect path="/signup/ar" element={<SignUp />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/user/*" element={<User />} />
          <Route path="/expert/*" element={<Expert />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
