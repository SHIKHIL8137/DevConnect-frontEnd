import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData, verificationUser } from "./redux/thunk/userThunk";
import { logout } from "./redux/slices/userSlice";
import { logout as adminLogout } from "./redux/slices/adminSlice";
import { fetchAdminData } from "./redux/thunk/adminThunk";
import { toast, Toaster } from "sonner";
import {
  AdminProtectedRoute,
  AdminPublicRoute,
  ProtectedRoute,
  PublicRoute,
} from "./util/protectedRoutes";
import SimpleStylishRing from "./components/common/Loading";

// Lazy load all components
const Home = lazy(() => import("./pages/common/Home"));
const Login = lazy(() => import("./pages/common/Login"));
const UnifiedSignUp = lazy(() => import("./components/user/signUp/unifiedSignUp"));
const Forget = lazy(() => import("./pages/common/Forget"));
const FreelancerMarketplace = lazy(() => import("./pages/client/Home"));
const FreelancerListing = lazy(() => import("./pages/freelancer/Home"));
const Profile = lazy(() => import("./pages/client/Profile"));
const ProfileFreelancer = lazy(() => import("./pages/freelancer/Profile"));
const ProfileUpdate = lazy(() => import("./pages/freelancer/ProfileUpdate"));
const ProfileUpdateClient = lazy(() => import("./pages/client/ProfileUpdate"));
const GoogleAuthRedirect = lazy(() => import("./pages/common/authGoogle"));
const AdminLogin = lazy(() => import("./pages/admin/login"));
const DevConnectDashboard = lazy(() => import("./pages/admin/DashBoard"));
const ProfileCompletionModal = lazy(() => import("./components/user/modals/profileCompletionModal"));
const ProjectDetailsFreelancer = lazy(() => import("./pages/freelancer/ProjectDetails"));
const AddProjectForm = lazy(() => import("./pages/client/addProject"));
const AllProjects = lazy(() => import("./pages/client/AllProjects"));
const ProjectDetails = lazy(() => import("./pages/client/ProjectDetails"));
const FreelancerPorfile = lazy(() => import("./pages/client/freelancerProfile"));
const EditProjectForm = lazy(() => import("./pages/client/editProject"));
const Logout = lazy(() => import("./components/common/LogOut"));
const ComplaintForm = lazy(() => import("./pages/common/complaint"));
const ComplaintsList = lazy(() => import("./pages/common/Complaints"));
const ComplaintDetails = lazy(() => import("./pages/common/ComplaintDetails"));
const BiddingRoom = lazy(() => import("./pages/freelancer/biddingUi"));
const ClientBiddingRoom = lazy(()=>import('./pages/client/BiddingRoom'));
const AllProjectsFreelancer = lazy(()=>import('./pages/freelancer/AllProjects'))
const ProjectDetailsHiredFreelancer = lazy(()=>import('./pages/freelancer/HiredProjectDetails'));
const FreelancerAllProjects = lazy(()=>import('./pages/client/freelancerAllProjects'))

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { admin } = useSelector((state) => state.admin);
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user) {
      const verifyUser = async () => {
        const result = await dispatch(fetchUserData());
        await dispatch(verificationUser());
        if (
          fetchUserData.rejected.match(result) &&
          (result.payload === "Token has expired" ||
            result.payload === "Invalid token")
        ) {
          dispatch(logout());
        } else if (result.payload?.block) {
          toast.error("User Blocked by Admin");
          dispatch(logout());
        } else {
          if (result.payload?.role === "freelancer") {
            const isIncomplete =
              !result.payload?.position ||
              !result.payload?.about ||
              !result.payload?.pricePerHour ||
              !result.payload?.skills ||
              result.payload?.skills.length === 0;

            setShowModal(isIncomplete);
          }
        }
      };
      verifyUser();
    } else if (admin) {
      const verifyAdmin = async () => {
        const result = await dispatch(fetchAdminData());
        if (
          fetchUserData.rejected.match(result) &&
          (result.payload === "Token has expired" ||
            result.payload === "Invalid token")
        ) {
          dispatch(adminLogout());
        }
      };
      verifyAdmin();
    } else {
      dispatch(logout());
      dispatch(adminLogout());
    }
  }, [location.pathname, dispatch]);

  return (
    <>
      <Toaster richColors position="top-right" />
      <Suspense fallback={<SimpleStylishRing/>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/logIn"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signUp"
            element={
              <PublicRoute>
                <UnifiedSignUp />
              </PublicRoute>
            }
          />
          <Route
            path="/forgotPassword"
            element={
              <PublicRoute>
                <Forget />
              </PublicRoute>
            }
          />
          <Route
            path="/client/home"
            element={
              <ProtectedRoute>
                <FreelancerMarketplace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/freelancer/home"
            element={
              <ProtectedRoute>
                <FreelancerListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/freelancer/profile"
            element={
              <ProtectedRoute>
                <ProfileFreelancer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/freelancer/profileUpdate"
            element={
              <ProtectedRoute>
                <ProfileUpdate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/profileUpdate"
            element={
              <ProtectedRoute>
                <ProfileUpdateClient />
              </ProtectedRoute>
            }
          />
          <Route path="/google-auth-redirect" element={<GoogleAuthRedirect />} />
          <Route
            path="/admin/login"
            element={
              <AdminPublicRoute>
                <AdminLogin />
              </AdminPublicRoute>
            }
          />
          <Route
            path="/admin/:tab?"
            element={
              <AdminProtectedRoute>
                <DevConnectDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/client/addProject"
            element={
              <ProtectedRoute>
                <AddProjectForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/allProject"
            element={
              <ProtectedRoute>
                <AllProjects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/projectDetails"
            element={
              <ProtectedRoute>
                <ProjectDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/editProject"
            element={
              <ProtectedRoute>
                <EditProjectForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/freelancerProfile"
            element={
              <ProtectedRoute>
                <FreelancerPorfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/freelancer/projectDetails"
            element={
              <ProtectedRoute>
                <ProjectDetailsFreelancer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logout"
            element={
              <ProtectedRoute>
                <Logout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/freelancer/complaint"
            element={
              <ProtectedRoute>
                <ComplaintForm complainantType="freelancer" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/complaint"
            element={
              <ProtectedRoute>
                <ComplaintForm complainantType="client" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/freelancer/complaints"
            element={
              <ProtectedRoute>
                <ComplaintsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/complaints"
            element={
              <ProtectedRoute>
                <ComplaintsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/freelancer/complaint-details/:id"
            element={
              <ProtectedRoute>
                <ComplaintDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/complaint-details/:id"
            element={
              <ProtectedRoute>
                <ComplaintDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/freelancer/bidding-room/:id"
            element={
              <ProtectedRoute>
                <BiddingRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/bidding-room/:id"
            element={
              <ProtectedRoute>
                <ClientBiddingRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/freelancer/allProjects"
            element={
              <ProtectedRoute>
                <AllProjectsFreelancer/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/freelancer/projectDetail/:id"
            element={
              <ProtectedRoute>
                <ProjectDetailsHiredFreelancer/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/freelancer-projects/:id"
            element={
              <ProtectedRoute>
                <FreelancerAllProjects/>
              </ProtectedRoute>
            }
          />
        </Routes>
        
        {user?.role === "freelancer" && showModal && (
          <ProfileCompletionModal closeModal={() => setShowModal(false)} />
        )}
      </Suspense>
    </>
  );
}

export default App;