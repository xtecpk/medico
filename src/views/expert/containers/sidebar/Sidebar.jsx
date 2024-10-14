import React, { useEffect, useRef } from "react";
import "./sidebar.css";
import { SidebarItem } from "../../components";
import {
  casesIcon,
  casesIconWhite,
  chatIcon,
  chatIconWhite,
  logoImg,
  profileIcon,
  profileIconWhite,
  ticketsIcon,
  ticketsWhiteIcon,
} from "../../assets";

const Sidebar = ({ isSidebarHidden, toggleSidebar }) => {
  const sidebarRef = useRef(null);
  useEffect(() => {
    if (isSidebarHidden) {
      sidebarRef.current.classList.add("expert_sidebar_hidden");
    } else {
      sidebarRef.current.classList.remove("expert_sidebar_hidden");
    }
  }, [isSidebarHidden]);

  return (
    <>
      <aside
        ref={sidebarRef}
        className={`expert_sidebar expert_sidebar_hidden`}>
        <div className="logoBox">
          <img src={logoImg} alt="logo" />
        </div>
        <hr className="expert_sidebar_hr" />
        <ul className="expert_sidebar__ul">
          <SidebarItem
            to={"/expert/cases"}
            icon={casesIcon}
            iconWhite={casesIconWhite}
            text={"Cases"}
            toggleSidebar={toggleSidebar}
          />
          <SidebarItem
            icon={chatIcon}
            iconWhite={chatIconWhite}
            text={"Chat"}
            toggleSidebar={toggleSidebar}
            subItems={["Admin",
              //  "Clients", 
              "Cases"]}
            subItemsTo={[
              "/expert/admin-chat",
              // "/expert/clients-chat",
              "/expert/cases-chat",
            ]}
          />
          <SidebarItem
            to={"/expert/tickets"}
            icon={ticketsIcon}
            iconWhite={ticketsWhiteIcon}
            text={"Tickets"}
            toggleSidebar={toggleSidebar}
          />
          <SidebarItem
            to={"/expert/profile"}
            icon={profileIcon}
            iconWhite={profileIconWhite}
            text={"Profile"}
            toggleSidebar={toggleSidebar}
          />
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
