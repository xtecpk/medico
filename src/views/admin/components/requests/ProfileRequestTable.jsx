import React, { useEffect, useState } from 'react'
import { CardLayout } from '../../../user/containers'
import { Pagination } from '../../../user/components'
import ConfitmationModal from '../membership/ConfitmationModal';
import { DateFormatForUser } from '../../../../components/custom/DateFormatForServer';

const ProfileRequestTable = ({ labels, tableData, approveRequest, denyRequest, isProfileEdit }) => {
    const [casesToDisplay, setCasesToDisplay] = useState(tableData);
    const [pageCasesToDisplay, setPageCasesToDisplay] = useState(tableData);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal1, setShowModal1] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [requestId, setRequestId] = useState();


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

    useEffect(() => {
        setCasesToDisplay(tableData)
    }, [tableData])

    return (
        <>
            <CardLayout className='mt-2'>
                <div className="user_cases_table_outer">
                    {
                        (pageCasesToDisplay?.length !== 0) ? (<table className="user_cases_display_table">
                            <thead>
                                <tr className="user_cases_display_table__head">
                                    {labels.map((label) => {
                                        return <th className="user_cases_display_table__label" >{label}</th>
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {pageCasesToDisplay.map((caseItem, index) => (
                                    <tr key={index} className="user_cases_display_table__row">
                                        <td>{caseItem.RequestId}</td>
                                        {isProfileEdit && <td>{caseItem.ClientId}</td>}
                                        <td>{caseItem.ClientName}</td>
                                        {!isProfileEdit && <>
                                            <td>{caseItem.ExpertName}</td>
                                            <td>{caseItem.CaseName}</td>
                                        </>}
                                        <td>{DateFormatForUser(caseItem.RequestDate)}</td>
                                        <td key={index} className="user_cases_display_table__cell memberActions" onClick={() => setRequestId(caseItem)}>
                                            {
                                                caseItem[isProfileEdit ? "Done" : "Status"] === -1 ? <>
                                                    <button style={{ color: "#46B744" }} onClick={toggleModal1}>Approve</button> /
                                                    <button style={{ color: "#EE3333" }} onClick={toggleModal2}>Deny</button>
                                                </> : (
                                                    caseItem[isProfileEdit ? "Done" : "Status"] === 1 ? "Approved" : "Denied"
                                                )
                                            }
                                        </td>
                                    </tr>
                                ))}
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
                            <button className=" user_button1" onClick={() => approveRequest(requestId).then(toggleModal1)}>
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
                            <button className=" user_button1" onClick={() => denyRequest(requestId).then(toggleModal2)}>
                                <span>Deny</span>
                            </button>
                        </div>
                    </ConfitmationModal>
                </>
            }

        </>
    )
}

export default ProfileRequestTable
