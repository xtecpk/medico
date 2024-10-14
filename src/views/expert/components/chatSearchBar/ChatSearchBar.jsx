import React from "react";
import "./chatSearchBar.css";
import { searchIcon } from "../../assets";

const ChatSearchBar = ({ setSearchVal }) => {
  return (
    <>
      <div className={`expert_chatSearchbar_div`}>
        <input
          type="text"
          placeholder={"Search"}
          onChange={(e) => setSearchVal(e.target.value)}
        />
        <img
          src={searchIcon}
          alt="search"
          className="expert_chatSearchbar_div__icon"
        />
      </div>
    </>
  );
};

export default ChatSearchBar;
