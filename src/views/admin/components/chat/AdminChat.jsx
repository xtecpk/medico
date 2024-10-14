import React from 'react'

const AdminChat = () => {
    const location = useLocation().pathname.split("/")[2];
    const [chatType, setChatType] = useState("");

    useEffect(() => {
        setChatType(location);
    }, [location]);

    const [entries, setEntries] = useState([]);
    const [currentEntry, setCurrentEntry] = useState({});
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (chatType === "experts-chat") {
            setEntries(experts);
            setCurrentEntry(experts[0]);
            setMessages(expertsDummyMessages);
        } else if (chatType === "cases-chat") {
            setEntries(cases);
            setCurrentEntry(cases[0]);
            setMessages(casesDummyMessages);
        } else if (chatType === "admin-chat") {
            setEntries([]);
            setCurrentEntry({ name: "admin" });
            setMessages(adminDummyMessages);
        } else if (chatType === "support") {
            setEntries(tickets);
            setCurrentEntry(tickets[0]);
            setMessages(ticketsDummyMessages);
        } else if (chatType === "clients-chat") {
            setEntries(tickets);
            setCurrentEntry(tickets[0]);
            setMessages(ticketsDummyMessages);
        }
    }, [chatType]);

    const [messagesToDisplay, setMessagesToDisplay] = useState(messages);

    useEffect(() => {
        setMessagesToDisplay(
            messages.filter(
                (message) =>
                    message.sender === currentEntry.name ||
                    message.sentTo === currentEntry.name
            )
        );
    }, [currentEntry, messages]);

    const [isLeftSidebarHidden, setisLeftSidebarHidden] = useState(true);
    const toggleLeftSidebar = () => {
        setisLeftSidebarHidden((prevState) => !prevState);
    };
    const [isRightSidebarHidden, setisRightSidebarHidden] = useState(true);
    const toggleRightSidebar = () => {
        setisRightSidebarHidden((prevState) => !prevState);
    };

    // Ticket
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
    const [createTicketModal, setCreateTicketModal] = useState(false);
    const toggleTicketModal = () => {
        setCreateTicketModal((prevState) => !prevState);
    };

    return (
        <>
            <div className="user_chat">
                <CardLayout className="mt-0 p-0 user_chat__inner">
                    {chatType !== "admin-chat" && (
                        <ChatLeftSidebar
                            isLeftSidebarHidden={isLeftSidebarHidden}
                            toggleLeftSidebar={toggleLeftSidebar}
                            chatType={chatType}
                            entries={entries}
                            currentEntry={currentEntry}
                            setCurrentEntry={setCurrentEntry}
                            // Ticket
                            toggleTicketModal={toggleTicketModal}
                        />
                    )}
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
                    />
                </CardLayout>
            </div>
        </>
    )
}

export default AdminChat
