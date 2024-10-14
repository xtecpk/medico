import React, { useEffect, useRef, useState } from "react";
import Card from "../Card/Card";
import {
  Button1,
  CasesDisplayTable,
  H2,
  LinkButton1,
  Pagination,
  SearchBar,
} from "../../../user/components";
import plusIcon from "../management/plusIcon.png";
import filterIcon from "../management/filter.svg";
import { CardLayout } from "../../../user/containers";
import ClientsDisplayTable from "./ClientsDisplayTable";
import axios from "axios";
import Cookies from "js-cookie";

const Clients = () => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const token = Cookies.get("token");
  const numberRegex = /^[0-9]+$/;

  const [clients, setClients] = useState([]);
  const statusSelectRef = useRef(null);
  const [searchVal, setSearchVal] = useState("");
  const [casesToDisplay, setCasesToDisplay] = useState(clients);
  const [pageCasesToDisplay, setPageCasesToDisplay] = useState(clients);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("All");
  const [clientCards, setClientCards] = useState({
    Total: 0,
    Surgeon: "0",
    Non_Surgeon: "0",
    Non_Medical: "0",
    Aesthetic_Surgeon: "0",
  });

  const filterHandler = () => {
    setStatus(statusSelectRef.current.value);
  };

  const getAllClients = async () => {
    await axios
      .get(baseURL + "/api/getallclient", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setClients(
          res.data.response.data.reverse().map((client) => {
            return {
              ClientId: client.ClientId,
              ClientName: client.ClientName,
              ExistingCase: client.ExistingCase,
              UserId: client.UserId,
              Valid: client.Valid,
              PhoneNo: client.PhoneNo,
              Type: client.Type,
              Speciality: client.Speciality,
              Experience: client.Experience,
            };
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getClientsCards = async () => {
    const clientsInfo = await axios.get(baseURL + "/api/cardclients", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    setClientCards({
      Total: clientsInfo.data.response.data[0].Total,
      Surgeon: clientsInfo.data.response.data[0].Surgeon,
      Non_Surgeon: clientsInfo.data.response.data[0]["Non-Surgeon"],
      Non_Medical: clientsInfo.data.response.data[0]["Non-Doctor"],
      Aesthetic_Surgeon: clientsInfo.data.response.data[0]["Aesthetic-Group"],
    });
  };

  useEffect(() => {
    getAllClients();
    getClientsCards();
  }, []);

  useEffect(() => {
    setCasesToDisplay(clients);
  }, [clients]);

  useEffect(() => {
    setCasesToDisplay(
      clients.filter(
        (item) =>
          (searchVal === "" ||
            (numberRegex.test(searchVal)
              ? item.ClientId.toString()
              : item.ClientName
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
            <p>Total Clients</p>
            <h1>{clientCards.Total}</h1>
          </Card>
        </div>
        <div className="p-2 col-md-3">
          <Card>
            <p>Surgeon Doctors</p>
            <h1>{clientCards.Surgeon}</h1>
          </Card>
        </div>
        <div className="p-2 col-md-3">
          <Card>
            <p>Non - Surgeon Doctors</p>
            <h1>{clientCards.Non_Surgeon}</h1>
          </Card>
        </div>
        <div className="p-2 col-md-3">
          <Card>
            <p>Aesthetic-Group</p>
            <h1>{clientCards.Aesthetic_Surgeon}</h1>
          </Card>
        </div>
        <div className="p-2 col-md-3">
          <Card>
            <p>Non-Doctors</p>
            <h1>{clientCards.Aesthetic_Surgeon}</h1>
          </Card>
        </div>
      </div>
      <div className="user_cases_outer mt-5">
        <div className="d-flex align-items-center justify-content-between ">
          <H2 text={"CLIENTS"} />
          <LinkButton1
            text={"Add new Client"}
            icon={plusIcon}
            to={"/admin/clients/add-client"}
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
              path="/admin/clients/"
              labels={[
                "ID",
                "NAME",
                "ExistingCase",
                "User ID",
                "Status",
                "National ID",
                // "PackageId",
                "Type",
                "Speciality",
                "Experience",
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

export default Clients;
