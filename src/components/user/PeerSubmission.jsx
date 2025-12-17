import toast, { Toaster } from "react-hot-toast";
import "../../pages/signin.css";
import { useSelector } from "react-redux";
import { apiConnector } from "../../service/apiconnector";
import React, { useState, useRef, useEffect } from "react";
import img25 from "../../assets/img25.png";
import { RxCross2 } from "react-icons/rx";
import { useParams, Link } from "react-router-dom";
import img15 from "../../assets/img15.png";
import img21 from "../../assets/img21.png";
import { Button, buttonVariants } from "../../component/ui/button";
import animationData from "../../assets/lotties/course.lottie";
import "@dotlottie/player-component";
import { useNavigate } from "react-router-dom";

function PeerSubmission({ forloading, popup }) {
  const inputRef = useRef();
  const [file, setFiles] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const [formDataToSend, setFormDataToSend] = useState(new FormData());
  const [submissionData, setsubmissionData] = useState();
  const [question, setQuestion] = useState([]);
  // helper to find original quesType from question bank using heading and question text
  const getQuesType = (headingType, questionText) => {
    try {
      const group = question?.[0]?.peerQues?.find((g) => g.headingType === headingType);
      if (!group) return null;
      const qObj = group.questions.find((q) => q.ques === questionText);
      return qObj?.quesType || null;
    } catch (err) {
      return null;
    }
  };
  const [peerfinalResponses, setPeerFinalResponses] = useState([]);
  const [peerselftotal, setPeerSelftotal] = useState();
  let { AssignmentId } = useParams();
  const [asessmentData, setAssessmentData] = useState();
  const { user } = useSelector((state) => state.profile);
  const { assignmentData } = useSelector((state) => state.profile);
  const [state, setState] = useState(false);
  const [selfState, setselfState] = useState(false);
  const [marksGot2, setmarksGot2] = useState();

  const navigate = useNavigate();

  const formData = {
    totalMark: peerselftotal,
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
    let totalMarks;
    if (
      question &&
      question[0]?.peerQues &&
      question[0]?.peerQues?.length > 0
    ) {
      totalMarks = question[0]?.peerQues.reduce((accumulator, currentValue) => {
        currentValue.questions.forEach((question) => {
          accumulator += question.mark;
        });
        return accumulator;
      }, 0);
      setPeerSelftotal(totalMarks);
    }
  }, [question]);

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
    if (peerfinalResponses && peerfinalResponses.length > 0) {
      totalMarks = peerfinalResponses.reduce((accumulator, currentValue) => {
        currentValue.responses.forEach((question) => {
          accumulator += question.markGot;
        });
        return accumulator;
      }, 0);
      // console.log(totalMarks)
      setmarksGot2(totalMarks);
    }
  }, [peerfinalResponses]);

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

  const peerassessmenthandler = async (event) => {
    event.preventDefault();

    try {
      
      forloading(true);
      
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      file &&
        file.forEach((f) => {
          formDataToSend.append("file", f[0]);
        });

      const result = await apiConnector(
        "POST",
        process.env.REACT_APP_BASE_URL +
          `/api/peer_assessment/${user._id}/${assignmentData._id}/${AssignmentId}`,
        formDataToSend,
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        }
      );

      if (!result.data.success) {
        setFiles([]);
        toast.error("failed to submit");
        forloading(false);
        throw new Error(result.data.message);
      }
      // console.log(result);
      setFiles([]);
      forloading(false);
      setFormDataToSend(new FormData());

      toast.success("Peer file Submitted Successfully");

      // Fetch updated submission data immediately after submission
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

      // console.log(updatedSubmissionResult)
    } catch (error) {
      forloading(false);
      setFiles([]);
      toast.error(error.response?.data?.message || "Failed to submit");
    }
  };

  // popup({
  //   marksGot: marksGot1,
  //   selfsubmitted: true,
  //   selftotal: userselftotal
  // })

  const peersubmission = async (event) => {
    event.preventDefault();

    try {
      forloading(true);
      const result = await apiConnector(
        "POST",
        process.env.REACT_APP_BASE_URL +
          `/api/peer_submission/${user._id}/${assignmentData._id}`,
        {
          peerfinalResponses,
          marksGot2,
          AssignmentId,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );
      if (!result.data.success) {
        toast.error("failed to submit");
        forloading(false);
        throw new Error(result.data.message);
      }
      // console.log(result);
      forloading(false);
      setPeerFinalResponses([]);

      toast.success("Send to Peer Successfully");

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

      // console.log(updatedSubmissionResult)
    } catch (error) {
      forloading(false);
      toast.error(error.response?.data?.message || "Failed to submit");
    }
  };

  useEffect(() => {
    if (
      asessmentData &&
      asessmentData?.userQuestions[0]?.submitted &&
      asessmentData?.userQuestions[0]?.response?.length > 0
    ) {
      setState(true);
    }
  }, [asessmentData]);

  useEffect(() => {
    if (Array.isArray(question) && question.length > 0) {
      const userresponses = question[0]?.peerQues?.map((ques) => ({
        headingType: ques.headingType,
        responses: ques.questions.map((questions) => ({
          question: questions.ques,
          answer: null,
          markGot: 0,
          actualMark: questions.mark,
        })),
      }));
      setPeerFinalResponses(userresponses);
    }
  }, [question]);

  return (
    <div>
      {
        <div>
          {/*   Peer submission */}

          {state && (
            <div className=" mt-10 mb-2 ml-2 flex items-center gap-2 text-xl">
              <h1 className="text-xl font-bold">Peer Assessment</h1>
              <div>
                <img src={img21} alt="" className="w-10  " />
              </div>
            </div>
          )}

          {state && !asessmentData?.peerQuestions[0]?.myfile.length > 0 && (
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
                          className="w-16 w-16 rounded-full"
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

                {state &&
                  asessmentData &&
                  !asessmentData?.peerQuestions[0]?.myfile.length > 0 &&
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
                    <Button variant="btn" onClick={peerassessmenthandler}>
                      Next
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      }

      {state && asessmentData?.peerQuestions[0]?.myfile.length > 0 && (
        <div className=" mt-10 mb-2 ml-2 flex items-center gap-2 text-xl">
          <h1 className="text-sm font-bold">Your File</h1>
        </div>
      )}

      {state &&
        asessmentData?.peerQuestions[0]?.myfile.length > 0 &&
        asessmentData?.peerQuestions[0]?.myfile.map((file, index) => {
          return (
            <div key={index}>
              <div className="text-richlue-900 bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-xl cursor-pointer border-l-8 border-[#695FDC]">
                <Link to={file.fileurl} target="_blank">
                  <div className="text-richblue-900 font-semibold hover:underline">
                    <p>
                      {index + 1}. {file.filename}
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          );
        })}

      {state &&
        asessmentData?.peerQuestions[0]?.myfile.length > 0 &&
        asessmentData?.peerQuestions[0]?.peerfile.length > 0 && (
          <div className=" mt-10 mb-2 ml-2 flex items-center gap-2 text-xl">
            <h1 className="text-sm font-bold">Peer File</h1>
          </div>
        )}

      {state &&
        asessmentData?.peerQuestions[0]?.myfile.length > 0 &&
        asessmentData?.peerQuestions[0]?.peerfile.length > 0 &&
        asessmentData?.peerQuestions[0]?.peerfile.map((file, index) => {
          return (
            <div>
              <div
                key={index}
                className="text-richlue-900 bg-richblue-10 m-2 mb-8 p-2 rounded-md flex justify-between items-center shadow-xl cursor-pointer border-l-8 border-[#695FDC]"
              >
                <Link to={file.fileurl} target="_blank">
                  {" "}
                  <div className="text-richblue-900 font-semibold hover:underline">
                    <p>
                      {index + 1}. {file.filename}
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          );
        })}

      {state &&
        asessmentData?.peerQuestions[0]?.submitted &&
        asessmentData?.peerQuestions[0]?.response?.length > 0 && (
          <div className="flex text-richblue-900 justify-center items-center bg-primary text-richblue-10 gap-4 shadow-md w-[150px] rounded-md">
            <div className="flex flex-col justify-center items-center">
              <img src={img25} alt="" className="w-8" />
              <p className="text-md font-semibold">Score</p>
            </div>
            <div>
              <span className="font-semibold ">
                {asessmentData?.peerQuestions[0]?.totalMarkGot}
              </span>
              <span className="text-sm opacity-80 font-semibold">
                / {asessmentData?.peerQuestions[0]?.totalMark}
              </span>
            </div>
          </div>
        )}

      {
        <div>
          <div>
            <div>
              {state &&
                asessmentData?.peerQuestions[0]?.myfile.length > 0 &&
                asessmentData?.peerQuestions[0]?.peerfile.length > 0 &&
                !asessmentData?.peerQuestions[0]?.submitted &&
                question &&
                question[0]?.peerQues?.length > 0 &&
                question[0]?.peerQues?.map((peerQues, index) => (
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

                          {asessmentData &&
                            !asessmentData.peerQuestions[0]?.submitted &&
                            question.quesType === "Feedback" && (
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

                                      setPeerFinalResponses((prevResponses) => {
                                        const updatedResponses = [
                                          ...prevResponses,
                                        ];

                                        updatedResponses[index].responses[
                                          idx
                                        ].answer = value;

                                        return updatedResponses;
                                      });
                                    }}
                                    value={
                                      peerfinalResponses[index]?.responses[idx]
                                        ?.answer || null
                                    }
                                  />
                                </div>
                              </div>
                            )}
                        </div>

                        {asessmentData &&
                          !asessmentData.peerQuestions[0]?.submitted &&
                          (/check.*feedback/i).test(question.quesType || "") && (
                            <div className="flex flex-col gap-2 w-full">
                              <label className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={
                                    !!peerfinalResponses[index]?.responses[idx]
                                      ?.checked
                                  }
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    setPeerFinalResponses((prevResponses) => {
                                      const updatedResponses = [
                                        ...prevResponses,
                                      ];
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

                                    setPeerFinalResponses((prevResponses) => {
                                      const updatedResponses = [
                                        ...prevResponses,
                                      ];
                                      updatedResponses[index].responses[idx] = {
                                        ...updatedResponses[index].responses[idx],
                                        answer: value,
                                      };

                                      return updatedResponses;
                                    });
                                  }}
                                  value={
                                    peerfinalResponses[index]?.responses[idx]
                                      ?.answer || ""
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
                                          Math.max(
                                            parseInt(e.target.value) || 0,
                                            0
                                          ),
                                          peerfinalResponses[index].responses[idx]
                                            ?.actualMark || 0
                                        );

                                        setPeerFinalResponses((prevResponses) => {
                                          const updatedResponses = [
                                            ...prevResponses,
                                          ];

                                          updatedResponses[index].responses[
                                            idx
                                          ].markGot = value;

                                          return updatedResponses;
                                        });
                                      }}
                                      value={
                                        peerfinalResponses[index]?.responses[idx]
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
                                    {peerfinalResponses[index]?.responses[idx]
                                      ?.markGot || 0}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                        {asessmentData &&
                          !asessmentData.peerQuestions[0]?.submitted &&
                          question.quesType !== "Feedback" &&
                          !(/check.*feedback/i).test(question.quesType || "") && (
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
                                        Math.max(
                                          parseInt(e.target.value) || 0,
                                          0
                                        ),
                                        peerfinalResponses[index].responses[idx]
                                          ?.actualMark || 0
                                      );

                                      setPeerFinalResponses((prevResponses) => {
                                        const updatedResponses = [
                                          ...prevResponses,
                                        ];

                                        updatedResponses[index].responses[
                                          idx
                                        ].markGot = value;

                                        return updatedResponses;
                                      });
                                    }}
                                    value={
                                      peerfinalResponses[index]?.responses[idx]
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
                                  {peerfinalResponses[index]?.responses[idx]
                                    ?.markGot || 0}
                                </p>
                              </div>
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                ))}
            </div>

            {state &&
              asessmentData?.peerQuestions[0]?.myfile.length > 0 &&
              !asessmentData?.peerQuestions[0]?.submitted &&
              asessmentData?.peerQuestions[0]?.peerfile.length > 0 &&
              question &&
              question[0]?.peerQues?.length > 0 && (
                <div className="flex m-6 my-20 justify-center items-center">
                  <Button variant="btn" onClick={peersubmission}>
                    Next
                  </Button>
                </div>
              )}

            {state &&
              asessmentData &&
              asessmentData?.peerQuestions[0]?.response?.length > 0 &&
              asessmentData?.peerQuestions[0]?.submitted && (
                <div className=" mt-10 mb-2 ml-2 flex items-center gap-2">
                  <h1 className="text-lg font-bold">Response From Peer</h1>
                </div>
              )}

            {state &&
              asessmentData &&
              asessmentData?.peerQuestions[0]?.response?.length > 0 &&
              asessmentData?.peerQuestions[0]?.submitted &&
              asessmentData?.peerQuestions[0]?.response.map(
                (response, index) => {
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
                }
              )}
          </div>
        </div>
      }

      {state &&
        asessmentData &&
        asessmentData?.peerQuestions[0]?.response?.length > 0 &&
        asessmentData?.peerQuestions[0]?.submitted && (
          <div className="flex flex-col gap-2 justify-center text-3xl text-gray-800 items-center my-20 font-bold ">
            <dotlottie-player
              autoplay
              playMode="normal"
              src={animationData}
              background="transparent"
              speed="0.5"
              style={{ width: "100px", height: "100px" }}
            />
            <p>You have successfully completed peer assessment !</p>

            <Button
              onClick={() => {
                navigate(
                  `/students/new_submission/${AssignmentId}/${assignmentData._id}/expert`
                );
              }}
            >
              Proceed to Mentor Assessment
            </Button>
          </div>
        )}

      {state &&
        asessmentData &&
        asessmentData?.peerQuestions[0]?.submitted &&
        !asessmentData.peerQuestions[0]?.response?.length > 0 && (
          <div className="flex flex-col gap-2 justify-center text-3xl text-gray-800 items-center my-20 font-bold ">
            <p>Wait For The Peer Response....</p>
          </div>
        )}
    </div>
  );
}

export default PeerSubmission;
