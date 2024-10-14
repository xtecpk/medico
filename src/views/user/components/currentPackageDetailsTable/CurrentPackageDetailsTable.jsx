import React from "react";
import "./currentPackageDetailsTable.css";
import { useTranslation } from "react-i18next";
import { DateFormatForUser, daysRemaining } from "../../../../components/custom/DateFormatForServer";
import Button1 from "../button1/Button1";
import { useNavigate } from "react-router-dom";

const CurrentPackageDetailsTable = ({ data }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // write a function to find no of days between two dates  fromat ("Fri Jan 05 2024 00:32:37 GMT+0500 (Pakistan Standard Time)")

  console.log(data);

  return (
    <>
      <table className="user_current_package_details_table mb-4">
        <tbody>
          <CurrentPackageDetailsTableRow
            dataKey={t("UserPanel.Packages.Name")}
            dataValue={data && (data[0]["PackageName"] || data[0]["Contract Name"])}
          />
          {/* <CurrentPackageDetailsTableRow
            dataKey={t("UserPanel.Packages.Description")}
            dataValue={data && data[0]["Description"]}
          /> */}
          <CurrentPackageDetailsTableRow
            dataKey={t("UserPanel.Packages.Year")}
            dataValue={data && data[0]["Year"]}
          />
          <CurrentPackageDetailsTableRow
            dataKey={t("UserPanel.Packages.Amount")}
            dataValue={`${data && data[0]["Fee"]} SR`}
          />
          <CurrentPackageDetailsTableRow
            dataKey={t("UserPanel.Packages.DateOfContract")}
            dataValue={data && DateFormatForUser(data[0]["ContractDate"])}
          />
          <CurrentPackageDetailsTableRow
            dataKey={t("UserPanel.Packages.DateOfExpiry")}
            dataValue={data && DateFormatForUser(data[0]["ExpiryDate"])}
          />
          <CurrentPackageDetailsTableRow
            dataKey={t("UserPanel.Packages.TimeRemaining")}
            dataValue={`${data && daysRemaining(data[0]["ExpiryDate"])}`}
          />
        </tbody>
      </table>

      <Button1
        onClick={() => navigate(`/user/packages/${data[0].PackageId}`)}
        text={t("UserPanel.Packages.ExtendPackage")}
      />
    </>
  );
};

const CurrentPackageDetailsTableRow = ({ dataKey, dataValue }) => {
  return (
    <>
      <tr>
        <td className="user_current_package_details_table__key py-3 px-2 px-sm-3">
          {dataKey}
        </td>
        <td className="current_package_details_table__value py-3 px-2 px-sm-3">
          {dataValue}
        </td>
      </tr>
    </>
  );
};

export default CurrentPackageDetailsTable;
