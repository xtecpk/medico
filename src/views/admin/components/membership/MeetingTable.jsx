import React, { useEffect, useState } from 'react'
import { CardLayout } from '../../../user/containers'
import { InputBox, Modal, Pagination } from '../../../user/components'
import ConfitmationModal from './ConfitmationModal';
import axios from 'axios';
import Cookies from 'js-cookie';
import { DateFormatForUser } from '../../../../components/custom/DateFormatForServer';
import { Alert, Snackbar, Tooltip } from '@mui/material';

const MeetingTable = ({ tableData, getMeetings, actions = true }) => {


    const baseURL = import.meta.env.VITE_BASE_URL;
    const token = Cookies.get('token');

    const [casesToDisplay, setCasesToDisplay] = useState(tableData);
    const [status, setStatus] = useState("All");
    const [pageCasesToDisplay, setPageCasesToDisplay] = useState(tableData);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal1, setShowModal1] = useState(false)
    const [showModal2, setShowModal2] = useState(false)
    const [meetingInfo, setMeetingInfo] = useState();
    const [message, setMessage] = useState("");
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false)
    }

    useEffect(() => {
        setCasesToDisplay(tableData);
    }, [tableData])


    useEffect(() => {
        const startIndex = (currentPage - 1) * recordsPerPage;
        const endIndex = startIndex + recordsPerPage;

        setPageCasesToDisplay(casesToDisplay.slice(startIndex, endIndex));
    }, [casesToDisplay, currentPage, recordsPerPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [recordsPerPage]);

    const toggleModal1 = () => {
        setShowModal1(!showModal1);
    }
    const toggleModal2 = () => {
        setShowModal2(!showModal2);
    }
    const approveMeeting = async () => {
        console.log(message);
        await axios.post(baseURL + "/api/approvemeeting", {
            MeetingId: meetingInfo.MemberId,
            Email: meetingInfo.Email,
            Message: message
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            console.log(response);
            getMeetings()
            toggleModal1()
        })
    }

    const rejectMeeting = async () => {
        await axios.post(baseURL + "/api/rejectmeeeting", {
            MeetingId: meetingInfo.MemberId,
            Email: meetingInfo.Email,
            Message: message
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            console.log(response);
            getMeetings();
            toggleModal2();
        })
    }

    const updateMeetingStatus = async (e) => {
        console.log(e.target.value);
        await axios.post(baseURL + "/api/updatemeetingStatus", {
            MeetingId: meetingInfo.MemberId,
            Status: parseInt(e.target.value)
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            console.log(response);
            getMeetings();
        })
    }

    const copyAdress = (value) => {
        navigator.clipboard.writeText(value);
        setOpen(true)
    }

    return (
        <>
            <CardLayout className='mt-2'>
                <div className="user_cases_table_outer">
                    {
                        (pageCasesToDisplay?.length !== 0) ? (<table className="user_cases_display_table">
                            <thead>
                                <tr className="user_cases_display_table__head">
                                    {/* <th className="user_cases_display_table__label" >#</th> */}
                                    <th className="user_cases_display_table__label" >MEMBER ID</th>
                                    <th className="user_cases_display_table__label" >CLIENT NAME</th>
                                    <th className="user_cases_display_table__label" >CLIENT TYPE</th>
                                    <th className="user_cases_display_table__label" >EMAIL</th>
                                    <th className="user_cases_display_table__label" >Adress</th>
                                    <th className="user_cases_display_table__label" >PHONE NO.</th>
                                    <th className="user_cases_display_table__label" >STATUS</th>
                                    <th className="user_cases_display_table__label" >MEETING DATE</th>
                                    {/* <th className="user_cases_display_table__label" >YEAR</th> */}
                                    {
                                        actions && <th className="user_cases_display_table__label" >ACTION</th>
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    pageCasesToDisplay.map((record, index) => {
                                        return (
                                            <tr key={index} className="user_cases_display_table__row">
                                                {/* <td key={index} className="user_cases_display_table__cell">{index + 1}</td> */}
                                                <td key={index} className="user_cases_display_table__cell">{record.MemberId}</td>
                                                <td key={index} className="user_cases_display_table__cell">{record.ClientName}</td>
                                                <td key={index} className="user_cases_display_table__cell">{record.Type}</td>
                                                <td key={index} className="user_cases_display_table__cell">{record.Email}</td>
                                                <td key={index} className="user_cases_display_table__cell">
                                                    <Tooltip title={record.Address} placement="top" onClick={() => copyAdress(record.Address)}>
                                                        {record.Address.split("/").pop() + "..."}
                                                    </Tooltip>
                                                </td>
                                                <td key={index} className="user_cases_display_table__cell">{record.PhoneNo}</td>
                                                <td key={index} className="user_cases_display_table__cell" onClick={() => setMeetingInfo(record)}>
                                                    <div className={` user_input_box `}>
                                                        <select value={record.MeetingStatus} onChange={updateMeetingStatus}>
                                                            <option value="-1">New</option>
                                                            <option value="1">Approved</option>
                                                            <option value="0">Denied</option>
                                                            <option value="2">Conducted</option>
                                                        </select>
                                                    </div>
                                                </td>
                                                <td key={index} className="user_cases_display_table__cell">{
                                                    DateFormatForUser(record.MeetingDate)
                                                }</td>
                                                {/* <td key={index} className="user_cases_display_table__cell">{record.Year}</td> */}
                                                {
                                                    actions &&
                                                    <td key={index} className="user_cases_display_table__cell memberActions" onClick={() => setMeetingInfo(record)}>
                                                        <button style={{ color: "#46B744" }} onClick={toggleModal1}>Approve</button> /
                                                        <button style={{ color: "#EE3333" }} onClick={toggleModal2}>Deny</button>
                                                    </td>
                                                }
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>) : (
                            <div className="text-center">{"No Record Found"}</div>
                        )
                    }
                </div>
                <div className="cases_display_footer">
                    <div className="d-flex gap-4 align-items-center justify-content-center justify-content-md-start">
                        <span>{"Records / Page"}</span>
                        <select
                            value={recordsPerPage}
                            onChange={(e) => setRecordsPerPage(Number(e.target.value))}>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={30}>30</option>
                            <option value={40}>40</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                    <Pagination
                        recordsToDisplay={casesToDisplay}
                        recordsPerPage={recordsPerPage}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />

                </div>
            </CardLayout >

            <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    variant="filled"
                    style={{ background: "#2f4058" }}
                    sx={{ width: '100%' }}
                >
                    Copied
                </Alert>
            </Snackbar>

            {
                showModal1 && <>
                    <ConfitmationModal toggleModal={toggleModal1} modalHead={"Approval Confirmation"}>
                        <div className='px-1 mt-3'>
                            <p>Are you sure you want to approve this request?</p>
                        </div>
                        {/* <InputBox type={"text"} className='mb-3' label={"Message to User"} placeholder={"Type your message here..."} /> */}
                        <InputBox type={"textarea"} label={"Message to User"} value={message} onChange={(e) => setMessage(e.target.value)} className='mb-4' placeholder={"Type your message here..."} />
                        <div className="d-flex align-items-center justify-content-end ">
                            <button className="mx-3 user_button1 user_button1--gray " onClick={toggleModal1}>
                                <span>Cancel</span>
                            </button>
                            <button className=" user_button1" onClick={approveMeeting}>
                                <span>Approve</span>
                            </button>
                        </div>
                    </ConfitmationModal>
                </>

            }

            {
                showModal2 && <>
                    <ConfitmationModal toggleModal={toggleModal2} modalHead={"Deny Confirmation"}>
                        <div className='px-1 mt-3'>
                            <p>Are you sure you want to approve this request?</p>
                        </div>
                        <InputBox type={"textarea"} label={"Message to User"} value={message} onChange={(e) => setMessage(e.target.value)} className='mb-4' placeholder={"Type your message here..."} />
                        <div className="d-flex align-items-center justify-content-end ">
                            <button className="mx-3 user_button1 user_button1--gray " onClick={toggleModal2}>
                                <span>Cancel</span>
                            </button>
                            <button className=" user_button1" onClick={rejectMeeting}>
                                <span>Deny</span>
                            </button>
                        </div>
                    </ConfitmationModal>
                </>
            }
        </>
    )
}

export default MeetingTable
