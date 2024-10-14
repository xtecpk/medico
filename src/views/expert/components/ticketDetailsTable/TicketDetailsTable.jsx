import React from "react";
import "./ticketDetailsTable.css";
import { useLocation } from "react-router-dom";

const TicketDetailsTable = ({
  labels,
  values,
  statusOptions,
  onStatusChange,
}) => {
  const role = useLocation().pathname.split('/')[1];
  return (
    <>
      <table className="expert_ticketDetailsTable">
        <tbody>
          {labels.map((label, index) => (
            <tr key={index} className="ticketDetailsRow">
              <td className="expert_ticketDetailsTable_label">{label}</td>
              <td className="expert_ticketDetailsTable_value">
                {
                  index === 2 ?
                    (
                      role === "admin" ? <select
                        className="expert_ticketDetailsTable_statusSelect"
                        value={values[index]}
                        onChange={onStatusChange}>
                        {statusOptions.map((option, index) => (
                          <option key={index} value={index}>
                            {option}
                          </option>
                        ))}
                      </select>
                        :
                        values[index] === "0" ? "New" : (values[index] === "1" ? "In Progress" : "Completed")
                    )

                    :
                    values[index]
                }
                {/* {label == "status" && role === "admin" ? (
                  <select
                    className="expert_ticketDetailsTable_statusSelect"
                    value={values[index] === "1" ? "Completed" : "In Progress"}
                    onChange={onStatusChange}>
                    {statusOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <>{values[index] === "1" ? "Completed" : "In Progress"}</>
                )}  */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default TicketDetailsTable;
