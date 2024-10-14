import React, { useEffect, useState } from 'react'
import { CardLayout } from '../../../user/containers'
import { CasesDisplayTable, Pagination } from '../../../user/components'
import PromosDisplayTable from '../promos/PromosDisplayTable';

const AdminTable = ({ tableData, labels, type = null, getPromos }) => {
    const [casesToDisplay, setCasesToDisplay] = useState(tableData);
    const [pageCasesToDisplay, setPageCasesToDisplay] = useState(tableData);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const startIndex = (currentPage - 1) * recordsPerPage;
        const endIndex = startIndex + recordsPerPage;

        setPageCasesToDisplay(casesToDisplay.slice(startIndex, endIndex));
    }, [casesToDisplay, currentPage, recordsPerPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [recordsPerPage]);

    useEffect(() => {
        setCasesToDisplay(tableData)
    }, [tableData])

    return (
        <>
            <CardLayout>
                <div className="user_cases_table_outer">
                    {
                        type === "promos" ? <PromosDisplayTable
                            getPromos={getPromos}
                            labels={labels}
                            pageCasesToDisplay={pageCasesToDisplay}
                        /> : <CasesDisplayTable
                            path='/admin/clients/'
                            labels={labels}
                            pageCasesToDisplay={pageCasesToDisplay}
                        />
                    }
                </div>
                <div className="cases_display_footer">
                    <div className="d-flex gap-4 align-items-center justify-content-center justify-content-md-start">
                        <span>{"RecordsPerPage"}</span>
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
        </>
    )
}

export default AdminTable
