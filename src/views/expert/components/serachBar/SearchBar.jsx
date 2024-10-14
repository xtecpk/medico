import React from "react";
import "./searchBar.css";
import { searchIcon } from "../../assets";

const SearchBar = ({ setSearchVal }) => {
  return (
    <>
      <div className="expert_searchbar_div">
        <input
          type="text"
          placeholder={"Search"}
          onChange={(e) => setSearchVal(e.target.value)}
        />
        <img src={searchIcon} alt="search" />
      </div>
    </>
  );
};

export default SearchBar;
