import React, { useEffect, useRef, useState } from 'react'
import { CardLayout } from '../../../user/containers';
import { Button1, H3, InputBox, Modal, Pagination, SearchBar } from '../../../user/components';
import ConfitmationModal from '../membership/ConfitmationModal';
import axios from 'axios';
import Cookies from 'js-cookie';
import filterIcon from "../management/filter.svg"

const ManagementTable = ({ tableData, getAllPackages }) => {

  const baseURL = import.meta.env.VITE_BASE_URL;
  const token = Cookies.get('token');

  const statusSelectRef = useRef(null);
  const userTypeSelectRef = useRef(null);

  const [searchVal, setSearchVal] = useState("");
  const [filterStatus, setFilterStatus] = useState("All")
  const [casesToDisplay, setCasesToDisplay] = useState(tableData);
  const [status, setStatus] = useState("Active");
  const [packageInfo, setPackageInfo] = useState();
  const [packageId, setPackageId] = useState();
  const [pageCasesToDisplay, setPageCasesToDisplay] = useState(tableData);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [userType, setUserType] = useState("All");

  const filterHandler = () => {
    setFilterStatus(statusSelectRef.current.value);
    setUserType(userTypeSelectRef.current.value);
  };

  useEffect(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;

    setPageCasesToDisplay(casesToDisplay.slice(startIndex, endIndex));
  }, [casesToDisplay, currentPage, recordsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [recordsPerPage]);

  useEffect(() => {
    setCasesToDisplay(tableData);
  }, [tableData])

  const toggleModal1 = () => {
    setShowModal1(!showModal1);
  }
  const toggleModal2 = () => {
    setShowModal2(!showModal2);
  }

  const handleChange = (event) => {
    const { value } = event.target;
    setPackageInfo({
      ...packageInfo,
      [event.target.name]: value,
    })
  }

  const updatePackageInfo = async () => {
    await axios.post(baseURL + "/api/updatepackage", {
      ...packageInfo,
      Valid: status === "Active" ? 1 : 0
      // Valid: 0
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      console.log(res);
      getAllPackages()
      toggleModal1()
    })
  }

  const deletePackage = async () => {
    console.log(packageId);
    await axios.post(baseURL + "/api/deletepackage", {
      PackageId: packageId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      toggleModal2();
      getAllPackages();
    })
  }

  useEffect(() => {
    setCasesToDisplay(
      tableData.filter(
        (item) =>
          (searchVal === "" ||
            item.PackageName.toLowerCase().includes(searchVal.toLowerCase()))
          &&
          (filterStatus === "All" ||
            item.Valid == filterStatus)
          &&
          (userType === "All" ||
            item.UserType == userType)
      )
    );
  }, [searchVal, filterStatus, userType]);

  return (
    <>
      <div className="d-flex flex-column flex-md-row align-items-center justify-content-end gap-4 mb-3">
        <SearchBar setSearchVal={setSearchVal} />
        <div className="user_cases__select_div">
          <span>{"User Type"}</span>
          <select ref={userTypeSelectRef}>
            <option value={"All"}>{"All"}</option>
            <option value={"Non-Surgeon"}>{"Non-Surgeon"}</option>
            <option value={"Surgeon"}>{"Surgeon"}</option>
            <option value={"Aesthetic-Group"}>{"Aesthetic-Group"}</option>
            <option value={"Non-Doctor"}>{"Non-Doctor"}</option>
          </select>
          <span>{"Status"}</span>
          <select ref={statusSelectRef}>
            <option value={"All"}>{"All"}</option>
            <option value={1}>{"Active"}</option>
            <option value={0}>{"Inactive"}</option>
          </select>
          <Button1
            onClick={filterHandler}
            text={"Filter"}
            icon={filterIcon}
          />
        </div>
      </div>
      <CardLayout className='mt-2'>
        <div className="user_cases_table_outer">
          {
            (pageCasesToDisplay?.length !== 0) ? (<table className="user_cases_display_table">
              <thead>
                <tr className="user_cases_display_table__head">
                  {/* <th className="user_cases_display_table__label" >#</th> */}
                  <th className="user_cases_display_table__label" >ID</th>
                  <th className="user_cases_display_table__label" >NAME</th>
                  <th className="user_cases_display_table__label" >DESCRIPTION</th>
                  <th className="user_cases_display_table__label" >YEAR</th>
                  <th className="user_cases_display_table__label" >TYPE</th>
                  <th className="user_cases_display_table__label" >AMOUNT</th>
                  <th className="user_cases_display_table__label" >STATUS</th>
                  <th className="user_cases_display_table__label" >ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {
                  pageCasesToDisplay.map((record, index) => {
                    return (
                      <tr key={index} className="user_cases_display_table__row">
                        {/* <td key={index} className="user_cases_display_table__cell">{index + 1}</td> */}
                        <td key={index} className="user_cases_display_table__cell">{record.PackageId}</td>
                        <td key={index} className="user_cases_display_table__cell">{record.PackageName}</td>
                        <td key={index} className="user_cases_display_table__cell">{record.Description}</td>
                        <td key={index} className="user_cases_display_table__cell">{record.Valid}</td>
                        <td key={index} className="user_cases_display_table__cell">{record.UserType}</td>
                        <td key={index} className="user_cases_display_table__cell">{record.Fee}</td>
                        <td key={index} className="user_cases_display_table__cell">{record.Valid === 1 ? "Active" : "Deactive"}</td>
                        <td key={index} className="user_cases_display_table__cell memberActions">
                          <button style={{ color: "#3573C9" }}
                            onClick={() => {
                              toggleModal1();
                              setPackageInfo(record);
                              setStatus(record.Valid === 1 ? "Active" : "Deactive")
                            }}>Edit</button>
                          {/*
                             /
                           <button style={{ color: "#EE3333" }} onClick={() => {
                            toggleModal2();
                            setPackageId(record.PackageId);
                          }}>In Active</button> */}
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
          <Modal toggleModal={toggleModal1} modalHead={"Approval Confirmation"}>
            <div className="user_createTicketForm mb-3">
              <H3 text={"UPDATE PACKAGE"} />
              <InputBox type={"text"} value={packageInfo && packageInfo.PackageName} nameIdHtmlFor="PackageName" onChange={handleChange} placeholder={"Name"} />
              <InputBox type={"textarea"} value={packageInfo && packageInfo.Description} onChange={handleChange} nameIdHtmlFor="Description" placeholder={"Description"} />
              <InputBox type={"number"} value={packageInfo && packageInfo.Fee} onChange={handleChange} nameIdHtmlFor="Fee" placeholder={"Fee"} />
              {/* <div className="row">
                <div className="col-sm-6" style={{ paddingLeft: "0" }}>
                  <InputBox type={"text"} placeholder={"Amount"} />
                </div>
                <div className="col-sm-6" style={{ paddingRight: "0" }}>
                  <InputBox type={"text"} placeholder={"Discount (%)"} />
                </div>
              </div> */}
              <InputBox type={"select"} placeholder={"Status"} onChange={(event) => setStatus(event.target.value)} value={status} nameIdHtmlFor="Valid" options={["Active", "Deactive"]} />
              <InputBox type={"select"} placeholder={"Type"} onChange={handleChange} value={packageInfo && packageInfo.UserType} nameIdHtmlFor="UserType" options={["Non-Doctor", "Aesthetic-Group", "Surgeon", "Non-Surgeon"]} />
            </div>

            <div className="d-flex align-items-center justify-content-end ">
              <button className="mx-3 user_button1 user_button1--gray " onClick={toggleModal1}>
                <span>Cancel</span>
              </button>
              <button className=" user_button1" onClick={updatePackageInfo}>
                <span>Update</span>
              </button>
            </div>

          </Modal>
        </>

      }

      {
        showModal2 && <>
          <ConfitmationModal toggleModal={toggleModal2} modalHead={"Approval Confirmation"}>
            <div className='flex_box my-3'>
              <p>Are you sure you want to Delete this Package?</p>
            </div>
            <div className="d-flex align-items-center justify-content-end ">
              <button className="mx-3 user_button1 user_button1--gray " onClick={toggleModal2}>
                <span>Cancel</span>
              </button>
              <button className=" user_button1" onClick={deletePackage}>
                <span>Delete</span>
              </button>
            </div>
          </ConfitmationModal>
        </>
      }


    </>
  )
}

export default ManagementTable
