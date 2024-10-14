import React from 'react'
import { H2 } from '../../../user/components'
import { CardLayout } from '../../../user/containers'
import { NavLink } from 'react-router-dom'

const ClientCases = ({ cases = [] }) => {

    return (
        <>
            <H2 text={"Cases"} className='mb-3' />
            <div className="row cards_row">
                {
                    cases.length > 0 ? cases.map((record) => {
                        return (
                            <div className="col-md-4">
                                <NavLink to={`/admin/clients/${record.CaseId}/details`}>
                                    <CardLayout>
                                        <h6>{record.CaseName}</h6>
                                        <p className='blurTxt'>{record.Description}</p>
                                        <div className='statusBox'>
                                            {record.Status}
                                        </div>
                                    </CardLayout>
                                </NavLink>
                            </div>
                        )
                    }) : <p>No Cases Found</p>
                }
            </div>
        </>
    )
}

export default ClientCases
