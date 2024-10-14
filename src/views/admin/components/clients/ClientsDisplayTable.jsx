import React from "react";
import { Link } from "react-router-dom";
import { InputBox } from "../../../user/components";

const ClientsDisplayTable = ({
  labels,
  pageCasesToDisplay,
  path = "/user/clients/",
}) => {
  const role = path.split("/")[2];

  console.log(role);

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
                      <Link
                        className="w-100 d-block user_cases_display_table__cell_link"
                        to={
                          role === "clients"
                            ? path + caseItem.ClientId
                            : path + caseItem.ExpertId
                        }
                      >
                        {/* to={path + caseItem.ClientId}> */}
                        {caseItem[data]}
                      </Link>
                    </td>
                  ) : dataIndex === (role === "clients" ? 4 : 3) ? (
                    <td>
                      {/* <InputBox
                                            value={caseItem.status}
                                            type={"select"}
                                            options={[
                                                "Active", "Deactive"
                                            ]}
                                        /> */}
                      {caseItem[data] === 1 ? "Active" : "Inactive"}
                    </td>
                  ) : (
                    <td
                      key={dataIndex}
                      className="user_cases_display_table__cell"
                    >
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

export default ClientsDisplayTable;
