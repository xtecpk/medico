import React, { useEffect, useState } from 'react'
import { H2 } from '../../../user/components'
import Card from '../Card/Card'
import { CardLayout } from '../../../user/containers'
import NameCard from '../Card/NameCard'
import axios from 'axios'
import Cookies from 'js-cookie'
import "./Progress.css"
import { revenueConverter } from '../../../../components/custom/RevenueConverter'

const Contracts = () => {

    const date = new Date();

    const [topExperts, setTopExperts] = useState([]);
    const [revenueGraphInfo, setRevenueGrahInfo] = useState();
    const [contractsGraphInfo, setContractsGrahInfo] = useState();
    const [casesGraphInfo, setCasesGrahInfo] = useState();
    const [cardsInfo, setCardsInfo] = useState({
        contractsTotal: null,
        contracts30Days: null,
        revenue: null,
        expertsTotal: null,
        expertsInActiveCases: null,
        casesTotal: null,
        casesLast30Days: null,
        revenueLast30Days: null,
        casesWon: null,
        casesLost: null,
        casesOpen: null,
    });
    const [casesCardInfo, setCasesCardInfo] = useState(
        // {
        //     Total: "0",
        //     InProgress: "0",
        //     Won: "0",
        //     Lost: "0",
        //     Closed: "0",
        //     UnderReview: "0",
        //     New: "0",
        //     OpenCases: "0"
        // }
    )

    const baseURL = import.meta.env.VITE_BASE_URL;
    const token = Cookies.get('token');

    const getTopExperts = async () => {
        await axios.get(baseURL + "/api/topexpert", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            console.log(res);
            setTopExperts(res.data.response.data)
        })
    }

    const plotCirlceGraph = () => {
        console.log(Object.values(casesCardInfo).shift());
        const xValues = ["New", "Under Review", "In progress", "Closed", "Won", "Lost", "Opened"];
        const yValues = Object.values(casesCardInfo).slice(1);
        const barColors = [
            "#2F4058",
            "#5C6D85",
            "#BFC0C2",
            "#D9D9D9",
            "#F0F0F0",
            "#5C6D85",
            "#A3A3A3",
        ];

        new Chart("circleGraph", {
            type: "pie",
            data: {
                labels: xValues,
                datasets: [{
                    backgroundColor: barColors,
                    data: yValues
                }]
            },
            options: {
                title: {
                    display: true,
                }
            }
        });
    }

    const plotLineGraph = (data) => {
        const xValues = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const yValues = data;

        new Chart("lineGraph", {
            type: "line",
            data: {
                labels: xValues,
                datasets: [{
                    fill: false,
                    lineTension: 0,
                    backgroundColor: "#2F4058",
                    borderColor: "#2F4058",
                    data: yValues
                }]
            },
            options: {
                legend: { display: false },
                // scales: {
                //     yAxes: [{ ticks: { min: 0, max: 30, stepSize: 10 } }],
                // }
                title: {
                    display: true,
                    text: "Monthly Contracts of year " + date.getFullYear(),
                    position: "bottom"
                },
            }
        });
    }

    const plotBarGraph = (data) => {
        const xValues = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const yValues = data
        const barColors = "#2F4058"

        new Chart("barGraph", {
            type: "bar",
            data: {
                labels: xValues,
                // yValues: yLables,
                datasets: [{
                    backgroundColor: barColors,
                    data: yValues
                }]
            },
            options: {
                legend: { display: false },
                title: {
                    display: true,
                    text: "Monthly Cases of year " + date.getFullYear(),
                    position: "bottom"
                },
                scales: {
                    x: [{
                        grid: {
                            display: false,
                        },
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            stepSize: 10,
                            // max: 40,
                        }
                    }]
                }
            }
        })
    }

    const plotBarGraph1 = (data) => {
        console.log(data);
        const xValues = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const yValues = data;
        const barColors = "#2F4058"

        new Chart("barGraph1", {
            type: "bar",
            data: {
                labels: xValues,
                // yValues: yLables,
                datasets: [{
                    backgroundColor: barColors,
                    data: yValues
                }]
            },
            options: {
                legend: { display: false },
                title: {
                    display: true,
                    text: "Monthly Revenue of " + date.getFullYear(),
                    position: "bottom"
                },
                scales: {
                    x: [{
                        grid: {
                            display: false,
                        },
                    }],
                    yAxes: [{
                        // ticks: {
                        //     beginAtZero: true,
                        //     stepSize: 100,
                        //     max: 40,
                        // }
                    }]
                }
            }
        })
    }



    const getRevenueGraphInfo = async () => {
        await axios.get(baseURL + "/api/revenueyear", {
            //     Year: date.getFullYear()
            // }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res => {
            setRevenueGrahInfo(res.data.response.data)
        }))
    }

    const getContractsGraphInfo = async () => {
        await axios.post(baseURL + "/api/cardcontractlast1year", {
            Year: date.getFullYear()
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res => {
            setContractsGrahInfo(res.data.response.data)
        }))
    }

    const getCasesGraphInfo = async () => {
        await axios.post(baseURL + "/api/cardcaselast1year", {
            Year: date.getFullYear()
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res => {
            setCasesGrahInfo(res.data.response.data)
        }))
    }


    const getCasesCardInfo = async () => {
        await axios.get(baseURL + "/api/cardcases", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            setCasesCardInfo(res.data.response.data[0])
        })
    }

    const getCardsInfo = async () => {
        const totalContracts = await axios.get(baseURL + "/api/cardcontracts", {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })

        const last30DaysContracts = await axios.get(baseURL + "/api/cardcontractlast30days", {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        const nExperts = await axios.get(baseURL + "/api/cardexpertall", {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        const revenue = await axios.get(baseURL + "/api/revenuetotal", {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        const revenueLast30Days = await axios.get(baseURL + "/api/revenuemonth", {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        const expertsInOpenCases = await axios.get(baseURL + "/api/cardexpertinopencases", {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        const casesInfo = await axios.get(baseURL + "/api/cardcases", {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        const casesLast30Days = await axios.get(baseURL + "/api/cardcaselast30days", {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        // const clientsInfo = await axios.get(baseURL + "/api/cardclients", {
        //     headers: {
        //         'Authorization': 'Bearer ' + token
        //     }
        // });

        setCardsInfo({
            contractsTotal: totalContracts.data.response.data[0].Total,
            contracts30Days: last30DaysContracts.data.response.data[0].Total,
            revenue: revenue.data.response.data[0].revenue,
            revenueLast30Days: revenueLast30Days.data.response.data[0].revenue,
            expertsTotal: nExperts.data.response.data[0].TotalExpert,
            expertsInActiveCases: expertsInOpenCases.data.response.data[0].TotalExpertOpenCases,
            casesTotal: casesInfo.data.response.data[0].Total,
            casesLast30Days: casesLast30Days.data.response.data[0].Total,
            casesWon: casesInfo.data.response.data[0].Won,
            casesLost: casesInfo.data.response.data[0].Lost,
        });
    }


    useEffect(() => {
        getTopExperts();
        getCardsInfo();

        // graphs
        getCasesCardInfo();
        getContractsGraphInfo();
        getRevenueGraphInfo();
        getCasesGraphInfo();
    }, []);

    useEffect(() => {
        casesCardInfo && plotCirlceGraph();
    }, [casesCardInfo])

    useEffect(() => {
        if (revenueGraphInfo) {
            let data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            revenueGraphInfo.map((month, index) => {
                data[month.Month - 1] = month.Revenue
            })
            plotBarGraph1(data);
        }
    }, [revenueGraphInfo])

    useEffect(() => {
        if (contractsGraphInfo) {
            let data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            contractsGraphInfo.map((month, index) => {
                data[month.month - 1] = month.Total
            })
            plotLineGraph(data);
        }
    }, [contractsGraphInfo])

    useEffect(() => {
        console.log(casesGraphInfo);
        if (casesGraphInfo) {
            let data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            casesGraphInfo.map((month, index) => {
                data[month.month - 1] = month.Total
            })
            plotBarGraph(data);
        }
    }, [casesGraphInfo])

    return (
        <>
            <H2 className='mb-3' text={"Revenue"} />
            <div className='row mb-5'>
                <div className="col-md-12 mb-4">
                    <div className="row">
                        <div className="col-lg-9 col-md-12">
                            <CardLayout className='bar_chart mx-2 mb-3'>
                                <p className='blurTxt'>Revenue</p>
                                <canvas id="barGraph1" style={{ width: "100%" }}></canvas>
                            </CardLayout>
                        </div>
                        <div className="col-lg-3 col-md-12">
                            <div className="row px-2 contarct_card_container">
                                <div className="px-2 col-lg-12 col-md-6 col-md-12 mb-2">
                                    <Card>
                                        <p>Total Revenue</p>
                                        <div className='cardContent'>
                                            <h3 className="text-secondary fw-bold  h3_comp" style={{ marginBottom: '12px' }}>SAR</h3>
                                            <h1>{cardsInfo.revenue ? revenueConverter(cardsInfo.revenue) : "0"} </h1>
                                        </div>
                                    </Card>
                                </div>
                                <div className="px-2 col-lg-12 col-md-6 col-md-12 mb-2">
                                    <Card>
                                        <p>Last 30 Days</p>
                                        <div className='cardContent'>
                                            <h3 className="text-secondary fw-bold  h3_comp" style={{ marginBottom: '12px' }}>SAR</h3>
                                            <h1>{cardsInfo.revenueLast30Days ? revenueConverter(cardsInfo.revenueLast30Days) : "0"} </h1>
                                        </div>
                                    </Card>
                                </div>
                                {/* <div className="p-2 col-lg-12 col-md-6 col-md-12">
                                    <Card>
                                        <p>Last 30 Days</p>
                                        <h1>{cardsInfo.casesLast30Days || "0"}</h1>
                                    </Card>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <H2 text={"CONTRACTS"} />
            <div className='row mb-5'>
                <div className="col-lg-6">
                    <div className="row p-2 contarct_card_container">
                        <div className="p-2 col-lg-6 col-md-6 col-md-12">
                            <Card>
                                <p>Total Contracts</p>
                                <h1>{cardsInfo.contractsTotal || "0"}</h1>
                            </Card>
                        </div>
                        <div className="p-2 col-lg-6 col-md-6 col-md-12">
                            <Card>
                                <p>Last 30 days</p>
                                <h1>{cardsInfo.contracts30Days || "0"}</h1>
                            </Card>
                        </div>
                        {/* <div className="p-2 col-lg-12 col-md-12 col-md-12">
                            <Card>
                                <p>Revenue</p>
                                <div className='cardContent'>
                                    <h3 className="text-secondary fw-bold  h3_comp" style={{ marginBottom: '12px' }}>SR</h3>
                                    <h1>{cardsInfo.revenue || "0"} </h1>
                                </div>
                            </Card>
                        </div> */}
                    </div>
                </div>
                <div className="col-lg-6 px-3">
                    <CardLayout className='bar_chart'>
                        <p className='blurTxt'>Contracts</p>
                        <canvas id="lineGraph" style={{ width: "100%" }}></canvas>
                    </CardLayout>
                </div>
            </div>
            <H2 text={"EXPERTS"} className='mx-2' />
            <div className='row mb-5'>
                <div className="col-lg-6 col-md-12 p-3">
                    <CardLayout>
                        <p className='blurTxt'>Experts Progress</p>
                        <div className='row'>
                            {topExperts.length < 0 ?
                                <p>No Expert Found</p>
                                :
                                topExperts.map((exp) => {
                                    return <NameCard className='col-md-6 col-sm-12' value={exp.WonCases / exp.Total * 100} name={exp.ExpertName} />
                                })
                            }
                        </div>
                    </CardLayout>
                </div>
                <div className="col-lg-6 col-md-12">
                    <div className="row p-2 contarct_card_container">
                        <div className="p-2 col-lg-5 col-md-6 col-md-12">
                            <Card>
                                <p>Total Experts</p>
                                <h1>{cardsInfo.expertsTotal || "0"}</h1>
                            </Card>
                        </div>
                        <div className="p-2 col-lg-5 col-md-6 col-md-12">
                            <Card>
                                <p>Experts in Open cases</p>
                                <h1>{cardsInfo.expertsInActiveCases || "0"}</h1>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            <H2 text={"CASES"} />
            <div className='row mb-5'>
                <div className="col-md-12 mb-4">
                    <div className="row">
                        <div className="col-lg-3 col-md-12">
                            <div className="row p-2 contarct_card_container">
                                <div className="p-2 col-lg-12 col-md-6 col-md-12">
                                    <Card>
                                        <p>Total Cases</p>
                                        <h1>{casesCardInfo ? casesCardInfo.Total : "0"}</h1>
                                    </Card>
                                </div>
                                <div className="p-2 col-lg-12 col-md-6 col-md-12">
                                    <Card>
                                        <p>Last 30 Days</p>
                                        <h1>{cardsInfo.casesLast30Days || "0"}</h1>
                                    </Card>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-9 col-md-12">
                            <CardLayout className='bar_chart mx-2'>
                                <p className='blurTxt'>Cases</p>
                                <canvas id="barGraph" style={{ width: "100%" }}></canvas>
                            </CardLayout>
                        </div>
                    </div>
                </div>

                <div className="col-md-12">
                    <div className="row">
                        <div className="col-lg-6 col-md-12 mb-3">
                            <CardLayout className='mx-2'>
                                <p className='blurTxt'>All Cases</p>
                                <div className="flex_box">
                                    <canvas id="circleGraph" style={{ width: "100%", height: '350px' }}></canvas>
                                </div>
                            </CardLayout>
                        </div>
                        <div className="col-lg-6 col-md-12">
                            <div className="p-2 col-lg-7 col-md-6 col-md-12">
                                <Card>
                                    <p>Cases Won</p>
                                    <h1>{casesCardInfo ? casesCardInfo.Won : "0"}</h1>
                                </Card>
                            </div>
                            <div className="p-2 col-lg-7 col-md-6 col-md-12">
                                <Card>
                                    <p>Cases Lost</p>
                                    <h1>{casesCardInfo ? casesCardInfo.Lost : "0"}</h1>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Contracts
