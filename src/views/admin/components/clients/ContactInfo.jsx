import React, { useEffect, useState } from 'react'
import { Button1, H2, Modal, ProfileUploadBox } from '../../../user/components'
import { CardLayout } from '../../../user/containers'
import { useLocation } from 'react-router-dom'
import { dummyImg } from '../../../user/assets'
import FileFinder from '../../../../components/custom/FileFinder'
import DocumentUpload from '../../../user/screens/profile/DocumentUpload'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import Cookies from 'js-cookie'
import { Alert, Snackbar } from '@mui/material'

const ContactInfo = ({ email, phNo, adress, userFiles = [], getClientDocuments, userId, contact }) => {

    const { t } = useTranslation();
    const baseURL = import.meta.env.VITE_BASE_URL;
    const token = Cookies.get('token')

    const role = useLocation().pathname.split("/")[2];
    const ClientId = useLocation().pathname.split("/")[3];


    const [docName, setDocName] = useState();
    const [signature, setSignature] = useState();
    const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false)
    }

    const toggleUploadModal = () => {
        setIsUploadModalVisible((prevState) => !prevState);
    };

    const getSignature = async () => {
        await axios.post(baseURL + "/api/getsignfile", {
            UserId: userId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            console.log(res);
            setSignature(res.data.response.data.result.length > 0 && res.data.response.data.result[0].SignatureImage)
        })
    }

    const deleteClientDocument = async (docId) => {
        await axios.post(baseURL + "/api/deletedocumentfromclient", {
            DocumentId: docId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            setOpen(true);
            getClientDocuments();
        })
    }

    useEffect(() => {
        getSignature();
    }, [])

    return (
        <>
            <CardLayout>
                <div className='p-4'>
                    <H2 text={"Contact Information"} className='mb-5' />
                    <div className="row">
                        <div className="col-md-4">
                            <p className='headingBlur'>EMAIL</p>
                        </div>
                        <div className="col-md-8 tableinfo">
                            <p>{email}</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <p className='headingBlur'>National ID</p>
                        </div>
                        <div className="col-md-8 tableinfo">
                            <p>{phNo}</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <p className='headingBlur'>Contact NO</p>
                        </div>
                        <div className="col-md-8 tableinfo">
                            <p>{contact}</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <p className='headingBlur'>ADRESS</p>
                        </div>
                        <div className="col-md-8 tableinfo">
                            <p>{adress}</p>
                        </div>
                    </div>
                    {
                        role === "clients" && <>
                            <H2 text={"Documents"} className='mt-5' />
                            <ProfileUploadBox
                                text={"Copy of SCFHS Registration"}
                                buttonText={FileFinder(`SCFHS-Registration of ${ClientId}`, userFiles) ? "Download" : "Upload"}
                                onClick={!FileFinder(`SCFHS-Registration of ${ClientId}`, userFiles) && (() => {
                                    toggleUploadModal()
                                    setDocName("SCFHS-Registration")
                                })}
                                onDelete={FileFinder(`SCFHS-Registration of ${ClientId}`, userFiles) && (() => deleteClientDocument(FileFinder(`SCFHS-Registration of ${ClientId}`, userFiles, true)))}
                                buttonType={FileFinder(`SCFHS-Registration of ${ClientId}`, userFiles) ? "link" : "button"}
                                to={FileFinder(`SCFHS-Registration of ${ClientId}`, userFiles) && `${baseURL}/client/${FileFinder(`SCFHS-Registration of ${ClientId}`, userFiles)}`}
                                image={userFiles.length > 0 && (FileFinder(`SCFHS-Registration of ${ClientId}`, userFiles) && `${baseURL}/client/${FileFinder(`SCFHS-Registration of ${ClientId}`, userFiles)}`)}
                            />
                            <ProfileUploadBox
                                text={"Copy of Medical Malpractice Insurance"}
                                buttonText={FileFinder(`Medical-Malpractice-Insurance of ${ClientId}`, userFiles) ? "Download" : "Upload"}
                                onClick={!FileFinder(`Medical-Malpractice-Insurance of ${ClientId}`, userFiles) && (() => {
                                    toggleUploadModal()
                                    setDocName("Medical-Malpractice-Insurance")
                                })}
                                onDelete={FileFinder(`Medical-Malpractice-Insurance of ${ClientId}`, userFiles) &&
                                    (() => deleteClientDocument(FileFinder(`Medical-Malpractice-Insurance of ${ClientId}`, userFiles, true)))
                                }
                                buttonType={FileFinder(`Medical-Malpractice-Insurance of ${ClientId}`, userFiles) ? "link" : "button"}
                                to={FileFinder(`Medical-Malpractice-Insurance of ${ClientId}`, userFiles) && `${baseURL}/client/${FileFinder(`Medical-Malpractice-Insurance of ${ClientId}`, userFiles)}`}
                                image={userFiles.length > 0 && (FileFinder(`Medical-Malpractice-Insurance of ${ClientId}`, userFiles) && `${baseURL}/client/${FileFinder(`Medical-Malpractice-Insurance of ${ClientId}`, userFiles)}`)}
                            />
                            <ProfileUploadBox
                                text={"Government ID"}
                                buttonText={FileFinder(`Government-ID of ${ClientId}`, userFiles) ? t("UserPanel.Profile.Download") : t("UserPanel.Profile.Upload")}
                                onClick={!FileFinder(`Government-ID of ${ClientId}`, userFiles) && (() => {
                                    toggleUploadModal()
                                    setDocName("Government-ID")
                                })}
                                onDelete={FileFinder(`Government-ID of ${ClientId}`, userFiles) &&
                                    (() => deleteClientDocument(FileFinder(`Government-ID of ${ClientId}`, userFiles, true)))
                                }
                                buttonType={FileFinder(`Government-ID of ${ClientId}`, userFiles) ? "link" : "button"}
                                to={FileFinder(`Government-ID of ${ClientId}`, userFiles) && `${baseURL}/client/${FileFinder(`Government-ID of ${ClientId}`, userFiles)}`}
                                image={userFiles.length > 0 && (FileFinder(`Government-ID of ${ClientId}`, userFiles) && `${baseURL}/client/${FileFinder(`Government-ID of ${ClientId}`, userFiles)}`)}
                            />
                            <ProfileUploadBox
                                text={"Passport"}
                                buttonText={FileFinder(`Passport of ${ClientId}`, userFiles) ? t("UserPanel.Profile.Download") : t("UserPanel.Profile.Upload")}
                                onClick={!FileFinder(`Passport of ${ClientId}`, userFiles) && (() => {
                                    toggleUploadModal()
                                    setDocName("Passport")
                                })}
                                onDelete={FileFinder(`Passport of ${ClientId}`, userFiles) &&
                                    (() => deleteClientDocument(FileFinder(`Passport of ${ClientId}`, userFiles, true)))
                                }
                                buttonType={FileFinder(`Passport of ${ClientId}`, userFiles) ? "link" : "button"}
                                to={FileFinder(`Passport of ${ClientId}`, userFiles) && `${baseURL}/client/${FileFinder(`Passport of ${ClientId}`, userFiles)}`}
                                image={userFiles.length > 0 && (FileFinder(`Passport of ${ClientId}`, userFiles) && `${baseURL}/client/${FileFinder(`Passport of ${ClientId}`, userFiles)}`)}
                            />

                            <ProfileUploadBox
                                text={"National Address Proof"}
                                buttonText={FileFinder(`National-Adress of ${ClientId}`, userFiles) ? t("UserPanel.Profile.Download") : t("UserPanel.Profile.Upload")}
                                onClick={!FileFinder(`National-Adress of ${ClientId}`, userFiles) && (() => {
                                    toggleUploadModal()
                                    setDocName("National-Adress")
                                })}
                                onDelete={FileFinder(`National-Adress of ${ClientId}`, userFiles) &&
                                    (() => deleteClientDocument(FileFinder(`National-Adress of ${ClientId}`, userFiles, true)))
                                }
                                buttonType={FileFinder(`National-Adress of ${ClientId}`, userFiles) ? "link" : "button"}
                                to={FileFinder(`National-Adress of ${ClientId}`, userFiles) && `${baseURL}/client/${FileFinder(`National-Adress of ${ClientId}`, userFiles)}`}
                                image={userFiles.length > 0 && (FileFinder(`National-Adress of ${ClientId}`, userFiles) && `${baseURL}/client/${FileFinder(`National-Adress of ${ClientId}`, userFiles)}`)}
                            />
                            <ProfileUploadBox
                                text={t("UserPanel.Cases.AddNewCasePage.Signature")}
                                buttonText={signature ? t("UserPanel.Profile.Download") : "Upload"}
                                buttonType={signature ? "link" : ""}
                                image={`${baseURL}/signs/${signature}`}
                                to={`${baseURL}/signs/${signature}`}
                            />
                            {/* <ProfileUploadBox
                                text={"Agreement"}
                                buttonText={"Download"}
                            // image={dummyImg}
                            /> */}
                            {/* <ProfileUploadBox
                                text={"Reciept"}
                                buttonType="button"
                                buttonText={t("UserPanel.Cases.AddNewCasePage.Upload")}
                                onClick={toggleUploadModal}
                                image={"Upload"}
                            /> */}
                        </>
                    }
                </div>
            </CardLayout>

            <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    variant="filled"
                    style={{ background: "#2f4058" }}
                    sx={{ width: '100%' }}
                >
                    Document Deleted Successfully
                </Alert>
            </Snackbar>

            {isUploadModalVisible && (
                <Modal toggleModal={toggleUploadModal}>
                    <DocumentUpload
                        toggleUploadModal={toggleUploadModal}
                        id={docName}
                        docName={docName}
                        getDocuments={getClientDocuments}
                        clientId={ClientId}
                        content={t("UserPanel.Cases.AddNewCasePage.ClickToUploadDocument")}
                    // setProfileDocs={setProfileDocs}
                    />
                    <div className="d-flex align-items-center justify-content-between mt-4 ">
                        <Button1
                            onClick={toggleUploadModal}
                            text={t("UserPanel.Cases.AddNewCasePage.Cancel")}
                            color="gray"
                        />
                        <Button1
                            onClick={toggleUploadModal}
                            text={t("UserPanel.Cases.AddNewCasePage.Submit")}
                        />
                    </div>
                </Modal>
            )}
        </>
    )
}

export default ContactInfo
