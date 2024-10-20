import "./packageDetails.css";
import React, { useEffect, useState } from "react";
import { CardLayout } from "../../containers";
import {
  AvailablePackageDetailsTable,
  Button1,
  CreateTicketForm,
  H2,
  H3,
  H4,
  Modal,
} from "../../components";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import CreateTicketModal from "../tickets/CreateTicketModal";
import BankPaymentModal from "../bankPayment/BankPaymentModal";
import { Alert, Snackbar } from "@mui/material";
import CardPaymentModal from "../billing/CardPaymentModal";

const PackageDetails = ({ availablePackages, setMoveToTicket }) => {
  const { t } = useTranslation();
  const location = useLocation().pathname.split("/")[3];
  const [currentAvailablePackage, setCurrentAvailablePackage] = useState({});

  const baseURL = import.meta.env.VITE_BASE_URL;
  const userId = Cookies.get("userId");
  const clientId = Cookies.get("clientId");
  const token = Cookies.get("token");
  const packageId = useLocation().pathname.split("/")[3];

  // Ticket
  const [userInfo, setUserInfo] = useState();
  const [newTicket, setNewTicket] = useState({
    subject: currentAvailablePackage && currentAvailablePackage.PackageName,
    description: currentAvailablePackage && currentAvailablePackage.Description,
    status: "New",
  });
  const [createTicketModal, setCreateTicketModal] = useState(false);
  const [bankPaymentModal, setBankPaymentModal] = useState(false);
  const [amount, setAmount] = useState(currentAvailablePackage.Fee);
  const [cardPaymentModal, setCardPaymentModal] = useState(false);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const ticketInputHandler = (e) => {
    setNewTicket((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const toggleCardPaymentModal = () => {
    setCardPaymentModal(!cardPaymentModal);
  };

  const toggleTicketModal = () => {
    setCreateTicketModal(!createTicketModal);
  };

  const toggleBankPaymentModal = () => {
    setBankPaymentModal(!bankPaymentModal);
  };

  const getPackageDetails = async () => {
    await axios
      .post(
        baseURL + "/api/getpackagebyid",
        {
          PackageId: packageId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        setCurrentAvailablePackage(res.data.response.data[0]);
        setNewTicket({
          subject:
            currentAvailablePackage && currentAvailablePackage.PackageName,
          description:
            currentAvailablePackage && currentAvailablePackage.Description,
        });
      });
  };

  const proceedPayment = async () => {
    await axios
      .post(baseURL + "/api/addpayment", {
        Amount: amount,
        Email: userInfo.Email,
        ClientId: clientId,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.response.status) {
          payment(response.data.response.data.paymentid);
        }
      });
  };

  const payment = async (OrderId) => {
    await axios
      .post(baseURL + "/api/initiatepayment", {
        Language: "en",
        OrderId,
        OrderAmount: amount,
        OrderCurrency: "SAR",
        OrderDescription: "Subscribe Package",
        Customer: {
          Name: userInfo.ClientName,
          Email: userInfo.Email,
          Phone: userInfo.PhoneNo,
          Address: {
            Line1: userInfo.Address?.split("/")[0] || "line 1",
            City: userInfo.Address?.split("/")[1] || "Riyadh",
            Country: userInfo.Address?.split("/")[4] || "SA",
            State: userInfo.Address?.split("/")[2] || "Riyadh",
            ZIP: userInfo.Address?.split("/")[3] || "23423",
          },
        },
        Shipping: {
          Name: userInfo.ClientName,
          Email: userInfo.Email,
          Phone: userInfo.PhoneNo,
          Address: {
            Line1: userInfo.Address?.split("/")[0] || "line 1",
            City: userInfo.Address?.split("/")[1] || "Riyadh",
            State: userInfo.Address?.split("/")[2] || "Riyadh",
            ZIP: userInfo.Address?.split("/")[3] || "23423",
            Country: userInfo.Address?.split("/")[4] || "SA",
          },
        },
      })
      .then((res) => {
        console.log(res);
        res.status === 200 && (window.location.href = res.data);
      });
  };

  const getUserInfo = () => {
    const userData = localStorage.getItem("userInfo");

    if (userData) {
      setUserInfo(JSON.parse(userData));
    }
  };

  useEffect(() => {
    getPackageDetails();
    getUserInfo();
  }, []);

  useEffect(() => {
    if (currentAvailablePackage) {
      setNewTicket({
        ...newTicket,
        subject: currentAvailablePackage.PackageName,
        description: currentAvailablePackage.Description,
      });
      setAmount(currentAvailablePackage.Fee);

      localStorage.setItem("package", JSON.stringify(currentAvailablePackage));
    }
  }, [currentAvailablePackage]);

  return (
    <>
      <div className="user_packageDetails_outer">
        <H2 text={t("UserPanel.Packages.PackageDetails")} />
        <CardLayout>
          <H3 text={t("UserPanel.Packages.PackageDetails")} />
          <div className="user_packageDetails_table_outer">
            <AvailablePackageDetailsTable data={currentAvailablePackage} />
          </div>
          <div className="d-flex mb-3">
            <Button1
              text={t("UserPanel.Packages.ContactUs")}
              onClick={toggleTicketModal}
              className="mt-4"
            />
          </div>
          <H4 text={t("UserPanel.Packages.BuyPackage")} />
          <div className="d-flex mb-3">
            <Button1
              text={t("UserPanel.Packages.CardPayment")}
              onClick={toggleCardPaymentModal}
              className="mt-4"
            />
            <Button1
              text={t("UserPanel.Packages.BankPayment")}
              onClick={() => setBankPaymentModal(true)}
              className="mt-4 mx-3"
            />
          </div>
        </CardLayout>
      </div>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          // severity="success"
          variant="filled"
          style={{ background: "#2f4058" }}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
      {createTicketModal && (
        <CreateTicketModal
          toggleTicketModal={toggleTicketModal}
          setMoveToTicket={setMoveToTicket}
          clientId={clientId}
          ticketDetails={newTicket}
        />
      )}
      {bankPaymentModal && (
        <BankPaymentModal
          setMessage={setMessage}
          setSuccess={setOpen}
          toggleModal={toggleBankPaymentModal}
          price={currentAvailablePackage.Fee}
          user={userInfo}
        />
      )}
      {cardPaymentModal && (
        <CardPaymentModal
          setAmount={setAmount}
          amount={amount}
          selectedPkg={currentAvailablePackage}
          toggleModal={toggleCardPaymentModal}
          makePayment={proceedPayment}
        />
      )}
    </>
  );
};

export default PackageDetails;
