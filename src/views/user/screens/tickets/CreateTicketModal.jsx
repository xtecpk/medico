import React, { useState } from 'react'
import { Button1, CreateTicketForm, Modal } from '../../components'
import DateFormatForServer from '../../../../components/custom/DateFormatForServer';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const CreateTicketModal = ({ ticketDetails, toggleTicketModal, getTickets, clientId, getChats, setMoveToTicket }) => {
    const clientsID = Cookies.get('clientId');
    const { t } = useTranslation();
    const baseURL = import.meta.env.VITE_BASE_URL;
    const role = useLocation().pathname.split("/")[1];
    const token = Cookies.get('token');
    const chatType = useLocation().pathname.split("/")[2];
    const navigate = useNavigate();
    const clientName = Cookies.get('clientName');

    const [client, setClient] = useState(role === "user" ? clientsID : clientId)
    const [files, setFiles] = useState([]);
    const [newTicket, setNewTicket] = useState(ticketDetails || {
        subject: "",
        description: "",
        status: "New",
    });

    const uploadImage = async () => {
        await axios.post(baseURL + "/api/uploadticketimage", {
            TicketFile: files[0].name,
            ticketimage: files[0]
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            console.log(res.data);
            getChats && getChats()
            toggleTicketModal();
        })
    }

    const redirect = () => {
        setMoveToTicket(true);
        chatType !== "support" && navigate("/user/support");
    }

    const addDocument = async (TicketNo) => {
        await axios.post(baseURL + "/api/adddocumenttoticket", {
            TicketNo,
            DocumentName: files[0].name,
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

    const addNotification = async () => {
        await axios.post(baseURL + '/api/addnotification', {
            Title: "Ticket Added",
            Message: `${clientName} Created a Support Ticket`,
            NotificationType: "Support",
            ReceiverId: 13,
            ReceiverType: "admin"
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    const createTicketHandler = async () => {
        client && await axios.post(baseURL + "/api/addticket", {
            Subject: newTicket.subject,
            Description: newTicket.description,
            ClientId: client,
            Status: 1,
            CreationDate: DateFormatForServer(Date())
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => {
            console.log(res);
            if (res.data.response.status) {
                files.length > 0 && addDocument(res.data.response.data.TicketNo);
                getTickets && getTickets();
                addNotification();
                toggleTicketModal();
                redirect();
            }
        })
    };

    const ticketInputHandler = (e) => {
        setNewTicket((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <>
            <Modal toggleModal={toggleTicketModal}>
                <div className="user_createTicketForm">
                    <div>
                        <h5 className="user_createTicketForm__h5">
                            {t("UserPanel.Chat.Document")}
                        </h5>
                        <CreateTicketForm
                            newTicket={newTicket}
                            setClient={setClient}
                            files={files}
                            setFiles={setFiles}
                            ticketInputHandler={ticketInputHandler}
                        />
                    </div>
                </div>
                <div className="d-flex align-items-center justify-content-end mt-2 ">
                    <Button1
                        onClick={toggleTicketModal}
                        text={t("UserPanel.Cases.AddNewCasePage.Cancel")}
                        color="gray"
                        className="mx-3"
                    />
                    <Button1
                        onClick={createTicketHandler}
                        text={t("UserPanel.Cases.AddNewCasePage.Submit")}
                    />
                </div>
            </Modal>
        </>
    )
}

export default CreateTicketModal
