import React, { useEffect, useRef, useState } from 'react'
import { Button1, H2 } from '../../../user/components'
import { CardLayout } from '../../../user/containers'
import BlogImage from './blogImg1.png'
import Data from './Data';
import './Blogs.css';
import { InputBox } from '../../../user/components';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
const EditBlog = () => {

    const navigate = useNavigate();
    const baseURL = import.meta.env.VITE_BASE_URL;
    const token = Cookies.get('token');
    const fileInputRef = useRef(null);

    const location = useLocation();
    const BlogId = location.pathname.split('/')[3];
    const [blogDetails, setBlogDetails] = useState();
    const [imageSrc, setImgSrc] = useState();
    const [imageFile, setImgFile] = useState();


    const getBlogById = async () => {
        await axios.post(baseURL + "/api/getblogbyid", {
            BlogId: BlogId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            console.log(res);
            setBlogDetails(res.data.response.data[0])
        }).catch(error => {
            console.log(error);
        })
    }

    const handleChange = (e) => {
        const { value, name } = e.target;
        setBlogDetails({
            ...blogDetails,
            [name]: value
        })
    }

    const updateBlog = async (event) => {
        event.preventDefault();
        await axios.post(baseURL + "/api/updateblog", {
            BlogId: BlogId,
            Title: blogDetails.Title,
            BlogTime: "2023-12-02 12:12:12",
            Writer: blogDetails.Writer,
            BlogText: blogDetails.BlogText,
            Status: blogDetails.Status,
            MetaDescription: blogDetails.MetaDescription,
            Keywords: blogDetails.Keywords,
            MetaTags: blogDetails.MetaTags,
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            console.log(res);
            if (res.data.response.status) {
                navigate("/admin/blogs")
            }
        }).catch(error => {
            console.log(error);
        })
    }

    const uploadImage = async (file) => {
        await axios.post(baseURL + "/api/uploadblogimage", {
            BlogImage: blogDetails.BlogImage,
            blogimage: file
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            console.log(res);
        }).catch(error => {
            console.log(error);
        })
    }

    useEffect(() => {
        getBlogById();
    }, [])

    const uploadFile = () => {
        fileInputRef.current.click();
    }

    const handleChageFile = () => {
        setImgFile(fileInputRef.current.files[0]);
        const imgFile = fileInputRef.current.files[0]

        const reader = new FileReader();

        reader.onload = (e) => {
            setImgSrc(e.target.result)
        };
        reader.readAsDataURL(imgFile);
        uploadImage(fileInputRef.current.files[0])
    }



    return (
        <>
            <H2 text={"BLOG"} className='mb-4' />
            <CardLayout className='position_relative'>
                <div className="add-img-block flex-box" onClick={uploadFile} style={{ backgroundImage: `url(${blogDetails ? "https://app.rasanllp.com/medical/blog/" + blogDetails.BlogImage : (imageSrc & imageSrc)})` }}>
                    <input type="file" ref={fileInputRef} onChange={handleChageFile} />
                    <h5 className='upload-heading'>+UPLOAD IMAGE</h5>
                </div>
                <form action="" onSubmit={updateBlog}>
                    <Data heading="Title" />
                    <InputBox
                        className='blog-input'
                        type={"text"}
                        nameIdHtmlFor={"Title"}
                        onChange={handleChange}
                        value={blogDetails && blogDetails.Title}
                    />
                    <Data heading="Description" />
                    <InputBox
                        className='blog-input-description'
                        type={"textarea"}
                        rows={7}
                        nameIdHtmlFor={"BlogText"}
                        onChange={handleChange}
                        value={blogDetails && blogDetails.BlogText}
                    />

                    <Data heading="Keywords" />
                    <InputBox
                        className='blog-input'
                        type={"text"}
                        nameIdHtmlFor={"Keywords"}
                        onChange={handleChange}
                        placeholder="Keywords  (comma separated) "
                        value={blogDetails && blogDetails.Keywords}
                    />
                    <Data heading="Meta Tags" />
                    <InputBox
                        className='blog-input'
                        type={"text"}
                        nameIdHtmlFor={"MetaTags"}
                        onChange={handleChange}
                        placeholder="Tags  (comma separated)"
                        value={blogDetails && blogDetails.MetaTags}
                    />
                    <Data heading="Meta Description" />
                    <InputBox
                        className='blog-input'
                        type={"text"}
                        placeholder="Description"
                        nameIdHtmlFor={"MetaDescription"}
                        onChange={handleChange}
                        value={blogDetails && blogDetails.MetaDescription}
                    />
                    <div className="d-flex align-items-center justify-content-end my-3 mt-5">
                        <Button1 type="submit" text={"Publish"}></Button1>
                    </div>
                </form>
            </CardLayout >
        </>
    )
}

export default EditBlog
