import React, { useState } from 'react'
import { Button1, H2 } from '../../../user/components'
import { CardLayout } from '../../../user/containers'
import DateFormatForServer, { DateFormatForUser, daysRemaining } from '../../../../components/custom/DateFormatForServer';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { getPackageById } from '../../../../components/custom/GetName';
import { Alert, Snackbar } from '@mui/material';

const MembrshipDetails = ({ membership, packages = [], getMemberShipDetails }) => {

    const baseURL = import.meta.env.VITE_BASE_URL;
    const token = Cookies.get('token');
    const clientId = useLocation().pathname.split('/').pop();

    const [packageId, setPackageId] = useState("0");
    const [errros, setErrors] = useState({});
    const [messageText, setMessageText] = useState("");
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false)
    }

    const addContract = async () => {
        const ExpiryDate = new Date();
        ExpiryDate.setFullYear(ExpiryDate.getFullYear() + 1);

        packageId !== "0" && await axios.post(baseURL + "/api/addcontract", {
            ClientId: clientId,
            PackageId: packageId,
            Year: 1,
            ContractDate: DateFormatForServer(Date()),
            Status: 1,
            ExpiryDate: DateFormatForServer(ExpiryDate),
            Fee: getPackageById(packages, packageId).Fee,
            Amount: getPackageById(packages, packageId).Fee
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            console.log(res);
            if (res.data.response.data.contractid) {
                getMemberShipDetails();
            }
        })
    };

    const extendPackage = async () => {
        // const ExpiryDate = new Date(membership.ExpiryDate);
        // ExpiryDate.setFullYear(ExpiryDate.getFullYear() + 1);


        await axios.post(baseURL + '/api/updatecontract', {
            ContractId: membership.ContractId,
            ClientId: clientId,
            PackageId: membership.PackageId,
            Year: 1,
            Status: 1,
            ContractDate: DateFormatForServer(membership.ContractDate),
            Fee: parseInt(membership.Fee) + parseInt(getPackageById(packages, membership.PackageId).Fee),
            Amount: getPackageById(packages, membership.PackageId).Fee
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }).then(res => {
            console.log(res);
            setMessageText("Package Extended")
            setOpen(true);
            getMemberShipDetails();
        })
    }

    const changePackage = async () => {
        console.log(membership.PackageId);
        await axios.post(baseURL + '/api/disablecontract', {
            ContractId: membership.ContractId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            console.log(res);
            addContract().then(() => {
                setMessageText("Package Changed")
                setOpen(true);
            });
        })
    }

    return (
        <>
            <CardLayout>
                {!membership ? <div className='p-4'>
                    <H2 text={"Subscribe Membership"} className='mb-5' />
                    <div className="row">
                        <div className="col-md-7">
                            <div className='user_input_box'>
                                <select value={packageId} onChange={(e) => setPackageId(e.target.value)}>
                                    <option value="0">Select Package</option>
                                    {
                                        packages.map((pkg, index) => {
                                            return <option value={pkg.PackageId}>{pkg.PackageName}</option>
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <Button1 text={"Subscribe"} onClick={addContract} />
                        </div>
                    </div>
                </div> :
                    <div className='p-4'>
                        <H2 text={"Subscribe Membership"} className='mb-5' />
                        <div className="row">
                            <div className="col-md-7">
                                <div className='user_input_box'>
                                    <select value={packageId} onChange={(e) => setPackageId(e.target.value)}>
                                        <option value="0">Select Package</option>
                                        {
                                            packages.filter(pkg => pkg.PackageId !== membership.PackageId).map((pkg, index) => {
                                                return <option value={pkg.PackageId}>{pkg.PackageName}</option>
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <Button1 text={"Change Package"} onClick={changePackage} />
                            </div>
                        </div>
                    </div>}
                <div className='p-4'>
                    <H2 text={"Membership Details"} className='mb-5' />
                    {/* <div className="row">
                        <div className="col-md-4">
                            <p className='headingBlur'>DESCRIPTION</p>
                        </div>
                        <div className="col-md-8 tableinfo">
                            <p>{membership && membership.Description}</p>
                        </div>
                    </div> */}
                    {
                        membership ? <>
                            <div className="row">
                                <div className="col-md-4">
                                    <p className='headingBlur'>Package NAME</p>
                                </div>
                                <div className="col-md-8 tableinfo">
                                    <p>{membership && membership["Contract Name"]}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <p className='headingBlur'>Package ID</p>
                                </div>
                                <div className="col-md-8 tableinfo">
                                    <p>{membership && membership["PackageId"]}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <p className='headingBlur'>YEAR</p>
                                </div>
                                <div className="col-md-8 tableinfo">
                                    <p>{membership && membership.Year}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <p className='headingBlur'>AMOUNT</p>
                                </div>
                                <div className="col-md-8 tableinfo">
                                    <p>{membership && membership.Fee + " SR"}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <p className='headingBlur'>DATE OF CONTRACT</p>
                                </div>
                                <div className="col-md-8 tableinfo">
                                    <p>{membership && DateFormatForUser(membership.ContractDate)}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <p className='headingBlur'>EXPIRY DATE</p>
                                </div>
                                <div className="col-md-8 tableinfo">
                                    <p>{membership && DateFormatForUser(membership.ExpiryDate)}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <p className='headingBlur'>TIME REMAINING</p>
                                </div>
                                <div className="col-md-8 tableinfo">
                                    <p>{membership && daysRemaining(membership.ExpiryDate, Date())}</p>
                                </div>
                            </div>
                            <Button1 onClick={extendPackage} className='mt-2' text={"Extend Package"} />
                        </> :
                            <p>Membership not Found</p>
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
                    {messageText}
                </Alert>
            </Snackbar>
        </>
    )
}

export default MembrshipDetails
