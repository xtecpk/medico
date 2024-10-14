import React, { useEffect, useState } from 'react'
import { Button1, H2, Modal, UploadModal } from '../../../user/components'
import { CardLayout, ChatLeftSidebar, ChatMain, ChatRightSidebar } from '../../../user/containers'
import { useLocation } from 'react-router-dom';
import axios from 'axios';


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
const ticketDummyMessages = [
    {
        text: "Hello Abdullah! I hope you're having a fantastic day. Have you tried the new restaurant downtown? I heard they have amazing food!",
        time: "12:00",
        isMine: false,
        sender: "123456",
        sentTo: null,
    },
    {
        text: "Hey John! Yes, I went there last weekend. The food was indeed incredible. We should plan to go together sometime.",
        time: "12:05",
        isMine: false,
        sender: "123456",
        sentTo: null,
    },
    {
        text: "Arslan, have you read the latest novel by your favorite author? It's a masterpiece!",
        time: "12:10",
        isMine: false,
        sender: "432456",
        sentTo: null,
    },
    {
        text: "Oh wow! I haven't had the chance yet, but I'm definitely going to check it out. Thanks for the recommendation!",
        time: "12:15",
        isMine: false,
        sender: "131109",
        sentTo: null,
    },
]

const RespondTicket = () => {

    const [isLeftSidebarHidden, setisLeftSidebarHidden] = useState(true);
    const [tickets, setTickets] = useState();
    const location = useLocation().pathname.split("/")[2];
    const [createTicketModal, setCreateTicketModal] = useState(false);
    const [chatType, setChatType] = useState("");
    const [isRightSidebarHidden, setisRightSidebarHidden] = useState(true);
    const [entries, setEntries] = useState([]);
    const [currentEntry, setCurrentEntry] = useState({});
    const [messages, setMessages] = useState([]);
    const [messagesToDisplay, setMessagesToDisplay] = useState(messages);
    const [documentUploadModal, setDocumentUploadModal] = useState(false);


    const toggleDocumentUploadModal = () => {
        setDocumentUploadModal((prevState) => !prevState);
    };


    const fetchTickets = async () => {
        await axios.post("http://202.182.110.16/medical/api/login", {
            PhoneNo: "03325501021",
            Password: "abc123"
        }).then(async response => {
            const token = response.data.token;
            await axios.get("http://202.182.110.16/medical/api/getallticket", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(res => {
                setTickets(res.data.response.data)
            }).catch(error => {
                console.log(error);
            })
        })
    }

    const fetchMessages = async () => {
        await axios.post("http://202.182.110.16/medical/api/login", {
            PhoneNo: "03325501021",
            Password: "abc123"
        }).then(async response => {
            const token = response.data.token;
            await axios.post("http://202.182.110.16/medical/api/getmessagebyticketno", {
                TicketNo: currentEntry.TicketNo
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(res => {
                setMessages(res.data.response.data);
            }).catch(error => {
                console.log(error);
            })
        })
    }

    useEffect(() => {
        setChatType(location);
    }, [location]);


    useEffect(() => {
        setMessagesToDisplay(
            messages
        );
    }, [currentEntry, messages]);

    useEffect(() => {
        fetchMessages();
    }, [currentEntry])

    const [newTicket, setNewTicket] = useState({
        subject: "",
        description: "",
        status: "New",
    });
    const ticketInputHandler = (e) => {
        setNewTicket((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };



    useEffect(() => {
        if (chatType === "support") {
            setEntries(tickets);
            tickets && setCurrentEntry(tickets[0]);
            setMessages([]);
        }
    }, [chatType, tickets]);

    useEffect(() => {
        fetchTickets();
    }, []);


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
                    <ChatMain
                        toggleLeftSidebar={toggleLeftSidebar}
                        toggleRightSidebar={toggleRightSidebar}
                        setMessages={setMessages}
                        messagesToDisplay={messagesToDisplay}
                        currentEntry={currentEntry}
                        chatType={chatType}
                        // Ticket
                        ticketInputHandler={ticketInputHandler}
                        newTicket={newTicket}
                        toggleTicketModal={toggleTicketModal}
                        createTicketModal={createTicketModal}
                    />
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

export default RespondTicket
