import React, { useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { H3, InputBox, Modal } from '../../../user/components';
import axios from 'axios';
import Cookies from 'js-cookie';

const PromosDisplayTable = ({ labels, pageCasesToDisplay, path = "/admin/promos/", getPromos }) => {

    const { t } = useTranslation();
    const baseURL = import.meta.env.VITE_BASE_URL;
    const token = Cookies.get('token');

    const [showModal1, setShowModal1] = useState(false)
    const [type, setType] = useState("Amount");
    const [Status, setStatus] = useState()
    const [promo, setPromo] = useState({
        PromoId: "",
        PromoName: "",
        Code: "",
        Type: "Percentage",
        Percentage: "",
        Amount: "",
        Status
    });

    const toggleModal1 = (data) => {
        setShowModal1(!showModal1);
        data && setStatus(data.Status === 1 ? "Active" : "Inactive")
        console.log(data);
        data && setType(data.Type)
        data && setPromo(data)
    }

    const updatePromo = async () => {
        await axios.post(baseURL + "/api/updatepromo", {
            ...promo,
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            console.log(res);
            toggleModal1();
            getPromos();
        })
    }

    const handleChangeStatus = (event) => {
        setStatus(event.target.value)
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPromo({
            ...promo,
            [name]: value,
        })
    }

    useEffect(() => {
        setPromo({
            ...promo,
            Status: (Status === "Active" ? 1 : 0)
        })
    }, [Status])


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
                                            {/* <Link
                                                className="w-100 d-block user_cases_display_table__cell_link"
                                                to={path + caseItem.PromoId}> */}
                                            {caseItem[data]}
                                            {/* </Link> */}
                                        </td>
                                    ) : (
                                        (
                                            dataIndex === 5 ? false : (dataIndex < 6) ? <td
                                                key={dataIndex}
                                                className="user_cases_display_table__cell">
                                                {caseItem[data]}
                                            </td> : <td>
                                                {caseItem[data] === 1 ? "Active" : "Inactive"}
                                            </td>
                                        )
                                    )
                                )}
                                <td key={index} className="user_cases_display_table__cell memberActions">
                                    <button style={{ color: "#3573C9" }} onClick={() => toggleModal1(caseItem)}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="text-center">{t("No Record Found")}</div>
            )}


            {
                showModal1 && <>
                    <Modal toggleModal={toggleModal1} modalHead={"Approval Confirmation"}>
                        <div className="user_createTicketForm mb-3">
                            <H3 text={"UPDATE PROMO"} />
                            <InputBox type={"text"} label={"Name"} placeholder={"Name"} value={promo.PromoName && promo.PromoName} nameIdHtmlFor={"PromoName"} onChange={handleChange} />
                            <InputBox type={"text"} label={"Code"} placeholder={"Code"} value={promo.Code && promo.Code} nameIdHtmlFor={"Code"} onChange={handleChange} />
                            {/* <div className="row">
                                <div className="col-sm-6" style={{ paddingLeft: "0" }}>
                                    <div className="user_input_box">
                                        <div className="flex_box" style={{ justifyContent: "flex-start" }} onClick={() => setType("Amount")}>
                                            <input type="radio" id='amount' name='Amount' value="Type" checked={!!(type === "Amount")} onChange={handleChange} />
                                            <label htmlFor="amount">
                                                <h5 className='mx-2'>Amount</h5>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6" style={{ paddingRight: "0" }}>
                                    <div className="user_input_box">
                                        <div className="flex_box" style={{ justifyContent: "flex-start" }} onClick={() => setType("Percentage")}>
                                            <input type="radio" id='percent' name='type' value="Percentage" checked={!!(type === "Percentage")} />
                                            <label htmlFor="percent">
                                                <h5 className='mx-2'>Percentage</h5>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            {/* <InputBox type={"text"} label={"Amount"} nameIdHtmlFor={type} placeholder={type} value={type === "Percentage" ? promo.Percentage : promo.Amount} onChange={handleChange} /> */}
                            <InputBox
                                label={"Status"}
                                type={"select"}
                                nameIdHtmlFor={"Status"}
                                onChange={handleChangeStatus}
                                value={Status}
                                options={[
                                    "Active",
                                    "Deactive"
                                ]}
                            />
                        </div>

                        <div className="d-flex align-items-center justify-content-end ">
                            <button className="mx-3 user_button1 user_button1--gray " onClick={toggleModal1}>
                                <span>Cancel</span>
                            </button>
                            <button className=" user_button1" onClick={updatePromo}>
                                <span>Update</span>
                            </button>
                        </div>

                    </Modal>
                </>
            }


        </>
    )
}

export default PromosDisplayTable
