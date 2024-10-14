import React from 'react'
import './blogs.css'
import { Link } from 'react-router-dom'
import ScreensLayout from '../../../layouts/ScreensLayout'
import ReadMoreArrowLight from '../../../assets/blogs/readmore-arrow-light.svg'
import ReadMoreArrowDark from '../../../assets/blogs/readmore-arrow-dark.svg'
import BlogImage from '../../../assets/blogs/blog-image.png'

const Blogs = () => {
  return (
    <ScreensLayout>
      <div className='container-fluid d-flex justify-content-center align-items-center mt-5'>
        <div className='blogs-container d-flex flex-column'>
          <div className='main-blog'>
            <div className='main-blog-image'>
              <img src={BlogImage} alt="pic" />
            </div>
            <div className='main-blog-info'>
              <h1>Blog Title</h1>
              <p>Blog Description</p>
                <Link to={`/blogs/${'123'}`} className='main-blog-link'>
                  <div className='d-flex'>
                    <span>Read more</span>
                    <img src={ReadMoreArrowLight} alt='>'/>
                  </div>
                </Link>
            </div>
          </div>
            <div className='blogs'>
              {
                [1,2,3,4,5,6,7,8,9,10].map((item, index) => (
                  <div className='blog' key={index}>
                    <div className='blog-image'>
                      <img src={BlogImage} alt="pic"/>
                    </div>
                    <div className='blog-info'>
                      <h1>Blog Title</h1>
                      <div className='blog-description'>
                        <div className='blog-description-overlay'></div>
                        <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature   from 45 BC, making it over 2000 years old.</p>
                      </div>
                      <Link to={`/blogs/${item}`} className='blog-link'>
                        <div className='d-flex'>
                          <span>Read more</span>
                          <img src={ReadMoreArrowDark} alt='>'/>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
    </ScreensLayout>
  )
}

export default Blogs