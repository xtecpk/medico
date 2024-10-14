import React, { useEffect, useState } from 'react'
import { Button1, H2, H4 } from '../../../user/components'
import { CardLayout } from '../../../user/containers'
import ClientAvatar from "./clientAvatar.png"
import { NavLink, useLocation } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'

const AdminDetails = () => {

    const location = useLocation();
    const baseURL = import.meta.env.VITE_BASE_URL;
    const token = Cookies.get('token');

    const AdminId = location.pathname.split("/").pop();
    const [admin, setAdmin] = useState();

    const getAdminById = async () => {
        await axios.post(baseURL + "/api/getadminbyid", {
            AdminId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            console.log(res);
            setAdmin(res.data.response.data[0])
        }).catch(error => {
            console.log(error);
        })
    }

    useEffect(() => {
        getAdminById();
    }, [])

    return (
        <>
            <H2 text={"ADMIN DETAILS"} className='mb-4 ' />
            <CardLayout>
                <div className='flex_box px-1' style={{ justifyContent: "start" }}>
                    <label className='experts-label support_light_txt' htmlFor="">PROFILE PICTURE</label>
                </div>
                <div className="row my-4 mb-5">
                    <div className="col-md-2 col-sm-12">
                        <img className='expert-main-img' src={ClientAvatar} alt="" />
                    </div>
                </div>
                <div className="row flex-direction-column">
                    <div className="col-lg-6 col-md-12 my-2">
                        <div className="row">
                            <H4 text={"NAME"} className='support_light_txt col-md-6' />
                            <p className='col-md-6'>{admin && admin.AdminName}</p>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-12 my-2">
                        <div className="row">
                            <H4 text={"ROLE"} className='support_light_txt col-md-6' />
                            <p className='col-md-6'>{admin && admin.Role}</p>
                        </div>
                    </div>
                    {/* <div className="col-lg-6 col-md-12 my-2">
                        <div className="row">
                            <H4 text={"Email"} className='support_light_txt col-md-6' />
                            <p className='col-md-6'>{admin && admin.Email}</p>
                        </div>
                    </div> */}
                    <div className="col-lg-6 col-md-12 my-2">
                        <div className="row">
                            <H4 text={"PHONE NO"} className='support_light_txt col-md-6' />
                            <p className='col-md-6'>{admin && admin.PhoneNo}</p>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-12 my-2">
                        <div className="row">
                            <H4 text={"EMAIL"} className='support_light_txt col-md-6' />
                            <p className='col-md-6'>{admin && admin.email}</p>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-12 my-2">
                        <div className="row">
                            <H4 text={"PASSWORD"} className='support_light_txt col-md-6' />
                            {/* <p className='col-md-6'>{admin && admin.Password}</p> */}
                            <p className='col-md-6'>-----</p>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-12 my-2 d-flex">
                        <NavLink to={`/admin/admins/edit-admin/${admin && admin.AdminId}`}>
                            <Button1 text={"Edit"} className='px-5' />
                        </NavLink>
                        {/* <Button1 text={"Delete"} className='mx-3 px-4 outline_delete' /> */}
                    </div>
                </div>
            </CardLayout>
        </>
    )
}

export default AdminDetails
