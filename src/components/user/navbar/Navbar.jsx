import React, { useState } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/slices/userSlice";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const path = location.pathname;

  const handleGoToProfile = () => {
    if (user?.role) {
      navigate(`/${user?.role}/profile`);
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="w-full py-4 px-8 bg-white shadow-sm md:rounded-full mx-auto max-w-7xl">
      <div className="flex items-center justify-between">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span className="text-blue-500 text-2xl font-bold">
            &lt; &gt; Dev
          </span>
          <span className="text-gray-400 text-2xl font-bold">Connect</span>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <p
            onClick={() => navigate("/")}
            className={`cursor-pointer ${
              path === "/" ? "text-blue-500" : "text-gray-600"
            } hover:text-blue-500`}
          >
            Home
          </p>

          {user?.role === "client" ? (
            <p
              onClick={() => navigate("/client/home")}
              className={`cursor-pointer ${
                path === "/client/home" ? "text-blue-500" : "text-gray-600"
              } hover:text-blue-500`}
            >
              Find Freelancers
            </p>
          ) : user?.role === "freelancer" ? (
            <p
              onClick={() => navigate("/freelancer/home")}
              className={`cursor-pointer ${
                path === "/freelancer/home" ? "text-blue-500" : "text-gray-600"
              } hover:text-blue-500`}
            >
              Find Project
            </p>
          ) : (
            <>
              <p
                onClick={() => navigate("/freelancer/home")}
                className={`cursor-pointer ${
                  path === "/freelancer/home"
                    ? "text-blue-500"
                    : "text-gray-600"
                } hover:text-blue-500`}
              >
                Find Freelancers
              </p>
              <p
                onClick={() => navigate("/client/home")}
                className={`cursor-pointer ${
                  path === "/client/home" ? "text-blue-500" : "text-gray-600"
                } hover:text-blue-500`}
              >
                Find Project
              </p>
            </>
          )}

          <p
            onClick={() => navigate("/about")}
            className={`cursor-pointer ${
              path === "/about" ? "text-blue-500" : "text-gray-600"
            } hover:text-blue-500`}
          >
            About Us
          </p>
          <p
            onClick={() => navigate("/contact")}
            className={`cursor-pointer ${
              path === "/contact" ? "text-blue-500" : "text-gray-600"
            } hover:text-blue-500`}
          >
            Contact Us
          </p>
        </nav>
        <div className="hidden md:flex items-center space-x-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-2 relative">
              <span className="text-gray-700">Hi, {user?.userName}</span>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setIsProfileMenuOpen(!isProfileMenuOpen);
                }}
                className="cursor-pointer"
              >
                {user?.profileImg ? (
                  <img
                    src={user.profileImg}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold border-2 border-blue-500">
                    {user?.userName?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </div>

              {isProfileMenuOpen && (
                <div className="absolute right-0 top-12 bg-white shadow-lg rounded-md py-2 w-40 z-10 border border-gray-200">
                  <button
                    onClick={handleGoToProfile}
                    className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <User size={16} />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full cursor-pointer text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-100 text-red-500"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-5 rounded-full transition duration-300 cursor-pointer"
              onClick={() => navigate("/logIn")}
            >
              Login <span>&#x2f;</span> SignUp
            </button>
          )}
        </div>
        <button
          className="md:hidden text-gray-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4">
          <nav className="flex flex-col space-y-4">
            <a href="#" className="text-gray-600 hover:text-blue-500">
              Home
            </a>
            {user?.role === "client" ? (
              <a href="#" className="text-gray-600 hover:text-blue-500">
                Find Freelancers
              </a>
            ) : user?.role === "freelancer" ? (
              <a href="#" className="text-gray-600 hover:text-blue-500">
                Find Project
              </a>
            ) : (
              <>
                <a href="#" className="text-gray-600 hover:text-blue-500 mr-4">
                  Find Freelancers
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-500">
                  Find Project
                </a>
              </>
            )}

            <a href="#" className="text-gray-600 hover:text-blue-500">
              About Us
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-600">
              Contact Us
            </a>
          </nav>
          <div className="flex flex-col mt-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">Hi, {user?.userName}</span>
                  {user?.profileImg ? (
                    <img
                      src={user.profileImg}
                      alt="Profile"
                      className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold border-2 border-blue-500">
                      {user?.userName?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>

                <div className="flex flex-col pl-2 pt-3 space-y-3">
                  <button
                    onClick={handleGoToProfile}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-500 cursor-pointer"
                  >
                    <User size={16} />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-red-500 hover:text-red-600 cursor-pointer"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-5 rounded-full transition duration-300 cursor-pointer"
                onClick={() => navigate("/logIn")}
              >
                Login <span>&#x2f;</span> SignUp
              </button>
            )}
          </div>
        </div>
      )}

      {isProfileMenuOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsProfileMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Navbar;
