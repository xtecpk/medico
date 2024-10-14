import React, { useEffect, useState } from 'react'
import { CardLayout } from '../../../user/containers'
import { Modal, Pagination } from '../../../user/components'
import ConfitmationModal from './ConfitmationModal';
import axios from 'axios';
import Cookies from 'js-cookie';

const MembershipTable = ({ tableData }) => {


    const baseURL = import.meta.env.VITE_BASE_URL;
    const token = Cookies.get('token');

    const [casesToDisplay, setCasesToDisplay] = useState(tableData);
    const [status, setStatus] = useState("All");
    const [pageCasesToDisplay, setPageCasesToDisplay] = useState(tableData);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal1, setShowModal1] = useState(false)
    const [showModal2, setShowModal2] = useState(false)
    const [memberId, setMemberId] = useState("")


    useEffect(() => {
        setCasesToDisplay(tableData);
    }, [tableData])

    console.log(token);


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
    const approveMembership = async () => {
        await axios.get(baseURL + "/api/approvemember", {
            MemberId: memberId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            console.log(response);
            toggleModal1()
        })
    }

    const rejectMembership = async () => {
        await axios.get(baseURL + "/api/rejectmember", {
            MemberId: memberId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            console.log(response);
            toggleModal2()
        })
    }

    return (
        <>
            <CardLayout className='mt-2'>
                <div className="user_cases_table_outer">
                    {
                        (pageCasesToDisplay?.length !== 0) ? (<table className="user_cases_display_table">
                            <thead>
                                <tr className="user_cases_display_table__head">
                                    <th className="user_cases_display_table__label" >MEMBER ID</th>
                                    <th className="user_cases_display_table__label" >CLIENT NAME</th>
                                    <th className="user_cases_display_table__label" >CLIENT TYPE</th>
                                    <th className="user_cases_display_table__label" >Package NAME</th>
                                    <th className="user_cases_display_table__label" >CONTRACT YEAR</th>
                                    <th className="user_cases_display_table__label" >AMOUNT</th>
                                    <th className="user_cases_display_table__label" >ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    pageCasesToDisplay.map((record, index) => {
                                        return (
                                            <tr key={index} className="user_cases_display_table__row">
                                                <td key={index} className="user_cases_display_table__cell">{record.MemberId}</td>
                                                <td key={index} className="user_cases_display_table__cell">{record.ClientName}</td>
                                                <td key={index} className="user_cases_display_table__cell">{record.Type}</td>
                                                <td key={index} className="user_cases_display_table__cell">{record.PackageName}</td>
                                                <td key={index} className="user_cases_display_table__cell">{record.Year}</td>
                                                <td key={index} className="user_cases_display_table__cell">{record.Fee}</td>
                                                <td key={index} className="user_cases_display_table__cell memberActions" onClick={() => setMemberId(record.MemberId)}>
                                                    <button style={{ color: "#46B744" }} onClick={toggleModal1}>Approve</button> /
                                                    <button style={{ color: "#EE3333" }} onClick={toggleModal2}>Deny</button>
                                                </td>
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
            </CardLayout>

            {
                showModal1 && <>
                    <ConfitmationModal toggleModal={toggleModal1} modalHead={"Approval Confirmation"}>
                        <div className='flex_box my-3'>
                            <p>Are you sure you want to approve this request?</p>
                        </div>
                        <div className="d-flex align-items-center justify-content-end ">
                            <button className="mx-3 user_button1 user_button1--gray " onClick={toggleModal1}>
                                <span>Cancel</span>
                            </button>
                            <button className=" user_button1" onClick={approveMembership}>
                                <span>Approve</span>
                            </button>
                        </div>
                    </ConfitmationModal>
                </>

            }

            {
                showModal2 && <>
                    <ConfitmationModal toggleModal={toggleModal2} modalHead={"Approval Confirmation"}>
                        <div className='flex_box my-3'>
                            <p>Are you sure you want to deny this request?</p>
                        </div>
                        <div className="d-flex align-items-center justify-content-end ">
                            <button className="mx-3 user_button1 user_button1--gray " onClick={toggleModal2}>
                                <span>Cancel</span>
                            </button>
                            <button className=" user_button1" onClick={rejectMembership}>
                                <span>Deny</span>
                            </button>
                        </div>
                    </ConfitmationModal>
                </>
            }

        </>
    )
}

export default MembershipTable
