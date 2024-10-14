import React, { useEffect, useState } from "react";
import "./createTicketForm.css";
import InputBox from "../inputBox/InputBox";
import Button1 from "../button1/Button1";
import Dropzone from "../dropzone/Dropzone";
import H3 from "../h3/H3";
import { useTranslation } from "react-i18next";
import Pdf from "../pdf/Pdf";
import axios from "axios";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";

const CreateTicketForm = ({
  newTicket = {},
  ticketInputHandler,
  setClient,
  files,
  setFiles
}) => {
  const { t } = useTranslation();
  const baseURL = import.meta.env.VITE_BASE_URL;
  const token = Cookies.get('token');
  const role = useLocation().pathname.split("/")[1];

  const [clients, setClients] = useState([])

  const getAllClients = async () => {
    await axios.get(baseURL + "/api/getallclient", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      setClients(res.data.response.data)
    }).catch(error => {
      console.log(error);
    })
  }

  useEffect(() => {
    role === "admin" && getAllClients();
  })

  return (
    <>
      <div className="user_createTicketForm">
        <H3 text={t("UserPanel.Chat.CreateTicket")} className="text-center" />
        <InputBox
          type={"text"}
          label={t("UserPanel.Chat.Subject")}
          nameIdHtmlFor={"subject"}
          value={newTicket.subject}
          onChange={ticketInputHandler}
        />
        <InputBox
          type={"textarea"}
          label={t("UserPanel.Chat.Description")}
          nameIdHtmlFor={"description"}
          value={newTicket.description}
          onChange={ticketInputHandler}
        />
        {
          role === "admin" && <select onChange={(e) => setClient(e.target.value)}>
            <option value="0">Client</option>
            {
              clients.length > 0 && clients.map(client => {
                return <option value={client.ClientId}>{client.ClientName}</option>
              })
            }
          </select>
        }
        <InputBox
          type={"select"}
          label={t("UserPanel.Chat.Status")}
          nameIdHtmlFor={"status"}
          options={[t("UserPanel.Chat.New")]}
          value={newTicket.status}
          onChange={ticketInputHandler}
        />
        <div>
          <h5 className="user_createTicketForm__h5">
            {t("UserPanel.Chat.Document")}
          </h5>
          <Dropzone
            content={t("UserPanel.Packages.ClickToUploadDocument")}
            files={files}
            setFiles={setFiles}
            className="my-2"
          />
          {
            files && (files.length > 0 && files.map((file) => {
              return <Pdf key={file.name} name={file.name} size={file.size} />
            }))
          }
          {/* <Button1 text={t("UserPanel.Chat.Upload")} /> */}
        </div>
      </div>
    </>
  );
};

export default CreateTicketForm;
