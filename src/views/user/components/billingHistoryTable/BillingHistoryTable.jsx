import React, { useState } from "react";
import "./billingHistoryTable.css";
import { useTranslation } from "react-i18next";
import { DateFormatForUser } from "../../../../components/custom/DateFormatForServer";
import { Alert, Snackbar, Tooltip } from "@mui/material";
import { IoClipboard } from "react-icons/io5";

const BillingHistoryTable = ({ labels, pageRecordsToDisplay }) => {
  const { t } = useTranslation();
  const baseURL = import.meta.env.VITE_BASE_URL;

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false)
  }

  const handleDownload = (path) => {
    const downloadLink = document.createElement('a');
    downloadLink.href = path;
    downloadLink.target = "_blank"
    downloadLink.download = path.split("/").pop();
    document.body.appendChild(downloadLink);

    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const copyPaymentId = (value) => {
    navigator.clipboard.writeText(value);
    setOpen(true)
  }

  return (
    <>
      {pageRecordsToDisplay?.length !== 0 ? (
        <table className="user_billingHistory_table">
          <thead>
            <tr className="user_billingHistory_table__head">
              {labels?.map((label, index) => (
                <th className="user_billingHistory_table__label" key={index}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRecordsToDisplay.map((record, index) => (
              <tr key={index} className="user_billingHistory_table__row">
                <td key={index} className="user_billingHistory_table__cell">{record.index}</td>
                <td key={index} className="user_billingHistory_table__cell">
                  <Tooltip title={record.PaymentId} placement="top" onClick={() => copyPaymentId(record.PaymentId)}>
                    {record.PaymentId.substring(0, 8) + "..."}
                  </Tooltip>
                </td>
                <td key={index} className="user_billingHistory_table__cell">{DateFormatForUser(record.PaymentDate)}</td>
                <td key={index} className="user_billingHistory_table__cell">{record.Amount}</td>
                <td key={index} className="user_billingHistory_table__cell">{record.Status === "Bank Paid" ? t("UserPanel.Billing.BankPaid") : "Card Payment"}</td>
                <td className="user_billingHistory_table__cell">
                  {
                    record.Status === "Bank Paid" ? <button
                      onClick={() => handleDownload(`${baseURL}/receipt/${record.PaymentId}.${record.FileExt}`)}
                    >
                      {t("UserPanel.Profile.Download")}
                    </button> :
                      "----"
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center">{t("No Record Found")}</div>
      )}
      <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          variant="filled"
          style={{ background: "#2f4058" }}
          sx={{ width: '100%' }}
        >
          Copied
        </Alert>
      </Snackbar>
    </>
  );
};

export default BillingHistoryTable;
