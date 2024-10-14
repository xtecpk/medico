import "./cases.css";
import React, { useEffect, useRef, useState } from "react";
import {
  Button1,
  CasesDisplayTable,
  H2,
  Pagination,
  SearchBar,
} from "../../components";
import { filterIcon } from "../../assets";
import { CardLayout } from "../../containers";
import Cookies from "js-cookie";

const Cases = ({ cases, getCases }) => {
  const statusSelectRef = useRef(null);
  const ExpertId = Cookies.get('ExpertId')

  const [searchVal, setSearchVal] = useState("");
  const [casesToDisplay, setCasesToDisplay] = useState(cases);
  const [pageCasesToDisplay, setPageCasesToDisplay] = useState(cases);
  const [status, setStatus] = useState("All");
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filterHandler = () => {
    setStatus(statusSelectRef.current.value);
  };

  useEffect(() => {
    setCasesToDisplay(cases)
  }, [cases])

  useEffect(() => {
    setCasesToDisplay(
      cases.filter(
        (item) =>
          (searchVal === "" ||
            item.CaseName.toLowerCase().includes(searchVal.toLowerCase())) &&
          (status.toLowerCase() === "all" ||
            item.Status.toLowerCase() === status.toLowerCase())
      )
    );
  }, [searchVal, status]);

  useEffect(() => {
    getCases(ExpertId)
  }, [])

  useEffect(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;

    setPageCasesToDisplay(casesToDisplay.slice(startIndex, endIndex));
  }, [casesToDisplay, currentPage, recordsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [recordsPerPage]);


  return (
    <>
      <div className="expert_cases_outer">
        <div className="d-flex align-items-center justify-content-between ">
          <H2 text={"Cases"} />
        </div>
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-end gap-4">
          <SearchBar setSearchVal={setSearchVal} />
          <div className="expert_cases__select_div">
            <span>{"Status"}</span>
            <select ref={statusSelectRef}>
              <option>All</option>
              <option>New</option>
              <option>Opened</option>
              <option>UnderReview</option>
              <option>InProgress</option>
              <option>Closed</option>
              <option>Won</option>
              <option>Lost</option>
            </select>
            <Button1
              onClick={filterHandler}
              text={"Filter"}
              icon={filterIcon}
            />
          </div>
        </div>
        <CardLayout>
          <div className="expert_cases_table_outer">
            <CasesDisplayTable
              labels={["Id", "Name", "Description", "Type", "Status",]}
              keysToDisplay={[
                "CaseId",
                "CaseName",
                "Description",
                "CaseType",
                "Status",
              ]}
              pageCasesToDisplay={pageCasesToDisplay}
            />
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
      </div>
    </>
  );
};

export default Cases;
