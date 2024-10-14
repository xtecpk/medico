import React from "react";
import "./chatRightSidebar.css";
import { plusIcon, xIcon } from "../../assets";
import { Button1, ChatMemberItem, H3 } from "../../components";
import { Pdf } from "../../../user/components";
import { useTranslation } from "react-i18next";

const ChatRightSidebar = ({
  isRightSidebarHidden,
  toggleRightSidebar,
  chatmembers,
  documents,
  toggleDocumentUploadModal,
  currentEntry,
  getDocuments
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div
        className={`expert_chatRightSidebar ${isRightSidebarHidden ? "expert_chatRightSidebar--hidden" : ""
          }`}>
        <button
          onClick={toggleRightSidebar}
          className="expert_chatRightSidebar__close_btn">
          <img src={xIcon} alt="x" />
        </button>
        {currentEntry && <div className="expert_chatRightSidebar__top">
          <H3 text={"Client"} />
          <div className="expert_chatRightSidebar__chatMembers_div">
            {/* {chatmembers.map(({ name, type }, index) => ( */}
            <ChatMemberItem name={currentEntry && currentEntry.ClientId} type={"Client"} />
            {/* ))} */}
          </div>
        </div>}
        <div className="user_chatRightSidebar__bottom">
          <H3 text={t("UserPanel.Cases.AddNewCasePage.Documents")} />
          <div>
            <div className="d-flex align-items-center justify-content-between">
              <h5>{t("UserPanel.Cases.AddNewCasePage.User")}</h5>
            </div>
            {documents.length > 0 && documents
              .filter((doc) => doc.Role === "user").length > 0 ?
              documents
                .filter((doc) => doc.Role === "user")
                .map((doc, index) => (
                  <Pdf key={index} name={doc.DocumentName}
                    onDeleteClick={(() => deleteDocFromTicket(doc.DocumentId))}
                    type={"ticket"}
                  />
                )) :
              <p>No Documents Found</p>}
          </div>
          <div>
            <div className="d-flex align-items-center justify-content-between">
              <h5>{t("UserPanel.Cases.Experts")}</h5>
              <Button1
                icon={plusIcon}
                onClick={() => {
                  toggleDocumentUploadModal();
                  toggleRightSidebar();
                }}
              />
            </div>
            {documents.length > 0 && documents
              .filter((doc) => doc.Role === "expert").length > 0 ?
              documents
                .filter((doc) => doc.Role === "expert")
                .map((doc, index) => (
                  <Pdf key={index} name={doc.DocumentName}
                    onDeleteClick={(() => deleteDocFromTicket(doc.DocumentId))}
                    type={"ticket"}
                  />
                )) :
              <p>No Documents Found</p>}
          </div>
          <div>
            <div className="d-flex align-items-center justify-content-between">
              <h5>{t("UserPanel.Chat.Admin")}</h5>
            </div>
            {documents.length > 0 && documents
              .filter((doc) => doc.Role === "admin").length > 0 ?
              documents
                .filter((doc) => doc.Role === "admin")
                .map((doc, index) => (
                  <Pdf
                    key={index}
                    name={doc.DocumentName}
                    onDeleteClick={(() => deleteDocFromTicket(doc.DocumentId))}
                    type={"ticket"}
                  />
                )) :
              <p>No Documents Found</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatRightSidebar;
