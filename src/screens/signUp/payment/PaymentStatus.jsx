import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import paymentSuccess from "../../../assets/signup/paymentSuccessful.png"
import paymentDeclined from "../../../assets/signup/paymentDeclined.png"
import { Button1, H2 } from '../../../views/user/components'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import Cookies from 'js-cookie'
import DateFormatForServer, { DateFormatForUser } from '../../../components/custom/DateFormatForServer'

const PaymentStatus = () => {
    const baseURL = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate();
    const paymentId = useLocation().pathname.split("/")[3];
    const PhoneNumber = Cookies.get('PhoneNumber');
    const Password = Cookies.get('Password');
    const token = Cookies.get('token');
    const clientID = Cookies.get('clientId');

    const [currentContract, setCurrentContract] = useState();
    const [redirect, setRedirect] = useState(false);
    const [packageDetails, setPackageDetails] = useState();
    const [paymentStatus, setPyamentStatus] = useState();
    const [loading, setLoading] = useState(true);

    const updatePayment = async (ContractId) => {
        console.log(paymentId, ContractId);
        await axios.post(baseURL + '/api/updatepaymentwithcontractid', {
            ContractId: ContractId,
            PaymentId: paymentId
        }).then(res => {
            console.log(res);
            if (res.data.response.status) {
                setRedirect(true);
            }
            // navigate("/user/packages")
        })
    }

    const addContract = async (token, ClientId) => {
        const ExpiryDate = new Date();
        ExpiryDate.setFullYear(ExpiryDate.getFullYear() + 1);

        await axios.post(baseURL + '/api/addcontract', {
            ClientId,
            PackageId: packageDetails.PackageId,
            Year: 1,
            ContractDate: DateFormatForServer(Date()),
            ExpiryDate: DateFormatForServer(ExpiryDate),
            Status: 1,
            Fee: packageDetails.Fee,
            Amount: packageDetails.Fee
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            console.log(res);
            if (res.data.response.status) {
                updatePayment(res.data.response.data.contractid);
            }
        })
    }

    const extendPackage = async (contract) => {
        await axios.post(baseURL + '/api/updatecontract', {
            ContractId: contract.ContractId,
            ClientId: clientID,
            PackageId: packageDetails.PackageId,
            Year: 1,
            ContractDate: DateFormatForServer(contract.ContractDate),
            Status: 1,
            Fee: parseInt(contract.Fee) + parseInt(packageDetails.Fee),
            Amount: packageDetails.Fee
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }).then(res => {
            console.log(res);
            updatePayment(contract.ContractId);
        })
    }

    const disableContract = async (contractId) => {
        await axios.post(baseURL + '/api/disablecontract', {
            ContractId: contractId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            console.log(res);
            addContract(token, clientID);
        })
    }

    const changePackage = async (contract) => {

        disableContract(contract.ContractId);

    }

    const existingContract = async (ClientId) => {
        const response = await axios.post(baseURL + '/api/getcontractbyclient', {
            ClientId: ClientId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (response.data.response.data.length > 0) {
            setCurrentContract(response.data.response.data.filter(record => record.Status == 1)[0])
            return response.data.response.data.filter(record => record.Status == 1)[0];
        } else {
            return false;
        }
    }

    const getPaymentStatus = async () => {
        await axios.post(baseURL + '/api/getpaymentstatus', {
            PaymentId: paymentId
        }).then(async res => {
            setPyamentStatus(res.data.response.data[0]);
            setLoading(false);
            if (res.data.response.data[0].Status === "A") {
                if (!token) {
                    login();
                }
                else {
                    const contractStatus = await existingContract(clientID);
                    console.log(contractStatus);
                    if (!contractStatus) {
                        addContract(token, clientID);
                    } else {
                        if (contractStatus.PackageId == packageDetails.PackageId) {
                            extendPackage(contractStatus);
                        }
                        else {
                            changePackage(contractStatus);
                        }
                    }
                }
            }
        })
    }

    const addNotification = async (token, clientName) => {
        await axios.post(baseURL + '/api/addnotification', {
            Title: "SignUp New User",
            Message: `New User ${clientName} has signed up`,
            NotificationType: "Client",
            ReceiverId: 13,
            ReceiverType: "admin"
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    const getClientByUserId = async (UserId, token) => {
        await axios.post(baseURL + "/api/getclientbyuserid", {
            UserId
        }, {
            headers: {
                'Authorization': 'Bearer ' + token
            },
        }).then(response => {
            console.log(response);
            if (response.data.response.status) {
                Cookies.set('clientId', response.data.response.data[0].ClientId, { expires: 30 })
                Cookies.set('profession', response.data.response.data[0].Type, { expires: 30 })
                Cookies.set('clientName', response.data.response.data[0].ClientName, { expires: 30 })
                addNotification(token, response.data.response.data[0].ClientName);
                addContract(token, response.data.response.data[0].ClientId);
            }
        })
    }

    const login = async () => {
        await axios.post(baseURL + "/api/login", {
            PhoneNo: PhoneNumber,
            Password: Password
        }).then(response => {
            console.log(response);
            if (response.status === 200) {
                const role = response.data.user.role;
                const token = response.data.token;
                const userId = response.data.user.uid;
                Cookies.set('userId', userId, { expires: 7 });
                Cookies.set('token', token, { expires: 30 });
                Cookies.set('role', "C", { expires: 30 });
                getClientByUserId(userId, token)
            }
        })
    }

    const getPackageDetails = async () => {
        const storedArray = localStorage.getItem('package');

        if (storedArray) {
            setPackageDetails(JSON.parse(storedArray));
        }
    }

    useEffect(() => {
        getPackageDetails();
    }, [])

    useEffect(() => {
        packageDetails && getPaymentStatus()
    }, [packageDetails])

    return (
        <div className='container-fluid d-flex flex-column justify-content-center align-items-center'>
            <div className='d-flex justify-content-center align-items-center flex-direction-column mt-5'>
                {
                    // paymentId ? loading ? <H2 text="Fetching Data..." /> : (
                    //     paymentStatus ? <>
                    //         <H2 text={`Your Payment ${paymentStatus}`} />
                    //         <img src={paymentSuccess} style={{ width: "100%" }} alt="" />
                    //     </> :
                    //         <>
                    //             <p className={`text-danger error-msg`}>
                    //                 Invalid Payment ID
                    //             </p>
                    //             <img src={paymentDeclined} style={{ width: "100%" }} alt="" />
                    //         </>
                    // ) :
                    //     <>
                    //         <H2 text="404 NOT FOUND" />
                    //         <img src={paymentDeclined} style={{ width: "100%" }} alt="" />
                    //     </>

                    loading ? <H2 text="Fetching Data..." /> : (
                        paymentStatus
                            .Status === "A"
                            ? <>
                                {/* <H2 text={`Your Payment ${paymentStatus.Status}`} /> */}
                                <H2 text={`Your Payment was Successsfull.`} />
                                <p>You have successfully subscribed.</p>
                                <div className="d-flex justify-content-center">
                                    {
                                        redirect &&
                                        <Button1 text={"Sign In"} onClick={() => {
                                            navigate("/user/packages")
                                        }} />
                                    }
                                </div>
                                <img src={paymentSuccess} style={{ width: "100%" }} alt="" />

                            </> :
                            <>
                                <p className={`text-danger error-msg`}>
                                    Payment Unsuccessfull
                                </p>
                                <img src={paymentDeclined} style={{ width: "100%" }} alt="" />
                            </>
                    )
                }
            </div>
        </div>
    )
}

export default PaymentStatus
