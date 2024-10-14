import React, { useEffect, useState } from "react";
import { CardLayout } from "../../../user/containers";
import { BillingHistoryTable, H2, Pagination } from "../../../user/components";
import axios from "axios";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

const PaymentsDetails = () => {
  const clientId = location.pathname.split("/").pop();
  const baseURL = import.meta.env.VITE_BASE_URL;
  const token = Cookies.get("token");
  const { t } = useTranslation();

  const [billingHistory, setBillingHistory] = useState([]);
  const [currentPackage, setCurrentPackage] = useState([]);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsToDisplay, setRecordsToDisplay] = useState([]);
  const [pageRecordsToDisplay, setPageRecordsToDisplay] = useState([]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;

    setPageRecordsToDisplay(recordsToDisplay.slice(startIndex, endIndex));
  }, [recordsToDisplay, currentPage, recordsPerPage, billingHistory]);

  const getBillingHistory = async () => {
    await axios
      .post(
        baseURL + "/api/getpaymentbyuserid",
        {
          ClientId: clientId,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
        setBillingHistory(
          res.data.response.data
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
        console.log(res);
      });
  };

  useEffect(() => {
    setRecordsToDisplay(billingHistory);
  }, [billingHistory]);

  useEffect(() => {
    getBillingHistory();
  }, []);

  return (
    <>
      <div className="p-4">
        <H2 className="mb-3" text={"Payment Details"} />
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

export default PaymentsDetails;
