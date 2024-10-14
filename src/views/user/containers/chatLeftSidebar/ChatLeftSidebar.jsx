import React, { useEffect, useRef, useState } from "react";
import "./chatLeftSidebar.css";
import { plusIcon, userImg, xIcon, filterIcon } from "../../assets";
import {
  Button1,
  ChatLeftbarItemLayout,
  ChatSearchBar,
  H3,
  H4,
} from "../../components";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { DateFormatForUser } from "../../../../components/custom/DateFormatForServer";
import { useLocation } from "react-router-dom";

const ChatLeftSidebar = ({
  isLeftSidebarHidden,
  toggleLeftSidebar,
  entries,
  currentEntry,
  setCurrentEntry,
  chatType,
  toggleTicketModal,
  setShowTicketDetails,
  type = ""
}) => {
  const { t } = useTranslation();
  const lang = useSelector((state) => state.language.value);
  const filterRef = useRef(null);
  const location = useLocation().pathname;
  const [searchVal, setSearchVal] = useState("");
  const [status, setStatus] = useState("All");
  const role = useLocation().pathname.split("/")[1];
  const numberRegex = /^[0-9]+$/;

  const formatDate = (inputDateString) => {
    const inputDate = new Date(inputDateString);
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return inputDate.toLocaleDateString('en-GB', options);
  }

  const filterHandler = () => {
    setStatus(filterRef.current.value);
  };

  useEffect(() => {
    setSearchVal("");
    setStatus("All")
  }, [location])

  return (
    <>
      <div
        className={`user_chatLeftSidebar ${isLeftSidebarHidden ? "user_chatLeftSidebar--hidden" : ""
          } ${lang === "ar" ? "user_chatLeftSidebar_ar" : ""} ${type === "support" ? "ticketMax" : ""}`}>
        <button
          onClick={toggleLeftSidebar}
          className="user_chatLeftSidebar__close_btn">
          <img src={xIcon} alt="x" />
        </button>
        {(chatType == "experts-chat") && (
          <>
            {role === "admin" ? (
              <div className="d-flex align-items-center justify-content-between">
                <H3 text={t("UserPanel.Chat.Experts")} />
                <Button1
                  icon={plusIcon}
                  className="p-2 rounded-5"
                  onClick={() => {
                    toggleTicketModal();
                    toggleLeftSidebar();
                  }}
                />
              </div>
            ) : (
              <H3 text={t("UserPanel.Chat.Experts")} />
            )}
            <ChatSearchBar setSearchVal={setSearchVal} />
            <div className="user_chatLeftSidebar__items">
              {entries
                .length > 0 ? entries
                  .filter(
                    (entry) =>
                      !searchVal ||
                      entry.ChatName?.toLowerCase().includes(searchVal.toLowerCase())
                  )
                  .map((entry, index) => (
                    <ChatLeftbarItemLayout
                      toggleSidebar={toggleLeftSidebar}
                      value={entry}
                      key={index}
                      currentValue={currentEntry}
                      setCurrentValue={setCurrentEntry}>
                      <div className="d-flex align-items-center ">
                        {chatType === "experts-chat" && (
                          <div>
                            <img src={userImg} alt="user" />
                          </div>
                        )}
                        <div
                          className={`
                        w-100 ${lang === "ar" ? "me-2" : "ms-2"}
                        `}>
                          <H4
                            text={entry.ChatName ||
                              `#${entry.ChatId}`
                            }
                            className={`text-capitalize
                          ${lang === "ar" ? "text-end " : "text-start "}
                          `}
                          />
                          <div className="d-flex align-items-center justify-content-between m-0 user_chatLeftSidebar__item__text">
                            <span>Start</span>
                            {/* <span>{t("UserPanel.Chat.LastMessage")}</span> */}
                            <span>{DateFormatForUser(entry.StartDate)}</span>
                          </div>
                        </div>
                      </div>
                    </ChatLeftbarItemLayout>
                  )
                  )
                :
                <p>No Chats Found</p>
              }
            </div>
          </>
        )}
        {chatType == "cases-chat" && (
          <>
            {/* {role === "admin" ? (
              <div className="d-flex align-items-center justify-content-between">
                <H3 text={t("UserPanel.Chat.Cases")} />
                <Button1
                  icon={plusIcon}
                  className="p-2 rounded-5"
                  onClick={() => {
                    toggleTicketModal();
                    toggleLeftSidebar();
                  }}
                />
              </div>
            ) : (
              )} */}
            <H3 text={t("UserPanel.Chat.Cases")} />
            <ChatSearchBar setSearchVal={setSearchVal} />
            <div className="user_chatLeftSidebar__items">
              {entries.length > 0 ? entries
                .filter(
                  (entry) =>
                    !searchVal ||
                    (role === "admin" ? entry.ChatName : entry.CaseName)?.toLowerCase().includes(searchVal.toLowerCase())
                )
                .map((entry, index) => (
                  <ChatLeftbarItemLayout
                    toggleSidebar={toggleLeftSidebar}
                    value={entry}
                    key={index}
                    currentValue={currentEntry}
                    setCurrentValue={setCurrentEntry}>
                    <div className="w-100 d-flex flex-column align-items-start">
                      <H4
                        text={entry.ChatName || entry.CaseName || "#" + entry.ChatId}
                        className="text-start text-capitalize "
                      />
                      <p className="user_chatLeftSidebar__case_p">
                        <span>{entry.status}</span>
                      </p>
                      <div className="d-flex align-items-center justify-content-between m-0 user_chatLeftSidebar__item__text user_chatLeftSidebar__item__text--case">
                        {/* {t("UserPanel.Chat.LastMessage")} */}
                        {"Start Date:"}
                        <span>{DateFormatForUser(entry.StartDate)}</span>
                      </div>
                    </div>
                  </ChatLeftbarItemLayout>
                ))
                :
                <p>{t("UserPanel.Chat.NoChatFound")}</p>
              }
            </div>
          </>
        )}

        {chatType == "support" && (
          <>
            <div className="d-flex align-items-center justify-content-between">
              <H3 text={t("UserPanel.Chat.Tickets")} className="fw-700" />
              {
                role === "user" && <Button1
                  icon={plusIcon}
                  className="p-2 rounded-5"
                  onClick={() => {
                    toggleTicketModal();
                    toggleLeftSidebar();
                  }}
                />
              }
            </div>
            <ChatSearchBar setSearchVal={setSearchVal} />
            <div className="d-flex w-100 gap-2 justify-content-between">
              <select className="rounded w-100" ref={filterRef}>
                <option value="All">All</option>
                <option value="0">New</option>
                <option value="1">In Progress</option>
                <option value="2">Completed</option>
              </select>
              <Button1
                onClick={filterHandler}
                text={"Filter"}
                icon={filterIcon}
              />
            </div>
            <div className="user_chatLeftSidebar__items">
              {entries
                .filter((entry) =>
                  ((numberRegex.test(searchVal) ? entry.TicketNo.toString() : entry.Subject?.toLowerCase())?.includes(searchVal.toLowerCase()))
                  &&
                  (status !== "All" ? entry.Status == status : true)).length > 0
                ?
                entries
                  .filter((entry) =>
                    ((numberRegex.test(searchVal) ? entry.TicketNo.toString() : entry.Subject?.toLowerCase()).includes(searchVal.toLowerCase()))
                    &&
                    (status !== "All" ? entry.Status == status : true))
                  .map((entry, index) => (
                    <ChatLeftbarItemLayout
                      toggleSidebar={toggleLeftSidebar}
                      value={entry}
                      key={index}
                      setShowTicketDetails={setShowTicketDetails}
                      currentValue={currentEntry}
                      setCurrentValue={setCurrentEntry}>
                      <div className="w-100 d-flex flex-column align-items-start">
                        <H4
                          text={`#${entry.TicketNo}`}
                          className="text-start text-capitalize "
                        />
                        <p className="my-2" style={{ color: "#5C6D85" }}>
                          {entry.Subject}
                        </p>
                        <div className="d-flex align-items-center justify-content-between m-0 user_chatLeftSidebar__item__text user_chatLeftSidebar__item__text--case">
                          <span className="d-flex align-items-center ">
                            <div className="status_color" style={{ backgroundColor: `${entry.Status === "2" && "#7ECD7C" || entry.Status === "0" && "#4A8AE6" || entry.Status === "1" && "#FDF52E"}` }}></div>
                            {entry.Status === "0" ? "New" : (entry.Status === "1" ? "Progress" : "Completed")}</span>
                          <div className="d-flex align-items-center">
                            <span className="mx-2">Created: </span>
                            <p className="m-0" style={{ color: "#2F4058" }}>{formatDate(entry.CreationDate)}</p>
                          </div>
                        </div>
                      </div>
                    </ChatLeftbarItemLayout>
                  ))
                :
                <p>No Tickets Found</p>
              }
            </div>
          </>
        )}

        {(chatType == "clients-chat") && (
          <>
            {role === "admin" ? (
              <div className="d-flex align-items-center justify-content-between">
                <H3 text={"Clients"} />
                <Button1
                  icon={plusIcon}
                  className="p-2 rounded-5"
                  onClick={() => {
                    toggleTicketModal();
                    toggleLeftSidebar();
                  }}
                />
              </div>
            ) : (
              <H3 text={"Clients"} />
            )}
            <ChatSearchBar setSearchVal={setSearchVal} />
            <div className="user_chatLeftSidebar__items">
              {entries
                .filter((entry) => !searchVal || entry.ChatName?.toLowerCase().includes(searchVal))
                .map((entry, index) => (
                  <ChatLeftbarItemLayout
                    toggleSidebar={toggleLeftSidebar}
                    value={entry}
                    key={index}
                    currentValue={currentEntry}
                    setCurrentValue={setCurrentEntry}>
                    <div className="d-flex align-items-center ">
                      {chatType === "clients-chat" && (
                        <div>
                          <img src={userImg} alt="user" />
                        </div>
                      )}
                      <div
                        className={`
                        w-100 ${lang === "ar" ? "me-2" : "ms-2"}
                        `}>
                        <H4
                          text={
                            entry.ChatName
                            || `#${entry.ChatId}`
                          }
                          className={`text-capitalize
                          ${lang === "ar" ? "text-end " : "text-start "}
                          `}
                        />
                        <div className="d-flex align-items-center justify-content-between m-0 user_chatLeftSidebar__item__text">
                          {/* <span>{t("UserPanel.Chat.LastMessage")}</span> */}
                          <span>Start</span>
                          <span>{DateFormatForUser(entry.StartDate)}</span>
                        </div>
                      </div>
                    </div>
                  </ChatLeftbarItemLayout>
                ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ChatLeftSidebar;
