import axios from "axios";
import "./packages.css";
import React, { useEffect, useState } from "react";
import { CardLayout } from "../../containers";
import { CurrentPackageDetailsTable, H2, H3 } from "../../components";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

// const currentPackage = {
//   pkgName: "Full Protection",
//   description:
//     "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut.",
//   year: 2,
//   amount: 5000,
//   dateOfContract: "12/04/2022",
//   timeRemaining: 45,
// };

const Packages = ({ availablePackages }) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const token = Cookies.get("token");
  const ClientId = Cookies.get("clientId");
  const { t } = useTranslation();

  const [currentPackage, setCurrentPackage] = useState([]);

  const getCurrentPackage = async () => {
    await axios
      .post(
        baseURL + "/api/getcontractbyclient",
        {
          ClientId: Cookies.get("clientId"),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        setCurrentPackage(
          res.data.response.data.filter((record) => record.Status == 1)
        );
      });
  };

  useEffect(() => {
    getCurrentPackage();
  }, []);

  const [selectedPkg, setSelectedPkg] = useState([]);

  useEffect(() => {
    const storedArray = localStorage.getItem("package");

    if (storedArray) {
      setSelectedPkg([JSON.parse(storedArray)]);

      // console.log(storedArray);
    }
  }, []);

  // console.log(selectedPkg);

  return (
    <>
      <div className="user_packages_outer">
        <H2 text={t("UserPanel.Packages.CurrentPackage")} />
        <CardLayout>
          <H3 text={t("UserPanel.Packages.PackageDetails")} />
          <div className="user_packages_table_outer">
            {currentPackage.length > 0 ? (
              <CurrentPackageDetailsTable data={currentPackage} />
            ) : (
              <p>{t("UserPanel.Packages.packageNotPurchased")}</p>
            )}
          </div>
        </CardLayout>
        <H2 text={t("UserPanel.Packages.AvailablePackages")} />
        <div className="user_packages__available_packages_outer">
          {availablePackages &&
            availablePackages.map(({ PackageName, Fee, PackageId }, index) => (
              <Link
                key={index}
                to={`/user/packages/${PackageId}`}
                className={
                  "user_packages__available_packages_btn text-center align-items-center d-flex flex-column"
                }
              >
                <H3 text={PackageName} className={"flex-grow-1 "} />
                <p>{t("UserPanel.Packages.ContractWithVat")}</p>
                <div className="d-flex align-items-baseline justify-content-center gap-2">
                  <H2 text={Fee} />
                  <H3 text={"SAR"} className={"text-secondary fw-bold "} />
                </div>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
};

export default Packages;
