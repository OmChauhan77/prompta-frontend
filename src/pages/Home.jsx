import React from 'react'
import Img1 from "../assets/img1.png"
import Img2 from "../assets/img4.png"
import Img3 from "../assets/img3.png"
import Img33 from "../assets/img33.2.png"
import Img4 from "../assets/img2.png"
import img12 from "../assets/img12.jpg"
import { MdEmail } from "react-icons/md";
import Arrow from '../assets/arrow'
import Underline from '../assets/underiline'
import Circle from '../assets/circle'
import { BsChevronDown } from "react-icons/bs"
import { TiSocialLinkedin, TiSocialFacebook, TiSocialInstagram, TiSocialTwitter } from "react-icons/ti"
import { Link } from 'react-router-dom'
import Social from "../components/HomePage/Social"
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from 'react'
import { IoMdNotificationsOutline } from "react-icons/io"
import { setUser } from '../slices/profileSlice'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { FaPlay } from "react-icons/fa";
import YouTube from 'react-youtube';
import Logo from '../assets/logo';
import ReactPlayer from 'react-player'
import Carousel from './Carousel'
import { apiConnector } from '../service/apiconnector'
import { setIstoken } from '../slices/profileSlice'
import { setToken } from '../slices/authSlice'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const Home = () => {

    const [Experts, setExperts] = useState([])
    const [expandedIndex, setExpandedIndex] = useState(null);

    const handleReadMore = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };
    useEffect(() => {
        const fetchdata = async () => {
            try {
                // console.log(id);
                const response = await apiConnector('GET', process.env.REACT_APP_BASE_URL + `/api/v2/all_experts`, null, null);



                if (response.data.Experts) {
                    setExperts(response.data.Experts)
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchdata();
    }, []);

    let LOGO = "PROMPTa";
    useEffect(() => {
        AOS.init({ duration: 2000 })
    }, [])
    const dispatch = useDispatch()
    const { user ,istoken} = useSelector((state) => state.profile)
    const { profile } = useSelector((state) => state.profileData);


    const logouthandler = () => {

            dispatch(setUser(null));
            dispatch(setIstoken(false));
            dispatch(setToken(''));
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            localStorage.removeItem('persist:root');

    };

    const [play, Setplay] = useState(false)

    const cards = [

        {
            heading: 'Multiple drafts with guided prompts',
            image: Img2,
            description: 'Our course is designed to take your writing to the next level with a unique feature: multiple drafts guided by targeted prompts. Each draft comes with specific prompts to help you brainstorm, refine, and polish your ideas. This step-by-step process ensures that you develop your thoughts thoroughly and produce high-quality writing, whether for creative projects or academic papers. Join us and see how our guided prompts can transform your writing journey!'
        },
        {
            heading: 'Personalized Feedback for Meaningful Growth',
            image: Img4,
            description: 'Gain valuable insights from self, peer, mentor, and expert feedback tailored to your writing needs. Our comprehensive assessments emphasize human connection, providing personalized feedback to ensure a richer, more meaningful learning experience. Join us to elevate your writing with guidance from a supportive community.',
        }, {
            heading: 'Engaging and rewarding',
            image: Img3,
            description: 'PROMPTa is designed with learners in mind, making the experience enjoyable and motivating. Our user-friendly platform offers interactive lessons, intuitive navigation, and engaging activities to keep you inspired. Earn a certificate upon completing the course and celebrate your achievement!'
        }

    ]



    return (

        <div className='relative mt-10'>

            {play && <div className='fixed h-screen w-screen bg-[#000000] bg-opacity-60 flex justify-center items-center z-50' onClick={() => Setplay(false)
            } >




                <div className='absolute  '>

                    <ReactPlayer url='https://www.youtube.com/embed/NyIrc5inhc0?si=6gXurDuW9NylXfMd' controls width="320px" height="200px" >

                    </ReactPlayer>



                </div>

            </div>

            }

            {/* Navbar */}

            <div className='px-2 pt-2 shadow-md fixed top-0 right-0 left-0 z-50  bg-richblue-10'  >

                <div className='flex justify-between gap-2 flex-col sm:flex-row p-2 w-11/12 '>


                    <div>
                        <Logo />
                    </div>

                    {
                        istoken ? (<div className='flex text-lg justify-center items-center gap-4 text-richblue-500'>
                            <div>
                                {/* <IoMdNotificationsOutline /> */}
                            </div>
                            <Menu as="div" className="relative inline-block text-left">
                                <div>
                                    <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ">
                                        <div className='w-8 h-8 rounded-md bg-cover flex justify-center items-center' style={{ backgroundImage: `url(${img12})` }}>
                                            {profile && profile?.image && <img src={profile?.image} alt="User Profile" className='w-8 h-8 rounded-md' />}
                                        </div>
                                        <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
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
                                    <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-[#ffffff] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="py-1">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link className={classNames(
                                                        active ? 'bg-[#f3f4f6] text-gray-900' : 'text-gray-700',
                                                        'block px-4 py-2 text-sm'
                                                    )} to = { user?.accountType === "Student" ? "/students/dashboard" : "/adminpannel/dashboard"}>    <div className='cursor-pointer'><p>Dashboard</p></div></Link>

                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link className={classNames(
                                                        active ? 'bg-[#f3f4f6] text-gray-900' : 'text-gray-700',
                                                        'block px-4 py-2 text-sm'
                                                    )} to='/profileupdate'>    <div className='cursor-pointer'><p>My profile</p></div></Link>
                                                )}
                                            </Menu.Item>
                                            <form method="POST" action="#">
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <div onClick={logouthandler} className={classNames(
                                                            active ? 'bg-[#f3f4f6] text-gray-900 cursor-pointer' : 'text-gray-700',
                                                            'block px-4 py-2 text-sm'
                                                        )}><p>Logout</p></div>
                                                    )}
                                                </Menu.Item>
                                            </form>
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>

                        </div>) : (

                            <div className='flex flex-row gap-4 ml-4 '>
                                <Link to={"/login"}>
                                    <div className='flex justify-center transition-all duration-200 hover:scale-[1.02] items-center w-[90px] h-[40px] border-[2px] border-richblue-700 group rounded-md font-medium text-richblue-700 cursor-pointer '>
                                        <div className='text-center transition-all duration-200 group-hover:scale-[1.02] text-lg '>Login</div>
                                    </div></Link>


                                <Link to={"/sendotp"}><div className='flex justify-center transition-all duration-200 hover:scale-[1.02] items-center w-[90px] h-[40px] group  rounded-md   bg-richblue-700 font-medium cursor-pointer'>
                                    <div className='text-center transition-all duration-200  text-lg text-richblue-10 group-hover:scale-[1.02]'>Signup</div>
                                </div></Link>

                            </div>
                        )
                    }

                </div>

            </div>





            <div className=' text-center pt-10 rounded-b-3xl'>

                <div className='flex flex-wrap-reverse max-w-lg w-9/12 justify-center mx-auto item-center sm:flex-row sm:max-w-5xl sm:flex-nowrap  ' data-aos="fade-left">


                    {/* left text */}
                    <div className=' mt-16 text-start'>

                        <div className='text-richblue-900 flex flex-col gap-2 justify-star cursor-default'>

                            <div className='flex flex-col justify-start text-6xl font-bold'>

                                <h2 className='tracking-tight text-richblue-700'>{LOGO}</h2>

                                <h2 className='tracking-tight text-gray-800'>
                                    Enhance your writing, one draft at a time!
                                </h2>

                            </div>

                            <p className='text-xl  text-start  font-medium text-richblue-700 font-pj'>Welcome to <span className='font-semibold'>{LOGO}</span>-Performance Review Of Manuscript Profeciency Tool for Assessment!</p>

                            <p className='text-xl text-start  font-medium text-richblue-700 font-pj'>Feeling stuck with your writing? </p>

                            <p className='text-xl text-start  font-medium text-richblue-700 font-pj'>Staring at a blank page?
                            </p>
                            <p className='text-xl  text-start  font-medium text-richblue-700 font-pj'>You’ve come to the right place!

                            </p>


                            <p className="text-lg font-medium text-richblue-700 font-pj">  Writing can be an uphill task, but <span className='text-richblue-700 font-semibold'>{LOGO}</span> is here to make it easier. We’ll help you enhance your skills, one draft at a time. Let’s embark on this journey together! </p>

                            {/* <p className='text-lg  text-richblue-700 '> </p> */}

                        </div>

                        <div className='mt-10 flex gap-4 '>
                            <Link to={"/sendotp"}>
                                <div className='  flex justify-center items-center  w-[120px] bg-richblue-700 rounded-md h-[40px] text-richblue-10 font-semibold transition-all duration-200 hover:scale-[1.02]'>Get Started</div>
                            </Link>

                            <div className='  flex justify-center items-center gap-2 w-[150px] bg-richblue-50 rounded-md h-[40px] text-richblue-700 font-semibold transition-all duration-200 hover:scale-[1.02] cursor-pointer' onClick={() => { Setplay(true) }}><span className='bg-richblue-10 text-sm w-8 h-8 rounded-full flex justify-center items-center ' > <FaPlay /> </span>Watch demo</div>

                        </div>

                    </div>

                </div>

                <Link to={"/"}><div className='flex flex-col mx-aut animate-bounce font-inter text-richblue-300 transition-all duration-200 hover:scale-95 font-semibold mt-10 pointer-events-auto cursor-pointer' >

                    <p>Learn more</p>
                    <div className='mx-auto'><BsChevronDown /></div>
                </div></Link>


            </div>



            <section className='mt-12'>
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">

                    <div className="flex flex-col items-center">
                        <div className="text-center">
                            <h2 className="mt-4 mb-10 text-3xl font-bold text-gray-900 sm:text-4xl xl:text-5xl font-pj">Empowering you to write better</h2>
                        </div>




                        <div className="grid grid-cols-1 max-w-[80%] sm:grid-cols-2 justify-center items-center gap-4">


                            <div>
                                <img src={Img33} alt="Descriptive alt text" />
                            </div>

                            <div className="items-center my-20 sm:flex sm:flex-col sm:items-center">
                                <div className="text-lg text-center">

                                    <p className="text-2xl font-medium text-richblue-700 font-pj">
                                        Effective writing is a continuous process, not just a final product. {LOGO} goes beyond the final draft, focusing on both the
                                        <span className="font-bold"> development </span> and the
                                        <span className="font-bold"> outcome </span> of your writing.
                                        Here’s how we empower you:
                                    </p>
                                </div>
                            </div>



                        </div>


                    </div>
                </div>
            </section>



            <div id="down" className="down flex mt-16 flex-col mx-auto justify-center items-center max-w-8/12">







                {/* cards */}
                {/* <section>

                    <div className='flex flex-col gap-5 sm:flex-row' data-aos="fade-right">

                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>


                            <div className=' min-h-[450px] shadow-xl  rounded-md p-4 flex flex-col justify-center items-center'>

                                <div className='w-[100px] min-h-[30%]'><img src={Img2} alt="" /></div>

                                <div>
                                    <div className='min-h-[30%] '><h2 className='text-richblue-400 text-2xl font-bold text-center'>Multiple drafts with guided prompts</h2></div>


                                    <div className='min-h-[40%]'><p className=' text-richblue-700 text-lg text-center text-richblue '>{LOGO} offers a series of writing tasks with structured prompts that guide you through brainstorming, developing strong arguments, and refining your style. Revisit these prompts with each draft to continuously improve your written work.</p></div>

                                </div>




                            </div>


                            <div className='  min-h-[450px]  rounded-md p-4 flex flex-col justify-center items-center shadow-xl'>

                                <div className='w-[140px] min-h-[30%]'><img src={Img4} alt="" /></div>
                                <div>
                                    <div className='min-h-[30%] mb-2'><h2 className='text-richblue-400 text-2xl font-bold text-center'>Comprehensive and Assessment and human centered feedback</h2></div>

                                    <div className='min-h-[40%]'><p className=' text-center  text-lg text-richblue-700 text-richblue '>Gain valuable insights from self, peer,mentor, and expert feedback trailored to your wrting needs. with focus on human connection you recieve personalise feedback to ensure a richer learning experience.</p></div>

                                </div>

                            </div>


                            <div className='  min-h-[450px]  rounded-md p-4 flex flex-col justify-center items-center shadow-xl'>

                                <div className='w-[100px] min-h-[30%] mt-0'><img src={Img3} alt="" /></div>
                                <div>
                                    <div className='min-h-[30%] mb-2'><h2 className='text-richblue-400 text-2xl font-bold text-center'>Engaging and rewarding</h2></div>

                                    <div className='min-h-[40%]'><p className=' text-center text-lg text-richblue-700 text-richblue '>{LOGO} is user friendly, making learning enjoyable and motivating. you will recieve acomplishing certificate upon finishing the course .</p></div>

                                </div>

                            </div>



                        </div>









                    </div>

                </section> */}


                <section className='flex justify-center my-12 items-center '>


                    <div className='flex flex-col justify-center items-center   max-w-[85%]'>

                        <div className='flex flex-col justify-center text-center gap-4 items-center mb-8'>



                            <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl xl:text-5xl font-pj">Elevate Your Writing Journey with PROMPTa</h2>
                            <p className="text-lg font-medium text-gray-600 font-pj">Guided Prompts,personalized feedback, and Rewarding Learning Experiences</p>





                        </div>



                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {cards.length > 0 && cards.map((team, index) => (
                                <div key={index} className='min-h-[300px] flex flex-col justify-center items-center rounded-md p-4 shadow-xl'>
                                    <div className='w-28 h-28 rounded-full flex justify-center items-center '>
                                        <img src={team.image} className='w-24 h-24 object-cover ' alt="" />
                                    </div>
                                    <div className='text-center'>
                                        <h3 className='text-xl font-bold mb-2 text-richblue-700'>{team.heading}</h3>

                                    </div>
                                    <div className='mt-4 text-center text-richblue-700 '>



                                        {team.description}
                                    </div>


                                </div>
                            ))}
                        </div>


                    </div>


                </section>


                <section className='flex justify-center my-12 items-center '>


                    <div className='flex flex-col justify-center items-center   max-w-[85%]'>

                        <div className='flex flex-col justify-center text-center gap-4 items-center mb-8'>



                            <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl xl:text-5xl font-pj">The Experts Behind PROMPTa</h2>
                            <p className="text-lg font-medium text-gray-600 font-pj">Meet our experts of dedicated professionals, committed to guiding you through every step of your writing journey with expertise, support, and personalized feedback.</p>





                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {Experts.length > 0 && Experts.map((team, index) => (
                                <div key={index} className='min-h-[300px] flex flex-col justify-center items-center rounded-md p-4 shadow-xl'>
                                    <div className='w-28 h-28 rounded-full flex justify-center items-center bg-gray-200'>
                                        <img src={team.imageUrl} className='w-24 h-24 object-cover rounded-full' alt="" />
                                    </div>
                                    <div className='text-center'>
                                        <h3 className='text-xl font-bold mb-2'>{team.name}</h3>
                                        <p className='text-gray-400 font-semibold text-lg'>{team.role}</p>
                                    </div>
                                    <div className='mt-4 text-center text-richblue-700 '>


                                        {expandedIndex === index ? team.about : `${team.about.substring(0, 100)}...`}


                                        {team.about.length > 100 && (
                                            <button
                                                onClick={() => handleReadMore(index)}
                                                className='text-blue-500 ml-2'
                                            >
                                                {expandedIndex === index ? 'Read Less' : 'Read More'}
                                            </button>
                                        )}
                                    </div>

                                    <div className='m-2'>
                                        <Social linkto={`mailto:${team.email}`}>
                                            <MdEmail />
                                        </Social>


                                    </div>
                                </div>
                            ))}
                        </div>


                    </div>


                </section>



                {/* <Carousel /> */}



                <div className='w-screen mt-20' >

                    <div className='bg-richblue-50 relative flex flex-col items-center justify-center text-center gap-5 rounded-t-3xl w-screen overflow-x '>




                        <div className='mt-10 flex flex-col justify-center max-w-[90%] items-center gap-2'>

                            <h2 className='text-richblue-700 text-2xl font-bold '>Join {LOGO} and discover a new way to write with confidence !</h2>

                            <div>
                                < Underline />
                            </div>


                        </div>

                        <div className='mt-2 mb-8'>   <Link to={"/sendotp"}>
                            <div className='  flex justify-center items-center  w-[120px] bg-richblue-700 rounded-md h-[40px] text-richblue-10 font-semibold transition-all duration-200 hover:scale-[1.02]'>Get Started</div>
                        </Link></div>

                        <div className='hidden sm:flex absolute w-92 top-[10] left-0 '>
                            <Arrow />
                        </div>

                    </div>

                    <div className='mt-20 '>

                        <div className='relative '>

                            <h2 className='text-richblue-900 p-8  text-2xl text-richblue-700 font-bold '>{LOGO}</h2>

                            <div className='absolute -top-12 left-6'>
                                <Circle />
                            </div>

                        </div>



                        <div className='flex flex-col justify-center items-center gap-5 m-5 sm:flex-row'>
                            <div className='flex flex-row gap-5'>
                                {/* social media */}

                                <Social linkto={"/"}>
                                    <TiSocialLinkedin />
                                </Social>



                                <Social linkto={"/"}>
                                    <TiSocialFacebook />
                                </Social>

                                <Social linkto={"/"}>
                                    <TiSocialInstagram />
                                </Social>

                                <Social linkto={"/"}>
                                    <TiSocialTwitter />
                                </Social>

                            </div>
                            <div className='text-richblue-500 flex flex-col font-sermibold gap-4 sm:flex-row sm:gap-10'>
                                <div className='transition-all duration-200  hover:scale-95'><Link><p>Accessibility</p></Link></div>
                                <div className='transition-all duration-200 hover:scale-95'><Link><p>Compliance</p></Link></div>
                                <div className='transition-all duration-200 hover:scale-95'><Link><p>Terms of Use</p></Link></div>
                                <div className='transition-all duration-200 hover:scale-95'><Link><p>Privacy Policy</p></Link></div>
                                <div className='transition-all duration-200 hover:scale-95'> <Link><p>Security Practices</p></Link></div>
                                <div className='transition-all duration-200 hover:scale-95'><Link><p>System Status</p></Link></div>
                                <div className='transition-all duration-200 hover:scale-95'><Link><p>English</p></Link></div>
                            </div>

                        </div>


                    </div>




                </div>

                <div className=' mt-5 mb-16 sm:flex sm:flex-row w-8/12 gap-2 sm:justify-center'>
                    <div ><p>All rights reserved. Use of this website signifies your agreement to the </p></div>
                    <div><Link><p className='text-richblue-300 transition-all duration-200 hover:scale-95 '>Terms of Use.</p></Link></div>
                </div>




            </div>





        </div>





    )
}

export default Home;



