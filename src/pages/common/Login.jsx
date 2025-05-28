import React, { useEffect, useState } from "react";
import Navbar from "../../components/user/loginSignUp_Navbar/Navbar";
import { Eye, EyeOff } from "lucide-react";
import loginImg from "../../assets/images/freepik__background__68429.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import { isValidEmail, isValidUsername } from "../../util/validation";
import { toast } from "sonner";
import { loginUser } from "../../apis/userApi";
import { useDispatch } from "react-redux";
import { fetchUserData } from "../../redux/thunk/userThunk";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [loading, setLoding] = useState(false);

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "user_blocked") {
      toast.error("User blocked by the admin.", {
        onClose: () => {
          navigate("/login", { replace: true });
        },
      });
    } else if (error === "auth_failed") {
      toast.error("Google authentication failed.", {
        onClose: () => {
          navigate("/login", { replace: true });
        },
      });
    }

    if (error) {
      navigate(window.location.pathname, { replace: true });
    }
  }, [searchParams, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidUsername(email) && !isValidEmail(email)) {
      toast.error("Invalid email or username");
      return;
    }

    try {
      setLoding(true);
      const response = await loginUser({ email: email, password });

      if (!response.data.status) {
        toast.error(response.data.message);
        return;
      }
     localStorage.setItem("refreshToken", response.data.refreshToken);
      const result = await dispatch(fetchUserData());
      if (fetchUserData.fulfilled.match(result)) {
        const userRole = result.payload.user.role;
        if (userRole === "client") navigate("/client/home");
        else if (userRole === "freelancer") navigate("/freelancer/home");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setLoding(false);
    }
  };

  const googleLogin = () => {
    window.location = "http://localhost:5000/api/auth/auth/google";
  };

  return (
    <div className="min-h-screen bg-blue-50 px-4 py-4">
      <Navbar />
      <div className="flex items-center justify-center w-full h-full mt-15">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 bg-blue-100 flex items-center justify-center p-8">
            <img src={loginImg} alt="login image" />
          </div>
          <div className="w-full md:w-1/2 py-8 px-6 md:px-12 flex flex-col justify-center">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Welcome back</h2>
            </div>
            <button
              type="button"
              className="flex items-center justify-center gap-2 border border-gray-300 rounded-full p-2 mb-6 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => googleLogin()}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Log in with Google </span>
            </button>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-sm text-gray-500">Email or Use</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email or Username
                </label>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-b-2 border-gray-300 py-2 outline-none focus:border-blue-500 transition-colors"
                  placeholder="Email or Username"
                />
              </div>

              <div className="relative">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b-2 border-gray-300 py-2 outline-none focus:border-blue-500 transition-colors pr-10"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-2 text-gray-400 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="text-right">
                <span
                  onClick={() => navigate("/forgotPassword")}
                  className="text-sm text-gray-500 hover:text-blue-600 cursor-pointer"
                >
                  Forgot Password?
                </span>
              </div>

              <button
                onClick={handleSubmit}
                type="button"
                className="w-full bg-violet-500 hover:bg-violet-600 text-white py-3 rounded-full font-medium transition-colors flex justify-center items-center"
                disabled={loading}
              >
                {loading ? (
                  <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                ) : (
                  "LOG IN"
                )}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  No Account yet?
                  <span
                    onClick={() => navigate("/signUp")}
                    className="text-blue-600 ml-1 font-medium cursor-pointer"
                  >
                    SIGN UP
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
