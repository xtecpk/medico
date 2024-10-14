import React,{useState,useEffect} from 'react'
import ScreensLayout from '../../../layouts/ScreensLayout'
import { useParams } from 'react-router-dom'
import BlogImage from '../../../assets/blogs/blog-image.png'
import useFetch from '../../../hooks/useFetch'
import './blogPage.css'
import ReadMoreArrowDark from '../../../assets/blogs/readmore-arrow-dark.svg'
import { Link } from 'react-router-dom'

const BlogPage = () => {

  const { id } = useParams();
  const [blog, setBlog] = useState([]);

//   const { response, loading, error } = useFetch({
//     method: 'get',
//     url: '/blogs',
//     headers: { accept: '*/*' },
//     body: {
//         id,
//     },
// });


// useEffect(() => {
//     if (response !== null) {
//         setBlog(response);
//     }
// }, [response]);

  return (
    <ScreensLayout>
      <div className='container-fluid d-flex justify-content-center align-items-center'>
        <div className='blog-page-container d-flex gap-5'>
              <div className='body-left'>

          <h1 className='blog-page-title'>
            {id}
          </h1>
          <div className='blog-page'>
            <div className='blog-page-image'>
              <img src={BlogImage} alt="pic" />
            </div>
          </div>
          <div className='blog-page-body d-flex flex-row gap-5 '>
                <p className='blog-page-description'>
                Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.<br/><br/>
                There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.<br/><br/>

                Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.<br/><br/>
                There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.
                </p>
          </div>
              </div>
              <div className='body-right'>
              <div className='blogs'>
              {
                [1,2,3,4].map((item, index) => (
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
                      <Link to={`/blogs/${'blog' + item}`} className='blog-link'>
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
      </div>
    </ScreensLayout>
  )
}

export default BlogPage