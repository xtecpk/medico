import React from "react";
import "./casesDisplayTable.css";
import { Link } from "react-router-dom";

const CasesDisplayTable = ({ labels, pageCasesToDisplay, keysToDisplay }) => {
  return (
    <>
      {pageCasesToDisplay?.length !== 0 ? (
        <table className="expert_cases_display_table">
          <thead>
            <tr className="expert_cases_display_table__head">
              {labels?.map((label, index) => (
                <th className="expert_cases_display_table__label" key={index}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageCasesToDisplay && pageCasesToDisplay.map((caseItem, index) => (
              <tr key={index} className="expert_cases_display_table__row">
                {keysToDisplay.map((data, dataIndex) =>
                  data === "CaseName" ? (
                    <td key={dataIndex}>
                      <Link
                        className="w-100 d-block expert_cases_display_table__cell_link"
                        to={`/expert/cases/${caseItem.CaseId}`}>
                        {caseItem[data]}
                      </Link>
                    </td>
                  ) : (
                    <td
                      key={dataIndex}
                      className="expert_cases_display_table__cell">
                      {caseItem[data]}
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center">No Cases Found</div>
      )}
    </>
  );
};

export default CasesDisplayTable;
