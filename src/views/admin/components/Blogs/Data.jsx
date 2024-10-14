import React from 'react'
import "./Blogs.css"
import { H4 } from '../../../user/components'

const Data = (props) => {
    return (
        <div className='data-container'>
            <H4 text={props.heading} />
            <p className='data-p'>{props.paragraph}</p>
        </div>
    )
}

export default Data