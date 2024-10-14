import React, { useEffect, useState } from 'react'
import { Button1, Modal, Dropzone, H3, InputBox, Pdf } from '../../components'
import { useTranslation } from 'react-i18next'
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import DateFormatForServer from '../../../../components/custom/DateFormatForServer';
import { FaRegClipboard } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

const BankPaymentModal = ({ toggleModal, price, user, setSuccess, setMessage }) => {
    const lang = useSelector(state => state.language.value)
    const { t } = useTranslation();
    const baseURL = import.meta.env.VITE_BASE_URL;
    const token = Cookies.get("token")
    const clientName = Cookies.get("clientName")
    const clientId = Cookies.get("clientId");
    const navigate = useNavigate();

    const [selectedPackage, setSelectedPackage] = useState();
    const [files, setFiles] = useState([]);
    const [errors, setErros] = useState(false);
    const [currentContract, setCurrentContract] = useState();
    const [bankDetails, setBankDetails] = useState({
        Email: user.Email,
        Bank: "Alinma Bank",
        trxId: "",
        AccountName: "",
        iban: "",
    });
    const [creditCardDetails, setCreditCardDetails] = useState({
        accountNumber: "68204417930001",
        expireDateMonth: "",
        ibanNumber: "SA9705000068204417930001",
        expireDateYear: "",
        cvv: "",
    });


    const onChangeBankDetials = (e) => {
        const value = e.target.value;

        setBankDetails({
            ...bankDetails,
            [e.target.name]: value
        })
    }

    const uploadReciept = async (PaymentId, fileExt) => {
        await axios.post(baseURL + "/api/Uploadreceipt", {
            PaymentId: `${PaymentId}.${fileExt}`,
            receiptimage: files[0]
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            console.log(res);
        })
    }

    const updatePayment = async (ContractId, paymentId) => {
        console.log(ContractId, paymentId);
        await axios.post(baseURL + '/api/updatepaymentwithcontractid', {
            ContractId: ContractId,
            PaymentId: paymentId
        }).then(res => {
            console.log(res);
            if (res.data.response.status) {
                createTicketHandler(paymentId);
            }
        })
    }

    const addContract = async (paymentId) => {
        const ExpiryDate = new Date();
        ExpiryDate.setFullYear(ExpiryDate.getFullYear() + 1);

        await axios.post(baseURL + "/api/addcontract", {
            ClientId: clientId,
            PackageId: selectedPackage.PackageId,
            Year: 1,
            ContractDate: DateFormatForServer(Date()),
            Status: 1,
            ExpiryDate: DateFormatForServer(ExpiryDate),
            Fee: selectedPackage.Fee,
            Amount: selectedPackage.Fee
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            console.log(res);
            if (res.data.response.data.contractid) {
                updatePayment(res.data.response.data.contractid, paymentId)
            }
        })
    };

    const extendPackage = async (membership, paymentId) => {
        await axios.post(baseURL + '/api/updatecontract', {
            ContractId: membership.ContractId,
            ClientId: clientId,
            PackageId: membership.PackageId,
            Year: 1,
            Status: 1,
            ContractDate: DateFormatForServer(membership.ContractDate),
            Fee: parseInt(membership.Fee) + parseInt(selectedPackage.Fee),
            Amount: selectedPackage.Fee
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }).then(res => {
            console.log(res);
            updatePayment(membership.ContractId, paymentId);
        })
    }

    const changePackage = async (membership, paymentId) => {
        console.log(membership.PackageId);
        await axios.post(baseURL + '/api/disablecontract', {
            ContractId: membership.ContractId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            console.log(res);
            addContract(paymentId);
        })
    }

    const addNotification = async () => {
        await axios.post(baseURL + '/api/addnotification', {
            Title: "Bank Payment",
            Message: `${clientName} added a bank payment`,
            NotificationType: "Payment",
            ReceiverId: 13,
            ReceiverType: "admin"
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    const addBankPayment = async () => {
        if (files.length > 0) {

            const imageExtension = files[0].name.split('.').pop();

            await axios.post(baseURL + "/api/addbankpayment", {
                Amount: price,
                Email: bankDetails.Email,
                Bank: bankDetails.Bank,
                ClientId: user.ClientId,
                TransId: bankDetails.trxId,
                TransDate: DateFormatForServer(Date()),
                AccountName: bankDetails.AccountName,
                IBAN: bankDetails.iban,
                FileExt: imageExtension,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(async res => {
                console.log(res);
                const paymentId = res.data.response.data.paymentid;
                addNotification();
                uploadReciept(res.data.response.data.paymentid, imageExtension)
                const contractStatus = await existingContract();
                console.log(contractStatus);
                if (!contractStatus) {
                    addContract(paymentId);
                } else {
                    if (contractStatus.PackageId === selectedPackage.PackageId) {
                        extendPackage(contractStatus, paymentId);
                    }
                    else {
                        changePackage(contractStatus, paymentId);
                    }
                }
            })
        }
        else {
            setErros(true)
        }
    }

    const createTicketHandler = async (PaymentId) => {
        await axios.post(baseURL + "/api/addticket", {
            Subject: `Payment request by ${user.ClientName}`,
            Description: `Payment Request by ${user.ClientName} % Payment ID: ${PaymentId.substring(0, 10) + "..."} % Package Name:${selectedPackage.PackageName} % Amount:   ${price}`,
            ClientId: user.ClientId,
            Status: 1,
            CreationDate: DateFormatForServer(Date())
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => {
            console.log(res);
            if (res.data.response.status) {
                toggleModal();
                setMessage("Request sent!")
                setSuccess(true)

                setTimeout(() => {
                    navigate('/user/packages')
                }, 2000);
            }
        })
    };

    const existingContract = async () => {
        const response = await axios.post(baseURL + '/api/getcontractbyclient', {
            ClientId: clientId
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

    const getUserInfo = () => {
        const packageInfo = localStorage.getItem('package');

        if (packageInfo) {
            setSelectedPackage(JSON.parse(packageInfo));
        }
    }



    const copyDetails = (value) => {
        navigator.clipboard.writeText(value);
        setMessage("Copied")
        setSuccess(true)
    }

    useEffect(() => {
        files.length > 0 && setErros(false)
    }, [files])

    useEffect(() => {
        getUserInfo();
    }, [])


    return (
        <Modal toggleModal={toggleModal}>
            <div className="user_createTicketForm">
                <div className="user_createTicketForm">
                    <H3 text={t("UserPanel.Billing.BankTransfer")} className="text-center" />

                    <div className="user_billingChannel__bank_transfer__table_outer">
                        <table className="user_billingChannel__bank_transfer_table">
                            <tbody>
                                <tr>
                                    <td className="user_billingChannel__bank_transfer_table__key">
                                        {t("UserPanel.Billing.AccountNumber")}
                                    </td>
                                    <td className="user_billingChannel__bank_transfer_table__value">
                                        {creditCardDetails.accountNumber}
                                    </td>
                                    <td>
                                        <FaRegClipboard fontSize={20} cursor={'pointer'} onClick={() => copyDetails(creditCardDetails.accountNumber)} />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="user_billingChannel__bank_transfer_table__key">
                                        {t("UserPanel.Billing.AccountTitle")}
                                    </td>
                                    <td className="user_billingChannel__bank_transfer_table__value">
                                        Rasan law firm and legal consultations company
                                    </td>
                                    <td>
                                        <FaRegClipboard fontSize={20} cursor={'pointer'} onClick={() => copyDetails("Rasan law firm and legal consultations company")} />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="user_billingChannel__bank_transfer_table__key">
                                        {"Customer ID"}
                                    </td>
                                    <td className="user_billingChannel__bank_transfer_table__value">
                                        7032476751
                                    </td>
                                    <td>
                                        <FaRegClipboard fontSize={20} cursor={'pointer'} onClick={() => copyDetails("7032476751")} />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="user_billingChannel__bank_transfer_table__key">
                                        {"IBAN Number"}
                                    </td>
                                    <td className="user_billingChannel__bank_transfer_table__value">
                                        {creditCardDetails.ibanNumber}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    </div>

                    <InputBox
                        type={"text"}
                        label={"Account Name"}
                        nameIdHtmlFor={"AccountName"}
                        value={bankDetails.AccountName}
                        onChange={onChangeBankDetials}
                    />

                    <InputBox
                        type={"text"}
                        label={"Email"}
                        nameIdHtmlFor={"Email"}
                        value={bankDetails.Email}
                        onChange={onChangeBankDetials}
                    />
                    <InputBox
                        type={"text"}
                        label={"Bank"}
                        nameIdHtmlFor={"Bank"}
                        value={bankDetails.Bank}
                        onChange={onChangeBankDetials}
                    />
                    <InputBox
                        type={"text"}
                        label={"Transaction ID"}
                        nameIdHtmlFor={"trxId"}
                        value={bankDetails.trxId}
                        onChange={onChangeBankDetials}
                    />
                    <InputBox
                        type={"text"}
                        label={"IBAN Number"}
                        nameIdHtmlFor={"iban"}
                        value={bankDetails.iban}
                        onChange={onChangeBankDetials}
                    />
                </div>
                <div>
                    <h5 className="user_createTicketForm__h5">
                        {t("UserPanel.Chat.Document")}
                    </h5>

                    <Dropzone
                        content={t("UserPanel.Packages.ClickToUploadDocument")}
                        files={files}
                        setFiles={setFiles}
                        className="my-2"
                    />
                    {
                        errors && <p className={`text-danger error-msg ${lang === 'en' ? '' : 'text-end'}`}>
                            {"Please Upload Recipt"}
                        </p>
                    }
                    {
                        files && (files.length > 0 && files.map((file) => {
                            return <Pdf downloadStatus={false} key={file.name} name={file.name} size={file.size} />
                        }))
                    }
                </div>
                <div className="d-flex align-items-center justify-content-end mt-2 ">

                    <Button1
                        onClick={toggleModal}
                        text={t("UserPanel.Cases.AddNewCasePage.Cancel")}
                        color="gray"
                        className="mx-3"
                    />
                    <Button1
                        onClick={addBankPayment}
                        text={t("UserPanel.Cases.AddNewCasePage.Submit")}
                    />
                </div>
            </div>


        </Modal>
    )
}

export default BankPaymentModal
