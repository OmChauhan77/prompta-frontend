import toast, { Toaster } from 'react-hot-toast';
import "../../pages/signin.css"
import { useSelector } from 'react-redux'
import { apiConnector } from '../../service/apiconnector'
import React, { useState, useRef, useEffect } from 'react';
import Navbar from './Navbar';
import img18 from '../../assets/img18.png';
import img15 from '../../assets/img15.png';
import img19 from '../../assets/img19.png';
import img20 from "../../assets/img20.png"
import img21 from "../../assets/img21.png"
import img23 from "../../assets/img23.png"
import img26 from "../../assets/img26.png"
import img27 from "../../assets/img27.png"
import img28 from "../../assets/img28.png"
import img29 from "../../assets/img29.png"
import animationData from '../../assets/lotties/course.lottie';
import '@dotlottie/player-component';
import { useNavigate } from 'react-router-dom'
import Footer from "../HomePage/Footer"
import img25 from "../../assets/img25.png"
import { Button, buttonVariants } from "../../component/ui/button"

import { RxCross2 } from 'react-icons/rx';
import { useParams, Link } from 'react-router-dom';

function ExpertSubmission({ forloading }) {
  const inputRef = useRef();
  const [file, setFiles] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const [formDataToSend, setFormDataToSend] = useState(new FormData());
  const [submissionData, setsubmissionData] = useState();
  const [question, setQuestion] = useState([]);
  // helper to find original quesType from question bank using heading and question text
  const getQuesType = (headingType, questionText) => {
    try {
      const group = question?.[0]?.expertQues?.find((g) => g.headingType === headingType);
      if (!group) return null;
      const qObj = group.questions.find((q) => q.ques === questionText);
      return qObj?.quesType || null;
    } catch (err) {
      return null;
    }
  };
  const [expertmarkGot, setExpertmarkGot] = useState()
  const [selftotal, setSelftotal] = useState()
  const [marksGot, setmarkGot] = useState()
  const [selfsubmitted, setSelfsubmitted] = useState(false)
  let { AssignmentId } = useParams();
  const [asessmentData, setAssessmentData] = useState();
  const { user } = useSelector((state) => state.profile)
  const { assignmentData } = useSelector((state) => state.profile)
  const [state, setState] = useState(false)

  const navigate = useNavigate();





  useEffect(() => {
    const fetchdata = async () => {
      try {
        const allQues = await apiConnector('GET', `${process.env.REACT_APP_BASE_URL}/api/v2/question_data/${assignmentData.assignmentType}`, null, {
          Authorization: `Bearer ${token}`,
        });
        setQuestion(allQues.data.allques);

      } catch (error) {
        console.log(error);
      }
    };

    fetchdata();
  }, [assignmentData]);



  useEffect(() => {

    const fetchdata = async () => {
      try {
        const Result = await apiConnector('GET', process.env.REACT_APP_BASE_URL + `/api/get_course/${user._id}/${assignmentData._id}`, null, {
          Authorization: `Bearer ${token}`,
        });

        if (Result.data.success) {
          setAssessmentData(Result.data.course);
        }


      } catch (error) {
        console.log(error);
      }
    }

    fetchdata();
  }, []);


  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await apiConnector('GET', process.env.REACT_APP_BASE_URL + `/api/get_submission/${user._id}/${AssignmentId}`, null, {
          Authorization: `Bearer ${token}`,
        });

        setsubmissionData(response.data.submission)
      } catch (error) {
        console.log(error);
      }
    }

    fetchdata();
  }, []);


  useEffect(() => {
    if (asessmentData && asessmentData?.userQuestions[0]?.submitted && asessmentData?.peerQuestions[0]?.submitted ) {

      setState(true)

    }





  }, [asessmentData])



  const handleFileChange = (event) => {
    const newFiles = [...file, event.target.files];
    setFiles(newFiles);
    // console.log(file);
  };

  function deletehandle(index) {
    const updated = file.filter((file, i) => i !== index);
    setFiles(updated);
  }

  const handleDrop = (event) => {
    event.preventDefault();
    const { files } = event.dataTransfer;
    if (files.length > 0) {
      setFiles([...file, files]);
    }
    // console.log(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDragStart = (event) => {
    event.dataTransfer.setData('text/plain', event.target.id);
  };



  const teachersubmissionhandler = async (event) => {
    event.preventDefault();

    try {

      forloading(true)
  
      file &&
        file.forEach((f) => {
          formDataToSend.append('file', f[0]);
        });

      const result = await apiConnector('POST', process.env.REACT_APP_BASE_URL + `/api/teacher_assessment/${user._id}/${assignmentData._id}/${AssignmentId}`, formDataToSend, {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      });

      if (!result.data.success) {
        toast.error("failed to submit")
        forloading(false)
        setFiles([])
        throw new Error(result.data.message);
      }
     
      setFiles([])
      forloading(false)
      setFormDataToSend(new FormData())

      toast.success('Teacher Assessment File Submitted Successfully');

   


    } catch (error) {
      forloading(false)
      toast.error(error.response?.data?.message || 'Failed to submit');
      setFiles([])
      console.error('An error occurred:', error);
    }
  };








  return (
    <div>

      {
        state &&      <div className=' mt-10 mb-20 ml-2 flex items-center gap-2 text-xl'>
        <h1 className='text-xl font-bold'>Mentor Assessment</h1>
        <div >
          <img src={img23} alt="" className='w-10  ' />

        </div>
      </div>
      
      }

 


      {state &&  !asessmentData?.expertQuestions[0]?.myfile?.length > 0 && <>



        <div className='mt-20'>
       


          <input id="file-upload" name="file" type="file" className="sr-only" ref={inputRef} multiple hidden onChange={handleFileChange} />

          <div className="col-span-full" onClick={() => inputRef.current.click()}
            onDragOver={handleDragOver} onDrop={handleDrop} onDragStart={handleDragStart}>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-[#4477CE]  px-6 py-10  bg-richblue-100">

              <div className="text-center flex flex-col justify-center items-center">
                <div>
                  <img src={img15} alt="" className='w-16 w-16 rounded-full' />

                </div>
                <div className="mt-4 flex text-sm leading-6 ">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <span>Upload a file</span>
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 ">PNG, JPG,up to 10MB</p>
              </div>
            </div>
          </div>

          {
            file.map((file, index) => {
              return <div>
                <div key={index} className='text-richlue-900 bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-xl cursor-pointer border-l-8 border-[#695FDC]'>
                  <div className='text-richblue-900 font-semibold'><p>{index + 1}. {file[0].name}</p></div>

                  <div className='mr-4 text-lg cursor-pointer' onClick={() => deletehandle(index)} ><RxCross2 /></div>
                </div>
              </div>




            })
          }

          {file?.length > 0 &&       <div className='flex mt-4 my-20 justify-center items-center'>
<Button variant='btn' onClick={teachersubmissionhandler}>
Next
</Button>
            
          </div>

          }
    




        </div>

      </>


      }




      { state &&  asessmentData?.expertQuestions[0]?.myfile?.length > 0  && asessmentData?.expertQuestions[0]?.response?.length > 0 &&

<div className="flex text-richblue-900 justify-center items-center bg-primary text-richblue-10 gap-4 shadow-md w-[150px] rounded-md">
          <div className='flex flex-col justify-center items-center'>

            <img src={img25} alt="" className="w-8" />
            <p className="text-md font-semibold">Score</p>
          </div>
          <div>
            <span className="font-semibold ">{asessmentData?.expertQuestions[0]?.totalMarkGot}</span><span className="font-semibold text-sm opacity-80">/ {asessmentData?.expertQuestions[0]?.totalMark}</span>
          </div>
        </div>

      } 


      { state && asessmentData?.expertQuestions[0]?.myfile?.length > 0  &&
       asessmentData?.expertQuestions[0]?.myfile?.map((file, index) => {
          return <div>
            <div key={index} className='text-richlue-900 bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-xl cursor-pointer border-l-8 border-[#695FDC]'>
              <Link to={file.fileurl} target="_blank"> <div className='text-richblue-900 font-semibold hover:underline'><p>{index + 1}. {file.filename}</p></div></Link>
            </div>
          </div>
        })
      }


      {state && asessmentData?.expertQuestions[0]?.myfile?.length > 0  && !asessmentData?.expertQuestions[0]?.response?.length > 0   &&
        <div className='flex flex-col gap-2 justify-center text-3xl text-gray-800 items-center my-20 font-bold '>
          <p>Wait For Mentor Response...</p></div>

      }


      {state && asessmentData?.expertQuestions[0]?.myfile?.length > 0  && asessmentData?.expertQuestions[0]?.response?.length > 0   &&
        <div className=' mt-10 mb-2 ml-2 flex items-center gap-2 text-lg'>
          <h1 className='text-xl font-bold'>Response From Mentor</h1>

        </div>
      }


      {state && asessmentData?.expertQuestions[0]?.myfile?.length > 0  && asessmentData?.expertQuestions[0]?.response?.length > 0   &&
        asessmentData?.expertQuestions[0]?.response?.map((response, index) => {
          return <div key={index}>
            {response.responses.length > 0 && <div className='font-semibold font-roboto underline'>{response.headingType}</div>}

      {response.responses.map((ques, idx) => {
        const qType = getQuesType(response.headingType, ques.question);
        return (
                <div key={idx} className='text-richlue-900 bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-xl cursor-pointer'>
                  <div className='flex flex-col max-w-[70%] min-w-[70%]'>
                    <div className='text-richblue-300 font-semibold min-w-[70%]'>
                      <p>
                        {idx + 1}. {ques.question}
                      </p>
                    </div>
                    <div>
                      {ques.answer !== null && (
                        <div className='min-w-[60%] text-sm font-roboto'>
                          <p className='font-roboto text-sm font-semibold '>Response :</p>

                          {ques.answer}
                        </div>
                      )}
                    </div>
                  </div>
                  {!(/^Response$/i.test(qType || "")) && (
                    <div className='bg-richblue-600 w-8 h-8 rounded-full text-richblue-10 flex justify-center items-center '>
                      <p>{ques.markGot}/{ques.actualMark}</p>
                    </div>
                  )}

                </div>
              );
            })}
          </div>



        })
      }
      
      {state && asessmentData?.expertQuestions[0]?.myfile?.length > 0  && asessmentData?.expertQuestions[0]?.response?.length > 0 &&  asessmentData?.expertQuestions[0]?.submitted  &&
        <div className='mb-10'>
          <div className=' mt-10 mb-2 ml-2 flex items-center gap-2 text-lg'>
            <h1 className='text-xl font-bold'>Feedback</h1>
            <div >
              <img src={img26} alt="" className='w-10 ' />

            </div>
          </div>
          <div>
            <textarea
              type="text"
              name="expertQuestion"
              className="block w-full rounded-md border-0 py-1.5  font-semibold shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
              placeholder="No Feedback"
              rows={2}
              value={asessmentData?.expertQuestions[0]?.feedback}

            />
          </div>
        </div>


      }






{state && asessmentData?.expertQuestions[0]?.myfile?.length > 0  && asessmentData?.expertQuestions[0]?.response?.length > 0 &&  
        <div className='flex flex-col gap-2 justify-center text-3xl text-gray-800 items-center my-20 font-bold '>
          <dotlottie-player
            autoplay
            playMode="normal"
            src={animationData}
            background="transparent"
            speed="0.5"
            style={{ width: '100px', height: '100px' }}
          />

          <p>You have successfully completed mentor assessment !</p>

          <Button onClick={() => {
            navigate(`/students/add_submission/${user._id}/${AssignmentId}`)
          }}>
            Back to Courses
          </Button>
        </div>

      }


    </div>
  )
}

export default ExpertSubmission;