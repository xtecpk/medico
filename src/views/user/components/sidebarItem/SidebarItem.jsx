import React, { useState } from "react";
import "./sidebarItem.css";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

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

  const lang = useSelector((state) => state.language.value);

  const toggleItem = () => {
    setIsItemExpanded((prevState) => !prevState);
  };

  return (
    <>
      <li
        className={`user_sidebar__li ${
          lang === "ar" ? "user_sidebar__li_ar" : ""
        }`}>
        {subItems ? (
          <div
            className={`user_sidebar__div ${
              subItemsTo.includes(currentLocation)
                ? "user_sidebar__div--active"
                : ""
            }`}>
            <button onClick={toggleItem} className={`user_sidebar__link`}>
              <img
                src={subItemsTo.includes(currentLocation) ? iconWhite : icon}
                alt={text}
              />
              <span>{text}</span>
            </button>
            <div
              className={`user_sidebar_sublist ${
                isItemExpanded ? "user_sidebar_sublist_expanded" : ""
              }`}>
              <ul>
                {subItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      onClick={toggleSidebar}
                      to={subItemsTo[index]}
                      className={`user_sidebar__sublink ${
                        currentLocation === subItemsTo[index] ||
                        currentLocation.startsWith(`${subItemsTo[index]}/`)
                          ? "user_sidebar__sublink--active"
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
            className={`user_sidebar__link ${
              currentLocation === to || currentLocation.startsWith(`${to}/`)
                ? "user_sidebar__link--active"
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
