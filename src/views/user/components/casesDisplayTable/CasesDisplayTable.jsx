import React from "react";
import "./casesDisplayTable.css";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

const CasesDisplayTable = ({ labels, pageCasesToDisplay, path = "/user/cases/" }) => {
  const { t } = useTranslation();

  const location = useLocation().pathname.split("/").pop();
  const role = useLocation().pathname.split("/")[1];

  return (
    <>
      {pageCasesToDisplay?.length !== 0 ? (
        <table className="user_cases_display_table">
          <thead>
            <tr className="user_cases_display_table__head">
              {labels?.map((label, index) => (
                <th className="user_cases_display_table__label" key={index}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageCasesToDisplay.map((caseItem, index) => (
              <tr key={index} className="user_cases_display_table__row">
                {Object.keys(caseItem).map((data, dataIndex) =>
                  dataIndex === 1 ? (
                    <td key={dataIndex}>
                      {
                        location === 'management' ?
                          caseItem[data] :
                          <Link
                            className="w-100 d-block user_cases_display_table__cell_link"
                            to={path + caseItem.CaseId}>
                            {caseItem[data]}
                          </Link>
                      }
                    </td>
                  ) :
                    (
                      (role === "user") ? (dataIndex < 6 &&
                        <td
                          key={dataIndex}
                          className="user_cases_display_table__cell">
                          {caseItem[data]}
                        </td>)
                        : <td
                          key={dataIndex}
                          className="user_cases_display_table__cell">
                          {caseItem[data]}
                        </td>
                    )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center">{"No Record Found"}</div>
      )}
    </>
  );
};

export default CasesDisplayTable;
