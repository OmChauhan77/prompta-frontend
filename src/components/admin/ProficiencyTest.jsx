import React from 'react'
import Navbar from "../user/Navbar"
import footer from "../HomePage/Footer"
import img18 from '../../assets/img18.png';
import { useNavigate } from 'react-router-dom';
import { setAssignmentData } from "../../slices/profileSlice"
import { RxCross2 } from 'react-icons/rx';
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { apiConnector } from '../../service/apiconnector'
import img11 from "../../assets/img11.png"
import toast, { Toaster } from 'react-hot-toast';
import { BiArrowBack } from "react-icons/bi"
import img28 from "../../assets/img28.png"
import img29 from "../../assets/img29.png"

import animationData from '../../assets/lotties/course.lottie';
import { Button, buttonVariants } from "../../component/ui/button"

import { cn } from '../../lib/utils'


const ProficiencyTest = () => {

  const navigate = useNavigate()
  const { UserId, AssignmentId, name } = useParams();

  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [submissionData, setSubmissionData] = useState();
  const [assignment, setAssignment] = useState()
  const [expand1, setExpand1] = useState({})
  const [initiate, setInitiate] = useState({})
  const [prefinalResponses, setpreFinalResponses] = useState([]);
  const [postfinalResponses, setpostFinalResponses] = useState([]);
  const [marksGot1, setmarksGot1] = useState()
  const [marksGot2, setmarksGot2] = useState()
  const [feedback, setFeedback] = useState('')

  const [question, setQuestion] = useState([])
  const [preQuestion, setPreQuestion] = useState()
  const [postQuestion, setPostQuestion] = useState()
  const [preTestexpand, setPreTestexpand] = useState(false)
  const [postTestexpand, setPostTestexpand] = useState(false)
  const [preTotal, setPreTotal] = useState(0)
  const [postTotal, setPostTotal] = useState(0)





  const goBack = () => {
    navigate(-1); // This is equivalent to history.goBack()
  };

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await apiConnector('GET', process.env.REACT_APP_BASE_URL + `/api/v2/get_submission/${UserId}/${AssignmentId}`, null, {
          Authorization: `Bearer ${token}`,
        });
        setSubmissionData(response.data.submission);
      } catch (error) {
        console.log(error);
      }
    };

    fetchdata();
  }, []);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await apiConnector('GET', process.env.REACT_APP_BASE_URL + `/api/v2/assignment/${AssignmentId}`, null, {
          Authorization: `Bearer ${token}`,
        });
        setAssignment(response.data.assignment);
      } catch (error) {
        console.log(error);
      }
    };

    fetchdata();
  }, [AssignmentId]);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await apiConnector('GET', process.env.REACT_APP_BASE_URL + `/api/v2/get_diagnostics`, null, {
          Authorization: `Bearer ${token}`,
        });
        console.log(response)
        setQuestion(response.data.alltype);
      } catch (error) {
        console.log(error);
      }
    };

    fetchdata();
  }, []);

  useEffect(() => {
    if (Array.isArray(question) && question.length > 0) {

      const preQues = question.filter((ques) => ques.assignmentType === 'preTest')

      setPreQuestion(preQues)

      const userresponses = preQues[0]?.diagnosticQues?.map((ques) => ({
        headingType: ques.headingType,
        responses: ques.questions.map((questions) => ({
          question: questions.ques,
          answer: null,
          markGot: 0,
          actualMark: questions.mark,
        })),
      }));
      setpreFinalResponses(userresponses);
    }
  }, [question]);

  useEffect(() => {
    if (Array.isArray(question) && question.length > 0) {

      const postQues = question.filter((ques) => ques.assignmentType === 'postTest')
      setPostQuestion(postQues)

      const userresponses = postQues[0]?.diagnosticQues?.map((ques) => ({
        headingType: ques.headingType,
        responses: ques.questions.map((questions) => ({
          question: questions.ques,
          answer: null,
          markGot: 0,
          actualMark: questions.mark,
        })),
      }));
      setpostFinalResponses(userresponses);
    }
  }, [question]);


  useEffect(() => {
    let totalMarks;
    if (preQuestion && preQuestion[0]?.diagnosticQues && preQuestion[0]?.diagnosticQues?.length > 0) {
      totalMarks = preQuestion[0]?.diagnosticQues.reduce((accumulator, currentValue) => {
        currentValue.questions.forEach((question) => {
          accumulator += question.mark;
        });
        return accumulator;
      }, 0);
      setPreTotal(totalMarks)
    }

  }, [preQuestion])

  useEffect(() => {
    let totalMarks;
    if (postQuestion && postQuestion[0]?.diagnosticQues && postQuestion[0]?.diagnosticQues?.length > 0) {
      totalMarks = postQuestion[0]?.diagnosticQues.reduce((accumulator, currentValue) => {
        currentValue.questions.forEach((question) => {
          accumulator += question.mark;
        });
        return accumulator;
      }, 0);
      setPostTotal(totalMarks);
    }
  }, [postQuestion]);



  // For preQuestion
  useEffect(() => {
    let totalMarks;
    if (prefinalResponses && prefinalResponses.length > 0) {
      totalMarks = prefinalResponses.reduce((accumulator, currentValue) => {
        currentValue.responses.forEach((question) => {
          accumulator += question.markGot;
        });
        return accumulator;
      }, 0);
      setmarksGot1(totalMarks);
    }
  }, [prefinalResponses]);



  // For postQuestion
  useEffect(() => {
    let totalMarks;
    if (postfinalResponses && postfinalResponses.length > 0) {
      totalMarks = postfinalResponses.reduce((accumulator, currentValue) => {
        currentValue.responses.forEach((question) => {
          accumulator += question.markGot;
        });
        return accumulator;
      }, 0);
      setmarksGot2(totalMarks);
    }
  }, [postfinalResponses]);

  const postAssessmentHandler = async (event) => {
    event.preventDefault();

    try {

      setLoading(true)

      const result = await apiConnector('POST', process.env.REACT_APP_BASE_URL + `/api/v2/post_diagnostics/${UserId}/${AssignmentId}`, {
        postfinalResponses,
        marksGot2,
        postTotal
      }, {
        Authorization: `Bearer ${token}`,
      });


      // console.log(result)

      if (!result.data.success) {
        toast.error("failed to submit")
        setLoading(false)
        throw new Error(result.data.message);
      }

      // console.log(result);

      toast.success('Self Assessment Submitted Successfully');



      const response = await apiConnector('GET', process.env.REACT_APP_BASE_URL + `/api/v2/get_submission/${UserId}/${AssignmentId}`, null, {
        Authorization: `Bearer ${token}`,
      });
      if (response.data.success) {
        setSubmissionData(response.data.submission);
      }



      setLoading(false)


    } catch (error) {
      setLoading(false)
      toast.error(error.response?.data?.message || 'Failed to submit');

    }
  };



  const preAssessmentHandler = async (event) => {
    event.preventDefault();

    try {

      setLoading(true)

      const result = await apiConnector('POST', process.env.REACT_APP_BASE_URL + `/api/v2/pre_diagnostics/${UserId}/${AssignmentId}`, {
        prefinalResponses,
        marksGot1,
        preTotal

      }, {
        Authorization: `Bearer ${token}`,
      });


      // console.log(result)

      if (!result.data.success) {
        toast.error("failed to submit")
        setLoading(false)
        throw new Error(result.data.message);
      }

      console.log(result);

      toast.success('Self Assessment Submitted Successfully');



      const response = await apiConnector('GET', process.env.REACT_APP_BASE_URL + `/api/v2/get_submission/${UserId}/${AssignmentId}`, null, {
        Authorization: `Bearer ${token}`,
      });
      if (response.data.success) {
        setSubmissionData(response.data.submission);
      }



      setLoading(false)


    } catch (error) {
      setLoading(false)
      toast.error(error.response?.data?.message || 'Failed to submit');

    }
  };



  return (
    < div className='min-h-screen '>

    <div className='bg-richblue-600 h-full text-richblue-10 p-10'>
      <div className='flex text-2xl gap-10 font-semibold items-center max-w-4xl'>
        <div className='hover:bg-richblue-10 h-10 w-10 rounded-full flex justify-center items-center hover:bg-opacity-20 cursor-pointer' onClick={goBack}>
          <BiArrowBack />
        </div>


        <div>
         {assignment?.assignmentName}         </div>

      </div>

    </div>



    {

loading ? (<div className='flex justify-center items-center h-[100vh] sm:signinbg'>
  <div class="spinner"></div>

</div>) : (

  
  <div >

    <div className=' max-w-4xl mx-auto mt-4 p-6 pt-2 bg-richblue-10 shadow-lg rounded-md'>
    {submissionData?.initialDone && (<div>
        <div className=' mt-10 mb-2 ml-2 flex items-center gap-2 text-xl'>
          <h1 className='text-xl font-semibold '>Pre Test</h1>
          <div >
            <img src={img18} alt="" className='w-8  ' />

          </div>
        </div>



        {submissionData?.initialDone && submissionData?.preTest?.length > 0 &&
          submissionData?.preTest?.map((file, index) => {
            return <div>
              <div key={index} className='text-richlue-900 bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-md cursor-pointer border-l-8 border-[#695FDC]'>
                <Link to={file.fileurl} target="_blank"> <div className='text-richblue-900 text-xs font-semibold hover:underline'><p>{index + 1}. {file.filename}</p></div></Link>
              </div>
            </div>




          })
        }

      </div>

      )

      }

      {/* pre test responses */}

      {submissionData?.initialDone && submissionData?.preTest?.length > 0 &&

        <div className={`text-richlue-900 mt-10 bg-richblue-10 m-2  mb-4 rounded-md shadow-md cursor-pointer border-l-8  p-2 hover:shadow-lg `}
          onClick={() => {
            setPreTestexpand(true)
          }}>

          <div className='flex justify-between items-center'>

            <div className='text-lg p-2 font-semibold'>
              Pre Test Responses
            </div>

            {submissionData?.initialDone && submissionData?.preTest?.length > 0 && submissionData?.preresponses && submissionData?.preresponses?.length > 0 && submissionData?.preTotalMarks && submissionData?.preMarks &&
              <div className="flex text-richblue-900 justify-center items-center bg-primary text-richblue-10 gap-4 shadow-md w-[150px] rounded-md">
                <div className='flex flex-col justify-center items-center'>

                  <p className="text-md font-semibold">Score</p>
                </div>
                <div>
                  <span className=" font-semibold ">{submissionData?.preTotalMarks}</span><span className="font-semibold text-sm opacity-80">/ {submissionData?.preMarks}</span>
                </div>
              </div>


            }

          </div>




          <div className={`transition-all  duration-300 ease-in-out overflow-hidden ${preTestexpand ? 'max-h-[500vh]' : 'max-h-0'}`}>


            {submissionData?.initialDone && submissionData?.preTest?.length > 0 && !submissionData?.preresponses?.length > 0 &&


              preQuestion && preQuestion[0]?.diagnosticQues?.map((peerQues, index) => (

                <div key={index}>
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
                                    e.stopPropagation();
                                    const value = e.target.value;

                                    setpreFinalResponses((prevResponses) => {
                                      const updatedResponses = [...prevResponses];

                                      updatedResponses[index].responses[idx].answer = value;

                                      return updatedResponses;
                                    });
                                  }}
                                  value={prefinalResponses[index]?.responses[idx]?.answer || null}
                                />
                              </div>
                            </div>
                          )}
                      </div>



                      {question.quesType !== "Feedback" && (
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
                                  e.stopPropagation();
                                  const value = Math.min(Math.max(parseInt(e.target.value) || 0, 0), prefinalResponses[index].responses[idx]?.actualMark || 0);

                                  setpreFinalResponses((prevResponses) => {
                                    const updatedResponses = [...prevResponses];

                                    updatedResponses[index].responses[idx].markGot = value;

                                    return updatedResponses;
                                  });
                                }}
                                value={prefinalResponses[index]?.responses[idx]?.markGot || 0}
                              />
                            </div>
                            <p>/ </p>
                            <div>
                              <p>{question.mark}</p>
                            </div>
                          </div>

                          <div className='bg-richblue-600 w-6 h-6 rounded-full text-richblue-10 flex justify-center items-center '>
                            <p>{prefinalResponses[index]?.responses[idx]?.markGot || 0}</p>
                          </div>
                        </div>
                      )}


                    </div>
                  ))}
                </div>
              ))

            }


            {submissionData?.initialDone && submissionData?.preTest?.length > 0 && submissionData?.preresponses && submissionData?.preresponses?.length > 0 &&

              submissionData?.preresponses?.map((response, index) => {
                return (
                  <div key={index}>
                    {response.responses.length > 0 && <div className='font-semibold font-roboto underline'>{response.headingType}</div>}

                    {response.responses.map((ques, idx) => {
                      return (
                        <div key={idx} className='text-richlue-900 bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-md  cursor-pointer'>
                          <div className='flex flex-col max-w-[70%] min-w-[70%]' >
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
                          {ques.answer === null && <div className='bg-richblue-600  w-8 h-8 rounded-full text-richblue-10 flex justify-center items-center '>
                            <p>{ques.markGot}/{ques.actualMark}</p>
                          </div>

                          }


                        </div>
                      );
                    })}
                  </div>
                );
              })
            }


            {submissionData?.initialDone && submissionData?.preTest?.length > 0 && !submissionData?.preresponses?.length > 0 &&
              <div className='flex mt-4 justify-center items-center'>
                <Button variant='btn' onClick={preAssessmentHandler} >
                  Next
                </Button>

              </div>
            }



            <div className='flex mt-4 justify-end items-center'>
              <Button variant='secondary' size='sm' onClick={(e) => {
                e.stopPropagation();
                setPreTestexpand(false)
              }} >
                show less
              </Button>
            </div>


          </div>



        </div>


      }

      {/* POST TASK */}


      {
        submissionData && (submissionData?.postTest.length > 0) &&
        <div className=' mt-10 mb-2 ml-2 flex items-center gap-2 text-xl'>
          <h1 className='text-xl font-semibold'>Post Test</h1>
          <div >
            <img src={img28} alt="" className='w-10  ' />

          </div>
        </div>

      }




      {submissionData && (submissionData?.postTest.length > 0) &&
        submissionData?.postTest.map((file, index) => {
          return <div>
            <div key={index} className='text-richlue-900 bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-md  cursor-pointer border-l-8 border-[#695FDC]'>
              <Link to={file.fileurl} target="_blank"> <div className='text-richblue-900 text-xs font-semibold hover:underline'><p>{index + 1}. {file.filename}</p></div></Link>
            </div>
          </div>
        })
      }




      {/* post test responses */}

      {submissionData && submissionData?.postTest?.length > 0 && submissionData?.completed &&
        <div className={`text-richlue-900 mt-10 bg-richblue-10 m-2  mb-4 rounded-md shadow-md cursor-pointer border-l-8  p-2 hover:shadow-lg `}
          onClick={() => {
            setPostTestexpand(true)
          }}>

          <div className='flex justify-between items-center'>

            <div className='text-lg p-2 font-semibold'>
             Post Test Responses
            </div>


            {submissionData && submissionData?.postresponses?.length > 0 && submissionData?.postTotalMarks && submissionData?.postMarks &&
              <div className="flex text-richblue-900 justify-center items-center bg-primary text-richblue-10 gap-4 shadow-md w-[150px] rounded-md">
                <div className='flex flex-col justify-center items-center'>

                  <p className="text-md font-semibold">Score</p>
                </div>
                <div>
                  <span className=" font-semibold ">{submissionData?.postTotalMarks}</span><span className="font-semibold text-sm opacity-80">/ {submissionData?.postMarks}</span>
                </div>
              </div>


            }

          </div>




          <div className={`transition-all  duration-300 ease-in-out overflow-hidden ${postTestexpand ? 'max-h-[500vh]' : 'max-h-0'}`}>


            {submissionData && !submissionData?.postresponses?.length > 0 && submissionData?.completed &&


              postQuestion && postQuestion[0]?.diagnosticQues?.map((peerQues, index) => (

                <div key={index}>
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
                                    e.stopPropagation();
                                    const value = e.target.value;

                                    setpostFinalResponses((prevResponses) => {
                                      const updatedResponses = [...prevResponses];

                                      updatedResponses[index].responses[idx].answer = value;

                                      return updatedResponses;
                                    });
                                  }}
                                  value={postfinalResponses[index]?.responses[idx]?.answer || null}
                                />
                              </div>
                            </div>
                          )}
                      </div>



                      {question.quesType !== "Feedback" && (
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
                                  e.stopPropagation();
                                  const value = Math.min(Math.max(parseInt(e.target.value) || 0, 0), postfinalResponses[index].responses[idx]?.actualMark || 0);

                                  setpostFinalResponses((prevResponses) => {
                                    const updatedResponses = [...prevResponses];

                                    updatedResponses[index].responses[idx].markGot = value;

                                    return updatedResponses;
                                  });
                                }}
                                value={postfinalResponses[index]?.responses[idx]?.markGot || 0}
                              />
                            </div>
                            <p>/ </p>
                            <div>
                              <p>{question.mark}</p>
                            </div>
                          </div>

                          <div className='bg-richblue-600 w-6 h-6 rounded-full text-richblue-10 flex justify-center items-center '>
                            <p>{postfinalResponses[index]?.responses[idx]?.markGot || 0}</p>
                          </div>
                        </div>
                      )}


                    </div>
                  ))}
                </div>
              ))

            }


            {submissionData && submissionData?.postresponses?.length > 0 && submissionData?.completed &&

              submissionData?.postresponses?.map((response, index) => {
                return (
                  <div key={index}>
                    {response.responses.length > 0 && <div className='font-semibold font-roboto underline'>{response.headingType}</div>}

                    {response.responses.map((ques, idx) => {
                      return (
                        <div key={idx} className='text-richlue-900 bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-md  cursor-pointer'>
                          <div className='flex flex-col max-w-[70%] min-w-[70%]' >
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
                          {ques.answer === null && <div className='bg-richblue-600  w-8 h-8 rounded-full text-richblue-10 flex justify-center items-center '>
                            <p>{ques.markGot}/{ques.actualMark}</p>
                          </div>

                          }


                        </div>
                      );
                    })}
                  </div>
                );
              })
            }


            {submissionData && !submissionData?.postresponses?.length > 0 && submissionData?.completed && submissionData?.postTest?.length > 0 &&
              <div className='flex mt-4 justify-center items-center'>
                <Button variant='btn' onClick={postAssessmentHandler} >
                  Next
                </Button>

              </div>
            }



            <div className='flex mt-4 justify-end items-center'>
              <Button variant='secondary' size='sm' onClick={(e) => {
                e.stopPropagation();
                setPostTestexpand(false)
              }} >
                show less
              </Button>
            </div>


          </div>



        </div>


      }
      
    </div> 
    
    
    
    </div> 
    
  
  
  
  )

      }


    




    </div>
  )
}

export default ProficiencyTest