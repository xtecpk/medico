import React, { useEffect, useRef, useState } from 'react'
import { Header, Sidebar } from '../user/containers'
import "./index.css";
import AdminSideBar from '../user/containers/sidebar/AdminSideBar'
import { useDispatch, useSelector } from 'react-redux';
import { barsIcon } from "../user/assets";
import { H2, UserPicCard } from '../user/components';
import { Route, Routes } from 'react-router-dom';
import Contracts from './components/contracts/Contracts';
import Membership from './components/membership/Membership';
import Management from './components/management/Management';
import Promos from './components/promos/Promos';
import Clients from './components/clients/Clients';
import ClientDetails from './components/clients/ClientDetails';
import CaseDetails from './components/clients/CaseDetails';
import Payments from './components/payments/Payments';
import ProfileRequests from './components/requests/ProfileRequests';
import { AddNewCase, Chat } from '../user/screens';
import Support from './components/support/Support';
import Blogs from './components/Blogs/Blogs';
import BlogDetails from './components/Blogs/BlogDetails';
import EditBlog from './components/Blogs/EditBlog';
import AddBlog from './components/Blogs/AddBlog';
import RespondTicket from './components/support/RespondTicket';
import Experts from './components/experts/Experts';
import ExpertDetails from './components/experts/ExpertDetails';
import AddExpert from './components/experts/AddExpert';
import AdminCases from './components/cases/AdminCases';
import Admins from './components/admins/Admins';
import AdminDetails from './components/admins/AdminDetails';
import AddAdmin from './components/admins/AddAdmin';
import EditAdmin from './components/admins/EditAdmin';
import useAuthentication from '../../hooks/useAuthentication';
import { useTranslation } from 'react-i18next';
import { language } from '../../features/language/lanSlice';
import Home from './Home';
import axios from 'axios';

const Admin = () => {

    const authenticate = useAuthentication();
    const { i18n } = useTranslation();
    const dispatch = useDispatch();

    const lang = useSelector((state) => state.language.value);
    const userBaseMainRef = useRef(null)
    const [isSidebarHidden, setIsSidebarHidden] = useState(true);
    const [isPicCardExpanded, setIsPicCardExpanded] = useState(false);
    const [chatCaseId, setChatCaseId] = useState();
    const [isLanguageToggleExpanded, setIsLanguageToggleExpanded] =
        useState(false);

    const toggleSidebar = () => {
        setIsSidebarHidden((prevState) => !prevState);
    };


    useEffect(() => {
        if (isSidebarHidden) {
            userBaseMainRef.current.classList.add("user_main_full_width");
        } else {
            userBaseMainRef.current.classList.remove("user_main_full_width");
        }
    }, [isSidebarHidden]);


    useEffect(() => {
        i18n.changeLanguage("en");
        dispatch(language("en"));

        if (authenticate) {
            console.log('authentication complete');
        }
        else {
            console.log('not authentication complete');
        }
    }, [])



    return (
        <div className={`user_base ${lang === "ar" ? "user_base_ar" : " "}`}>
            <div className="user_base_inner">
                <AdminSideBar
                    isSidebarHidden={isSidebarHidden}
                    toggleSidebar={toggleSidebar}
                />
                <Header toggleSidebar={toggleSidebar} isSidebarHidden={isSidebarHidden} />
                <main
                    ref={userBaseMainRef}
                    className={`user_base_main ${lang === "ar" ? "user_base_main_ar" : ""}`}>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/progress' element={<Contracts />} />
                        <Route path='/requests' element={<Membership />} />
                        <Route path='/management' element={<Management />} />
                        <Route path='/promos' element={<Promos />} />
                        <Route path='/clients' element={<Clients />} />
                        <Route path='/clients/add-client' element={<AddExpert type='clients' />} />
                        <Route path='/payments' element={<Payments />} />
                        <Route path='/clients-chat' element={<>
                            <H2 text={"CHAT"} className='mb-4' />
                            <Chat />
                        </>} />
                        <Route path='/experts-chat' element={<>
                            <H2 text={"CHAT"} className='mb-4' />
                            <Chat />
                        </>} />
                        <Route path='/cases-chat' element={<>
                            <H2 text={"CHAT"} className='mb-4' />
                            <Chat chatCaseId={chatCaseId} />
                        </>} />
                        <Route path='/support' element={<Chat />} />
                        <Route path='/support/respond' element={<RespondTicket />} />
                        {/* <Route path='/blogs' element={<Blogs />} />
                        <Route path='/blogs/:blogId/edit' element={<EditBlog />} />
                        <Route path='/blogs/add-new-blog' element={<AddBlog />} />
                        <Route path='/blogs/:blogId' element={<BlogDetails />} /> */}
                        <Route path='/profile-requests' element={<ProfileRequests />} />
                        <Route path='/clients/:clientId' element={<ClientDetails />} />
                        <Route path='/clients/:clientId/details' element={<CaseDetails role="admin" type='clients' setChatCaseId={setChatCaseId} />} />
                        <Route path='/experts' element={<Experts />} />
                        <Route path='/experts/:expertId' element={<ExpertDetails />} />
                        <Route path='/experts/add-expert' element={<AddExpert />} />
                        <Route path='/cases' element={<AdminCases />} />
                        <Route path='/cases/add-new-case' element={<AddNewCase />} />
                        <Route path='/cases/:caseId' element={<CaseDetails role="admin" type='cases' setChatCaseId={setChatCaseId} />} />
                        <Route path='/admins' element={<Admins />} />
                        <Route path='/admins/:adminId' element={<AdminDetails />} />
                        <Route path='/admins/add-admin' element={<AddAdmin />} />
                        <Route path='/admins/edit-admin/:adminId' element={<EditAdmin />} />
                    </Routes>
                </main>
            </div>
        </div>
    )
}

export default Admin
