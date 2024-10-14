import React, { useEffect, useState } from "react";
import "./billing.css";
import { BillingHistoryTable, H2, Pagination } from "../../components";
import { useTranslation } from "react-i18next";
import { BillingChannel, CardLayout } from "../../containers";
import axios from "axios";
import Cookies from "js-cookie";


const Billing = () => {
  const { t } = useTranslation();
  const baseURL = import.meta.env.VITE_BASE_URL;
  const ClientId = Cookies.get("clientId");
  const token = Cookies.get("token");


  const [currentPackage, setCurrentPackage] = useState([]);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsToDisplay, setRecordsToDisplay] = useState([]);
  const [pageRecordsToDisplay, setPageRecordsToDisplay] =
    useState([]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;

    setPageRecordsToDisplay(recordsToDisplay.slice(startIndex, endIndex));
  }, [recordsToDisplay, currentPage, recordsPerPage]);

  const getBillingHistory = async () => {
    await axios.post(baseURL + "/api/getpaymentbyuserid", {
      ClientId
    }, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then(res => {
      setRecordsToDisplay(res.data.response.data.filter(record => record.Status === 'A' ||
        record.Status === "Bank Paid").reverse()
        .map((record, index) => {
          return {
            ...record,
            index: index + 1
          }
        }))
      console.log(res);
    })
  }
  const getCurrentPackage = async () => {
    await axios.post(baseURL + "/api/getcontractbyclient", {
      ClientId: Cookies.get('clientId')
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((res) => {
      console.log(res);
      setCurrentPackage(res.data.response.data);
    })
  }

  useEffect(() => {
    getCurrentPackage()
  }, [])

  useEffect(() => {
    getBillingHistory();
    setCurrentPage(1);
  }, [recordsPerPage]);

  return (
    <>
      <div className="user_billing">
        {/* <H2 text={t("UserPanel.Billing.CurrentBillingChannel")} />
        <CardLayout>
          <BillingChannel packageDetails={currentPackage} />
        </CardLayout> */}
        <H2 text={t("UserPanel.Billing.BillingHistory")} />
        <CardLayout>
          <div className="user_billingHistory__table_outer">
            <BillingHistoryTable
              pageRecordsToDisplay={pageRecordsToDisplay}
              labels={[
                "#",
                t("UserPanel.Billing.PaymentId"),
                t("UserPanel.Billing.PyamentDate"),
                // t("UserPanel.Billing.TransactionDate"),
                // t("UserPanel.Billing.Name"),
                // t("UserPanel.Billing.Type"),
                // t("UserPanel.Billing.Year"),
                // t("UserPanel.Billing.Date"),
                t("UserPanel.Billing.Amount"),
                // t("UserPanel.Cases.Status"),
                // t("UserPanel.Billing.ClientId"),
                // t("UserPanel.Billing.ClientName"),
                t("UserPanel.Billing.PaymentMethod"),
                t("UserPanel.Billing.Invoice"),
              ]}
            />
          </div>
          <div className="user_billing__footer">
            <div className="d-flex gap-4 align-items-center justify-content-center justify-content-md-start">
              <span>{t("UserPanel.Cases.RecordsPerPage")}</span>
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
              recordsToDisplay={recordsToDisplay}
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

export default Billing;
