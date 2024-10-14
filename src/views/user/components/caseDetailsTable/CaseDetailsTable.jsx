import React from "react";
import "./caseDetailsTable.css";
import { useTranslation } from "react-i18next";

const CaseDetailsTable = ({ details }) => {

  const { t } = useTranslation();

  return (
    <>
      <table className="user_caseDetailsTable">
        <tbody>
          <tr>
            <td className="user_user_caseDetailsTable_label">{t("UserPanel.Cases.Name")}</td>
            <td className="user_user_caseDetailsTable_value">
              {details && details.CaseName}
            </td>
          </tr>
          <tr>
            <td className="user_user_caseDetailsTable_label">{t("UserPanel.Cases.Type")}</td>
            <td className="user_user_caseDetailsTable_value">
              {details && details.CaseType}
            </td>
          </tr>
          <tr>
            <td className="user_user_caseDetailsTable_label">{t("UserPanel.Cases.Status")}</td>
            <td className="user_user_caseDetailsTable_value">
              {/* {details && details.CaseType} */}
              {details && details.Status}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default CaseDetailsTable;
