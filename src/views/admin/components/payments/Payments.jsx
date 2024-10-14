import React, { useEffect, useRef, useState } from "react";
import { Button1, H2, InputBox, SearchBar } from "../../../user/components";
import PaymentTable from "./PaymentTable";
import axios from "axios";
import Cookies from "js-cookie";
import { filterIcon } from "../../../user/assets";
import DateFormatForServer, {
  DateFormatForUser,
} from "../../../../components/custom/DateFormatForServer";

const Payments = () => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const token = Cookies.get("token");

  const statusSelectRef = useRef(null);
  const [date, setDate] = useState();
  const [searchVal, setSearchVal] = useState("");
  const [status, setStatus] = useState("All");
  const [payments, setPayments] = useState([]);
  const [casesToDisplay, setCasesToDisplay] = useState([]);

  const filterHandler = () => {
    setStatus(statusSelectRef.current.value);
  };

  const getPayments = async () => {
    await axios
      .get(baseURL + "/api/getallpayment", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((reponse) => {
        console.log(reponse);
        setPayments(
          reponse.data.response.data
            .reverse()
            .filter((payment, index) => {
              if (payment.Status === "A" || payment.Status === "Bank Paid") {
                return payment;
              }
            })
            .map((payment, index) => {
              return {
                ...payment,
                index: index + 1,
              };
            })
        );
      });
  };

  useEffect(() => {
    getPayments();
  }, []);

  useEffect(() => {
    setCasesToDisplay(
      payments.filter(
        (item) =>
          (searchVal === "" ||
            item.ClientName.toLowerCase().includes(searchVal.toLowerCase())) &&
          (status.toLowerCase() === "all" || item.PaymentMethod == status) &&
          (date
            ? DateFormatForUser(date) === DateFormatForUser(item.TransDate)
            : true)
      )
    );
  }, [searchVal, status, payments, date]);

  return (
    <>
      <H2 text={"PAYMENTS"} className="mb-4" />
      <div className="d-flex flex-column flex-md-row align-items-center justify-content-end gap-4 mb-3">
        <SearchBar setSearchVal={setSearchVal} />
        <div className="user_searchbar_div">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="Date"
          />
        </div>
        <div className="user_cases__select_div">
          <span>{"Payment Method"}</span>
          <select ref={statusSelectRef}>
            <option value={"all"}>{"All"}</option>
            <option value={"Card"}>{"Card Payment"}</option>
            <option value={"Bank"}>{"Bank Payment"}</option>
          </select>
          <Button1 onClick={filterHandler} text={"Filter"} icon={filterIcon} />
        </div>
      </div>
      <PaymentTable
        tableData={casesToDisplay}
        labels={[
          "#",
          "PAYMENT ID",
          // "CLIENT",
          // "PHONE NO",
          // "AMOUNT",
          // "CHANNEL",
          // "ACCOUNT NO",
          // "Trx ID",
          // "DATE",\
          "Trx ID",
          "Client ",
          "Package ",
          "Payment Method",
          // "Card No",
          "Transaction Date",
          "Amount",
          // "STATUS",
          // "ACTION"
        ]}
      />
    </>
  );
};

export default Payments;
