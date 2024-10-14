import React, { useEffect, useState } from 'react'
import { H3 } from '../../../user/components'
import Card from '../Card/Card'
import { CardLayout } from '../../../user/containers'
import { Cases } from '../../../user/screens'
import axios from 'axios'
import Cookies from 'js-cookie'

const AdminCases = () => {

    const baseURL = import.meta.env.VITE_BASE_URL;
    const token = Cookies.get('token')

    const [cases, setCases] = useState([]);
    const [cardInfo, setCardInfo] = useState({
        Total: "0",
        InProgress: "0",
        Won: "0",
        Lost: "0",
        Closed: "0",
        UnderReview: "0",
        New: "0",
        OpenCases: "0"
    })

    const getCases = async () => {
        await axios.get(baseURL + "/api/getallcase", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            setCases(res.data.response.data.reverse())
        }).catch(error => {
            console.log(error);
        })
    }

    const getCardInfo = async () => {
        await axios.get(baseURL + "/api/cardcases", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            const data = res.data.response.data[0];
            setCardInfo({
                ...data,
            })
        })
    }

    useEffect(() => {
        getCases();
        getCardInfo();
    }, [])

    return (
        <>
            <div className='row mb-5'>
                <div className="col-md-6 col-sm-12 mb-3">
                    <div className="row cardsRow px-2">
                        <Card className='col-md-5'>
                            <p>Total Cases</p>
                            <h1>{cardInfo.Total}</h1>
                        </Card>
                        <Card className='col-md-5'>
                            <p>In Progress</p>
                            <h1>{cardInfo.InProgress}</h1>
                        </Card>
                        <Card className='col-md-5'>
                            <p>Cases Won</p>
                            <div className='cardContent'>
                                {/* <h3 className="text-secondary fw-bold  h3_comp" style={{ marginBottom: '12px' }}>SR</h3> */}
                                <h1>{cardInfo.Won} </h1>
                            </div>
                        </Card>
                        <Card className='col-md-5'>
                            <p>Cases Lost</p>
                            <div className='cardContent'>
                                {/* <h3 className="text-secondary fw-bold  h3_comp" style={{ marginBottom: '12px' }}>SR</h3> */}
                                <h1>{cardInfo.Lost} </h1>
                            </div>
                        </Card>
                    </div>
                </div>
                <div className="col-md-6 col-sm-12">
                    <CardLayout>
                        <p className='blurTxt'>Others</p>
                        <div className="row">
                            <div className="col-lg-7 col-md-12">
                                <div className="record_row d-flex align-items-center justify-content-between py-2 mb-2">
                                    <p class="blurTxt headingBlur">New</p>
                                    <H3 text={cardInfo.New} />
                                </div>
                                <div className="record_row d-flex align-items-center justify-content-between py-2 mb-2">
                                    <p class="blurTxt headingBlur">OPENED</p>
                                    <H3 text={cardInfo.OpenCases} />
                                </div>
                                <div className="record_row d-flex align-items-center justify-content-between py-2 mb-2">
                                    <p class="blurTxt headingBlur">UNDER REVIEW</p>
                                    <H3 text={cardInfo.UnderReview} />
                                </div>
                                <div className="record_row d-flex align-items-center justify-content-between py-2 mb-2">
                                    <p class="blurTxt headingBlur">CLOSED</p>
                                    <H3 text={cardInfo.Closed} />
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-12"></div>
                        </div>
                    </CardLayout>
                </div>
            </div>
            <Cases cases={cases} role='admin' />
        </>
    )
}

export default AdminCases
