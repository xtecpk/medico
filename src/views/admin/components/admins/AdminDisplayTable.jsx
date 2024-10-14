import React, { useState } from "react";
import { Link } from "react-router-dom";
import { InputBox } from "../../../user/components";
import ConfitmationModal from "../membership/ConfitmationModal";
import axios from "axios";
import Cookies from "js-cookie";
import { Alert, Snackbar } from "@mui/material";

const AdminDisplayTable = ({
  labels,
  pageCasesToDisplay,
  path = "/admin/admins/",
  getAdmins,
}) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const token = Cookies.get("token");
  const adminType = Cookies.get("adminType");

  const [showModal1, setShowModal1] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const toggleModal1 = () => {
    setShowModal1(!showModal1);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const changeAdminType = async (event, admin) => {
    console.log(admin);
    await axios
      .post(
        baseURL + "/api/updateadmin",
        {
          PhoneNo: admin.PhoneNo,
          Email: admin.email,
          AdminName: admin.AdminName,
          Valid: admin.Status,
          AdminId: admin.AdminId,
          Role: event.target.value,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
        console.log(res);
        getAdmins();
      });
  };

  const enableUser = async (UserId) => {
    await axios
      .post(
        baseURL + "/api/enableuser",
        {
          UserId: UserId,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
        if (res.data.response.status) {
          setMessage("Enabled");
          setOpen(true);
        }
      });
  };

  const disableUser = async (UserId) => {
    await axios
      .post(
        baseURL + "/api/disableuser",
        {
          UserId: UserId,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
        if (res.data.response.status) {
          setMessage("Disabled");
          setOpen(true);
        }
      });
  };

  const changeAdminStatus = async (event, admin) => {
    if (event.target.value == "Active") {
      enableUser(admin.UserId);
    } else {
      disableUser(admin.UserId);
    }
    await axios
      .post(
        baseURL + "/api/updateadmin",
        {
          PhoneNo: admin.PhoneNo,
          Email: admin.email,
          AdminName: admin.AdminName,
          Valid: event.target.value === "Active" ? "1" : "0",
          AdminId: admin.AdminId,
          Role: admin.Role,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
        console.log(res);
        getAdmins();
      });
  };

  const status = ["In Active", "Active"];

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
                        to={path + caseItem.AdminId}
                      >
                        {caseItem[data]}
                      </Link>
                    </td>
                  ) : dataIndex === 5 ? (
                    <td className="px-3">
                      {adminType === "Super Admin" ? (
                        <InputBox
                          value={caseItem[data]}
                          type={"select"}
                          onChange={(event) => changeAdminType(event, caseItem)}
                          options={["Admin", "Super Admin"]}
                        />
                      ) : (
                        caseItem[data]
                      )}
                    </td>
                  ) : dataIndex === 3 ? (
                    <td className="px-3">
                      {caseItem.Role === "Super Admin" ? (
                        "Active"
                      ) : adminType === "Super Admin" ? (
                        <InputBox
                          value={status[caseItem[data]]}
                          type={"select"}
                          onChange={(event) =>
                            changeAdminStatus(event, caseItem)
                          }
                          options={["Active", "In Active"]}
                        />
                      ) : (
                        status[caseItem[data]]
                      )}
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
                {/* <td className='memberActions '>
                                    <button style={{ color: "rgb(238, 51, 51)" }} onClick={toggleModal1}>Delete</button>
                                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center">{"No Cases Found"}</div>
      )}
      <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          variant="filled"
          style={{ background: "#2f4058" }}
          sx={{ width: "100%" }}
        >
          Client {message}
        </Alert>
      </Snackbar>
      {showModal1 && (
        <>
          <ConfitmationModal
            toggleModal={toggleModal1}
            modalHead={"Delete Confirmation"}
          >
            <div className="flex_box my-3">
              <p>Are you sure you want to delete this Admin?</p>
            </div>
            <div className="d-flex align-items-center justify-content-end ">
              <button
                className="mx-3 user_button1 user_button1--gray "
                onClick={toggleModal1}
              >
                <span>Cancel</span>
              </button>
              <button
                className=" user_button1"
                style={{ background: "#E33" }}
                onClick={toggleModal1}
              >
                <span>Delete</span>
              </button>
            </div>
          </ConfitmationModal>
        </>
      )}
    </>
  );
};

export default AdminDisplayTable;
