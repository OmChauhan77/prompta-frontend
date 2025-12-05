import React from "react";
import toast from "react-hot-toast";
import "../../pages/signin.css";
import { useSelector } from "react-redux";
import { apiConnector } from "../../service/apiconnector";
import { useState, useRef, useEffect } from "react";
import img19 from "../../assets/img19.png";
import img25 from "../../assets/img25.png";
import { useParams, Link } from "react-router-dom";
import animationData from "../../assets/lotties/course.lottie";
import "@dotlottie/player-component";
import { Button, buttonVariants } from "../../component/ui/button";
import { useNavigate } from "react-router-dom";
import img15 from "../../assets/img15.png";
import img21 from "../../assets/img21.png";
import { RxCross2 } from "react-icons/rx";

function SelfAssessment({ forloading, popup }) {
  const { token } = useSelector((state) => state.auth);
  const [submissionData, setsubmissionData] = useState();
  const [question, setQuestion] = useState([]);
  const [userselftotal, setUserSelftotal] = useState();
  let { AssignmentId } = useParams();
  const [asessmentData, setAssessmentData] = useState();
  const { user } = useSelector((state) => state.profile);
  const { assignmentData } = useSelector((state) => state.profile);
  const [userfinalResponses, setUserFinalResponses] = useState([]);
  const [selfState, setselfState] = useState(false);
  const [usermarkGot, setUsermarkGot] = useState();
  const [marksGot1, setmarksGot1] = useState();
  const navigate = useNavigate();
  const inputRef = useRef();
  const [file, setFiles] = useState([]);

  // helper to find original quesType from question bank using heading and question text
  const getQuesType = (headingType, questionText) => {
    try {
      const group = question?.[0]?.userQues?.find(
        (g) => g.headingType === headingType
      );
      if (!group) return null;
      const qObj = group.questions.find((q) => q.ques === questionText);
      return qObj?.quesType || null;
    } catch (err) {
      return null;
    }
  };
  const handleFileChange = (event) => {
    const newFiles = [...file, event.target.files];
    setFiles(newFiles);
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
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDragStart = (event) => {
    event.dataTransfer.setData("text/plain", event.target.id);
  };



  useEffect(() => {
    const fetchdata = async () => {
      try {
        const Result = await apiConnector(
          "GET",
          process.env.REACT_APP_BASE_URL +
            `/api/get_course/${user._id}/${assignmentData._id}`,
          null,
          {
            Authorization: `Bearer ${token}`,
          }
        );

        if (Result.data.success) {
          setAssessmentData(Result.data.course);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchdata();
  }, []);



  useEffect(() => {
    if (asessmentData && asessmentData?.userQuestions[0]?.response.length > 0) {
      const markGotSum = asessmentData?.userQuestions[0]?.response.reduce(
        (sum, response) => {
          return (
            sum +
            response.responses.reduce((responseSum, ques) => {
              return responseSum + ques.markGot;
            }, 0)
          );
        },
        0
      );
      setUsermarkGot(markGotSum);
    }
  }, [asessmentData]);

  useEffect(() => {
    let totalMarks;
    if (
      question &&
      question[0]?.userQues &&
      question[0]?.userQues?.length > 0
    ) {
      totalMarks = question[0]?.userQues.reduce((accumulator, currentValue) => {
        currentValue.questions.forEach((question) => {
          accumulator += question.mark;
        });
        return accumulator;
      }, 0);
      setUserSelftotal(totalMarks);
    }
  }, [question]);

  // fetching the questions data
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const allQues = await apiConnector(
          "GET",
          `${process.env.REACT_APP_BASE_URL}/api/v2/question_data/${assignmentData.assignmentType}`,
          null,
          {
            Authorization: `Bearer ${token}`,
          }
        );
        setQuestion(allQues.data.allques);
      } catch (error) {
        console.log(error);
      }
    };
    fetchdata();
  }, [assignmentData]);



  // fetching the course
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await apiConnector(
          "GET",
          process.env.REACT_APP_BASE_URL +
            `/api/get_submission/${user._id}/${AssignmentId}`,
          null,
          {
            Authorization: `Bearer ${token}`,
          }
        );

        setsubmissionData(response.data.submission);
      } catch (error) {
        console.log(error);
      }
    };
    fetchdata();
  }, []);

  useEffect(() => {
    let totalMarks;
    if (userfinalResponses && userfinalResponses.length > 0) {
      totalMarks = userfinalResponses.reduce((accumulator, currentValue) => {
        currentValue.responses.forEach((question) => {
          accumulator += question.markGot;
        });
        return accumulator;
      }, 0);
      // console.log(totalMarks)
      setmarksGot1(totalMarks);
    }
  }, [userfinalResponses]);

  const selfFileSubmitHandler = async (event) => {
    event.preventDefault();

    
    if (!file || file.length === 0) {
      toast.error("Please Upload File");
      return;
    }

    console.log(file);

    try {
      forloading(true);

      // Initialize FormData
      const formDataToSend = new FormData();
      const formData = {
        assignmentId: assignmentData._id,
        assignmentTopic: assignmentData.assignmentTopic,
        assignmentType: assignmentData.assignmentType,
      };

      // Append form data to FormData object
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

  
      file &&
        file.forEach((f) => {
          formDataToSend.append("file", f[0]);
        });

      // API call to submit the assessment
      const result = await apiConnector(
        "POST",
        `${process.env.REACT_APP_BASE_URL}/api/selfsubmit/${user._id}/${AssignmentId}`,
        formDataToSend,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!result.data.success) {
        toast.error("Failed to submit");
        throw new Error(result.data.message);
      }

      toast.success("Self Assessment File Submitted Successfully");

      const updatedCourse = await apiConnector(
        "GET",
        `${process.env.REACT_APP_BASE_URL}/api/get_course/${user._id}/${assignmentData._id}`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (updatedCourse.data.success) {
        setAssessmentData(updatedCourse.data.course);
      }

      forloading(false);
    } catch (error) {
      console.error("Error submitting self-assessment:", error);
      forloading(false);
      toast.error(error.response?.data?.message || "Failed to submit");
    }
  };

  const selfassessmenthandler = async (event) => {
    event.preventDefault();

    try {
      forloading(true);
      const result = await apiConnector(
        "POST",
        process.env.REACT_APP_BASE_URL +
          `/api/self_assessment_submit/${user._id}/${AssignmentId}`,
        {
          assignmentId: assignmentData._id,
          assignmentTopic: assignmentData.assignmentTopic,
          assignmentType: assignmentData.assignmentType,
          selftotal: userselftotal,
          marksGot: marksGot1,
          userfinalResponses,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      console.log(result);

      if (!result.data.success) {
        toast.error("failed to submit");
        forloading(false);
        throw new Error(result.data.message);
      }

      // console.log(result);

      setUserFinalResponses([]);

      toast.success("Self Assessment Submitted Successfully");

      popup({
        marksGot: marksGot1,
        selfsubmitted: true,
        selftotal: userselftotal,
      });

      const Result = await apiConnector(
        "GET",
        process.env.REACT_APP_BASE_URL +
          `/api/get_course/${user._id}/${assignmentData._id}`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      console.log(Result);

      if (Result.data.success) {
        setAssessmentData(Result.data.course);
      }
      forloading(false);
    } catch (error) {
      forloading(false);
      toast.error(error.response?.data?.message || "Failed to submit");
    }
  };

  useEffect(() => {
    if (Array.isArray(question) && question.length > 0) {
      const userresponses = question[0]?.userQues?.map((ques) => ({
        headingType: ques.headingType,
        responses: ques.questions.map((questions) => ({
          question: questions.ques,
          answer: null,
          markGot: 0,
          actualMark: questions.mark,
        })),
      }));
      setUserFinalResponses(userresponses);
    }
  }, [question]);

  return (
    <div>
      <div className=" mt-10 mb-2 ml-2 flex items-center gap-2 text-xl">
        <h1 className="text-xl font-bold">Self-Assessment</h1>
        <div>
          <img src={img19} alt="" className="w-8  " />
        </div>
      </div>

      {(!asessmentData ||
        !asessmentData?.userQuestions[0]?.myfile?.length > 0) && (
        <div>
          {
            <>
              <div>
                <input
                  id="file-upload"
                  name="file"
                  type="file"
                  className="sr-only"
                  ref={inputRef}
                  multiple
                  hidden
                  onChange={handleFileChange}
                />

                <div
                  className="col-span-full"
                  onClick={() => inputRef.current.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragStart={handleDragStart}
                >
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-[#4477CE]  px-6 py-10  bg-richblue-100">
                    <div className="text-center flex flex-col justify-center items-center ">
                      <div>
                        <img
                          src={img15}
                          alt=""
                          className="h-16 w-16 rounded-full"
                        />
                      </div>
                      <div className="mt-4 flex text-sm leading-6 ">
                        <label
                          htmlFor="file-upload"
                          className=" cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span className="z-0">
                            Upload a file or drag and drop
                          </span>
                        </label>
                      </div>
                      <p className="text-xs leading-5 ">PNG, JPG,up to 10MB</p>
                    </div>
                  </div>
                </div>

                {(!asessmentData ||
                  !asessmentData?.userQuestions[0]?.myfile?.length > 0) &&
                  file.map((file, index) => {
                    return (
                      <div>
                        <div
                          key={index}
                          className="text-richlue-900 bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-xl cursor-pointer border-l-8 border-[#695FDC]"
                        >
                          <div className="text-richblue-900 font-semibold">
                            <p>
                              {index + 1}. {file[0].name}
                            </p>
                          </div>

                          <div
                            className="mr-4 text-lg cursor-pointer"
                            onClick={() => deletehandle(index)}
                          >
                            <RxCross2 />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {file?.length > 0 && (
                  <div className="flex mt-4 my-20 justify-center items-center">
                    <Button variant="btn" onClick={selfFileSubmitHandler}>
                      Next
                    </Button>
                  </div>
                )}
              </div>
            </>
          }
        </div>
      )}

      {asessmentData?.userQuestions[0]?.myfile?.length > 0 && (
        <>
          <div className="mt-10 mb-2 ml-2 flex items-center gap-2 text-xl">
            <h1 className="text-sm font-bold">Your File</h1>
          </div>

          {asessmentData.userQuestions[0].myfile.map((file, index) => (
            <div key={index}>
              <div className="text-richblue-900 bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-xl cursor-pointer border-l-8 border-[#695FDC]">
                <Link to={file.fileurl} target="_blank">
                  <div className="text-richblue-900 font-semibold hover:underline">
                    <p>
                      {index + 1}. {file.filename}
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </>
      )}

      <div>
        {((asessmentData && !asessmentData?.userQuestions[0]?.submitted) ||
          !asessmentData?.userQuestions[0]?.response.length > 0) &&
          question &&
          asessmentData?.userQuestions[0]?.myfile?.length > 0 &&
          question[0]?.userQues?.map((peerQues, index) => (
            <div key={index}>
              <div className="font-semibold font-roboto underline">
                {peerQues.headingType}
              </div>

              {peerQues.questions.map((question, idx) => (
                <div
                  key={idx}
                  className="text-richlue-900 bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-lg"
                >
                  <div className="flex flex-col max-w-[70%] min-w-[70%]">
                    <div className="text-richblue-300 font-semibold">
                      <p>
                        {idx + 1}. {question.ques}
                      </p>
                    </div>

                    {question.quesType === "Response" && (
                      <div>
                        <div>
                          <p className="font-roboto text-sm font-semibold">
                            Response :
                          </p>
                          <textarea
                            className="number-input border-b-[1px] border-0 min-w-[60%]"
                            rows="2"
                            required="required"
                            onChange={(e) => {
                              const value = e.target.value;

                              setUserFinalResponses((prevResponses) => {
                                const updatedResponses = [...prevResponses];

                                updatedResponses[index].responses[idx].answer =
                                  value;

                                return updatedResponses;
                              });
                            }}
                            value={
                              userfinalResponses[index]?.responses[idx]
                                ?.answer || null
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {(/check.*response/i).test(question.quesType || "") && (
                    <div className="flex flex-col gap-2 w-full">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={
                            !!userfinalResponses[index]?.responses[idx]?.checked
                          }
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setUserFinalResponses((prevResponses) => {
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
                        <p className="font-roboto text-sm font-semibold">Response :</p>
                        <textarea
                          className="number-input border-b-[1px] border-0 min-w-[60%] mt-1"
                          rows="2"
                          onChange={(e) => {
                            const value = e.target.value;

                            setUserFinalResponses((prevResponses) => {
                              const updatedResponses = [...prevResponses];
                              updatedResponses[index].responses[idx] = {
                                ...updatedResponses[index].responses[idx],
                                answer: value,
                              };

                              return updatedResponses;
                            });
                          }}
                          value={
                            userfinalResponses[index]?.responses[idx]?.answer || ""
                          }
                          placeholder="Type your response..."
                        />
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row w-full">
                        <div className="flex">
                          <div className="border-b-[1px]">
                            <input
                              type="number"
                              min="0"
                              required="required"
                              max={question.mark}
                              className="border-0 w-6 h-6 p-0 number-input focus:outline-0 bg-none"
                              onWheel={(e) => e.currentTarget.blur()}
                              onChange={(e) => {
                                const value = Math.min(
                                  Math.max(parseInt(e.target.value) || 0, 0),
                                  userfinalResponses[index].responses[idx]
                                    ?.actualMark || 0
                                );

                                setUserFinalResponses((prevResponses) => {
                                  const updatedResponses = [...prevResponses];

                                  updatedResponses[index].responses[idx].markGot =
                                    value;

                                  return updatedResponses;
                                });
                              }}
                              value={
                                userfinalResponses[index]?.responses[idx]
                                  ?.markGot || 0
                              }
                            />
                          </div>
                          <p>/ </p>
                          <div>
                            <p>{question.mark}</p>
                          </div>
                        </div>

                        <div className="bg-richblue-600 w-6 h-6 rounded-full text-richblue-10 flex justify-center items-center ">
                          <p>
                            {userfinalResponses[index]?.responses[idx]?.markGot ||
                              0}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {question.quesType !== "Response" && !(/check.*response/i).test(question.quesType || "") && (
                    <div className="flex flex-col gap-2 sm:flex-row ">
                      <div className="flex">
                        <div className="border-b-[1px]">
                          <input
                            type="number"
                            min="0"
                            required="required"
                            max={question.mark}
                            className="border-0 w-6 h-6 p-0 number-input focus:outline-0 bg-none"
                            onWheel={(e) => e.currentTarget.blur()}
                            onChange={(e) => {
                              const value = Math.min(
                                Math.max(parseInt(e.target.value) || 0, 0),
                                userfinalResponses[index].responses[idx]
                                  ?.actualMark || 0
                              );

                              setUserFinalResponses((prevResponses) => {
                                const updatedResponses = [...prevResponses];

                                updatedResponses[index].responses[idx].markGot =
                                  value;

                                return updatedResponses;
                              });
                            }}
                            value={
                              userfinalResponses[index]?.responses[idx]
                                ?.markGot || 0
                            }
                          />
                        </div>
                        <p>/ </p>
                        <div>
                          <p>{question.mark}</p>
                        </div>
                      </div>

                      <div className="bg-richblue-600 w-6 h-6 rounded-full text-richblue-10 flex justify-center items-center ">
                        <p>
                          {userfinalResponses[index]?.responses[idx]?.markGot ||
                            0}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}

        {((asessmentData && !asessmentData?.userQuestions[0]?.submitted) ||
          !asessmentData?.userQuestions[0]?.response.length > 0) &&
          asessmentData?.userQuestions[0]?.myfile?.length > 0 && (
            <div className="flex m-6 my-20 justify-center items-center">
              <Button variant="btn" onClick={selfassessmenthandler}>
                Next
              </Button>
            </div>
          )}
      </div>

      {asessmentData &&
        asessmentData?.userQuestions[0]?.submitted &&
        asessmentData?.userQuestions[0]?.response.length > 0 && (
          <div className="flex text-richblue-900 justify-center items-center bg-primary text-richblue-10 gap-4 shadow-md w-[150px] rounded-md">
            <div className="flex flex-col justify-center items-center">
              <img src={img25} alt="" className="w-8" />
              <p className="text-md font-semibold">Score</p>
            </div>
            <div>
              <span className=" font-semibold ">{usermarkGot}</span>
              <span className="font-semibold text-sm opacity-80">
                / {userselftotal}
              </span>
            </div>
          </div>
        )}

      {asessmentData &&
        asessmentData?.userQuestions[0]?.submitted &&
        asessmentData?.userQuestions[0]?.response.length > 0 && (
          <div className=" mt-10 mb-2 ml-2 flex items-center gap-2 ">
            <h1 className="text-lg font-bold">
              Carefully evaluate your writing based on the checklist provided
              below.
            </h1>
          </div>
        )}

      {asessmentData &&
        asessmentData?.userQuestions[0]?.submitted &&
        asessmentData?.userQuestions[0]?.response.length > 0 &&
        asessmentData?.userQuestions[0]?.response?.map((response, index) => {
          return (
            <div key={index}>
              {response.responses.length > 0 && (
                <div className="font-semibold font-roboto underline">
                  {response.headingType}
                </div>
              )}

              {response.responses.map((ques, idx) => {
                const qType = getQuesType(response.headingType, ques.question);
                return (
                  <div
                    key={idx}
                    className="text-richlue-900 bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-xl cursor-pointer"
                  >
                    <div className="flex flex-col max-w-[70%] min-w-[70%]">
                      <div className="text-richblue-300 font-semibold min-w-[70%]">
                        <p>
                          {idx + 1}. {ques.question}
                        </p>
                      </div>
                      <div>
                        {ques.answer !== null && (
                          <div className="min-w-[60%] text-sm font-roboto">
                            <p className="font-roboto text-sm font-semibold ">
                              Response :
                            </p>

                            {ques.answer}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Show marks for all non-pure-Response question types (including Checkbox+Response) */}
                    {!(/^Response$/i.test(qType || "")) && (
                      <div className="bg-richblue-600  w-8 h-8 rounded-full text-richblue-10 flex justify-center items-center ">
                        <p>
                          {ques.markGot}/{ques.actualMark}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

      {asessmentData &&
        asessmentData?.userQuestions[0]?.submitted &&
        asessmentData?.userQuestions[0]?.response.length > 0 && (
          <div className="flex flex-col gap-2 justify-center text-3xl text-gray-800 items-center my-20 font-bold ">
            <dotlottie-player
              autoplay
              playMode="normal"
              src={animationData}
              background="transparent"
              speed="0.5"
              style={{ width: "100px", height: "100px" }}
            />
            <p>You have successfully completed self-assessment !</p>

            <Button
              onClick={() => {
                navigate(
                  `/students/new_submission/${AssignmentId}/${assignmentData._id}/peer`
                );
              }}
            >
              Proceed to Peer Assessment
            </Button>
          </div>
        )}
    </div>
  );
}

export default SelfAssessment;
