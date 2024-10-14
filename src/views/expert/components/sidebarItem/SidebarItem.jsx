import React, { useState } from "react";
import "./sidebarItem.css";
import { Link, useLocation } from "react-router-dom";

const SidebarItem = ({
  to,
  icon,
  iconWhite,
  text,
  toggleSidebar,
  subItems = null,
  subItemsTo = null,
}) => {
  const currentLocation = useLocation().pathname;
  const [isItemExpanded, setIsItemExpanded] = useState(false);

  const toggleItem = () => {
    setIsItemExpanded((prevState) => !prevState);
  };

  return (
    <>
      <li className={`expert_sidebar__li`}>
        {subItems ? (
          <div
            className={`expert_sidebar__div ${
              subItemsTo.includes(currentLocation)
                ? "expert_sidebar__div--active"
                : ""
            }`}>
            <button onClick={toggleItem} className={`expert_sidebar__link`}>
              <img
                src={subItemsTo.includes(currentLocation) ? iconWhite : icon}
                alt={text}
              />
              <span>{text}</span>
            </button>
            <div
              className={`expert_sidebar_sublist ${
                isItemExpanded ? "expert_sidebar_sublist_expanded" : ""
              }`}>
              <ul>
                {subItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      onClick={toggleSidebar}
                      to={subItemsTo[index]}
                      className={`expert_sidebar__sublink ${
                        currentLocation === subItemsTo[index] ||
                        currentLocation.startsWith(`${subItemsTo[index]}/`)
                          ? "expert_sidebar__sublink--active"
                          : ""
                      }`}>
                      <span>{item}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <Link
            onClick={toggleSidebar}
            to={to}
            className={`expert_sidebar__link ${
              currentLocation === to || currentLocation.startsWith(`${to}/`)
                ? "expert_sidebar__link--active"
                : ""
            }`}>
            <img
              src={
                currentLocation === to || currentLocation.startsWith(`${to}/`)
                  ? iconWhite
                  : icon
              }
              alt={text}
            />
            <span>{text}</span>
          </Link>
        )}
      </li>
    </>
  );
};

export default SidebarItem;
