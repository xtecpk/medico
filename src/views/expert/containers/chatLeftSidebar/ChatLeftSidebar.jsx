import React, { useEffect, useRef, useState } from "react";
import "./chatLeftSidebar.css";
import { expertImg, filterIcon, xIcon } from "../../assets";
import {
  Button1,
  ChatLeftbarItemLayout,
  ChatSearchBar,
  H3,
  H4,
} from "../../components";

const ChatLeftSidebar = ({
  isLeftSidebarHidden,
  toggleLeftSidebar,
  entries,
  currentEntry,
  setCurrentEntry,
  chatType,
  setShowTicketDetails,
}) => {
  const [ticketType, setTicketType] = useState("All");
  const [searchVal, setSearchVal] = useState("");
  const ticketTypesSelectRef = useRef(null);
  const numberRegex = /^[0-9]+$/;

  const filterHandler = () => {
    setTicketType(ticketTypesSelectRef.current.value);
  };

  const formatDate = (inputDateString) => {
    const inputDate = new Date(inputDateString);
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return inputDate.toLocaleDateString('en-GB', options);
  }

  // useEffect(() => {
  //   console.log(entries
  //     .filter((entry) =>
  //       !searchVal ||
  //       entry.Subject.toLowerCase().includes(searchVal.toLowerCase()) ||
  //       ticketType !== "All" && entry.Status.toLowerCase().includes(ticketType.toLowerCase())));
  // }, [ticketType])

  return (
    <>
      <div
        className={`expert_chatLeftSidebar ${isLeftSidebarHidden ? "expert_chatLeftSidebar--hidden" : ""
          }`}>
        <button
          onClick={toggleLeftSidebar}
          className="expert_chatLeftSidebar__close_btn">
          <img src={xIcon} alt="x" />
        </button>
        {chatType == "clients-chat" && (
          <>
            <H3 text={"Clients"} />
            <ChatSearchBar setSearchVal={setSearchVal} />
            <div className="expert_chatLeftSidebar__items">
              {entries
                .filter(
                  (entry) =>
                    !searchVal ||
                    entry.Subject.toLowerCase().includes(searchVal.toLowerCase())
                )
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
                          <img src={expertImg} alt="user" />
                        </div>
                      )}
                      <div
                        className={`
                        w-100 ms-2
                        `}>
                        <H4
                          text={entry.name}
                          className={`text-capitalize text-start`}
                        />
                        <div className="d-flex align-items-center justify-content-between m-0 expert_chatLeftSidebar__item__text">
                          <span>{"Last Message"}</span>
                          <span>{entry.lastMessage}</span>
                        </div>
                      </div>
                    </div>
                  </ChatLeftbarItemLayout>
                ))}
            </div>
          </>
        )}
        {(chatType == "cases-chat" || chatType === "tickets") ? (
          <>
            <H3 text={chatType === "cases-chat" ? "Cases" : "Tickets"} />
            <ChatSearchBar setSearchVal={setSearchVal} />
            {chatType === "tickets" && (
              <div className="d-flex w-100 gap-2 justify-content-between">
                <select ref={ticketTypesSelectRef} className="rounded w-100">
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
            )}
            <div className="expert_chatLeftSidebar__items">
              {
                entries
                  .filter((entry) =>
                    ((numberRegex.test(searchVal) ? entry.TicketNo.toString() : entry.Subject?.toLowerCase()).includes(searchVal.toLowerCase()))
                    &&
                    (ticketType !== "All" ? entry.Status == ticketType : true)).length > 0
                  ?
                  entries
                    .filter((entry) =>
                      ((numberRegex.test(searchVal) ? entry.TicketNo.toString() : entry.Subject?.toLowerCase()).includes(searchVal.toLowerCase()))
                      &&
                      (ticketType !== "All" ? entry.Status == ticketType : true))
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
                  <p>No Chats Found</p>
              }
            </div>
          </>
        ) : (
          <div className="expert_chatLeftSidebar__items">
            {entries
              .filter(
                (entry) =>
                  !searchVal ||
                  entry.name.toLowerCase().includes(searchVal.toLowerCase())
              )
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
                      text={
                        chatType === "cases-chat"
                          ? entry.name
                          : `#${entry.name}`
                      }
                      className="text-start text-capitalize "
                    />
                    <p className="expert_chatLeftSidebar__case_p">
                      {chatType === "cases-chat" ? (
                        <>Last Message</>
                      ) : (
                        <>{entry.subject}</>
                      )}
                    </p>
                    <div className="d-flex align-items-center justify-content-between m-0 expert_chatLeftSidebar__item__text expert_chatLeftSidebar__item__text--case">
                      <span>{entry.status}</span>
                      {chatType === "cases-chat" ? (
                        <span>{entry.time}</span>
                      ) : (
                        <>
                          <div>
                            <span>Created: </span>
                            <span>{entry.created}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </ChatLeftbarItemLayout>
              ))}
          </div>
        )}
      </div >
    </>
  );
};

export default ChatLeftSidebar;
