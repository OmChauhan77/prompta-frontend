import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Home"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Signin from "./pages/Signin"
import Page from "./pages/Page"
import Profile from "./pages/Profile"
import User from "./pages/User"
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedRouteAdmin from './components/admin/ProtectedRouteAdmin';
import Mysubmission from "./components/user/Mysubmission";
// import SignupRoute from './components/SignupRoute';
import AdminPage from './pages/AdminPage';
import NewAssigment from './components/admin/NewAssigment';
import AllAssignment from './components/admin/AllAssigment';
import { SetQuestion } from './components/admin/SetQuestion';
import Assignment from './components/admin/Assignment';
import AllUser from './components/admin/AllUser';
import NewAssessment from "./components/user/NewAssessment"
import Allassessment from "./components/user/Allassessment"
import Submission from "./components/user/Submission"
import ViewSubmission from './components/admin/ViewSubmission';
import NewSubmission from './components/user/NewSubmission';
import Chatapp from './components/admin/Chatapp';
import UserSubmission from './components/admin/UserSubmission';
import Reports from "./components/admin/Reports"
import UserReport from './components/admin/UserReport';
import MyReport from './components/user/MyReports';
import Allsubmissions from './components/admin/Allsubmissions';
import Viewmysubmission from './components/user/Viewmysubmission';
import CoursePage from './components/user/CoursePage'
import Alltasks from './components/admin/Alltasks'
import ProficiencyTest from './components/user/ProficiencyTest'
import Proficiency from './components/admin/ProficiencyTest'
import ReviewsAndExperts from './components/admin/ReviewsAndExperts'
function App() {
  return (
    <div className='w-screen '>
{/* return <button onClick={() => {throw new Error("This is your first error!");}}>Break the world</button>; */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sendotp" element={<Signin />} />
        <Route path="/change_password" element={<Signup />} />
        <Route path="/forgot_password" element={<Signin />} />


        <Route element={< ProtectedRouteAdmin />}>

          <Route path="/adminpannel/dashboard" element={<AdminPage />} />
          <Route path="/adminpannel/new_assignment" element={<NewAssigment />} />
          <Route path="/adminpannel/all_assignment" element={<AllAssignment />} />
          <Route path="/adminpannel/set_questions" element={<SetQuestion />} />
          <Route path="/adminpannel/assignment/:id" element={<Assignment />} />
          <Route path="/adminpannel/all_users" element={<AllUser />} />
          <Route path="/adminpannel/view_submission/:id/:name" element={<ViewSubmission />} />
          <Route path="/adminpannel/user_submission/:UserId/:AssignmentId/:Type" element={<UserSubmission />} />
          <Route path="/adminpannel/chat_with_users" element={<Chatapp />} />
          <Route path="/adminpannel/reports/:userId/:name" element={<Reports />} />
          <Route path="/adminpannel/user_report/:userId/:AssignmentId/:name" element={<UserReport />} />
          <Route path="/adminpannel/Submissions/:userId/:name" element={<Reports />} />
          <Route path="/adminpannel/my_submission/:UserId/:AssignmentId/:name" element={<Mysubmission />} />
          <Route path="/adminpannel/all_submission/:UserId/:AssignmentId/:name" element={<Allsubmissions/>} />
          <Route path="/adminpannel/view_submission/:UserId/:AssignmentId/:name" element={<Viewmysubmission/>} />
          <Route path="/adminpannel/add_tasks/:id/:name" element={<Alltasks/>} />
          <Route path="/adminpannel/proficiency_test/:UserId/:AssignmentId" element={<Proficiency/>} />
          <Route path="/adminpannel/Review_and_experts" element={<ReviewsAndExperts/>} />

        </Route>

        <Route element={< ProtectedRoute />}>

          <Route path="/students/dashboard" element={<User />} />
          <Route path="/students/new_assessment" element={<NewAssessment />} />
          <Route path="/students/all_assessments" element={<Allassessment />} />
          <Route path="/students/new_submission/:AssignmentId/:Id/:params" element={<NewSubmission />} />
          <Route path="/students/add_submission/:UserId/:AssignmentId" element={<Submission />} />
          <Route path="/students/proficiency_test/:UserId/:AssignmentId" element={<ProficiencyTest/>} />
          <Route path="/students/my_submission/:UserId/:AssignmentId/:name" element={<Mysubmission />} />
          <Route path="/students/view_submission/:UserId/:AssignmentId/:name" element={<Viewmysubmission/>} />
          <Route path="/students/my_reports" element={<MyReport />} />
          <Route path="/students/report/:userId/:AssignmentId/:name" element={<UserReport />} />
          <Route path="/students/course_page/:id/:name" element={<CoursePage />} />

  
        </Route>
        
        <Route path="/profileupdate" element={<Profile />} />



        <Route path="*" element={<Page />} />
      </Routes>
    </div>
  );
}

export default App;

