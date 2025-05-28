import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUserData } from "../../redux/thunk/userThunk";
import { useNavigate, useLocation } from "react-router-dom";

const GoogleAuthRedirect = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getUser = async () => {
      const result = await dispatch(fetchUserData());
      if (fetchUserData.fulfilled.match(result)) {
        const role = new URLSearchParams(location.search).get("role");
        if (role === "freelancer") navigate("/freelancer/home");
        else navigate("/client/home");
      } else {
        navigate("/login");
      }
    };
    getUser();
  }, [dispatch, location.search, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <div className="flex flex-col items-center">
          {/* Logo */}
          <div className="mb-6 flex items-center">
            <span className="text-blue-500 text-3xl font-bold">
              &lt; &gt; Dev
            </span>
            <span className="text-gray-400 text-3xl font-bold">Connect</span>
          </div>

          <div className="mb-8 relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-full"></div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Logging you in
          </h2>
          <p className="text-gray-600 text-center mb-4">
            Authenticating with Google...
          </p>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-6 overflow-hidden">
            <div className="bg-blue-500 h-2 rounded-full animate-pulse"></div>
          </div>

          <div className="flex items-center text-gray-600">
            <svg
              className="w-5 h-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              />
            </svg>
            <span>Please wait while we connect to your Google account</span>
          </div>
        </div>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        © {new Date().getFullYear()} DevConnect. All rights reserved.
      </div>
    </div>
  );
};

export default GoogleAuthRedirect;
