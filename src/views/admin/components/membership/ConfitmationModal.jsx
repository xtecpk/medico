import React from 'react'
import { CardLayout } from '../../../user/containers'

const ConfitmationModal = ({ children, toggleModal, modalHead }) => {
    return (
        <div>
            <div className="user_modal_overlay" onClick={toggleModal}></div>
            {/* <div> */}
            <div className="user_modal">
                <div className="modal_head">
                    <h6>{modalHead}</h6>
                </div>
                <div className="modal_body">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default ConfitmationModal
