import React, { useEffect, useState } from "react";
import "./uploadModal.css";
import { Dropzone, H3, InputBox, Pdf } from "../../components";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { ticketsIcon } from "../../../expert/assets";

const UploadModal = ({
  modalType,
  currentEntry,
  nationalAddress = "",
  onNationalAdressChange = () => { },
  toggleModal,
  getTicketDocuments
}) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState([]);
  const chatType = useLocation().pathname.split("/")[2];
  const role = useLocation().pathname.split("/")[1];
  const location = useLocation().pathname.split("/")[2];
  const userId = Cookies.get('userId');
  const baseURL = import.meta.env.VITE_BASE_URL;
  const token = Cookies.get('token');

  const uploadImage = async () => {

    const fileName = `${userId}-${files[0].name.split(" ").join("")}`

    if (chatType === "support" || chatType === "tickets") {
      await axios.post(baseURL + "/api/uploadticketimage", {
        TicketFile: fileName,
        ticketimage: files[0]
      }, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      }).then(res => {
        console.log(res.data);
        getTicketDocuments();
        toggleModal();
      })
    }
    // else if (chatType === "cases-chat") {
    //   await axios.post(baseURL + "/api/uploaddocumentimage", {
    //     CaseFile: fileName,
    //     docimage: files[0]
    //   }, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //       'Authorization': `Bearer ${token}`
    //     }
    //   }).then(res => {
    //     console.log(res.data);
    //     getTicketDocuments();
    //     toggleModal();
    //   })
    // }
    else {
      await axios.post(baseURL + "/api/uploadchatimage", {
        ChatFile: fileName,
        chatimage: files[0]
      }, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      }).then(res => {
        console.log(res.data);
        getTicketDocuments();
        toggleModal();
      })
    }
  }

  const addDocument = async () => {
    const fileName = `${userId}-${files[0].name.split(" ").join("")}`
    if (chatType === "support" || chatType === "tickets") {
      await axios.post(baseURL + "/api/adddocumenttoticket", {
        TicketNo: currentEntry.TicketNo,
        DocumentName: fileName,
        UploadedBy: 1,
        Role: role
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(res => {
        console.log(res);
        uploadImage()
      })
    }
    else {
      await axios.post(baseURL + "/api/adddocumenttochat", {
        ChatId: currentEntry.ChatId,
        DocName: fileName,
        UploadedBy: 1,
        ChatFile: fileName,
        Role: role
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(res => {
        console.log(res);
        uploadImage()
      })
    }
  }

  useEffect(() => {
    files.length > 0 && addDocument();
  }, [files])

  return (
    <>
      <div className="user_upload_modal_div">
        {(modalType === "documentUpload") && (
          <Dropzone
            files={files}
            setFiles={setFiles}
            content={t("UserPanel.Cases.AddNewCasePage.ClickToUploadDocument")}
          />
        )}
        {modalType === "addressUpload" && (
          <>
            <H3
              text={t("UserPanel.Cases.AddNewCasePage.AddNationalAddress")}
              className="text-center"
            />
            <InputBox
              value={nationalAddress}
              onChange={onNationalAdressChange}
              nameIdHtmlFor={"nationalAddress"}
              type={"text"}
              placeholder={t("UserPanel.Cases.AddNewCasePage.NationalAddress")}
            />
          </>
        )}
        {
          files.length > 0 && files.map((file) => {
            return <Pdf downloadStatus={false} key={file.name} name={file.name} />
          })
        }
      </div>
    </>
  );
};

export default UploadModal;
