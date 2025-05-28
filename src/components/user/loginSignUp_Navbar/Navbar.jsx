import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <header className="w-full py-4 px-8 bg-white shadow-sm rounded-full mx-auto max-w-7xl">
      <div className="flex items-center justify-center">
        <div
          className="flex items-center cursor-pointer "
          onClick={() => navigate("/")}
        >
          <span className="text-blue-500 text-2xl font-bold">
            &lt; &gt; Dev
          </span>
          <span className="text-gray-400 text-2xl font-bold">Connect</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
