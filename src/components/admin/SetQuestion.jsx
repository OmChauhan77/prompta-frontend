import React from "react";
import Navbar from "../user/Navbar";
import { RiDeleteBinLine } from "react-icons/ri";
import { useState, useEffect } from "react";
import { apiConnector } from "../../service/apiconnector";
import "../../pages/signin.css";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import Deletebtn from "../HomePage/Deletebtn";
import img16 from "../../assets/img16.png";
import Footer from "../HomePage/Footer";
import { RxCross2 } from "react-icons/rx";
import { Button } from "../../component/ui/button";
import { cn } from "../../lib/utils";
import { useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../component/ui/tabs";

export const SetQuestion = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState([]);

  const [userQues, setUserQues] = useState([]);
  const [userQues1, setUserQues1] = useState([]);

  const [peerQues, setpeerQues] = useState([]);
  const [peerQues1, setpeerQues1] = useState([]);

  const [expertQues, setexpertQues] = useState([]);
  const [expertQues1, setexpertQues1] = useState([]);

  const [preQues, setpreQues] = useState([]);
  const [preQues1, setpreQues1] = useState([]);

  // const [postQues, setpostQues] = useState([]);
  // const [postQues1, setpostQues1] = useState([]);

  // set ques
  const [ques, setQues] = useState("");
  const [ques1, setQues1] = useState("");
  const [ques2, setQues2] = useState("");
  const [ques3, setQues3] = useState("");
  // const [ques4, setQues4] = useState('');

  // ques type
  const [quesType, setQuesType] = useState("Checkbox");
  const [quesType1, setQuesType1] = useState("Checkbox");
  const [quesType2, setQuesType2] = useState("Checkbox");
  const [quesType3, setQuesType3] = useState("Checkbox");
  // const [quesType4, setQuesType4] = useState('Checkbox');

  const [loading, setLoading] = useState(false);
  const [assignmentType, setAssignmentType] = useState();
  const { token } = useSelector((state) => state.auth);

  // marks
  const [selfmarks, setSelfmarks] = useState(0);
  const [peermarks, setPeermarks] = useState(0);
  const [expertmarks, setExpertmarks] = useState(0);
  const [premarks, setPremarks] = useState(0);
  // const [postmarks, setPostmarks] = useState(0)

  // set heading
  const [heading, setHeading] = useState("Content");
  const [heading1, setHeading1] = useState("Content");
  const [heading2, setHeading2] = useState("Content");
  const [heading3, setHeading3] = useState("Content");
  // const [heading4, setHeading4] = useState('Content')

  const [allType, setAllType] = useState();
  const [rubricsType, setRubricsType] = useState([]);
  const [rubricsNewType, setRubricsNewType] = useState([]);
  const [groupType, setGroupType] = useState([]);
  const [groupTypeNew, setGroupTypeNew] = useState([]);
  const [group, setGroup] = useState("");
  const [diagnosticType, setDiagnosticType] = useState("preTest");
  const [diagnoQues, setDiagnoQues] = useState();

  const [type, setType] = useState("");

  const goBack = () => {
    navigate(-1); // This is equivalent to history.goBack()
  };

  useEffect(() => {
    const filterData = diagnoQues?.filter(
      (ques) => ques.assignmentType === diagnosticType
    );
    const filterObj = filterData?.length > 0 ? filterData[0] : null;
    const filterType = allType?.filter(
      (type) => type.assignmentType === diagnosticType
    );
    console.log(filterType);
    setGroupType(
      filterType && filterType[0]?.groups ? filterType[0].groups : []
    );
    setpreQues1(
      filterObj && filterObj?.diagnosticQues ? filterObj.diagnosticQues : []
    );
  }, [diagnoQues, diagnosticType]);

  useEffect(() => {
    const filterData = question?.filter(
      (ques) => ques.assignmentType === assignmentType
    );
    const filterType = allType?.filter(
      (type) => type.assignmentType === assignmentType
    );
    const filterObj = filterData.length > 0 ? filterData[0] : null;
    console.log(filterType);
    // console.log(filterObj && filterObj.userQues);
    setUserQues1(filterObj && filterObj?.userQues ? filterObj.userQues : []);
    setpeerQues1(filterObj && filterObj?.peerQues ? filterObj.peerQues : []);
    setexpertQues1(
      filterObj && filterObj?.expertQues ? filterObj.expertQues : []
    );
    // setpreQues1(filterObj && filterObj?.preQues ? filterObj.preQues : []);
    // setpostQues1(filterObj && filterObj?.postQues ? filterObj.postQues : []);
    setGroupType(
      filterType && filterType[0]?.groups ? filterType[0].groups : []
    );
  }, [question, assignmentType]);

  function assigntypehandler(event) {
    setAssignmentType(event.target.value);
  }

  useEffect(() => {
    allType && setRubricsType(allType.map((type) => type.assignmentType));
  }, [allType]);

  // set questions

  function changehandler1(event) {
    setQues(event.target.value);
  }

  function changehandler3(event) {
    setQues1(event.target.value);
  }

  function changehandler5(event) {
    setQues2(event.target.value);
  }

  function changehandler7(event) {
    setQues3(event.target.value);
  }

  // function changehandler9(event) {
  //     setQues4(event.target.value)
  // }

  // set ques type

  function changehandler2(event) {
    setQuesType(event.target.value);
    console.log(quesType);
  }

  function changehandler4(event) {
    setQuesType1(event.target.value);
    console.log(quesType1);
  }

  function changehandler6(event) {
    setQuesType2(event.target.value);
    console.log(quesType2);
  }

  function changehandler8(event) {
    setQuesType3(event.target.value);
    console.log(quesType3);
  }

  // function changehandler10(event) {
  //     setQuesType4(event.target.value)
  //     console.log(quesType4)
  // }

  // set heading
  function headinghandler1(event) {
    setHeading(event.target.value);
    console.log(heading);
  }
  function headinghandler2(event) {
    setHeading1(event.target.value);
    console.log(heading1);
  }
  function headinghandler3(event) {
    setHeading2(event.target.value);
    console.log(heading2);
  }
  function headinghandler4(event) {
    setHeading3(event.target.value);
    console.log(heading3);
  }
  // function headinghandler5(event) {
  //     setHeading4(event.target.value)
  //     console.log(heading4)
  // }

  // push questions

  const addqueshandle = () => {
    const Questions = {
      ques: ques,
      quesType: quesType,
      mark: selfmarks,
    };

    userQues.push(Questions);
    setQues("");
    console.log(userQues);
  };

  const addqueshandle1 = () => {
    const Questions = {
      ques: ques1,
      quesType: quesType1,
      mark: peermarks,
    };

    peerQues.push(Questions);
    setQues1("");
    console.log(peerQues);
  };

  const addqueshandle2 = () => {
    const Questions = {
      ques: ques2,
      quesType: quesType2,
      mark: expertmarks,
    };

    expertQues.push(Questions);
    setQues2("");
    console.log(expertQues);
  };

  const addqueshandle3 = () => {
    const Questions = {
      ques: ques3,
      quesType: quesType3,
      mark: premarks,
    };

    preQues.push(Questions);
    setQues3("");
    console.log(preQues);
  };

  // const addqueshandle4 = () => {
  //     const Questions = {
  //         ques: ques4,
  //         quesType: quesType4,
  //         mark: postmarks

  //     }

  //     postQues.push(Questions)
  //     setQues4('')
  //     console.log(postQues)
  // }

  // delete questions hndler

  function deletehandle(index) {
    const updated = userQues.filter((userQues, i) => i !== index);
    setUserQues(updated);
  }

  function deletehandle1(index) {
    const updated = peerQues.filter((peerQues, i) => i !== index);
    setpeerQues(updated);
  }

  function deletehandle2(index) {
    const updated = expertQues.filter((expertQues, i) => i !== index);
    setexpertQues(updated);
  }

  function deletehandle3(index) {
    const updated = preQues.filter((preQues, i) => i !== index);
    setpreQues(updated);
  }

  // function deletehandle4(index) {
  //     const updated = postQues.filter((postQues, i) => i !== index);
  //     setpostQues(updated)
  // }

  // delete groups
  function deletegroup(index) {
    const updated = userQues1.filter((group, i) => i !== index);
    setUserQues1(updated);
  }
  function deletegroup1(index) {
    const updated = peerQues1.filter((group, i) => i !== index);
    setpeerQues1(updated);
  }
  function deletegroup2(index) {
    const updated = expertQues1.filter((group, i) => i !== index);
    setexpertQues1(updated);
  }
  function deletegroup3(index) {
    const updated = preQues1.filter((group, i) => i !== index);
    setpreQues1(updated);
  }
  // function deletegroup4(index) {
  //     const updated = postQues1.filter((group, i) => i !== index);
  //     setpostQues1(updated)
  // }

  // setting marks

  const handleInputChange1 = (event) => {
    const newValue = parseInt(event.target.value);
    setSelfmarks(newValue);
  };
  const handleInputChange2 = (event) => {
    const newValue = parseInt(event.target.value);
    setPeermarks(newValue);
  };
  const handleInputChange3 = (event) => {
    const newValue = parseInt(event.target.value);
    setExpertmarks(newValue);
  };
  const handleInputChange4 = (event) => {
    const newValue = parseInt(event.target.value);
    setPremarks(newValue);
  };
  // const handleInputChange5 = (event) => {
  //     const newValue = parseInt(event.target.value);
  //     setPostmarks(newValue);
  // };

  const submithandler = async (event) => {
    event.preventDefault();
    const quesData = {
      assignmentType: assignmentType,
      userQues: userQues1,
      peerQues: peerQues1,
      expertQues: expertQues1,
      groupType: groupType,
      // preQues: preQues1,
      // postQues: postQues1
    };
    console.log(quesData);

    try {
      setLoading(true);
      const result = await apiConnector(
        "POST",
        process.env.REACT_APP_BASE_URL + "/api/v2/set_question",
        quesData,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      console.log(result);
      console.log(result.data.data);

      if (!result.data.success) {
        throw new Error(result.data.message);
      }
      setLoading(false);
      toast.success("Question Submitted Successfully");
      setGroupTypeNew([]);
      setRubricsNewType([]);
      // Fetch updated submission data immediately after submission
      const Allques = await apiConnector(
        "GET",
        process.env.REACT_APP_BASE_URL + "/api/v2/get_question",
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (Allques.data.success) {
        setQuestion(Allques.data.allques);
        setAllType(Allques.data.alltype);
        setAssignmentType(Allques.data.alltype[0]?.assignmentType);
        setDiagnoQues(Allques.data.Alldiagnostics);
      }

      console.log(question);
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed To Submit");

      console.error("An error occurred:", error);
    }
  };

  const submithandler2 = async (event) => {
    event.preventDefault();
    const quesData = {
      assignmentType: diagnosticType,
      groupType: groupType,
      diagnosticQues: preQues1,
    };
    console.log(quesData);

    try {
      setLoading(true);
      const result = await apiConnector(
        "POST",
        process.env.REACT_APP_BASE_URL + "/api/v2/diagnostics",
        quesData,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      console.log(result);

      if (!result.data.success) {
        throw new Error(result.data.message);
      }
      setLoading(false);
      toast.success("Question Submitted Successfully");
      setGroupTypeNew([]);

      // Fetch updated submission data immediately after submission
      const Allques = await apiConnector(
        "GET",
        process.env.REACT_APP_BASE_URL + "/api/v2/get_question",
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (Allques.data.success) {
        setQuestion(Allques.data.allques);
        setAllType(Allques.data.alltype);
        setAssignmentType(Allques.data.alltype[0]?.assignmentType);
        setDiagnoQues(Allques.data.Alldiagnostics);
      }

      console.log(question);
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed To Submit");

      console.error("An error occurred:", error);
    }
  };
  // const submithandler2 = async (event) => {
  //   event.preventDefault();

  //   if (!diagnosticType || !groupType || !preQues1 || preQues1.length === 0) {
  //     toast.error(
  //       "Please complete all required fields, including at least one question."
  //     );
  //     return;
  //   }

  //   const quesData = {
  //     assignmentType: diagnosticType.toLowerCase(), // Normalize case
  //     groupType: groupType,
  //     diagnosticQues: preQues1,
  //   };

  //   console.log("Submitting quesData:", JSON.stringify(quesData, null, 2));

  //   try {
  //     setLoading(true);

  //     const result = await apiConnector(
  //       "POST",
  //       `${process.env.REACT_APP_BASE_URL}/api/v2/diagnostics`,
  //       quesData,
  //       {
  //         Authorization: `Bearer ${token}`,
  //       }
  //     );

  //     console.log("POST response:", JSON.stringify(result.data, null, 2));

  //     if (!result.data.success) {
  //       throw new Error(result.data.message || "Submission failed");
  //     }

  //     toast.success("Question Submitted Successfully");

  //     const Allques = await apiConnector(
  //       "GET",
  //       `${process.env.REACT_APP_BASE_URL}/api/v2/get_question`,
  //       null,
  //       {
  //         Authorization: `Bearer ${token}`,
  //       }
  //     );

  //     console.log(
  //       "GET Alldiagnostics:",
  //       JSON.stringify(Allques.data.Alldiagnostics, null, 2)
  //     );

  //     if (Allques.data.success) {
  //       setQuestion(Allques.data.allques);
  //       setAllType(Allques.data.alltype);
  //       setAssignmentType(Allques.data.alltype[0]?.assignmentType);
  //       setDiagnoQues(Allques.data.Alldiagnostics);
  //     }
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Failed to Submit");
  //     console.error(
  //       "Submission error:",
  //       error.response ? JSON.stringify(error.response, null, 2) : error.message
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const Allques = await apiConnector(
          "GET",
          process.env.REACT_APP_BASE_URL + "/api/v2/get_question",
          null,
          {
            Authorization: `Bearer ${token}`,
          }
        );
        setQuestion(Allques.data.allques);
        setAllType(Allques.data.alltype);
        setAssignmentType(Allques.data.alltype[0]?.assignmentType);
        setDiagnoQues(Allques.data.Alldiagnostics);
        // console.log(question);
      } catch (error) {
        console.log(error);
      }
    };
    fetchdata();
  }, []);

  // useEffect(() => {
  //   console.log("diagnoQues:", JSON.stringify(diagnoQues, null, 2));
  //   console.log("diagnosticType:", diagnosticType);
  //   const filterData = diagnoQues?.filter(
  //     (ques) =>
  //       ques.assignmentType.toLowerCase() === diagnosticType.toLowerCase()
  //   );
  //   console.log("filterData:", filterData);
  //   const filterObj = filterData?.length > 0 ? filterData[0] : null;
  //   console.log("filterObj:", filterObj);
  //   const filterType = allType?.filter(
  //     (type) =>
  //       type.assignmentType.toLowerCase() === diagnosticType.toLowerCase()
  //   );
  //   console.log("filterType:", filterType);
  //   setGroupType(
  //     filterType && filterType[0]?.groups ? filterType[0].groups : []
  //   );
  //   setpreQues1(
  //     filterObj && filterObj?.diagnosticQues
  //       ? [...filterObj.diagnosticQues]
  //       : []
  //   );
  //   console.log("preQues1 set to:", filterObj?.diagnosticQues || []);
  // }, [diagnoQues, diagnosticType]);
  const Diagnostichandler = () => {
    const filterData = diagnoQues?.filter(
      (ques) => ques.assignmentType === diagnosticType
    );
    const filterObj = filterData?.length > 0 ? filterData[0] : null;

    setpreQues1(
      filterObj && filterObj?.diagnosticQues ? filterObj.diagnosticQues : []
    );

    const filterType = allType?.filter(
      (type) => type.assignmentType === diagnosticType
    );
    console.log(filterType);
    setGroupType(
      filterType && filterType[0]?.groups ? filterType[0].groups : []
    );
  };

  const sum1 = userQues1.reduce((accumulator, currentValue) => {
    currentValue.questions.forEach((question) => {
      accumulator += question.mark;
    });
    return accumulator;
  }, 0);
  const sum2 = peerQues1.reduce((accumulator, currentValue) => {
    currentValue.questions.forEach((question) => {
      accumulator += question.mark;
    });
    return accumulator;
  }, 0);

  const sum3 = expertQues1.reduce((accumulator, currentValue) => {
    currentValue.questions.forEach((question) => {
      accumulator += question.mark;
    });
    return accumulator;
  }, 0);

  const sum4 = preQues1.reduce((accumulator, currentValue) => {
    currentValue.questions.forEach((question) => {
      accumulator += question.mark;
    });
    return accumulator;
  }, 0);
  // const sum5 = postQues1.reduce((accumulator, currentValue) => {
  //     currentValue.questions.forEach((question) => {
  //         accumulator += question.mark;
  //     });
  //     return accumulator;
  // }, 0);

  // add questions handler
  const addhandler = () => {
    const addques = {
      headingType: heading,
      questions: userQues.map(({ ques, quesType, mark }) => ({
        ques,
        quesType,
        mark,
      })),
    };
    userQues1.push(addques);
    setUserQues([]);
    console.log(userQues1);
  };
  const addhandler1 = () => {
    const addques = {
      headingType: heading1,
      questions: peerQues.map(({ ques, quesType, mark }) => ({
        ques,
        quesType,
        mark,
      })),
    };
    peerQues1.push(addques);
    setpeerQues([]);
    console.log(peerQues1);
  };
  const addhandler2 = () => {
    const addques = {
      headingType: heading2,
      questions: expertQues.map(({ ques, quesType, mark }) => ({
        ques,
        quesType,
        mark,
      })),
    };
    expertQues1.push(addques);
    setexpertQues([]);
    console.log(expertQues1);
  };
  const addhandler3 = () => {
    const addques = {
      headingType: heading3,
      questions: preQues.map(({ ques, quesType, mark }) => ({
        ques,
        quesType,
        mark,
      })),
    };
    preQues1.push(addques);
    setpreQues([]);
    console.log(preQues1);
  };
  // const addhandler4 = () => {
  //     const addques = {
  //         headingType: heading4,
  //         questions: postQues.map(({ ques, quesType, mark }) => ({ ques, quesType, mark }))
  //     }
  //     postQues1.push(addques)
  //     setpostQues([])
  //     console.log(postQues1)
  // }

  // delete whole group

  function deletegroupQuesHandler(index, idx) {
    if (userQues1[index] && userQues1[index].questions) {
      const updated = [...userQues1];
      updated[index].questions = updated[index].questions.filter(
        (group, i) => i !== idx
      );
      setUserQues1(updated);
      console.log(updated);
    }
  }

  function deletegroupQuesHandler1(index, idx) {
    if (peerQues1[index] && peerQues1[index].questions) {
      const updated = [...peerQues1];
      updated[index].questions = updated[index].questions.filter(
        (group, i) => i !== idx
      );
      setpeerQues1(updated);
      console.log(updated);
    }
  }
  function deletegroupQuesHandler2(index, idx) {
    if (expertQues1[index] && expertQues1[index].questions) {
      const updated = [...expertQues1];
      updated[index].questions = updated[index].questions.filter(
        (group, i) => i !== idx
      );
      setexpertQues1(updated);
      console.log(updated);
    }
  }

  function deletegroupQuesHandler3(index, idx) {
    if (preQues1[index] && preQues1[index].questions) {
      const updated = [...preQues1];
      updated[index].questions = updated[index].questions.filter(
        (group, i) => i !== idx
      );
      setpreQues1(updated);
      console.log(updated);
    }
  }

  // function deletegroupQuesHandler4(index, idx) {
  //     if (postQues1[index] && postQues1[index].questions) {
  //         const updated = [...postQues1];
  //         updated[index].questions = updated[index].questions.filter((group, i) => i !== idx);
  //         setpostQues1(updated);
  //         console.log(updated);
  //     }
  // }

  const filterType = (item, index) => {
    const updatetype = rubricsNewType.filter((type, i) => {
      return i !== index;
    });
    const updated = rubricsType.filter((items, i) => {
      return items !== item;
    });
    setRubricsNewType(updatetype);
    setRubricsType(updated);
  };

  const filtergroupType = (item, index) => {
    const updatetype = groupTypeNew.filter((type, i) => {
      return i !== index;
    });
    const updated = groupType.filter((items, i) => {
      return items !== item;
    });
    setGroupTypeNew(updatetype);
    setGroupType(updated);
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-[100vh] sm:signinbg">
          <div class="spinner"></div>
        </div>
      ) : (
        <div className=" h-full">
          <div className="bg-richblue-600 h-full text-richblue-10 p-10">
            <div className="flex text-2xl gap-10 font-semibold items-center cursor-pointer max-w-4xl">
              <div
                className="hover:bg-richblue-10 h-10 w-10 rounded-full flex justify-center items-center hover:bg-opacity-20"
                onClick={goBack}
              >
                <BiArrowBack />
              </div>

              <div>
                <span className="font-normal">Set Rubrics</span>
              </div>
            </div>
          </div>
          <div className="max-w-[80%] sm:max-w-4xl mx-auto text-richblue-900">
            <div className="flex items-center gap-2 text-xl">
              <h1 className=" font-bold mt-8 mb-8 font-inter">
                Set Your Rubrics
              </h1>
              <div>
                <img src={img16} alt="" className="w-10 h-10  bg-cover" />{" "}
              </div>
            </div>

            <Tabs defaultValue="rubrics">
              <TabsList>
                <TabsTrigger
                  value="rubrics"
                  onClick={() => {
                    const filterType = allType?.filter(
                      (type) => type.assignmentType === assignmentType
                    );
                    setGroupType(
                      filterType && filterType[0]?.groups
                        ? filterType[0].groups
                        : []
                    );
                  }}
                >
                  Rubrics
                </TabsTrigger>
                <TabsTrigger value="preTest" onClick={Diagnostichandler}>
                  Proficiency
                </TabsTrigger>
              </TabsList>

              <TabsContent value="rubrics">
                <div className="flex flex-wrap gap-20 mt-8">
                  <div>
                    <label htmlFor="country" className="text-lg font-semibold ">
                      Task Type
                    </label>
                    <div className="mt-2">
                      <select
                        name="assignmentType"
                        autoComplete="assignmentType"
                        value={assignmentType}
                        className="block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        onChange={assigntypehandler}
                      >
                        <option selected disabled>
                          Assignment-Type
                        </option>
                        {rubricsType.map((item, index) => (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <div className="flex  gap-2">
                      <div>
                        <label
                          htmlFor="country"
                          className="text-lg font-semibold "
                        >
                          Add Task Type
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="AssignmentType"
                            value={type}
                            className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            placeholder="Add new type"
                            onChange={(e) => {
                              setType(e.target.value);
                            }}
                          />
                        </div>
                      </div>

                      {type && (
                        <Button
                          onClick={() => {
                            setRubricsType((prev) => [...prev, type]);
                            setRubricsNewType((prev) => [...prev, type]);
                            toast.success("added");
                            setType("");
                          }}
                          className={cn("mt-8")}
                        >
                          Add Type
                        </Button>
                      )}
                    </div>
                    <div>
                      {rubricsNewType &&
                        rubricsNewType.map((item, index) => (
                          <div
                            key={index}
                            className="text-richlue-900 m-2 p-2  flex justify-between items-center "
                          >
                            <p className="hover:underline text-richblue-300">
                              {item}
                            </p>

                            <div
                              className="mr-4 text-lg cursor-pointer"
                              onClick={() => filterType(item, index)}
                            >
                              <RxCross2 />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-20 mt-8">
                  <div>
                    <label htmlFor="country" className="text-lg font-semibold ">
                      Aspects
                    </label>
                    <div className="mt-2">
                      <select
                        name="assignmentType"
                        autoComplete="assignmentType"
                        value={groupType}
                        className="block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        onChange={(e) => {
                          setGroupTypeNew((prev) => [...prev, e.target.value]);
                        }}
                      >
                        {groupType.map((item, index) => (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <div className="flex gap-2">
                      <div>
                        <label
                          htmlFor="country"
                          className="text-lg font-semibold"
                        >
                          Add Aspects
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            id="groupTypeInput"
                            value={group}
                            className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            placeholder="Add new type"
                            onChange={(e) => setGroup(e.target.value)}
                          />
                        </div>
                      </div>
                      {group && (
                        <Button
                          onClick={() => {
                            setGroupType((prev) => [...prev, group]);
                            setGroupTypeNew((prev) => [...prev, group]);
                            toast.success("Added");
                            setGroup("");
                          }}
                          className="mt-8"
                        >
                          Add Type
                        </Button>
                      )}
                    </div>
                    <div>
                      {groupTypeNew &&
                        groupTypeNew.map((item, index) => (
                          <div
                            key={item.id}
                            className="text-richblue-900 m-2 p-2 flex justify-between items-center"
                          >
                            <p className="hover:underline text-richblue-300">
                              {item}
                            </p>
                            <div
                              className="mr-4 text-lg cursor-pointer"
                              onClick={() => filtergroupType(item, index)}
                            >
                              <RxCross2 />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flex gap-2 items-center ">
                    <h3 className="text-lg mb-2 font-semibold">
                      Self Assessment Rubrics
                    </h3>
                    <h3 className="text-sm mb-2 w-32 font-semibold gap-2 flex">
                      Total :{" "}
                      <div className="flex justify-center items center text-richblue-300 w-6 h-6 rounded-full bg-richblue-100 border-[0.5px] border-richblue-300 font-semibold">
                        <p>{sum1}</p>
                      </div>
                    </h3>
                  </div>

                  <div>
                    <div>
                      <div>
                        {/* {userQues1 &&
                          userQues1.map((userQues, index) => {
                            return (
                              <div key={index}>
                                <div className="flex gap-4 justify-center items-center">
                                  {" "}
                                  <div>
                                    <h1 className="font-roboto font-semibold text-sm text-richblue-900 mt-4 relative">
                                      {userQues.headingType}
                                    </h1>
                                  </div>
                                  <div
                                    className="mr-4 mt-4 flex justify-center items-center text-sm cursor-pointer "
                                    onClick={() => {
                                      deletegroup(index);
                                    }}
                                  >
                                    <Deletebtn />
                                  </div>
                                </div>

                                {userQues.questions.map((ques, idx) => {
                                  return (
                                    <div
                                      key={idx}
                                      className="text-richlue-900 bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-lg font-semibold"
                                    >
                                      <div className="text-richblue-300 max-w-[70%] min-w-[70%]">
                                        <p>
                                          {idx + 1}. {ques.ques}
                                        </p>
                                      </div>
                                      <div className="text-xs text-richblue-300 bg-richblue-100 w-4 h-4 flex justify-center rounded-full items-center">
                                        <p>{ques.mark}</p>
                                      </div>
                                      <div className="text-xs text-richblue-300 bg-richblue-100 w-[70px] flex justify-center rounded-lg items-center">
                                        <p>{ques.quesType}</p>
                                      </div>
                                      <div
                                        className="mr-4 flex justify-center items-center text-lg cursor-pointer"
                                        onClick={() =>
                                          deletegroupQuesHandler(index, idx)
                                        }
                                      >
                                        <Deletebtn />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })} */}
                        {userQues1 &&
                          userQues1.map((userQues, index) => {
                            return (
                              <div key={index}>
                                <div className="flex gap-4 justify-center items-center">
                                  <div>
                                    <h1 className="font-roboto font-semibold text-sm text-richblue-900 mt-4 relative">
                                      {userQues.headingType}
                                    </h1>
                                  </div>
                                  <div
                                    className="mr-4 mt-4 flex justify-center items-center text-sm cursor-pointer "
                                    onClick={() => {
                                      deletegroup(index);
                                    }}
                                  >
                                    <Deletebtn />
                                  </div>
                                </div>

                                {userQues.questions.map((ques, idx) => {
                                  return (
                                    <div
                                      key={idx}
                                      className="text-richlue-900 bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-lg font-semibold"
                                    >
                                      <div className="text-richblue-300 max-w-[70%] min-w-[70%]">
                                        <p>
                                          {idx + 1}. {ques.ques}
                                        </p>
                                      </div>
                                      <div className="text-xs text-richblue-300 bg-richblue-100 w-4 h-4 flex justify-center rounded-full items-center">
                                        <p>{ques.mark}</p>
                                      </div>
                                      <div className="text-xs text-richblue-300 bg-richblue-100 w-[70px] flex justify-center rounded-lg items-center">
                                        <p>{ques.quesType}</p>
                                        {/* Optional: Add indicator for Checkbox+Feedback */}
                                        {/* {(/check.*feedback/i).test(ques.quesType || "") && (
                                          <span
                                            className="ml-1"
                                            title="Includes Checkbox and Feedback"
                                          >
                                          </span>
                                        )} */}
                                      </div>
                                      <div
                                        className="mr-4 flex justify-center items-center text-lg cursor-pointer"
                                        onClick={() =>
                                          deletegroupQuesHandler(index, idx)
                                        }
                                      >
                                        <Deletebtn />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    <div>
                      {userQues.map((userQues, index) => {
                        return (
                          <div
                            key={index}
                            className="text-richlue-900 bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-lg"
                          >
                            <div className="text-richblue-300 max-w-[70%] min-w-[70%]">
                              <p className="text-orange-600 font-bold">
                                {index + 1}. {userQues.ques}
                              </p>
                            </div>
                            <div className="text-xs text-richblue-300 bg-richblue-100 w-4 h-4 flex justify-center rounded-full  items-center">
                              <p>{userQues.mark}</p>
                            </div>
                            <div className="text-xs text-richblue-300 bg-richblue-100  w-[70px] flex justify-center rounded-lg items-center">
                              <p>{userQues.quesType}</p>
                            </div>

                            <div
                              className="mr-4 text-xs flex justify-center items-center cursor-pointer"
                              onClick={() => deletehandle(index)}
                            >
                              <Deletebtn />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex w- rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <textarea
                      type="text"
                      name="UserQuestion"
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="Add Questions"
                      rows={1}
                      value={ques}
                      onChange={changehandler1}
                    />
                  </div>
                  <div className="mt-4 flex flex-col justify-center-center gap-2">
                    <div className="flex items-center gap-2">
                      <div className="sm:col-span-3">
                        <div className="">
                          <select
                            name="quesType"
                            value={quesType}
                            onChange={changehandler2}
                            className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                          >
                            <option selected disabled>
                              Questions Type
                            </option>
                            <option>Check Box</option>
                            <option>Feedback</option>
                            <option>Check Box+Feedback</option>
                          </select>
                        </div>
                      </div>
                      <div className="sm:col-span-3">
                        <div className="">
                          <select
                            name="quesType"
                            value={heading}
                            onChange={headinghandler1}
                            className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                          >
                            <option selected disabled>
                              Set Heading
                            </option>
                            {groupType?.map((item, index) => (
                              <option key={index} value={item}>
                                {item}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center font-semibold">
                        <div>
                          <p className="text-sm">Set Mark:</p>
                        </div>
                        <input
                          type="number"
                          min="0"
                          value={selfmarks}
                          className="block rounded-md w-16 border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                          onChange={handleInputChange1}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button onClick={addqueshandle}>Add Question</Button>

                      <Button onClick={addhandler}>Add Group</Button>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flex gap-2 items-center ">
                    <h3 className="text-lg mb-2 font-semibold">
                      Peer Assessment Rubrics
                    </h3>
                    <h3 className="text-sm mb-2 w-32 font-semibold gap-2 flex">
                      Total :{" "}
                      <div className="flex justify-center items center text-richblue-300 w-6 h-6 rounded-full bg-richblue-100 border-[0.5px] border-richblue-300 font-semibold">
                        <p>{sum2}</p>
                      </div>
                    </h3>
                  </div>

                  <div>
                    <div>
                      <div>
                        <div>
                          {peerQues1 &&
                            peerQues1.map((peerQues1, index) => {
                              return (
                                <div key={index}>
                                  <div className="flex gap-4 justify-center items-center">
                                    {" "}
                                    <div>
                                      <h1 className="font-roboto font-semibold text-sm text-richblue-900 mt-4">
                                        {peerQues1.headingType}
                                      </h1>
                                    </div>
                                    <div
                                      className="mr-4 mt-4 text-sm cursor-pointer"
                                      onClick={() => {
                                        deletegroup1(index);
                                      }}
                                    >
                                      <Deletebtn />
                                    </div>{" "}
                                  </div>

                                  {peerQues1.questions.map((ques, idx) => {
                                    return (
                                      <div
                                        key={idx}
                                        className="text-richlue-900 bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-lg font-semibold"
                                      >
                                        <div className="text-richblue-300 max-w-[70%] min-w-[70%]">
                                          <p>
                                            {idx + 1}. {ques.ques}
                                          </p>
                                        </div>
                                        <div className="text-xs text-richblue-300 bg-richblue-100 w-4 h-4 flex justify-center rounded-full items-center">
                                          <p>{ques.mark}</p>
                                        </div>
                                        <div className="text-xs text-richblue-300 bg-richblue-100 w-[70px] flex justify-center rounded-lg items-center">
                                          <p>{ques.quesType}</p>
                                        </div>
                                        <div
                                          className="mr-4 text-lg cursor-pointer"
                                          onClick={() =>
                                            deletegroupQuesHandler1(index, idx)
                                          }
                                        >
                                          <Deletebtn />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })}
                        </div>
                      </div>
                      {peerQues.map((peerQues, index) => {
                        return (
                          <div
                            key={index}
                            className="text-richlue-900 bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-lg"
                          >
                            <div className="text-richblue-300 max-w-[70%] min-w-[70%]">
                              <p className="text-orange-600 font-bold">
                                {index + 1}. {peerQues.ques}
                              </p>
                            </div>
                            <div className="text-xs text-richblue-300 bg-richblue-100 w-[70px] flex justify-center rounded-lg items-center">
                              <p>{peerQues.quesType}</p>
                            </div>
                            <div className="text-xs text-richblue-300 bg-richblue-100 w-4 h-4 flex justify-center rounded-full  items-center">
                              <p>{peerQues.mark}</p>
                            </div>
                            <div
                              className="mr-4 text-xs cursor-pointer"
                              onClick={() => deletehandle1(index)}
                            >
                              <Deletebtn />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex w- rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <textarea
                      type="text"
                      name="UserQuestion"
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="Add Questions"
                      rows={1}
                      value={ques1}
                      onChange={changehandler3}
                    />
                  </div>
                  <div className="mt-4 flex flex-col justify-center gap-2">
                    <div className="flex items-center gap-2 ">
                      <div className="sm:col-span-3">
                        <div className="">
                          <select
                            name="quesType"
                            value={quesType1}
                            onChange={changehandler4}
                            className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                          >
                            <option selected disabled>
                              Questions Type
                            </option>
                            <option>Check Box</option>
                            <option>Feedback</option>
                            <option>Check Box+Feedback</option>
                          </select>
                        </div>
                      </div>
                      <div className="sm:col-span-3">
                        <div className="">
                          <select
                            name="quesType"
                            value={heading1}
                            onChange={headinghandler2}
                            className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                          >
                            <option selected disabled>
                              Set Heading
                            </option>
                            {groupType?.map((item, index) => (
                              <option key={index} value={item}>
                                {item}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center font-semibold">
                        <div className="font-semibold text-sm">
                          <p>Set Mark:</p>
                        </div>
                        <input
                          type="number"
                          min="0"
                          value={peermarks}
                          className="block rounded-md w-16 border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                          onChange={handleInputChange2}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <Button onClick={addqueshandle1}>Add Question</Button>

                      <Button onClick={addhandler1}>Add Group</Button>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flex gap-2 items-center ">
                    <h3 className="text-lg mb-2 font-semibold">
                      Mentor Assessment Rubrics
                    </h3>
                    <h3 className="text-sm mb-2 w-32 font-semibold gap-2 flex">
                      Total :{" "}
                      <div className="flex justify-center items center text-richblue-300 w-6 h-6 rounded-full bg-richblue-100 border-[0.5px] border-richblue-300 font-semibold">
                        <p>{sum3}</p>
                      </div>
                    </h3>
                  </div>

                  <div>
                    <div>
                      <div>
                        <div>
                          {expertQues1 &&
                            expertQues1.map((expertQues1, index) => {
                              return (
                                <div key={index}>
                                  <div className="flex gap-4 justify-center items-center">
                                    {" "}
                                    <div>
                                      <h1 className="font-roboto font-semibold text-sm text-richblue-900 mt-4">
                                        {expertQues1.headingType}
                                      </h1>
                                    </div>
                                    <div
                                      className="mr-4 mt-4 text-sm cursor-pointer"
                                      onClick={() => {
                                        deletegroup2(index);
                                      }}
                                    >
                                      <Deletebtn />
                                    </div>{" "}
                                  </div>

                                  {expertQues1.questions.map((ques, idx) => {
                                    return (
                                      <div
                                        key={idx}
                                        className="text-richlue-900 bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-lg font-semibold"
                                      >
                                        <div className="text-richblue-300 max-w-[70%] min-w-[70%]">
                                          <p>
                                            {idx + 1}. {ques.ques}
                                          </p>
                                        </div>
                                        <div className="text-xs text-richblue-300 bg-richblue-100 w-4 h-4 flex justify-center rounded-full items-center">
                                          <p>{ques.mark}</p>
                                        </div>
                                        <div className="text-xs text-richblue-300 bg-richblue-100 w-[70px] flex justify-center rounded-lg items-center">
                                          <p>{ques.quesType}</p>
                                        </div>
                                        <div
                                          className="mr-4 text-xs cursor-pointer"
                                          onClick={() =>
                                            deletegroupQuesHandler2(index, idx)
                                          }
                                        >
                                          <Deletebtn />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })}
                        </div>
                      </div>
                      {expertQues.map((expertQues, index) => {
                        return (
                          <div
                            key={index}
                            className="text-richlue-900 bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-lg"
                          >
                            <div className="text-richblue-300 max-w-[70%] min-w-[70%]">
                              <p className="text-orange-600 font-bold">
                                {index + 1}. {expertQues.ques}
                              </p>
                            </div>
                            <div className="text-xs text-richblue-300 bg-richblue-100 w-[70px] flex justify-center rounded-lg items-center">
                              <p>{expertQues.quesType}</p>
                            </div>
                            <div className="text-xs text-richblue-300 bg-richblue-100 w-4 h-4 flex justify-center rounded-full  items-center">
                              <p>{expertQues.mark}</p>
                            </div>
                            <div
                              className="mr-4 text-lg cursor-pointer"
                              onClick={() => deletehandle2(index)}
                            >
                              <Deletebtn />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex w- rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <textarea
                      type="text"
                      name="UserQuestion"
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="Add Questions"
                      rows={1}
                      value={ques2}
                      onChange={changehandler5}
                    />
                  </div>
                  <div className="mt-4 flex flex-col justify-center ">
                    <div className="flex items-center gap-2">
                      <div className="sm:col-span-3">
                        <div className="">
                          <select
                            name="quesType"
                            value={quesType2}
                            onChange={changehandler6}
                            className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                          >
                            <option selected disabled>
                              Questions Type
                            </option>
                            <option>Check Box</option>
                            <option>Feedback</option>
                            <option>Check Box+Feedback</option>
                          </select>
                        </div>
                      </div>
                      <div className="sm:col-span-3">
                        <div className="">
                          <select
                            name="quesType"
                            value={heading2}
                            onChange={headinghandler3}
                            className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                          >
                            <option selected disabled>
                              Set Heading
                            </option>
                            {groupType?.map((item, index) => (
                              <option key={index} value={item}>
                                {item}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center font-semibold">
                        <div className="font-semibold text-sm">
                          {" "}
                          <p>Set Mark:</p>
                        </div>
                        <input
                          type="number"
                          min="0"
                          value={expertmarks}
                          className="block rounded-md w-16 border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                          onChange={handleInputChange3}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <Button onClick={addqueshandle2}>Add Question</Button>

                    <Button onClick={addhandler2}>Add Group</Button>
                  </div>
                </div>
                <div className="my-16  flex justify-center">
                  <Button variant="btn" onClick={submithandler}>
                    Submit
                  </Button>

                  <Toaster />
                </div>
              </TabsContent>

              <TabsContent value="preTest">
                <div className="min-h-screen mb-20">
                  <div>
                    <label htmlFor="country" className="text-lg font-semibold ">
                      Proficiency Type
                    </label>
                    <div className="mt-2">
                      <select
                        name="assignmentType"
                        autoComplete="assignmentType"
                        value={diagnosticType}
                        className="block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        onChange={(e) => {
                          setDiagnosticType(e.target.value);
                        }}
                      >
                        <option selected disabled>
                          Proficiency-Type
                        </option>
                        <option value="preTest">Diagnostic Test</option>
                        <option value="postTest">Evaluative Test</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-20 mt-8">
                    <div>
                      <label
                        htmlFor="country"
                        className="text-lg font-semibold "
                      >
                        Aspects
                      </label>
                      <div className="mt-2">
                        <select
                          name="assignmentType"
                          autoComplete="assignmentType"
                          value={groupType}
                          className="block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                          onChange={(e) => {
                            setGroupTypeNew((prev) => [
                              ...prev,
                              e.target.value,
                            ]);
                          }}
                        >
                          {groupType.map((item, index) => (
                            <option key={index} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <div className="flex gap-2">
                        <div>
                          <label
                            htmlFor="country"
                            className="text-lg font-semibold"
                          >
                            Add Aspects
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              id="groupTypeInput"
                              value={group}
                              className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              placeholder="Add new Aspect"
                              onChange={(e) => setGroup(e.target.value)}
                            />
                          </div>
                        </div>
                        {group && (
                          <Button
                            onClick={() => {
                              setGroupType((prev) => [...prev, group]);
                              setGroupTypeNew((prev) => [...prev, group]);
                              toast.success("Added");
                              setGroup("");
                            }}
                            className="mt-8"
                          >
                            Add Type
                          </Button>
                        )}
                      </div>
                      <div>
                        {groupTypeNew &&
                          groupTypeNew.map((item, index) => (
                            <div
                              key={item.id}
                              className="text-richblue-900 m-2 p-2 flex justify-between items-center"
                            >
                              <p className="hover:underline text-richblue-300">
                                {item}
                              </p>
                              <div
                                className="mr-4 text-lg cursor-pointer"
                                onClick={() => filtergroupType(item, index)}
                              >
                                <RxCross2 />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="flex gap-2 items-center ">
                      <h3 className="text-lg mb-2 font-semibold">
                        Proficiency Rubrics
                      </h3>
                      <h3 className="text-sm mb-2 w-32 font-semibold gap-2 flex">
                        Total :{" "}
                        <div className="flex justify-center items center text-richblue-300 w-6 h-6 rounded-full bg-richblue-100 border-[0.5px] border-richblue-300 font-semibold">
                          <p>{sum4}</p>
                        </div>
                      </h3>
                    </div>

                    <div>
                      <div>
                        <div>
                          {preQues1 &&
                            preQues1.map((preQues, index) => {
                              return (
                                <div key={index}>
                                  <div className="flex gap-4 justify-center items-center">
                                    {" "}
                                    <div>
                                      <h1 className="font-roboto font-semibold text-sm text-richblue-900 mt-4">
                                        {preQues.headingType}
                                      </h1>
                                    </div>
                                    <div
                                      className="mr-4 mt-4 text-sm cursor-pointer"
                                      onClick={() => {
                                        deletegroup3(index);
                                      }}
                                    >
                                      <Deletebtn />
                                    </div>{" "}
                                  </div>

                                  {preQues.questions.map((ques, idx) => {
                                    return (
                                      <div
                                        key={idx}
                                        className="text-richlue-900 bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-lg font-semibold"
                                      >
                                        <div className="text-richblue-300 max-w-[70%] min-w-[70%]">
                                          <p>
                                            {idx + 1}. {ques.ques}
                                          </p>
                                        </div>
                                        <div className="text-xs text-richblue-300 bg-richblue-100 w-4 h-4 flex justify-center rounded-full items-center">
                                          <p>{ques.mark}</p>
                                        </div>
                                        <div className="text-xs text-richblue-300 bg-richblue-100 w-[70px] flex justify-center rounded-lg items-center">
                                          <p>{ques.quesType}</p>
                                        </div>
                                        <div
                                          className="mr-4 text-lg cursor-pointer"
                                          onClick={() =>
                                            deletegroupQuesHandler3(index, idx)
                                          }
                                        >
                                          <Deletebtn />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })}
                        </div>
                      </div>

                      <div>
                        {preQues.map((preQues, index) => {
                          return (
                            <div
                              key={index}
                              className="text-richlue-900 bg-richblue-10 m-2 p-2 rounded-md flex justify-between items-center shadow-lg"
                            >
                              <div className="text-richblue-300 max-w-[70%] min-w-[70%]">
                                <p>
                                  {index + 1}. {preQues.ques}
                                </p>
                              </div>
                              <div className="text-xs text-richblue-300 bg-richblue-100 w-4 h-4 flex justify-center rounded-full  items-center">
                                <p>{preQues.mark}</p>
                              </div>
                              <div className="text-xs text-richblue-300 bg-richblue-100  w-[70px] flex justify-center rounded-lg items-center">
                                <p>{preQues.quesType}</p>
                              </div>

                              <div
                                className="mr-4 text-xs cursor-pointer"
                                onClick={() => deletehandle3(index)}
                              >
                                <Deletebtn />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex w- rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <textarea
                        type="text"
                        name="UserQuestion"
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Add Questions"
                        rows={1}
                        value={ques3}
                        onChange={changehandler7}
                      />
                    </div>
                    <div className="mt-4 flex flex-col justify-center-center gap-2">
                      <div className="flex items-center gap-2">
                        <div className="sm:col-span-3">
                          <div className="">
                            <select
                              name="quesType"
                              value={quesType3}
                              onChange={changehandler8}
                              className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            >
                              <option selected disabled>
                                Questions Type
                              </option>
                              <option>Check Box</option>
                              <option>Response</option>
                              <option>Check Box+Feedback</option>
                            </select>
                          </div>
                        </div>
                        <div className="sm:col-span-3">
                          <div className="">
                            <select
                              name="quesType"
                              value={heading3}
                              onChange={headinghandler4}
                              className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            >
                              <option selected disabled>
                                Set Heading
                              </option>
                              {groupType?.map((item, index) => (
                                <option key={index} value={item}>
                                  {item}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="flex gap-2 items-center font-semibold">
                          <div>
                            <p className="text-sm">Set Mark:</p>
                          </div>
                          <input
                            type="number"
                            min="0"
                            value={premarks}
                            className="block rounded-md w-16 border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            onChange={handleInputChange4}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button onClick={addqueshandle3}>Add Question</Button>

                        <Button onClick={addhandler3}>Add Group</Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center items-center my-10">
                    <Button variant="btn" onClick={submithandler2}>
                      Submit
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
      <Footer></Footer>
    </>
  );
};
