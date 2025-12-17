import React, { useEffect } from 'react'
import { IoMdNotificationsOutline } from "react-icons/io"
import { RxHamburgerMenu } from "react-icons/rx"
import Img10 from "../../assets/img10.png"
import { Link, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import { useState } from "react"
import { setUser, setIsOpen1 } from '../../slices/profileSlice'
import { RxDashboard } from "react-icons/rx"
import { MdAssignmentAdd, MdAssignment } from "react-icons/md"
import { FaClipboardQuestion } from "react-icons/fa6"
import { BiSolidReport } from "react-icons/bi"
import { HiUserGroup } from "react-icons/hi2"
import { IoMdUnlock } from "react-icons/io"
import Logo from '../../assets/logo1';
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { MdReviews } from "react-icons/md";
import { setIstoken } from '../../slices/profileSlice'
import { setToken } from '../../slices/authSlice'
import { MdChat } from "react-icons/md";
const Navbar = () => {
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    const dispatch = useDispatch()
    const [isOpen1, setIsOpen1] = useState(false)

    const logouthandler = () => {

        dispatch(setUser(null));
        dispatch(setIstoken(false));
        dispatch(setToken(''));
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem('persist:root');

};

    const location = useLocation();


    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const closeDropdown = () => {
        setIsOpen(false);
    };


    function toggleDropdown1() {
        setIsOpen1(!isOpen1);
    };

    useEffect(() => {
        console.log(isOpen1)
    }, [isOpen1])




    // const toggleDropdown1 = () => {
    //     dispatch(setIsOpen1(true));
    //   };

    // const closeDropdown1 = () => {
    //     dispatch(setIsOpen1(false));
    // };


    const { user } = useSelector((state) => state.profile);

    const userNavigation = [
        { name: 'Your Profile', href: '/profileupdate' },
    ];


    const { profile } = useSelector((state) => state.profileData);
    return (
        <div className=''>
            {

                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen1 ? 'w-60' : 'w-0'} fixed top-0 left-0 bg-richblue-300 h-screen  z-50 font-roboto rounded-r-md`} onClick={toggleDropdown1}>
                    <div className='h-48 mt-6  flex flex-col gap-4 justify-center items-center'>
                        <div className='w-16 h-16 rounded-full'>
                            <img src={profile.image} alt="" className='w-16 h-16 rounded-full' />
                        </div>

                        <div className='flex flex-col gap-[1px] justify-center items-center text-richblue-10'>
                            <p className='font-[450]'>
                                {profile.firstname} {profile.lastname}
                            </p>
                            <p className='opacity-70 font-normal text-sm'>
                                {user.email}
                            </p>
                            <div className="h-[1px] w-56 border-b-[1px] mt-10 opacity-10 shadow-lg">

                            </div>
                        </div>

                    </div>
                    <div classname="flex flex-col gap-4 justify-center items-center text-richblue-10 opacity-60 font-[400]">
                        <Link to={user.accountType === "Student" ? "/students/dashboard" : "/adminpannel/dashboard"}>
                            <div className='flex ml-12  cursor-pointer mb-4 items-center group hover:bg-richblue-10 hover:bg-opacity-20 mr-6 h-10 ml-4 pl-8 rounded-md transition delay-75'> <RxDashboard className='text-richblue-10 group-hover:opacity-100  opacity-70  font-[500] mr-2 transition delay-75' /><p className='text-richblue-10 group-hover:opacity-100  opacity-70  font-[500] transition delay-75 text-nowrap'> Dashboard</p></div>

                        </Link>
                        <Link to={user.accountType === "Student" ? "/students/new_assessment" : "/adminpannel/new_assignment"}>
                            <div className='flex ml-12  cursor-pointer mb-4 items-center group hover:bg-richblue-10 hover:bg-opacity-20 mr-6 h-10 ml-4 pl-8 rounded-md transition delay-75'> <MdAssignmentAdd className='text-richblue-10 group-hover:opacity-100  opacity-70  font-[500] mr-2 transition delay-75' /><p className='text-richblue-10 group-hover:opacity-100 opacity-80  font-[500] transition delay-75 text-nowrap'> {user.accountType === "Student" ? "My Courses " : "Create Course"}</p></div>

                        </Link >
                        <Link to={user.accountType === "Student" ? "/students/all_assessments" : "/adminpannel/all_assignment"}>
                            <div className='flex ml-12  cursor-pointer mb-4 items-center group hover:bg-richblue-10 hover:bg-opacity-20 mr-6 h-10 ml-4 pl-8 rounded-md transition delay-75'><MdAssignment className='text-richblue-10 group-hover:opacity-100  opacity-70  font-[500] mr-2 transition delay-75' /><p className='text-richblue-10 group-hover:opacity-100 opacity-80  font-[500] transition delay-75 text-nowrap'> {user.accountType === "Student" ? "All Courses" : "My Courses"}</p></div>
                        </Link>
                        {user.accountType === "Admin" && <div className='group'>
                            <Link to='/adminpannel/set_questions'>
                                <div className='flex ml-12  cursor-pointer mb-4 items-center group hover:bg-richblue-10 hover:bg-opacity-20 mr-6 h-10 ml-4 pl-8 rounded-md transition delay-75 '> <FaClipboardQuestion className='text-richblue-10 group-hover:opacity-100  opacity-70  font-[500] mr-2 transition delay-75' /><p className='text-richblue-10 group-hover:opacity-100 opacity-80  font-[500] transition delay-75 text-nowrap'>Questions</p></div>
                            </Link>

                        </div>


                        }


                        {user.accountType === "Admin" && <div className='group'>
                            <Link to='/adminpannel/all_users'>
                                <div className='flex ml-12  cursor-pointer mb-4 items-center group hover:bg-richblue-10 hover:bg-opacity-20 mr-6 h-10 ml-4 pl-8 rounded-md '> <HiUserGroup className='text-richblue-10 group-hover:opacity-100  opacity-70  font-[500] mr-2' /><p className='text-richblue-10 group-hover:opacity-100 opacity-80  font-[500]'>Users</p></div>
                            </Link>

                        </div>

                        }
                        {user.accountType === "Admin" && <div className='group'>
                            <Link to='/adminpannel/Review_and_experts'>
                                <div className='flex ml-12  cursor-pointer mb-4 items-center group hover:bg-richblue-10 hover:bg-opacity-20 mr-6 h-10 ml-4 pl-8 rounded-md '> <MdReviews className='text-richblue-10 group-hover:opacity-100  opacity-70  font-[500] mr-2' /><p className='text-richblue-10 group-hover:opacity-100 opacity-80  font-[500]'>Experts</p></div>
                            </Link>

                        </div>

                        }

                    </div>
                    <div className="h-[1px] border-gray-300 w-56 border-b-[1px]  opacity-10 shadow-lg">

                    </div>
                    <div>
                        <div className='flex ml-12  mt-2 cursor-pointer mb-6 items-center group hover:bg-richblue-10 hover:bg-opacity-20 mr-6 h-10 ml-4 pl-8 rounded-md transition delay-75' onClick={logouthandler}> <IoMdUnlock className='text-richblue-10 group-hover:opacity-100  opacity-70  font-[500] mr-2 transition delay-75' /><p className='text-richblue-10 group-hover:opacity-100 opacity-80  font-[500] transition delay-75'>Sign out</p></div>


                    </div>
                </div>
            }

            <div className='max-w-8/12  w-screen pb-0'>


                <div className='font-roboto bg-richblue-600 text-richblue-10 text-opacity-70 rounded-b-xl'>

                    {/* nav */}
                    <div className='flex flex-row justify-evenly border-b-[1px] text-sm font-normal  border-opacity-20 pt-4'>

                        {/* logo */}
                        <div>
                            <Link to="/">
                                <Logo />
                            </Link>
                        </div>
                        {/* mid */}
                        <div className='flex gap-8  mb-0 cursor-pointer hidden  sm:flex'>
                            <div className={` group ${location.pathname === '/adminpannel/dashboard' || location.pathname === '/students/dashboard' ? ('text-richblue-10') : (false)}`}>
                                <Link to={user.accountType === "Student" ? "/students/dashboard" : "/adminpannel/dashboard"}>
                                    <div className='mb-0 p-2'><p>Dashboard</p></div>

                                </Link>
                                <div className={location.pathname === '/adminpannel/dashboard' || location.pathname === '/students/dashboard' ? ('w-18 h-[2px] m-0 bg-richblue-10') : (false)}></div>
                            </div>


                            {/* <div className={` group ${location.pathname === '/adminpannel/new_assignment' || location.pathname === '/students/new_assessment' ? ('text-richblue-10') : (false)}`}>
                                <Link to={user.accountType === "Student" ? "/students/new_assessment" : "/adminpannel/new_assignment"}>
                                    <div className='mb-0 p-2'><p> {user.accountType === "Student" ? "Course" : "Course"}</p></div>

                                </Link >
                                <div className={location.pathname === '/adminpannel/new_assignment' || location.pathname === '/students/new_assessment' ? ('w-18 h-[2px] m-0 bg-richblue-10') : (false)}></div></div> */}
                            {/* <div className={` group ${location.pathname === '/adminpannel/all_assignment' || location.pathname === '/students/all_assessments' ? ('text-richblue-10') : (false)}`}>
                                <Link to={user.accountType === "Student" ? "/students/all_assessments" : "/adminpannel/all_assignment"}>
                                    <div className='mb-0 p-2'><p>{user.accountType === "Student" ? "All Courses" : "All Courses"}</p></div>
                                </Link>
                                <div className={location.pathname === '/adminpannel/all_assignment' || location.pathname === '/students/all_assessments' ? ('w-18 h-[2px] m-0 bg-richblue-10') : (false)}></div>

                            </div> */}
{/*                             
                            {user.accountType === "Admin" && <div className={`group ${location.pathname === '/adminpannel/set_questions' ? ('text-richblue-10') : (false)}`}>
                                <Link to='/adminpannel/set_questions'>
                                    <div className='mb-0 p-2'><p>Assessment Rubrics</p></div>
                                </Link>
                                <div className={location.pathname === '/adminpannel/set_questions' ? ('w-18 h-[2px] m-0 bg-richblue-10') : (false)}></div>

                            </div>

                            } */}

                            {/* <div className={` group ${location.pathname === '/students/my_reports' ? ('text-richblue-10') : (false)}`}>
                                <Link to="/students/my_reports" >
                                    <div className='mb-0 p-2'><p>{user.accountType === "Student" && "My Reports"}</p></div>
                                </Link>
                                <div className={location.pathname === '/students/my_reports' ? ('w-18 h-[2px] m-0 bg-richblue-10') : (false)}></div>

                            </div> */}

                        </div>    
                        {/* profile */}
                        <div className='flex text-lg justify-end items-center gap-4 z-10 mr-0'>
                            <div>
                                {/* <IoMdNotificationsOutline /> */}
                            </div>

                            <div className='flex  justify-center items-center gap-2'>


                               
                                <Menu as="div" className="relative ml-3 mr-3">
                                    <div>
                                        <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                            <span className="absolute -inset-1.5" />
                                            <span className="sr-only">Open user menu</span>
                                            <img className="h-8 w-8 rounded-full" src={profile.image} alt="" />
                                        </Menu.Button>
                                    </div>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <div className='p-2 border-b-[0.8px]'>
                                                <h4 className='text-sm font-bold text-gray-700'> {profile?.firstname} {profile?.lastname}</h4>
                                                <p className='text-xs text-gray-700'>{profile.email}</p>
                                            </div>
                                            {userNavigation.map((item) => (
                                                <Menu.Item key={item.name}>
                                                    {({ active }) => (
                                                        <a
                                                            href={item.href}
                                                            className={classNames(
                                                                active ? 'bg-gray-100' : '',
                                                                'block px-4 py-2 text-sm text-gray-700'
                                                            )}
                                                        >
                                                            {item.name}
                                                        </a>
                                                    )}
                                                </Menu.Item>

                                            ))}

                                            <Menu.Item ><div onClick={logouthandler} className={

                                                'hover:bg-gray-100  block cursor-pointer px-4 py-2 text-sm text-gray-700'
                                            }><p>Logout</p></div></Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>





                                <div className='mr-10 '>


                                    <div className="profile-dropdown  relative">
                                        <button className="profile-button mb-8 opacity-75 hover:opacity-100 h-[5px] " onClick={toggleDropdown1}
                                        >
                                            <label className="hamburger">
                                                <svg viewBox="0 0 32 32">
                                                    <path className="line line-top-bottom" d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"></path>
                                                    <path className="line" d="M7 16 27 16"></path>
                                                </svg>
                                            </label>
                                        </button>
                                    </div>

                                </div>




                            </div>

                        </div>
                    </div>
                    {
                        location.pathname === '/adminpannel/dashboard' || location.pathname === '/students/dashboard' ? (<div className='flex items-center ml-28'>

                            <div className='text-2xl' >
                                <h1>Welcome to Prompta, &nbsp;<span className='text-richblue-10 '>{profile.firstname || profile.firstname}</span> </h1>
                            </div>
                            <div className='w-40 m-0'>
                                <img src={Img10} alt="" className='m-0 p-0' />
                            </div>

                        </div>) : (false)
                    }




                </div>


            </div>

        </div>




    )
}

export default Navbar;