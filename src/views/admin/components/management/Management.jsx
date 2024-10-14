import React, { useEffect, useRef, useState } from 'react'
import Card from '../Card/Card'
import { Button1, CasesDisplayTable, H2, H3, InputBox, LinkButton1, Modal, Pagination, SearchBar } from '../../../user/components'
import bottomArrow from "./bottomCheveron.png"
import ManagementTable from './ManagementTable'
import plusIcon from "./plusIcon.png"
import filterIcon from "./filter.svg"
import { CardLayout } from '../../../user/containers'
import axios from 'axios'
import Cookies from 'js-cookie'

const Management = () => {

    const baseURL = import.meta.env.VITE_BASE_URL;
    const token = Cookies.get('token');

    const [showModal1, setShowModal1] = useState(false);
    const [packages, setPackages] = useState([]);

    const getAllPackages = async () => {
        await axios.get(baseURL + "/api/getpackages", {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        }).then(res => {
            setPackages(res.data.response.data.reverse())
        })
    }


    const toggleModal1 = () => {
        setShowModal1(!showModal1);
    }

    const getAllMembers = async () => {
        await axios.get(baseURL + "/api/getallmembers", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            setClientMemberships(res.data.response.data)
        }).catch(err => console.log(err));
    }

    const [clientsMemberships, setClientMemberships] = useState([])
    const statusSelectRef = useRef(null);
    const statusSelectRef1 = useRef(null);
    const [searchVal, setSearchVal] = useState("");
    const [casesToDisplay, setCasesToDisplay] = useState(clientsMemberships);
    const [pageCasesToDisplay, setPageCasesToDisplay] = useState(clientsMemberships);
    const [clientType, setClientType] = useState("All");
    const [year, setYear] = useState("All");
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [cardsInfo, setCardsInfo] = useState({
        totalMemberships: "0",
        revenue: "0"
    })
    const [membershipDetails, setMembershipDetails] = useState({
        ClientName: "",
        PhoneNo: "",
        Email: "",
        Address: "",
        Status: 0,
        MeetingDate: "",
        Discount: "",
        PackageId: "",
        UserPassword: "",
        Type: "",
        Year: 1
    })
    const [packageInfo, setPackageInfo] = useState({
        PackageName: "",
        Description: "",
        Fee: "",
        UserType: "Non-Doctor",
    })


    const handleChange = (event) => {
        const { value } = event.target;
        setPackageInfo({
            ...packageInfo,
            [event.target.name]: value,
        })
    }

    const createPackage = async () => {
        await axios.post(baseURL + "/api/addpackage", {
            ...packageInfo
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        }).then(res => {
            toggleModal1()
            setPackageInfo({
                PackageName: "",
                Description: "",
                Fee: "",
                UserType: "Non-Doctor",
            })
            getAllPackages()
        })
    }


    const filterHandler = () => {
        setClientType(statusSelectRef1.current.value);
        setYear(statusSelectRef.current.value)

    };
    useEffect(() => {
        setCasesToDisplay(
            clientsMemberships.filter(
                (item) =>
                    (searchVal === "" ||
                        item.ClientName.toLowerCase().includes(searchVal.toLowerCase())) &&
                    (year === "All" ||
                        item.MeetingDate.includes(year))
                    &&
                    (clientType.toLowerCase() === "all" ||
                        item.Type.includes(clientType))
            )
        );
    }, [searchVal, clientType]);

    const getCardsInfo = async () => {
        const totalContracts = await axios.get(baseURL + "/api/cardcontracts", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        const revenue = await axios.get(baseURL + "/api/cardrevenue", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        setCardsInfo({
            ...cardsInfo,
            revenue: revenue.data.response.data[0].revenue,
            totalMemberships: totalContracts.data.response.data[0].Total
        })

    }

    useEffect(() => {
        const startIndex = (currentPage - 1) * recordsPerPage;
        const endIndex = startIndex + recordsPerPage;

        setPageCasesToDisplay(casesToDisplay.slice(startIndex, endIndex));
    }, [casesToDisplay, currentPage, recordsPerPage]);

    useEffect(() => {
        setCasesToDisplay(clientsMemberships)
    }, [clientsMemberships])

    useEffect(() => {
        setCurrentPage(1);
    }, [recordsPerPage]);

    useEffect(() => {
        getAllPackages();
        getAllMembers();
        getCardsInfo();
    }, [])

    return (
        <>
            {/* <div className="cards_box mb-5">
                <Card>
                    <p>Total Memberships</p>
                    <h1>{cardsInfo.totalMemberships}</h1>
                </Card>
                <Card>
                    <p>Revenue</p>
                    <div className='cardContent'>
                        <h3 className="text-secondary fw-bold  h3_comp" style={{ marginBottom: '12px' }}>SR</h3>
                        <h1>{cardsInfo.revenue} </h1>
                    </div>
                </Card>
            </div> */}
            <div className='space_between mb-3'>
                <H2 text={
                    <>
                        <span className='text-center'>PACKAGES</span>
                        <img src={bottomArrow} className='mx-2' />
                    </>
                } />
                <button className='user_link_button1' onClick={toggleModal1}>
                    <img src={plusIcon} alt="" />
                    <span>Create Package</span>
                </button>
            </div>
            <ManagementTable getAllPackages={getAllPackages} tableData={packages} />

            {
                showModal1 && <>
                    <Modal toggleModal={toggleModal1} modalHead={"Approval Confirmation"}>
                        <div className="user_createTicketForm mb-3">
                            <H3 text={"CREATE PACKAGE"} />
                            <InputBox type={"text"} value={packageInfo.PackageName} nameIdHtmlFor="PackageName" onChange={handleChange} placeholder={"Name"} />
                            <InputBox type={"textarea"} value={packageInfo.Description} onChange={handleChange} nameIdHtmlFor="Description" placeholder={"Description"} />
                            <InputBox type={"number"} value={packageInfo.Fee} onChange={handleChange} nameIdHtmlFor="Fee" placeholder={"Fee"} />
                            {/* <div className="row">
                <div className="col-sm-6" style={{ paddingLeft: "0" }}>
                  <InputBox type={"text"} placeholder={"Amount"} />
                </div>
                <div className="col-sm-6" style={{ paddingRight: "0" }}>
                  <InputBox type={"text"} placeholder={"Discount (%)"} />
                </div>
              </div> */}
                            {/* <InputBox type={"select"} placeholder={"Status"} onChange={(event) => setStatus(event.target.value)} value={status} nameIdHtmlFor="Valid" options={["Active", "Deactive"]} /> */}
                            <InputBox type={"select"} placeholder={"Type"} onChange={handleChange} value={packageInfo.UserType} nameIdHtmlFor="UserType" options={["Non-Doctor", "Aesthetic-Group", "Surgeon", "Non-Surgeon"]} />
                        </div>

                        <div className="d-flex align-items-center justify-content-end ">
                            <button className="mx-3 user_button1 user_button1--gray " onClick={toggleModal1}>
                                <span>Cancel</span>
                            </button>
                            <button className=" user_button1" onClick={createPackage}>
                                <span>Submit</span>
                            </button>
                        </div>
                    </Modal>
                </>
            }

            {/* <div className="user_cases_outer mt-5">
                <div className="d-flex align-items-center justify-content-between ">
                    <H2 text={<>
                        <span className='text-center'>MEMBERSHIPS PURCHASED BY CLIENTS</span>
                        <img src={bottomArrow} className='mx-2' />
                    </>} />
                </div>
                <div className="d-flex flex-column flex-md-row align-items-center justify-content-end gap-4">
                    <SearchBar setSearchVal={setSearchVal} />
                    <div className="user_cases__select_div">
                        <span>{"Year"}</span>
                        <select value={year} ref={statusSelectRef} onChange={(e) => setYear(e.target.value)}>
                            <option>{"All"}</option>
                            <option>{"2023"}</option>
                            <option>{"2022"}</option>
                        </select>
                        <span>{"Client Type"}</span>
                        <select value={clientType} ref={statusSelectRef1} onChange={(e) => setClientType(e.target.value)}>
                            <option>{"All"}</option>
                            <option>{"Doctor"}</option>
                            <option>{"Surgeon"}</option>
                        </select>
                        <Button1
                            onClick={filterHandler}
                            text={"Filter"}
                            icon={filterIcon}
                        />
                    </div>
                </div>
                <CardLayout>
                    <div className="user_cases_table_outer">
                        <CasesDisplayTable
                            labels={[
                                "CLIENT ID",
                                "CLIENT NAME",
                                "CLIENT TYPE",
                                "CONTRACT ID",
                                "CONTRACT NAME",
                                "AMOUNT",
                                "YEAR",
                                "MEETING DATE",
                                "EXISTING CASES"
                            ]}
                            pageCasesToDisplay={pageCasesToDisplay}
                        />
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
            </div> */}

        </>
    )
}

export default Management
