import React, { useEffect, useRef, useState } from 'react'
import { H2 } from '../../../user/components'
import './Blogs.css';
import Data from './Data';
import { InputBox } from '../../../user/components';
import { CardLayout } from '../../../user/containers';
import { Button1 } from '../../../user/components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import DateFormatForServer from '../../../../components/custom/DateFormatForServer';
const AddBlog = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const baseURL = import.meta.env.VITE_BASE_URL;
    const token = Cookies.get('token');

    const [imageSrc, setImgSrc] = useState();
    const [keywords, setKeywords] = useState();
    const [imageFile, setImgFile] = useState();
    const [blogInfo, setBlogInfo] = useState({
        Title: "",
        BlogTime: "",
        Writer: "",
        BlogText: "",
        BlogImage: "",
        Keywords: "",
        MetaTags: "",
        MetaDescription: ""
    })

    const tagConverter = (value) => {
        let result = "";
        value.split(', ').map(tag => {
            result += " #" + tag + ",";
        });
        return result;
    }

    const handleChangeKeywords = (event) => {
        setKeywords(event.target.value);
    }

    console.log(blogInfo.Keywords);

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
    }

    const formatDate = (currentDate) => {
        const formattedDate = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            // timeZoneName: 'short',
        }).format(currentDate);

        return formattedDate
    }



    const handleChange = (e) => {
        const { value, name } = e.target;
        setBlogInfo({
            ...blogInfo,
            [name]: value
        })
    }

    const uploadImage = async () => {
        await axios.post(baseURL + "/api/uploadblogimage", {
            BlogImage: imageFile.name,
            blogimage: imageFile
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

    const addBlog = async () => {
        const currentDate = new Date();
        uploadImage()

        await axios.post(baseURL + "/api/addblog", {
            Title: blogInfo.Title,
            Writer: blogInfo.Writer,
            BlogText: blogInfo.BlogText,
            BlogImage: imageFile.name,
            Status: 1,
            BlogTime: DateFormatForServer(currentDate),
            Keywords: tagConverter(keywords),
            MetaTags: blogInfo.MetaTags,
            MetaDescription: blogInfo.MetaDescription
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            navigate("/admin/blogs")
        }).catch(error => {
            console.log(error);
        })
    }


    const handleSubmit = (e) => {
        console.log("submit");
        e.preventDefault();
        addBlog();
    }

    return (
        <>
            <H2 text={"NEW BLOG"} className='mb-4' />
            <CardLayout className='position_relative'>

                <div className="add-img-block flex-box" onClick={uploadFile} style={{ backgroundImage: `url(${imageSrc && imageSrc})` }}>
                    <input type="file" ref={fileInputRef} onChange={handleChageFile} />
                    <h5 className='upload-heading'>+UPLOAD IMAGE</h5>
                </div>
                <form action="" onSubmit={handleSubmit}>
                    <Data heading="Title" />
                    <InputBox
                        className='blog-input'
                        type={"text"}
                        placeholder=""
                        nameIdHtmlFor={"Title"}
                        value={blogInfo.Title}
                        onChange={handleChange}
                    />
                    <Data heading="Description" />
                    <InputBox
                        rows={7}
                        className='blog-input-description'
                        type={"textarea"}
                        placeholder=""
                        nameIdHtmlFor={"BlogText"}
                        value={blogInfo.BlogText}
                        onChange={handleChange}
                    />

                    <Data heading="Keywords" />
                    <InputBox
                        className='blog-input'
                        type={"text"}
                        placeholder=""
                        nameIdHtmlFor="Keywords"
                        value={keywords}
                        onChange={handleChangeKeywords}
                    />
                    <Data heading="Writer" />
                    <InputBox
                        className='blog-input'
                        type={"text"}
                        placeholder=""
                        nameIdHtmlFor={"Writer"}
                        value={blogInfo.Writer}
                        onChange={handleChange}
                    />
                    <Data heading="Meta Tags" />
                    <InputBox
                        className='blog-input'
                        type={"text"}
                        placeholder=""
                        nameIdHtmlFor="MetaTags"
                        value={blogInfo.MetaTags}
                        onChange={handleChange}
                    />
                    <Data heading="Meta Description" />
                    <InputBox
                        className='blog-input'
                        type={"text"}
                        placeholder=""
                        nameIdHtmlFor="MetaDescription"
                        value={blogInfo.MetaDescription}
                        onChange={handleChange}
                    />
                    <div className="d-flex align-items-center justify-content-end my-3 mt-5">
                        <Button1 type="submit" text={"Publish"}></Button1>
                    </div>
                </form>
            </CardLayout >
        </>
    )
}

export default AddBlog
