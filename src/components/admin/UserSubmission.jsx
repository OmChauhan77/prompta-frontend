import React, { Component } from "react";
import { BiArrowBack } from "react-icons/bi"
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react'
import { apiConnector } from '../../service/apiconnector'
import { useSelector } from 'react-redux'

import img22 from "../../assets/img22.png"
import Img24 from "../../assets/img24.png"
import img18 from '../../assets/img18.png';
import img15 from '../../assets/img15.png';
import img19 from '../../assets/img19.png';
import img20 from "../../assets/img20.png"
import img21 from "../../assets/img21.png"
import img23 from "../../assets/img23.png"
import img25 from "../../assets/img25.png"
import img26 from "../../assets/img26.png"
import Footer from "../HomePage/Footer"
import img27 from "../../assets/img27.png"

import animationData from '../../assets/lotties/course.lottie';
import { Button, buttonVariants } from "../../component/ui/button"

import toast, { Toaster } from 'react-hot-toast';

const UserSubmission = () => {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const { UserId, AssignmentId, Type } = useParams();
  const [submissionData, setSubmissionData] = useState()
  const [feedback, setFeedback] = useState('')
  const [questionData, setQuestionData] = useState();
  // helper to find original quesType from questionData using heading and question text
  const getQuesType = (headingType, questionText, section = "expert") => {
    try {
      const sectionKey =
        section === "user" ? "userQues" : section === "peer" ? "peerQues" : "expertQues";
      const group = questionData?.[0]?.[sectionKey]?.find((g) => g.headingType === headingType);
      if (!group) return null;
      const qObj = group.questions.find((q) => q.ques === questionText);
      return qObj?.quesType || null;
    } catch (err) {
      return null;
    }
  };
  const [expertfinalResponses, setExpertFinalResponses] = useState([]);
  const [peertotal, setPeertotal] = useState()
  const { assignmentData } = useSelector((state) => state.profile)
const [marksGot,setmarksGot]=useState()

  useEffect(() => {
    let totalMarks;
    if (questionData && questionData[0]?.expertQues && questionData[0]?.expertQues.length > 0) {
      totalMarks = questionData[0].expertQues.reduce((accumulator, currentValue) => {
        currentValue.questions.forEach((question) => {
          accumulator += question.mark;
        });
        return accumulator;
      }, 0);
      // console.log(totalMarks);
      setPeertotal(totalMarks)
    }
  }, [questionData]);



  useEffect(() => {
    let totalMarks;
    if (  expertfinalResponses &&   expertfinalResponses.length > 0) {
      totalMarks =   expertfinalResponses.reduce((accumulator, currentValue) => {
        currentValue.responses.forEach((question) => {
          accumulator += question.markGot;
        });
        return accumulator;
      }, 0);
      // console.log(totalMarks)
      setmarksGot(totalMarks)
    }
  }, [  expertfinalResponses]);
  


  useEffect(() => {
    const fetchdata = async () => {
      try {
        const allQues = await apiConnector('GET', `${process.env.REACT_APP_BASE_URL}/api/v2/question_data/${assignmentData?.assignmentType}`, null, {
          Authorization: `Bearer ${token}`,
        });
        setQuestionData(allQues.data.allques);
      } catch (error) {
        console.log(error);
      }
    };

    fetchdata();
  }, []);



  const goBack = () => {
    navigate(-1); // This is equivalent to history.goBack()
  };








  useEffect(() => {

    const fetchdata = async () => {
      try {
        const Result = await apiConnector('GET', process.env.REACT_APP_BASE_URL + `/api/get_course/${UserId}/${AssignmentId}`, null, {
          Authorization: `Bearer ${token}`,
        });

        if (Result.data.success) {
          setSubmissionData(Result.data.course);
        }


      } catch (error) {
        console.log(error);
      }
    }

    fetchdata();
  }, []);








  useEffect(() => {
    if (Array.isArray(questionData) && questionData.length > 0) {
      const userresponses = questionData[0]?.expertQues?.map((ques) => ({
        headingType: ques.headingType,
        responses: ques.questions.map((questions) => ({
          question: questions.ques,
          answer: null,
          markGot: 0,
          actualMark: questions.mark,
        })),
      }));
      setExpertFinalResponses(userresponses);
    }
  }, [questionData]);



  

  const expertsubmission = async (event) => {

    event.preventDefault();

    try {
      setLoading(true);
      const result = await apiConnector('POST', process.env.REACT_APP_BASE_URL + `/api/v2/teacher_submission/${UserId}/${AssignmentId}`, {
        expertfinalResponses,
        feedback,
        peertotal,
        marksGot
      }, {
        Authorization: `Bearer ${token}`,
      });

      if (!result.data.success) {
        setLoading(false);
        throw new Error(result.data.message);
      }
      // console.log(result);
      setLoading(false);
      setExpertFinalResponses([])
      toast.success('Send to User Successfully');

      // Fetch updated submission data immediately after submission
      const Result = await apiConnector('GET', process.env.REACT_APP_BASE_URL + `/api/get_course/${UserId}/${AssignmentId}`, null, {
        Authorization: `Bearer ${token}`,
      });

      if (Result.data.success) {
        setSubmissionData(Result.data.course);
      }


    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed To Submit");
      console.error('An error occurred:', error);
    }
  };







  useEffect(() => {
    console.log(questionData)
  }, [questionData])




  return (<div>


    <div className='min-h-[100vh] font-roboto '>



      <div className='bg-richblue-600 h-full text-richblue-10 p-10'>
        <div className='flex text-2xl gap-10 font-semibold items-center max-w-4xl'>
          <div className='hover:bg-richblue-10 h-10 w-10 rounded-full flex justify-center items-center hover:bg-opacity-20 cursor-pointer' onClick={goBack}>
            <BiArrowBack />
          </div>


          <div>
            {assignmentData?.assignmentTopic} - <span className='text-lg'>View Submission</span>
          </div>

        </div>

      </div>

      <div className='max-w-[90%] sm:max-w-4xl mx-auto text-richblue-900 mt-4'>

        <div>
          <div className='w-20 h-20'><img src={img22} alt="" /></div>
          <div className='text-xl font-semibold'>Submission</div>
        </div>




        <div>

        </div>
        {loading ? (<div className='flex justify-center items-center h-[100vh] sm:signinbg'>
          <div class="spinner"></div>

        </div>) : (


          <div>


            {!submissionData && <div className='mt-20'>
              <main class="grid min-h-full ">
                <div class="text-center flex flex-col justify-center items-center">
                  <p class="text-base font-semibold text-indigo-600 w-[180px]"><img src={Img24} alt="" /></p>
                  <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-2xl">"Submission not found"</h1>
                  <div class="mt-10 flex items-center justify-center gap-x-6">
                  </div>
                </div>
              </main>
            </div>

            }




            {
              (
                <div >

                  <div className=' max-w-4xl mx-auto font-roboto mt-4 p-6 pt-2 bg-richblue-10  rounded-md'>




                    {/* self assessment */}


                    {Type === "self" && <div className='shadow-xl bg-richblue-10 p-10'>


                      {submissionData &&  (<div>


                        <div className=' mt-10 mb-2 ml-2 flex items-center gap-2 text-xl'>
                          <h1 className='text-xl font-bold'>Self-Assessment</h1>
                          <div >
                            <img src={img19} alt="" className='w-8  ' />

                          </div>
                        </div>
                      </div>

                      )

                      }
                      {submissionData && submissionData?.userQuestions[0]?.submitted && submissionData?.userQuestions[0]?.response?.length > 0 &&
                        <div className="flex text-richblue-10 justify-center items-center bg-primary  gap-4 shadow-md w-[150px] rounded-md">
                          <div className='flex flex-col justify-center items-center'>

                            <img src={img25} alt="" className="w-8" />
                            <p className="text-md font-semibold">Score</p>
                          </div>
                          <div>
                            <span className=" font-semibold ">{submissionData?.userQuestions[0]?.totalMarkGot}</span><span className="font-semibold text-sm opacity-80">/ {submissionData?.userQuestions[0]?.totalMark}</span>
                          </div>
                        </div>

                      }


                      {(submissionData && submissionData?.userQuestions[0]?.response?.length > 0 && submissionData?.userQuestions[0]?.submitted) && <div className=' mt-10 mb-2 ml-2 flex items-center gap-2 '>
                        <h1 className='text-lg font-bold'>Self-Assessment Response</h1>
                      </div>


                      }

                      {
                        submissionData && submissionData?.userQuestions[0]?.response?.length > 0 && submissionData?.userQuestions[0]?.submitted &&
                        submissionData?.userQuestions[0]?.response.map((response, index) => {
                          return (
                            <div key={index}>
                              {response.responses.length > 0 && <div className='font-semibold font-roboto underline'>{response.headingType}</div>}

                              {response.responses.map((ques, idx) => {
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

                                    <div className='bg-richblue-600 w-8 h-8 rounded-full text-richblue-10 flex justify-center items-center '>
                                      <p>{ques.markGot}/{ques.actualMark}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })

                      }

                      {submissionData && submissionData?.userQuestions[0]?.response?.length > 0 && submissionData?.userQuestions[0]?.submitted &&
                        <div className='flex flex-col gap-2 justify-center text-3xl text-gray-800 items-center my-20 font-bold '>
                          <dotlottie-player
                            autoplay
                            playMode="normal"
                            src={animationData}
                            background="transparent"
                            speed="0.5"
                            style={{ width: '100px', height: '100px' }}
                          />
                          <p>Self-Assessment Completed!</p>

                          <Button onClick={() => {

                            navigate(`/adminpannel/user_submission/${UserId}/${assignmentData._id}/peer`)
                          }}>
                            Peer Assessment
                          </Button>
                        </div>

                      }

                    </div>
                    }



                    {Type === "peer" && <div className='shadow-xl bg-richblue-10  p-10'>






                      <div>
                        <div className=' mt-10 mb-2 ml-2 flex items-center gap-2 text-xl'>
                          <h1 className='text-xl font-bold'>Peer Assessment</h1>
                          <div >
                            <img src={img21} alt="" className='w-10  ' />

                          </div>
                        </div>

                      </div>


                      {submissionData && submissionData?.peerQuestions?.length > 0 && submissionData.peerQuestions[0]?.response?.length > 0 &&
                        <div className="flex text-richblue-10 justify-center items-center bg-primary gap-4 shadow-md w-[150px] rounded-md">
                          <div className='flex flex-col justify-center items-center'>

                            <img src={img25} alt="" className="w-8" />
                            <p className="text-md font-semibold">Score</p>
                          </div>
                          <div>
                            <span className=" font-semibold ">{submissionData?.peerQuestions[0]?.totalMarkGot}</span><span className="text-sm opacity-80 font-semibold">/ {submissionData.peerQuestions[0].totalMark}</span>
                          </div>
                        </div>

                      }



                      {submissionData && submissionData?.peerQuestions?.length > 0 &&
                        submissionData?.peerQuestions[0]?.myfile?.length > 0 &&
                        <div className=' mt-10 mb-2 ml-2 flex items-center gap-2 text-xl'>
                          <h1 className='text-sm font-bold'>User File</h1>
                        </div>
                      }


                      {submissionData && submissionData?.peerQuestions?.length > 0 &&
                        submissionData?.peerQuestions[0]?.myfile?.length > 0 &&
                        submissionData.peerQuestions[0].myfile.map((file, index) => {
                          return (
                            <div key={index}>
                              <div className='text-richlue-900 bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-xl cursor-pointer border-l-8 border-[#695FDC]'>
                                <Link to={file.fileurl} target="_blank">
                                  <div className='text-richblue-900 font-semibold hover:underline'>
                                    <p>{index + 1}. {file.filename}</p>
                                  </div>
                                </Link>
                              </div>
                            </div>
                          );
                        })
                      }


                      {submissionData && submissionData?.peerQuestions?.length > 0 && submissionData?.peerQuestions[0]?.peerfile?.length > 0 &&
                        <div className=' mt-10 mb-2 ml-2 flex items-center gap-2 text-xl'>
                          <h1 className='text-sm font-bold'>Peer File</h1>
                        </div>
                      }
                      {submissionData && submissionData?.peerQuestions?.length > 0 && submissionData?.peerQuestions[0]?.peerfile?.length > 0 &&

                        submissionData.peerQuestions[0].peerfile.map((file, index) => {
                          return <div>
                            <div key={index} className='text-richlue-900 bg-richblue-10 m-2 mb-8 p-2 rounded-md flex justify-between items-center shadow-xl cursor-pointer border-l-8 border-[#695FDC]'>
                              <Link to={file.fileurl} target="_blank"> <div className='text-richblue-900 font-semibold hover:underline'><p>{index + 1}. {file.filename}</p></div></Link>
                            </div>
                          </div>




                        })
                      }



                      {submissionData && submissionData?.peerQuestions?.length > 0 && submissionData?.peerQuestions[0]?.response?.length > 0 && <div className=' mt-10 mb-2 ml-2 flex items-center gap-2'>
                        <h1 className='text-lg font-bold'>Response From Peer</h1>
                      </div>

                      }

                      {submissionData && submissionData?.peerQuestions?.length > 0 && submissionData?.peerQuestions[0]?.response?.length > 0 &&
                        submissionData.peerQuestions[0].response.map((response, index) => {
                          return <div key={index}>
                            {response.responses.length > 0 && <div className='font-semibold font-roboto underline'>{response.headingType}</div>}

                            {response.responses.map((ques, idx) => {
                              const qType = getQuesType(response.headingType, ques.question, 'peer');
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

                      {submissionData && submissionData?.peerQuestions?.length > 0 && submissionData?.peerQuestions[0]?.response?.length > 0 && submissionData?.peerQuestions[0]?.submitted &&
                        <div className='flex flex-col gap-2 justify-center text-3xl text-gray-800 items-center my-20 font-bold '>
                          <dotlottie-player
                            autoplay
                            playMode="normal"
                            src={animationData}
                            background="transparent"
                            speed="0.5"
                            style={{ width: '100px', height: '100px' }}
                          />
                          <p>Peer Assessment Completed!</p>

                          <Button onClick={() => {

                            navigate(`/adminpannel/user_submission/${UserId}/${assignmentData._id}/expert`)
                          }}>
                            Mentor Assessment
                          </Button>
                        </div>

                      }


                    </div>
                    }


                    {Type === 'expert' && <div className='shadow-xl bg-richblue-10  p-10'>
                      <div className=' mt-10 mb-2 ml-2 flex items-center gap-2 text-xl'>
                        <h1 className='text-xl font-bold'>Mentor Assessment</h1>
                        <div >
                          <img src={img18} alt="" className='w-10  ' />

                        </div>
                      </div>



                      {submissionData && submissionData?.expertQuestions?.length > 0 && submissionData?.expertQuestions[0]?.response?.length > 0 &&
                        <div className="flex text-richblue-10 justify-center items-center bg-primary gap-4 shadow-md w-[150px] rounded-md">
                          <div className='flex flex-col justify-center items-center'>

                            <img src={img25} alt="" className="w-8" />
                            <p className="text-md font-semibold">Score</p>
                          </div>
                          <div>
                            <span className=" font-semibold ">{submissionData?.expertQuestions[0]?.totalMarkGot}</span><span className="font-semibold text-sm opacity-80">/ {submissionData?.expertQuestions[0]?.totalMark}</span>
                          </div>
                        </div>

                      }


                      {submissionData &&
                        submissionData?.expertQuestions?.length > 0 &&
                        submissionData?.expertQuestions[0]?.myfile?.length > 0 && (
                          <div className='mt-10 mb-2 ml-2 flex items-center gap-2 text-xl'>
                            <h1 className='text-xl font-bold'>Mentor Assessment File</h1>
                            <div>
                              <img src={img23} alt="" className='w-10' />
                            </div>
                          </div>
                        )}

                      {submissionData &&
                        submissionData?.expertQuestions?.length > 0 &&
                        submissionData?.expertQuestions[0]?.myfile?.length > 0 &&

                        submissionData.expertQuestions[0]?.myfile.map((file, index) => (
                          <div key={index} className='text-richlue-900 bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-xl cursor-pointer border-l-8 border-[#695FDC]'>
                            <Link to={file.fileurl} target="_blank">
                              <div className='text-richblue-900 font-semibold hover:underline'>
                                <p>{index + 1}. {file.filename}</p>
                              </div>
                            </Link>
                          </div>
                        ))}


                      {submissionData &&

                        submissionData?.expertQuestions?.length > 0 &&

                        submissionData.expertQuestions[0]?.myfile?.length > 0 &&

                        !submissionData?.expertQuestions[0]?.submitted &&

                        !submissionData?.expertQuestions[0]?.response?.length > 0 &&

                        questionData &&

                        questionData[0]?.expertQues?.length > 0 &&
                        questionData[0]?.expertQues.map((peerQues, index) => (
                          <div className='mt-10' key={index}>
                            <div className='font-semibold font-roboto underline'>{peerQues.headingType}</div>

                            {peerQues.questions.map((question, idx) => (
                              <div key={idx} className='text-richlue-900 bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-lg'>
                                <div className='flex flex-col max-w-[70%] min-w-[70%]'>
                                  <div className='text-richblue-300 font-semibold'>
                                    <p>{idx + 1}. {question.ques}</p>
                                  </div>

                                  {
                                    question.quesType === "Feedback" && (
                                      <div>
                                        <div>
                                          <p className='font-roboto text-sm font-semibold'>Response :</p>
                                          <textarea
                                            className='number-input border-b-[1px] border-0 min-w-[60%]'
                                            rows="2"
                                            required='required'
                                            onChange={(e) => {
                                              const value = e.target.value;

                                              setExpertFinalResponses((prevResponses) => {
                                                const updatedResponses = [...prevResponses];

                                                updatedResponses[index].responses[idx].answer = value;

                                                return updatedResponses;
                                              });
                                            }}
                                            value={expertfinalResponses[index]?.responses[idx]?.answer || null}
                                          />
                                        </div>
                                      </div>
                                    )}
                                </div>

                                {(/check.*feedback/i).test(question.quesType || "") && (
                                  <div className='flex flex-col gap-2 w-full'>
                                    <label className="flex items-center gap-3">
                                      <input
                                        type="checkbox"
                                        checked={!!expertfinalResponses[index]?.responses[idx]?.checked}
                                        onChange={(e) => {
                                          const checked = e.target.checked;
                                          setExpertFinalResponses((prevResponses) => {
                                            const updatedResponses = [...prevResponses];
                                            updatedResponses[index].responses[idx] = {
                                              ...updatedResponses[index].responses[idx],
                                              checked,
                                            };
                                            return updatedResponses;
                                          });
                                        }}
                                      />
                                      <span className="font-roboto text-sm">Mark if applicable</span>
                                    </label>

                                    <div>
                                      <p className='font-roboto text-sm font-semibold'>Response :</p>
                                      <textarea
                                        className='number-input border-b-[1px] border-0 min-w-[60%] mt-1'
                                        rows="2"
                                        onChange={(e) => {
                                          const value = e.target.value;

                                          setExpertFinalResponses((prevResponses) => {
                                            const updatedResponses = [...prevResponses];
                                            updatedResponses[index].responses[idx] = {
                                              ...updatedResponses[index].responses[idx],
                                              answer: value,
                                            };

                                            return updatedResponses;
                                          });
                                        }}
                                        value={expertfinalResponses[index]?.responses[idx]?.answer || ""}
                                        placeholder="Type your response..."
                                      />
                                    </div>

                                    <div className='flex flex-col gap-2 sm:flex-row w-full'>
                                      <div className='flex'>
                                        <div className='border-b-[1px]'>
                                          <input
                                            type="number"
                                            min="0"
                                            required='required'
                                            max={question.mark}
                                            className="border-0 w-6 h-6 p-0 number-input focus:outline-0 bg-none"
                                            onWheel={(e) => e.currentTarget.blur()}
                                            onChange={(e) => {
                                              const value = Math.min(Math.max(parseInt(e.target.value) || 0, 0), expertfinalResponses[index].responses[idx]?.actualMark || 0);

                                              setExpertFinalResponses((prevResponses) => {
                                                const updatedResponses = [...prevResponses];

                                                updatedResponses[index].responses[idx].markGot = value;

                                                return updatedResponses;
                                              });
                                            }}
                                            value={expertfinalResponses[index]?.responses[idx]?.markGot || 0}
                                          />
                                        </div>
                                        <p>/ </p>
                                        <div>
                                          <p>{question.mark}</p>
                                        </div>
                                      </div>

                                      <div className='bg-richblue-600 w-6 h-6 rounded-full text-richblue-10 flex justify-center items-center '>
                                        <p>{expertfinalResponses[index]?.responses[idx]?.markGot || 0}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {question.quesType !== "Feedback" && !(/check.*feedback/i).test(question.quesType || "") && (
                                  <div className='flex flex-col gap-2 sm:flex-row '>
                                    <div className='flex'>
                                      <div className='border-b-[1px]'>
                                        <input
                                          type="number"
                                          min="0"
                                          required='required'
                                          max={question.mark}
                                          className="border-0 w-6 h-6 p-0 number-input focus:outline-0 bg-none"
                                          onWheel={(e) => e.currentTarget.blur()}
                                          onChange={(e) => {
                                            const value = Math.min(Math.max(parseInt(e.target.value) || 0, 0), expertfinalResponses[index].responses[idx]?.actualMark || 0);

                                            setExpertFinalResponses((prevResponses) => {
                                              const updatedResponses = [...prevResponses];

                                              updatedResponses[index].responses[idx].markGot = value;

                                              return updatedResponses;
                                            });
                                          }}
                                          value={expertfinalResponses[index]?.responses[idx]?.markGot || 0}
                                        />
                                      </div>
                                      <p>/ </p>
                                      <div>
                                        <p>{question.mark}</p>
                                      </div>
                                    </div>

                                    <div className='bg-richblue-600 w-6 h-6 rounded-full text-richblue-10 flex justify-center items-center '>
                                      <p>{expertfinalResponses[index]?.responses[idx]?.markGot || 0}</p>
                                    </div>
                                  </div>
                                )}


                              </div>
                            ))}
                          </div>
                        ))}


                      {submissionData &&

                        submissionData.expertQuestions?.length > 0 &&

                        submissionData.expertQuestions[0]?.myfile?.length > 0 &&

                        submissionData.expertQuestions[0]?.response?.length > 0 &&

                        submissionData.expertQuestions[0]?.response?.map((response, index) => (
                          <div key={index}>
                            {response.responses.length > 0 &&
                              <div className='font-semibold font-roboto underline'>{response.headingType}</div>}

                            {response.responses.map((ques, idx) => {
                              const qType = getQuesType(response.headingType, ques.question, 'expert');
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
                            })}          </div>
                        ))

                      }




                      {submissionData &&
                        submissionData?.expertQuestions?.length > 0 &&
                        submissionData?.expertQuestions[0]?.myfile?.length > 0 &&
                        !submissionData?.expertQuestions[0]?.response?.length > 0 &&
                        (!submissionData?.expertQuestions[0]?.submitted) &&
                        !submissionData?.expertQuestions[0]?.feedback &&

                        (
                          <div>
                            <div className='mt-10 mb-2 ml-2 flex items-center gap-2 text-lg'>
                              <h1 className='text-xl font-bold'>Feedback</h1>
                              <div>
                                <img src={img26} alt="" className='w-10' />
                              </div>
                            </div>

                            <div>
                              <textarea
                                type="text"
                                name="expertQuestion"
                                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Add Feedback"
                                rows={3}
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                              />
                            </div>
                          </div>
                        )}



                      {submissionData &&
                        submissionData.expertQuestions?.length > 0 &&
                        submissionData.expertQuestions[0]?.myfile?.length > 0 &&
                        !submissionData.expertQuestions[0]?.response?.length > 0 &&
                        (!submissionData.expertQuestions[0]?.submitted) && (
                          <div className='flex mt-10 justify-center items-center'>

                            <Button variant='btn' onClick={expertsubmission}>
                              Next
                            </Button>

                          </div>
                        )}








                      {
                        submissionData && submissionData?.expertQuestions[0]?.submitted && submissionData?.expertQuestions[0]?.response.length > 0 && submissionData?.expertQuestions[0]?.feedback &&
                        <div>
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
                              value={submissionData.expertQuestions[0].feedback}

                            />
                          </div>
                        </div>


                      }

                      {submissionData && submissionData?.expertQuestions[0]?.submitted && submissionData?.expertQuestions[0]?.response.length > 0 &&
                        <div className='flex flex-col gap-2 justify-center text-3xl text-gray-800 items-center my-20 font-bold '>
                          <dotlottie-player
                            autoplay
                            playMode="normal"
                            src={animationData}
                            background="transparent"
                            speed="0.5"
                            style={{ width: '100px', height: '100px' }}
                          />
                          <p>Mentor Assessment Completed!</p>

                        </div>

                      }








                    </div>
                    }








                  </div>

                </div>


              )}


          </div>
        )

        }


      </div>

    </div>
    <Footer></Footer>
  </div>)
}

export default UserSubmission;





