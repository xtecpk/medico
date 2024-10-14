import React, {useState, useEffect} from 'react'
import './testimonial.css'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const Testimonial = () => {

  const [activeIndex, setActiveIndex] = useState(0);
  const {t} = useTranslation();
  const lang = useSelector(state => state.language.value);
  const testimonials = i18next.t('Home.Testimonial.testimonials', {returnObjects: true});

  const handleDotClick = (index) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Increment the activeIndex or loop back to 0
      setActiveIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change testimonial every 5000 milliseconds (5 seconds)

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [testimonials.length]);

  


  return (
    <div className='container-fluid testimonials-bg w-100 d-flex justify-content-center align-items-center'>
        <div className='testimonials-container d-flex flex-column align-items-center gap-5'>
            <div className='testimonials-heading d-flex justify-content-center'>
                <h1 className='text-center'>
                    {t('Home.Testimonial.Heading')}
                </h1>
            </div>
            <div className='testimonials-subheading d-flex justify-content-center mt-4'>
                <p className='text-center'>
                    {t('Home.Testimonial.Subheading')}
                </p>
            </div>
            <div className='testimonials d-flex flex-column justify-content-center align-items-center'>
                    {
                    testimonials.map((testimonial, index) => (
                        <div
                          key={index}
                          className={`testimonial ${index === activeIndex ? 'active' : ''}`}
                        >
                        <div className='quotations-marks top'> 
                            <h1>"</h1>
                        </div>
                        <div className='quotations-marks bottom'>
                            <h1>"</h1>
                        </div>
                        <p className={`testimonial-quote ${lang=='en'?'text-start':'text-end'}`}>{testimonial.quote}</p>
                        <p className={`testimonial-author ${lang=='en'?'text-start':'text-end'}`}>-- {testimonial.author}</p>
                        </div>
                        ))
                    }
                <div className='d-flex gap-3 mt-5'>
                    {
                        testimonials.map((_, index) => (
                            <div
                              key={index}
                              className={`dot ${index === activeIndex ? 'active' : ''}`}
                              onClick={() => handleDotClick(index)}
                            ></div>
                        ))
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default Testimonial