import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Github,
  Twitter,
  Facebook,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { isValidEmail } from "../../util/validation";

import { toast } from "sonner";
import { loginValidate } from "../../apis/adminApi";
import { fetchAdminData } from "../../redux/thunk/adminThunk";
import { useDispatch } from "react-redux";

const DevConnectLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoding] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      toast.error("Invalid email ");
      return;
    }

    try {
      setLoding(true);
      const response = await loginValidate({ email, password });

      if (!response.data.status) {
        toast.error(response.data.message);
        return;
      }
      console.log(response.data);
       localStorage.setItem("accessToken", response.data.accessToken);
      const result = await dispatch(fetchAdminData());
      console.log(result);
      if (fetchAdminData.fulfilled.match(result)) {
        toast.success(response.data.message);
        navigate("/admin/dashboard");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoding(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-900 to-blue-800 text-white flex-col justify-between p-12">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Dev<span className="text-blue-300">Connect</span>
          </h1>
          <p className="text-blue-200 mb-8">Connecting developers worldwide</p>

          <div className="mt-16">
            <h2 className="text-4xl font-bold leading-tight mb-6">
              Welcome to the <br />
              Professional Network <br />
              for Developers
            </h2>
            <p className="text-blue-200 text-lg max-w-md">
              Join thousands of freelancers and clients on the platform built
              specifically for development professionals.
            </p>
          </div>
        </div>

        <div>
          <div className="flex space-x-6 mb-8">
            <a
              href="#"
              className="p-2 bg-blue-800/30 rounded-full hover:bg-blue-700/50 transition-colors"
            >
              <Github size={20} />
            </a>
            <a
              href="#"
              className="p-2 bg-blue-800/30 rounded-full hover:bg-blue-700/50 transition-colors"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              className="p-2 bg-blue-800/30 rounded-full hover:bg-blue-700/50 transition-colors"
            >
              <Facebook size={20} />
            </a>
          </div>

          <p className="text-blue-200 text-sm">
            © 2025 DevConnect. All rights reserved.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="md:hidden text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">
              Dev<span className="text-blue-600">Connect</span>
            </h1>
            <p className="text-gray-500">Connecting developers worldwide</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
              <p className="text-gray-500 mt-2">
                Welcome back! Please enter your details
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  {/* <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </a> */}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff
                        size={18}
                        className="text-gray-400 hover:text-gray-600"
                      />
                    ) : (
                      <Eye
                        size={18}
                        className="text-gray-400 hover:text-gray-600"
                      />
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-3 cursor-pointer px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevConnectLogin;
