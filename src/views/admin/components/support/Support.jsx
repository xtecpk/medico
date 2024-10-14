import React, { useEffect, useState } from 'react'
import { Button1, H2, H3, H4, Modal, UploadModal } from '../../../user/components'
import { CardLayout, ChatLeftSidebar, ChatRightSidebar } from '../../../user/containers'
import { NavLink, useLocation } from 'react-router-dom'
import deleteIcon from "./deleteIcon.svg"
import axios from 'axios'
import Cookies from 'js-cookie'

const chatmembers = [
    { name: "asad", type: "Expertise" },
    { name: "faisal", type: "Speciality" },
];

const documents = [
    { name: "Name of the document", size: "120kb", type: "user" },
    { name: "Name of the document", size: "120kb", type: "user" },
    { name: "Name of the document", size: "120kb", type: "experts" },
    { name: "Name of the document", size: "120kb", type: "experts" },
    { name: "Name of the document", size: "120kb", type: "admin" },
    { name: "Name of the document", size: "120kb", type: "admin" },
];

const Support = () => {
    const location = useLocation().pathname.split("/")[2];
    const baseURL = import.meta.env.VITE_BASE_URL;
    const token = Cookies.get('token');

    const [isLeftSidebarHidden, setisLeftSidebarHidden] = useState(true);
    const [createTicketModal, setCreateTicketModal] = useState(false);
    const [chatType, setChatType] = useState("");
    const [isRightSidebarHidden, setisRightSidebarHidden] = useState(true);
    const [entries, setEntries] = useState([]);
    const [currentEntry, setCurrentEntry] = useState();
    const [messages, setMessages] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [documentUploadModal, setDocumentUploadModal] = useState(false);
    const toggleDocumentUploadModal = () => {
        setDocumentUploadModal((prevState) => !prevState);
    };

    const getTcikets = async () => {
        await axios.get(baseURL + "/api/getallticket", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            setTickets(res.data.response.data)
        })
    }

    useEffect(() => {
        getTcikets();
    }, [])


    useEffect(() => {
        setChatType(location);
    }, [location]);


    useEffect(() => {
        if (chatType === "support") {
            setEntries(tickets);
            setCurrentEntry(tickets[0]);
            setMessages([]);
        }
    }, [chatType, tickets]);


    const toggleLeftSidebar = () => {
        setisLeftSidebarHidden((prevState) => !prevState);
    };
    const toggleRightSidebar = () => {
        setisRightSidebarHidden((prevState) => !prevState);
    };
    const toggleTicketModal = () => {
        setCreateTicketModal((prevState) => !prevState);
    };

    return (
        <>
            <H2 text={"SUPPORT"} className='mb-4' />
            <div className="user_chat">
                <CardLayout className="mt-0 p-0 user_chat__inner">
                    <ChatLeftSidebar
                        isLeftSidebarHidden={isLeftSidebarHidden}
                        toggleLeftSidebar={toggleLeftSidebar}
                        chatType={chatType}
                        entries={entries}
                        currentEntry={currentEntry}
                        setCurrentEntry={setCurrentEntry}
                        // Ticket
                        toggleTicketModal={toggleTicketModal}
                        type="support"
                    />
                    <div className="user_chatMain py-3 px-5">
                        <H3 text={"Ticket Details"} className="my-3 fw-700" />
                        <div className="row my-4 mb-5">
                            <div className="col-md-12 d-flex my-2">
                                <H4 text={"SUBJECT"} className='support_light_txt' />
                                <H4 text={currentEntry && currentEntry.Subject} />
                            </div>
                            <div className="col-md-12 d-flex my-2">
                                <H4 text={"DESCRIPTION"} className='support_light_txt' />
                                <H4 text={currentEntry && currentEntry.Description} />
                            </div>
                            <div className="col-md-12 d-flex my-2">
                                <H4 text={"STATUS"} className='support_light_txt' />
                                <select value={currentEntry && currentEntry.Status}>
                                    <option value="1">Active</option>
                                    <option value="2">Completed</option>
                                    <option value="3">Progress</option>
                                </select>
                            </div>
                            <div className="col-md-12 d-flex my-2">
                                <NavLink to={"/admin/support/respond"}>
                                    <Button1 text={"Respond"} className='px-5 mb-3' />
                                </NavLink>
                            </div>
                        </div>
                        <H3 text={"EXPERTS"} className="my-3 fw-700 mt-5" />
                        <div className="row my-4">
                            <div className="col-md-12 d-flex">
                                <select name="" id="" className='px-2' style={{ width: "70%", marginRight: "1rem" }}>
                                    <option value="">Expert Name</option>
                                </select>
                                <Button1 text={"Add"} />
                            </div>
                        </div>
                        <div className="row expert_cards_box">
                            <div className="col-lg-6 col-md-12 my-3">
                                <CardLayout className='p-4'>
                                    <div className="row">
                                        <div className="col-md-10">
                                            <H4 text={"Name of the Expert"} />
                                            <p>Area of experties</p>
                                        </div>
                                        <div className="col-md-2 d-flex text-center align-items-center">
                                            <img src={deleteIcon} alt="" />
                                        </div>
                                    </div>
                                </CardLayout>
                            </div>
                            <div className="col-lg-6 col-md-12 my-3">
                                <CardLayout className='p-4'>
                                    <div className="row">
                                        <div className="col-md-10">
                                            <H4 text={"Name of the Expert"} />
                                            <p>Area of experties</p>
                                        </div>
                                        <div className="col-md-2 d-flex text-center align-items-center">
                                            <img src={deleteIcon} alt="" />
                                        </div>
                                    </div>
                                </CardLayout>
                            </div>
                            <div className="col-lg-6 col-md-12 my-3">
                                <CardLayout className='p-4'>
                                    <div className="row">
                                        <div className="col-md-10">
                                            <H4 text={"Name of the Expert"} />
                                            <p>Area of experties</p>
                                        </div>
                                        <div className="col-md-2 d-flex text-center align-items-center">
                                            <img src={deleteIcon} alt="" />
                                        </div>
                                    </div>
                                </CardLayout>
                            </div>
                        </div>
                    </div>
                    <ChatRightSidebar
                        isRightSidebarHidden={isRightSidebarHidden}
                        toggleRightSidebar={toggleRightSidebar}
                        chatmembers={chatmembers}
                        documents={documents}
                        toggleDocumentUploadModal={toggleDocumentUploadModal}
                        type="support"
                    />
                </CardLayout>
            </div>

            {documentUploadModal && (
                <Modal toggleModal={toggleDocumentUploadModal}>
                    <UploadModal
                        modalType={"documentUpload"}
                        toggleModal={toggleDocumentUploadModal}
                    />
                    <div className="d-flex align-items-center justify-content-between mt-4 ">
                        <Button1
                            onClick={toggleDocumentUploadModal}
                            text={"Cancel"}
                            color="gray"
                        />
                        <Button1
                            onClick={toggleDocumentUploadModal}
                            text={"Submit"}
                        />
                    </div>
                </Modal>
            )}
        </>
    )
}

export default Support
