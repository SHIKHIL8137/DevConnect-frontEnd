import { useState } from "react";
import Navbar from "../../components/user/loginSignUp_Navbar/Navbar";
import { useNavigate } from "react-router-dom";

const signupChoosing = () => {
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();

  const submitHandler = () => {
    if (userType === "client") {
      navigate(`/signUp?role=${userType}`);
    } else if (userType === "freelancer") {
      navigate(`/signUp?role=${userType}`);
    }
  };
  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-6">
      <div className="w-full mb-4">
        <Navbar />
      </div>
      <div className="w-full max-w-3xl flex-grow flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
            Join as a client or freelancer
          </h1>
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-10">
            <div
              className={`border-2 rounded-lg p-6 flex items-center justify-between cursor-pointer transition-all
              ${
                userType === "client"
                  ? "border-green-600"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => setUserType("client")}
            >
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-full mr-4">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                      fill="currentColor"
                    />
                    <path
                      d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                      fill="currentColor"
                    />
                    <path
                      d="M18 8H21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-lg">I'm a client,</p>
                  <p className="font-semibold text-lg">hiring for a project</p>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center 
              ${
                userType === "client" ? "border-green-600" : "border-gray-300"
              }`}
              >
                {userType === "client" && (
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                )}
              </div>
            </div>
            <div
              className={`border-2 rounded-lg p-6 flex items-center justify-between cursor-pointer transition-all
              ${
                userType === "freelancer"
                  ? "border-green-600"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => setUserType("freelancer")}
            >
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-full mr-4">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                      fill="currentColor"
                    />
                    <path
                      d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                      fill="currentColor"
                    />
                    <path
                      d="M17 17L21 17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-lg">I'm a freelancer,</p>
                  <p className="font-semibold text-lg">looking for work</p>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center 
              ${
                userType === "freelancer"
                  ? "border-green-600"
                  : "border-gray-300"
              }`}
              >
                {userType === "freelancer" && (
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                )}
              </div>
            </div>
          </div>

          <button
            className={`cursor-pointer px-6 py-3 rounded-md font-medium text-white transition-colors w-full max-w-xs
            ${
              userType
                ? "bg-green-600 hover:bg-green-700"
                : "bg-green-500 opacity-70 cursor-not-allowed"
            }`}
            disabled={!userType}
            onClick={submitHandler}
          >
            Join as a{" "}
            {userType === "client"
              ? "Client"
              : userType === "freelancer"
              ? "Freelancer"
              : "Client"}
          </button>
          <div className="mt-8 text-gray-700">
            Already have an account?
            <span
              onClick={() => navigate("/login")}
              className="text-green-600 font-medium ml-1 hover:underline cursor-pointer"
            >
              Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default signupChoosing;
