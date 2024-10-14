import React, { useState } from 'react'
import { CardLayout } from '../../../user/containers'
import ClientAvatar from "./clientAvatar.png"
import { Button1, H2, H3, InputBox } from '../../../user/components'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'

const AddAdmin = () => {

    const navigate = useNavigate();
    const baseURL = import.meta.env.VITE_BASE_URL;
    const token = Cookies.get('token');

    const [adminInfo, setAdminInfo] = useState({
        PhoneNo: "",
        Email: "",
        UserPassword: "",
        AdminName: "",
        Valid: 1,
        Role: "Admin"
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setAdminInfo({
            ...adminInfo,
            [name]: value
        })
    }

    const addNewAdmin = async () => {
        await axios.post(baseURL + "/api/addadmin", {
            ...adminInfo
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            navigate("/admin/admins")
        }).catch(error => {
            console.log(error);
        })
    }


    return (
        <>
            <H2 text={"NEW ADMIN"} className='mb-4 ' />
            <CardLayout>
                <div className='flex_box px-1' style={{ justifyContent: "start" }}>
                    <H3 text={"Admin Details"} />
                </div>
                <div className="row my-4 mb-5">
                    <div className="col-md-2 col-sm-12">
                        <img className='expert-main-img' src={ClientAvatar} alt="" />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-8 col-md-12">
                        <div className="row mb-3" style={{ gap: '2rem' }}>
                            <div className="col-md-5 col-sm-12 mb-3">
                                <label className='experts-label support_light_txt mb-2' htmlFor="AdminName">NAME</label>
                                <InputBox type={"text"} placeholder={"Name of the Admin"} value={adminInfo.AdminName} nameIdHtmlFor="AdminName" onChange={handleChange} />
                            </div>
                            <div className="col-md-5 col-sm-12  mb-3">
                                <label className='experts-label support_light_txt mb-2' htmlFor="">ROLE</label>
                                <InputBox value={adminInfo.Role} nameIdHtmlFor="Role" type={"select"} options={[
                                    "Admin", "Super Admin"
                                ]}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="row mb-3" style={{ gap: '2rem' }}>
                            <div className="col-md-5 col-sm-12 mb-3">
                                <label className='experts-label support_light_txt mb-2' htmlFor="">PHONE NO</label>
                                <div className="ph-number">
                                    {/* +966 */}
                                    <InputBox className='expert-input-alter mx-2 col-md-11 ' placeholder={"Phone No"} nameIdHtmlFor="PhoneNo" type={"text"} value={adminInfo.PhoneNo} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-md-5 col-sm-12 mb-3">
                                <label className='experts-label support_light_txt mb-2' htmlFor="">EMAIL</label>
                                <InputBox type={"text"} nameIdHtmlFor={"Email"} value={adminInfo.Email} onChange={handleChange} placeholder={"Email"} />
                            </div>
                        </div>
                        <div className="row mb-3" style={{ gap: '2rem' }}>
                            <div className="col-md-5 col-sm-12 mb-3">
                                <label className='experts-label support_light_txt mb-2' htmlFor="">PASSWORD</label>
                                <InputBox type={"password"} nameIdHtmlFor={"UserPassword"} value={adminInfo.UserPassword} onChange={handleChange} placeholder={"Password"} />
                            </div>
                            <div className="col-md-5 col-sm-12 mb-3 d-flex align-items-end justify-content-end">
                                <Button1 text={"Add"} className='px-4' onClick={addNewAdmin} />
                            </div>
                        </div>
                    </div>
                </div>
            </CardLayout>
        </>
    )
}

export default AddAdmin
