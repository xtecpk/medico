import React, { useEffect, useRef, useState } from "react";
import Card from "../Card/Card";
import {
  Button1,
  H2,
  LinkButton1,
  Pagination,
  SearchBar,
} from "../../../user/components";
import { CardLayout } from "../../../user/containers";
import ClientsDisplayTable from "../clients/ClientsDisplayTable";
import plusIcon from "../management/plusIcon.png";
import filterIcon from "../management/filter.svg";
import axios from "axios";
import Cookies from "js-cookie";

const Experts = () => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const token = Cookies.get("token");
  const numberRegex = /^[0-9]+$/;

  const [experts, setExperts] = useState([]);
  const statusSelectRef = useRef(null);
  const [searchVal, setSearchVal] = useState("");
  const [casesToDisplay, setCasesToDisplay] = useState(experts);
  const [pageCasesToDisplay, setPageCasesToDisplay] = useState([]);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("All");
  const [cardInfo, setCardInfo] = useState({
    TotalExpert: "0",
    ActiveExperts: "0",
    InactiveExperts: "0",
    ExpertsInActiveCases: "0",
  });

  const filterHandler = () => {
    setStatus(statusSelectRef.current.value);
  };

  // 
  const getAllExperts = async () => {
    await axios
      .get(baseURL + "/api/getallexperts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        setExperts(res.data.response.data.reverse());
      });
  };

  const getCardInfo = async () => {
    const totalExperts = await axios.get(baseURL + "/api/cardexpertall", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const expertsInActiveCases = await axios.get(
      baseURL + "/api/cardexpertinopencases",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setCardInfo({
      ...cardInfo,
      TotalExpert: totalExperts.data.response.data[0].TotalExpert,
      ActiveExperts: totalExperts.data.response.data[0].Active,
      InactiveExperts: totalExperts.data.response.data[0].Inactive,
      ExpertsInActiveCases:
        expertsInActiveCases.data.response.data[0].TotalExpertOpenCases,
    });
  };

  useEffect(() => {
    getAllExperts();
    getCardInfo();
  }, []);

  useEffect(() => {
    setCasesToDisplay(experts);
  }, [experts]);

  console.log(casesToDisplay);

  useEffect(() => {
    setCasesToDisplay(
      experts.filter(
        (item) =>
          (searchVal === "" ||
            (numberRegex.test(searchVal)
              ? item.ExpertId.toString()
              : item.ExpertName
            )
              .toLowerCase()
              .includes(searchVal.toLowerCase())) &&
          (status.toLowerCase() === "all" || item.Valid == status)
      )
    );
  }, [searchVal, status]);

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
      <div className="row p-2">
        <div className="p-2 col-md-3">
          <Card>
            <p>Total Experts</p>
            <h1>{cardInfo.TotalExpert}</h1>
          </Card>
        </div>
        <div className="p-2 col-md-3">
          <Card>
            <p>Active experts</p>
            <h1>{cardInfo.ActiveExperts}</h1>
          </Card>
        </div>
        <div className="p-2 col-md-3">
          <Card>
            <p>Inactive experts</p>
            <h1>{cardInfo.InactiveExperts}</h1>
          </Card>
        </div>
        <div className="p-2 col-md-3">
          <Card>
            <p>Experts in open cases</p>
            <h1>{cardInfo.ExpertsInActiveCases}</h1>
          </Card>
        </div>
      </div>
      <div className="user_cases_outer mt-5">
        <div className="d-flex align-items-center justify-content-between ">
          <H2 text={"EXPERTS"} />
          <LinkButton1
            text={"Add new Expert"}
            icon={plusIcon}
            to={"/admin/experts/add-expert"}
          />
        </div>
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-end gap-4">
          <SearchBar setSearchVal={setSearchVal} />
          <div className="user_cases__select_div">
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
        <CardLayout>
          <div className="user_cases_table_outer">
            <ClientsDisplayTable
              path="/admin/experts/"
              labels={[
                "ID",
                "NAME",
                "USER ID",
                "Status",
                "Phone Number",
                "EXPERIENCE",
                "EXPERTIES",
                "EMAIL",
                "Adress",
                // "START TIME",
                // "END TIME",
                // "TOTAL CASES",
                // "WON",
                // "LOST",
                // "OPEN"
              ]}
              pageCasesToDisplay={pageCasesToDisplay}
            />
          </div>
          <div className="cases_display_footer">
            <div className="d-flex gap-4 align-items-center justify-content-center justify-content-md-start">
              <span>{"RecordsPerPage"}</span>
              <select
                value={recordsPerPage}
                onChange={(e) => setRecordsPerPage(Number(e.target.value))}
              >
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

export default Experts;
