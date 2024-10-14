import React, { useEffect, useState } from 'react'
import { H2 } from '../../../user/components'
import ProfileRequestTable from './ProfileRequestTable'
import axios from 'axios';
import Cookies from 'js-cookie';
import { Alert, Snackbar } from '@mui/material';

const ProfileRequests = () => {

    const baseUrl = import.meta.env.VITE_BASE_URL;
    const token = Cookies.get('token');

    const [open, setOpen] = useState(false)
    const [profileEditRequests, setProfileEditRequests] = useState([]);
    const [removeExpertRequests, setRemoveExpertRequests] = useState([]);
    const [message, setMessage] = useState("")
    const [caseChatId, setCaseChatId] = useState();

    const handleClose = () => {
        setOpen(false)
    }

    const getProfileEditRequests = async () => {
        await axios.get(baseUrl + "/api/geteditprofilerequest", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            setProfileEditRequests(res.data.response.data.reverse());
        })
    }

    const getRemoveExpertRequests = async () => {
        await axios.get(baseUrl + "/api/getexpertremoverequest", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            setRemoveExpertRequests(res.data.response.data.reverse());
        })
    }

    const removeExpertFromCase = async (request) => {
        await axios.post(baseUrl + "/api/removexpertfromcase", {
            ExpertId: request.ExpertId,
            CaseId: request.CaseId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            getCaseChat(request.CaseId, request.ExpertId)
        })
    }

    const removeMemberFromChat = async (ExpertId, chatId) => {
        await axios.post(baseUrl + "/api/removememberfromchat", {
            ChatId: chatId,
            MemberId: ExpertId,
            MemberType: "Expert"
        }, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(response => {
            console.log(response);
            setMessage("Expert Removed Successfully")
            setOpen(true)
        })
    }

    const getCaseChat = async (CaseId, expertId) => {
        await axios.post(baseUrl + "/api/getchatbyclientandtype", {
            ClientId: CaseId,
            ChatType: "Case"
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            removeMemberFromChat(expertId, res.data.response.data[0].ChatId);
            setCaseChatId(res.data.response.data[0].ChatId)
            setMessage("Expert Removed Successfully")
            setOpen(true)
        })
    }


    const addNotification = async (title, message, recieverId) => {
        await axios.post(baseUrl + '/api/addnotification', {
            Title: title,
            Message: message,
            NotificationType: "Request",
            ReceiverId: recieverId,
            ReceiverType: "user"
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }


    const approveRemoveExpertRequest = async (request) => {
        await axios.post(baseUrl + "/api/approveexpertremoverequest", {
            RequestId: request.RequestId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            removeExpertFromCase(request);
            addNotification("Remove Expert Request", "Your Request to remove expert is Approved!", request.ClientId);
            getRemoveExpertRequests();
        })
    }

    const allowToEdit = async (request) => {
        await axios.post(baseUrl + "/api/updateallowclientedit", {
            ClientId: request.ClientId,
            AllowEdit: 1
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            console.log(res);
            if (res.data.response.status) {
                setMessage("Request Approved!");
                setOpen(true)
            }
        })
    }

    const disAllowToEdit = async (request) => {
        await axios.post(baseUrl + "/api/updateallowclientedit", {
            ClientId: request.ClientId,
            AllowEdit: 0
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            console.log(res);
            if (res.data.response.status) {
                setMessage("Request Denied!");
                setOpen(true)
            }
        })
    }


    const approveProfileEditRequest = async (request) => {
        await axios.post(baseUrl + "/api/approveeditprofileequest", {
            RequestId: request.RequestId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            allowToEdit(request);
            addNotification("Profile Edit Request", "Your Profile Edit Request is Approved!", request.ClientId);
            getProfileEditRequests();
        })
    }

    const denyRemoveExpertRequest = async (request) => {
        await axios.post(baseUrl + "/api/denyexpertremoverequest", {
            RequestId: request.RequestId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            getRemoveExpertRequests();
            addNotification("Remove Expert Request", "Your Request to remove expert is Denied!", request.ClientId);
        })
    }

    const denyProfileEditRequest = async (request) => {
        await axios.post(baseUrl + "/api/denyeditprofilerequest", {
            RequestId: request.RequestId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            disAllowToEdit(request);
            addNotification("Profile Edit Request", "Your Profile Edit Request is Denied!", request.ClientId);
            getProfileEditRequests();
        })
    }

    useEffect(() => {
        getProfileEditRequests();
        getRemoveExpertRequests();
    }, [])

    return (
        <>
            <H2 text={"PROFILE EDIT REQUESTS"} className='mb-4' />
            <ProfileRequestTable
                isProfileEdit={true}
                tableData={profileEditRequests}
                approveRequest={approveProfileEditRequest}
                denyRequest={denyProfileEditRequest}
                labels={[
                    "ID",
                    "Client Id",
                    "CLIENT Name",
                    "Date",
                    "ACTIONS"
                ]} />

            <H2 text={"REMOVE EXPERT REQUESTS"} className='my-4 mt-5' />
            <ProfileRequestTable
                tableData={removeExpertRequests}
                approveRequest={approveRemoveExpertRequest}
                denyRequest={denyRemoveExpertRequest}
                labels={[
                    "ID",
                    "CLIENT Name",
                    "EXPERT NAME",
                    "CASE NAME",
                    "Date",
                    "ACTIONS"
                ]} />

            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    // severity="success"
                    variant="filled"
                    style={{ background: "#2f4058" }}
                    sx={{ width: '100%' }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </>
    )
}

export default ProfileRequests
