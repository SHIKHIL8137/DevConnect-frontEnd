import { useState, useEffect } from "react";
import { Eye, EyeOff, Check, Clock } from "lucide-react";
import Navbar from "../../components/user/loginSignUp_Navbar/Navbar";
import loginImg from "../../assets/images/freepik__background__68429.png";
import { useNavigate } from "react-router-dom";
import {
  doPasswordsMatch,
  isValidEmail,
  isValidPassword,
  validateOTP,
} from "../../util/validation.js";
import {
  forgetPassword,
  validateOtp,
  validateUserChangPswd,
} from "../../apis/userApi";
import { toast } from "sonner";
const Forget = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState({
    gotp: false,
    verify: false,
    submit: false,
  });

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isOtpSent && !canResend) {
      setCanResend(true);
    }
  }, [countdown, isOtpSent, canResend]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSendOtp = async () => {
    if (isValidEmail(email)) {
      try {
        setLoading((val) => ({ ...val, gotp: true }));
        const response = await forgetPassword({ email: email });
        if (!response.data.status) {
          toast.error(response.data.message);
          return;
        }
        setIsOtpSent(true);
        setCountdown(30);
        setCanResend(false);
        toast.success(response.data.message);
      } catch (error) {
        if (
          (error.response && error.response.status === 409) ||
          error.response.status === 400
        ) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.response.data.message);
        }
      } finally {
        setLoading((val) => ({ ...val, gotp: false }));
      }
    } else {
      if (!isValidEmail(email)) {
        toast.error("Please enter valid mail");
      }
    }
  };

  const handleVerifyOtp = async () => {
    if (validateOTP(otp)) {
      try {
        setLoading((val) => ({ ...val, verify: true }));
        const response = await validateOtp({ otp, email });
        if (!response.data.status) return toast.error(response.data.message);
        toast.success(response.data.message);
        setIsOtpVerified(true);
        setCanResend(false);
        localStorage.setItem("otp", response.data.otp);
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        setLoading((val) => ({ ...val, verify: false }));
      }
    } else {
      toast.error("Please enter the OTP");
    }
  };

  const handleResetPassword = async () => {
    if (!isOtpVerified) {
      toast.error("Please verify your email with OTP first");
      return;
    }
    if (!isValidPassword(password)) {
      toast.error(
        "Password must be at least 8 characters long and include at least one letter and one number"
      );
      return;
    }
    if (!doPasswordsMatch(password, confirmPassword)) {
      toast.error("Passwords do not match");
      return;
    }

    const storedOtp = localStorage.getItem("otp");
    if (!storedOtp) return toast.error("otp expired");

    try {
      setLoading((val) => ({ ...val, submit: true }));
      const response = await validateUserChangPswd({
        email,
        otp: storedOtp,
        password,
      });

      if (!response.data.status) {
        toast.error(response.data.message);
        return;
      }

      setEmail("");
      setOtp("");
      setConfirmPassword("");
      setPassword("");
      setIsOtpSent(false);
      setIsOtpVerified(false);
      setCanResend(false);
      setCountdown(0);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading((val) => ({ ...val, submit: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white px-4 py-4">
      <Navbar />
      <div className="flex items-center justify-center w-full h-full mt-15">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 bg-blue-100 flex items-center justify-center p-8">
            <img src={loginImg} alt="login image" />
          </div>
          <div className="w-full md:w-1/2 py-8 px-6 md:px-12 flex flex-col justify-center">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                Forgot Password
              </h2>
              <p className="text-gray-500 mt-2">
                Enter your email to reset your password
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-b-2 border-gray-300 py-2 outline-none focus:border-blue-500 transition-colors"
                  placeholder="Email Address"
                  disabled={isOtpVerified}
                />
              </div>

              {!isOtpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full bg-violet-500 hover:bg-violet-600 text-white py-3 rounded-lg font-medium transition-colors cursor-pointer flex justify-center items-center"
                  disabled={!email || loading.gotp}
                >
                  {loading.gotp ? (
                    <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label htmlFor="otp" className="sr-only">
                        OTP
                      </label>
                      <input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full border-b-2 border-gray-300 py-2 outline-none focus:border-blue-500 transition-colors"
                        placeholder="Enter OTP"
                        disabled={isOtpVerified}
                        maxLength={6}
                      />
                    </div>
                    {!isOtpVerified ? (
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors cursor-pointer flex justify-center items-center"
                        disabled={loading.verify}
                      >
                        {loading.verify ? (
                          <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                        ) : (
                          "Verify"
                        )}
                      </button>
                    ) : (
                      <div className="bg-green-100 text-green-700 px-3 py-2 rounded-lg flex items-center">
                        <Check size={16} className="mr-1" /> Verified
                      </div>
                    )}
                  </div>
                  {!isOtpVerified && (
                    <div className="flex justify-center">
                      {canResend ? (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="text-blue-600 text-sm hover:underline"
                        >
                          Resend OTP
                        </button>
                      ) : (
                        <p className="text-gray-500 text-sm flex items-center">
                          <Clock size={14} className="mr-1" /> Resend OTP in{" "}
                          {countdown}s
                        </p>
                      )}
                    </div>
                  )}
                  {isOtpVerified && (
                    <div className="space-y-6">
                      <div className="relative">
                        <label htmlFor="password" className="sr-only">
                          New Password
                        </label>
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full border-b-2 border-gray-300 py-2 outline-none focus:border-blue-500 transition-colors pr-10"
                          placeholder="New Password"
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-2 top-2 text-gray-400"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>

                      <div className="relative">
                        <label htmlFor="confirmPassword" className="sr-only">
                          Confirm New Password
                        </label>
                        <input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full border-b-2 border-gray-300 py-2 outline-none focus:border-blue-500 transition-colors pr-10"
                          placeholder="Confirm New Password"
                        />
                        <button
                          type="button"
                          onClick={toggleConfirmPasswordVisibility}
                          className="absolute right-2 top-2 text-gray-400"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>

                      <button
                        onClick={handleResetPassword}
                        type="button"
                        className="w-full bg-violet-500 hover:bg-violet-600 text-white py-3 rounded-lg font-medium transition-colors cursor-pointer flex justify-center items-center"
                        disabled={loading.submit}
                      >
                        {loading.submit ? (
                          <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                        ) : (
                          " Reset Password"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="text-center pt-4">
                <p className="text-sm text-gray-500">
                  Remember your password?
                  <span
                    onClick={() => navigate("/logIn")}
                    className="text-blue-600 ml-1 font-medium cursor-pointer"
                  >
                    Log In
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

export default Forget;
