import React from "react";
import "./searchBar.css";
import { searchIcon } from "../../assets";
import { useTranslation } from "react-i18next";

const SearchBar = ({ setSearchVal }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="user_searchbar_div">
        <input
          type="text"
          placeholder={t("UserPanel.Cases.Search")}
          onChange={(e) => setSearchVal(e.target.value)}
        />
        <img src={searchIcon} alt="search" />
      </div>
    </>
  );
};

export default SearchBar;
