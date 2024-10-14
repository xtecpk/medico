import React, { useEffect, useState } from 'react'
import { H2, Modal, Dropzone, Button1 } from '../../../user/components'
import { CardLayout } from '../../../user/containers'
import clientAvatar from "./clientAvatar.png"
import ContactInfo from '../clients/ContactInfo'
import ClientCases from '../clients/ClientCases'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useTranslation } from 'react-i18next'
import { Alert, Snackbar } from '@mui/material'

const ExpertDetails = () => {
    const buttonsTxt = [
        "Contact Information",
        "Cases"
    ];

    const { t } = useTranslation();

    const baseURL = import.meta.env.VITE_BASE_URL;
    const token = Cookies.get('token');

    const expertId = useLocation().pathname.split("/")[3];
    const role = useLocation().pathname.split("/")[2];

    const [refresher, setRefresher] = useState(1);
    const [activeInx, setActiveIndx] = useState(0);
    const [expertDetails, setExpertDetails] = useState();
    const [expertCases, setExpertCases] = useState();
    const [profileImage, setProfileImage] = useState();
    const [imgFile, setImgFile] = useState([]);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
    const toggleUploadModal = () => {
        setIsUploadModalVisible((prevState) => !prevState);
    };

    const handleClose = () => {
        setOpen(false)
    }

    const showContent = (index) => {
        setActiveIndx(index);
    }

    const getExpertDetails = async () => {
        await axios.post(baseURL + "/api/getexpertbyid", {
            ExpertId: expertId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            console.log(res);
            setExpertDetails(res.data.response.data[0])
        })
    }

    const getExpertCases = async () => {
        await axios.post(baseURL + "/api/getcasebyexpert", {
            ExpertId: expertId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            console.log(res);
            setExpertCases(res.data.response.data)
        })
    }

    const enableUser = async () => {
        await axios.post(baseURL + "/api/enableuser", {
            UserId: expertDetails.UserId,
        }, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(res => {
            if (res.data.response.status) {
                setMessage("Enabled");
                setOpen(true)
            }
        })
    }

    const disableUser = async () => {
        await axios.post(baseURL + "/api/disableuser", {
            UserId: expertDetails.UserId,
        }, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(res => {
            if (res.data.response.status) {
                setMessage("Disabled")
                setOpen(true)
            }
        })
    }

    const updateExpert = async (e) => {
        if (e.target.value == 1) {
            enableUser();
        }
        else {
            disableUser();
        }

        await axios.post(baseURL + "/api/updateexpert", {
            ...expertDetails,
            Valid: e.target.value
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            console.log(res);
            getExpertDetails();
        })
    }

    const getProfileImage = async () => {
        await axios.post(baseURL + "/api/getexpertprofilepicture", {
            ExpertId: expertId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        }).then(res => {
            console.log(res);
            setProfileImage(res.data.response.data[0].ImageFile)
            setRefresher(refresher + 1);
        })
    }

    useEffect(() => {
        getExpertDetails();
        getExpertCases();
        getProfileImage();
    }, []);

    const uploadProfileImage = async (FileName) => {
        await axios.post(baseURL + "/api/uploadexpertprofileimage", {
            FileName,
            expertimage: imgFile[0]
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
            }
        }).then(res => {
            toggleUploadModal();
            getProfileImage();
        });
    }

    const addProfileImage = async (fileName) => {
        await axios.post(baseURL + "/api/updateexperprofileimage", {
            ImageFile: fileName,
            ExpertId: expertId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            console.log(res);
            if (res.data.response.status) {
                uploadProfileImage(fileName);
            }
        });
    }

    useEffect(() => {
        if (imgFile.length > 0) {
            const fileName = `${expertId}-${imgFile[0].name.split(" ").join("")}`;
            addProfileImage(fileName);
        }
    }, [imgFile])


    return (
        <>
            <H2 text={"EXPERT"} className='mb-4' />
            <CardLayout className='mb-5'>
                <div className="row">
                    <div className="col-md-2">
                        {refresher && <img className="pointer profile-pic"
                            onClick={() => {
                                toggleUploadModal();
                            }}
                            src={profileImage ? `https://app.rasanllp.com/medical/profile/expert/${profileImage}` : clientAvatar
                            }
                            alt="user"
                        />}
                    </div>
                    <div className="col-md-10">
                        <div className="flex_box px-3" style={{ justifyContent: "space-between" }}>
                            <div>
                                <h5>{expertDetails && expertDetails.ExpertName}</h5>
                                <p className='blurTxt font-weight-bold'>Surgeon, Doctor</p>
                            </div>
                            <select name="" value={expertDetails && expertDetails.Valid} id="" onChange={updateExpert}>
                                <option value="1">Active</option>
                                <option value="0">Deactive</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row mt-5">
                    <div className="col-md-2">
                        <p className='blurTxt headingBlur'>SPECIALITY</p>
                        <p>{expertDetails && expertDetails.Expertise}</p>
                    </div>
                    <div id="mid-line" className='col-md-1 mx-5'></div>
                    <div className="col-md-3" style={{ marginLeft: "2rem" }}>
                        <p className='blurTxt headingBlur'>YEAR OF EXPERIENCE</p>
                        <p>{expertDetails && expertDetails.Experience}</p>
                    </div>
                </div>
            </CardLayout>

            <div className="row mt-3">
                <div className="col-md-3 buttonsBox">
                    {
                        buttonsTxt.map((text, index) => {
                            return (
                                <button className={`user_sidebar__link ${(activeInx === index) ? "user_sidebar__link--active" : "bg-white"}`} onClick={() => showContent(index)}>
                                    {text}
                                </button>
                            )
                        })
                    }
                </div>
                <div className="col-md-9">
                    {(activeInx === 0) ?
                        <ContactInfo
                            phNo={expertDetails && expertDetails.PhoneNo}
                            email={expertDetails && expertDetails.Email}
                            adress={expertDetails && expertDetails.Address}
                        />
                        : <ClientCases cases={expertCases} />}
                </div>
                {
                    isUploadModalVisible && <Modal toggleModal={toggleUploadModal}>
                        <Dropzone content={t("UserPanel.Cases.AddNewCasePage.ClickToUploadDocument")} setFiles={setImgFile} />
                        <div className="d-flex align-items-center justify-content-between mt-4 ">
                            <Button1
                                onClick={toggleUploadModal}
                                text={"Cancel"}
                                color="gray"
                            />
                            <Button1
                                onClick={toggleUploadModal}
                                text={"Submit"}
                            />
                        </div>
                    </Modal>
                }
            </div>
            <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    variant="filled"
                    style={{ background: "#2f4058" }}
                    sx={{ width: '100%' }}
                >
                    Client {message}
                </Alert>
            </Snackbar>
        </>
    )
}

export default ExpertDetails
