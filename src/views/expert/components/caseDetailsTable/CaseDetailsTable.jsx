import React from "react";
import "./caseDetailsTable.css";

const CaseDetailsTable = ({
  labels,
  values,
  options = null,
  optionsLabel = "",
  onOptionChange = null,
  selectValue = "",
}) => {
  return (

    <>
      <table className="expert_caseDetailsTable">
        <tbody>
          {labels.map((label, index) => (
            <tr key={index}>
              <td className="expert_caseDetailsTable_label">{label}</td>
              {label === optionsLabel ? (
                <td>
                  <select
                    value={selectValue}
                    className="expert_caseDetailsTable_select"
                    onChange={onOptionChange}
                    name={optionsLabel}>
                    {options.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>
              ) : (
                <td className="expert_caseDetailsTable_value">
                  {values && values[index]}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default CaseDetailsTable;
