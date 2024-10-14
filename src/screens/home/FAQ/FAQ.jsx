import React,{useState} from 'react'
import './faq.css'
import { FaqData } from '../../../variables/home/FAQ'

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null)

    const handleIndex = (index) => {
        setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
    }    

  return (
    <div className='container-fluid d-flex justify-content-center align-items-center '>
        <div className='faq-container d-flex flex-column justify-content-center align-items-center'>
            <div className='faq-title d-flex justify-content-center mb-5'>
                <h1>FAQs</h1>
            </div>
            <div className='faq-questions d-flex flex-column gap-5'>
                {FaqData.map((item, index) => {
                    return(
                        <div key={index} className='faq-question d-flex flex-column justify-content-center'>
                            <div className='faq-question-title d-flex justify-content-between align-items-center'
                                onClick={() => handleIndex(index)}
                             >
                                <h3>{item.question}</h3>
                                <div className='faq-question-toggle d-flex justify-content-center align-items-center'>
                                    <h1 className='faq-sign'>
                                        {activeIndex === index ? '-' : '+'}
                                    </h1>
                                </div>
                            </div>
                            <div className={`faq-question-answer ${activeIndex === index ? 'active': ''}`}>
                                <p className='mt-3'>{item.answer}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    </div>
  )
}

export default FAQ