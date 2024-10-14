import React from "react";
import "./chatSearchBar.css";
import { searchIcon } from "../../assets";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const ChatSearchBar = ({ setSearchVal }) => {
  const { t } = useTranslation();
  const lang = useSelector((state) => state.language.value);

  return (
    <>
      <div
        className={`user_chatSearchbar_div ${
          lang === "ar" ? "user_chatSearchbar_div_ar" : ""
        }`}>
        <input
          type="text"
          placeholder={t("UserPanel.Cases.Search")}
          onChange={(e) => setSearchVal(e.target.value)}
        />
        <img
          src={searchIcon}
          alt="search"
          className="user_chatSearchbar_div__icon"
        />
      </div>
    </>
  );
};

export default ChatSearchBar;
