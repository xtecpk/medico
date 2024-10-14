import React, { useEffect, useState } from "react";
import "./ticketDetails.css";
import { Button1, ExpertDisplay, H3, TicketDetailsTable } from "../";
import Cookies from "js-cookie";
import axios from "axios";
import { CardLayout } from "../../containers";
import { H4 } from "../../../user/components";
import deleteIcon from "./deleteIcon.svg"
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DateFormatForServer from "../../../../components/custom/DateFormatForServer";
import { Autocomplete, TextField } from "@mui/material";

const TicketDetails = ({
  ticketDetails,
  setTicketDetails,
  setShowTicketDetails,
  getTickets
}) => {

  const { t } = useTranslation();

  const baseURL = import.meta.env.VITE_BASE_URL;
  const token = Cookies.get('token');
  const role = useLocation().pathname.split("/")[1];

  const [selectedExpert, setSelectedExpert] = useState();
  const [experts, setExperts] = useState([]);
  const [ticketExerts, setTicketExperts] = useState([]);

  const getTicketExperts = async () => {
    await axios.post(`${baseURL}/api/getticketexperts`, {
      TicketNo: ticketDetails.TicketNo
    }, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then(res => {
      console.log(res);
      setTicketExperts(res.data.response.data)
    })
  }

  const statusChangeHandler = async (e) => {
    // setTicketDetails((prevEntry) => ({
    //   ...prevEntry,
    //   status: e.target.value,
    // }));
    console.log(ticketDetails);
    await axios.post(`${baseURL}/api/updateticket`, {
      TicketNo: ticketDetails.TicketNo,
      Subject: ticketDetails.Subject,
      Status: parseInt(e.target.value),
      Description: ticketDetails.Description,
      ClientId: ticketDetails.ClientId,
      CreationDate: DateFormatForServer(ticketDetails.CreationDate),
    }, {
      headers: {
        'Authorization': 'Bearer ' + token
      },
    }).then((res) => {
      console.log(res);
      getTickets()
    });
  };

  const getallexperts = async () => {
    await axios.get(`${baseURL}/api/getallexperts`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then(res => {
      console.log(res);
      setExperts(res.data.response.data.filter(expert => {
        return !ticketExerts.some(member => member.ExpertId === expert.ExpertId)
      }))
    })
  }

  const addNotification = async (title, message, recieverId) => {
    await axios.post(baseURL + '/api/addnotification', {
      Title: title,
      Message: message,
      NotificationType: "Request",
      ReceiverId: recieverId,
      ReceiverType: "user"
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  const addExpertToTicket = async () => {
    selectedExpert && await axios.post(`${baseURL}/api/addexperttoticket`, {
      TicketNo: ticketDetails.TicketNo,
      ExpertId: selectedExpert.ExpertId
    }, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then(res => {
      addNotification("Ticket Assigned", "You're assigned a new ticket", selectedExpert.ExpertId)
      getTicketExperts()
      console.log(res);
    })
  }

  const removeExpertFromTicket = async (ExpertId) => {
    await axios.post(baseURL + "/api/removexpertfromticket", {
      TicketNo: ticketDetails.TicketNo,
      ExpertId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      console.log(res);
      getTicketExperts();
    }).catch(error => {
      console.log(error);
    })
  }

  useEffect(() => {
    getallexperts()
  }, [])

  useEffect(() => {
    getallexperts();
  }, [ticketExerts])


  useEffect(() => {
    getTicketExperts()
  }, [ticketDetails])

  return (
    <>
      <div className="expert_ticketDetails">
        {
          ticketDetails ?
            <>
              <div className="expert_ticketDetails__table_div">
                <H3 text={t("UserPanel.Chat.TicketDetails")} />
                <TicketDetailsTable
                  labels={[t("UserPanel.Chat.Subject"), t("UserPanel.Chat.Description"), t("UserPanel.Chat.Status")]}
                  values={[
                    ticketDetails?.Subject,
                    ticketDetails?.Description?.split("%").map((line) => {
                      return <>
                        {line}<br />
                      </>
                    }),
                    ticketDetails?.Status,
                  ]}
                  statusOptions={["New", "In Progress", "Completed"]}
                  onStatusChange={statusChangeHandler}
                />
                <Button1
                  text={role === "user" ? t("UserPanel.Sidebar.Chat") : "Respond"}
                  className="px-5"
                  onClick={() => {
                    setShowTicketDetails(false);
                  }}
                />
              </div>
              <div className="mb-5">
                <H3 text={t("UserPanel.Sidebar.Experts")} className="mb-4" />
                {
                  role === "admin" && <div className="row my-4">
                    <div className="col-md-12 d-flex">
                      <Autocomplete
                        disablePortal
                        className='p-0'
                        size='small'
                        id="combo-box-demo"
                        onChange={(e, newValue) => setSelectedExpert(newValue)}
                        options={experts}
                        sx={{ width: 300 }}
                        getOptionLabel={(option) => option.ExpertName}
                        renderInput={(params) => <TextField {...params} label="Expert" />}
                      />
                      {/* <select name="" id="" value={selectedExpert} onChange={e => setExpertId(e.target.value)} className='px-2' style={{ width: "70%", marginRight: "1rem" }}>
                        <option value="">Expert Name</option>
                        {
                          experts.length > 0 && experts.map((expert, index) => {
                            return (
                              <option value={expert.ExpertId}>{expert.ExpertName}</option>
                            )
                          })
                        }
                      </select> */}
                      <Button1 text={"Add"} className="mx-3" onClick={addExpertToTicket} />
                    </div>
                  </div>
                }
                <div className="row expert_ticketDetails__experts_display">
                  {ticketExerts.length > 0 ? ticketExerts.map((expert, { ExpertName, areaOfExpertise }, index) => (
                    <div className="col-md-12 my-3">
                      <CardLayout className='p-4'>
                        <div className="row">
                          <div className="col-md-10">
                            <H4 text={expert.ExpertName} />
                            <p>{expert.Expertise}</p>
                          </div>
                          {
                            role === "admin" && <div className="col-md-2 d-flex text-center align-items-center pointer" onClick={() => removeExpertFromTicket(expert.ExpertId)}>
                              <img src={deleteIcon} alt="" />
                            </div>
                          }
                        </div>
                      </CardLayout>
                    </div>
                  ))
                    :
                    <p>{t("UserPanel.Chat.NoExpertsInTicket")}</p>

                  }
                </div>
              </div>
            </>
            :
            <p className="text-center">No Ticket Found</p>
        }
      </div>
    </>
  );
};

export default TicketDetails;
