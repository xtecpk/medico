import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Blogs from '../blogs/Blogs/Blogs'
import BlogPage from '../blogs/blogPage/BlogPage'

const BlogPages = () => {
  return (
    <>
        <Routes>
            <Route exect path="/" element={<Blogs/>} />
            <Route path="/:id" element={<BlogPage/>} />
        </Routes>
    </>
  )
}

export default BlogPages