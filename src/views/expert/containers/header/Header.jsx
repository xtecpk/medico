import React, { useState } from "react";
import "./header.css";
import { ExpertPicCard } from "../../components";
import { barsIcon, xIcon } from "../../assets";

const Header = ({ toggleSidebar, isSidebarHidden }) => {
  const [isPicCardExpanded, setIsPicCardExpanded] = useState(false);
    useState(false);
  return (
    <>
      <div className="expert_header"></div>
      <button className={`expert_bars_btn`} onClick={toggleSidebar}>
            <img src={isSidebarHidden ? barsIcon : xIcon} alt="bars" />
          </button>
      <ExpertPicCard
        isPicCardExpanded={isPicCardExpanded}
        setIsPicCardExpanded={setIsPicCardExpanded}
      />
    </>
  );
};

export default Header;
