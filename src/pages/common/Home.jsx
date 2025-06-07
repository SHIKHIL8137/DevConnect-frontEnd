import React, { useState } from "react";
import Footer from "../../components/user/footer/Footer";
import Navbar from "../../components/user/navbar/navbar";
import homeImag from "../../assets/images/pngegg (97).png";
import workingImg from "../../assets/images/Working remotely.png";
import {
  Lock,
  FileSearch,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import RecentlyPostedWorks from "../../components/common/HomeProjectCard";
import PortfolioSlider from "../../components/common/HomeFreelancerCard";

const Home = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate();
  const portfolios = [
    {
      id: 1,
      name: "Bunny.design",
      role: "UI/UX Designer",
      image: "/api/placeholder/400/400",
    },
    {
      id: 2,
      name: "Bhaskar Tiwari",
      role: "Full stack developer",
      image: "/api/placeholder/400/400",
    },
    {
      id: 3,
      name: "Aksara Joshi",
      role: "Mern stack developer",
      image: "/api/placeholder/400/400",
    },
  ];

  const goToSlide = (index) => {
    setActiveSlide(index);
  };

  return (
    <>
      <section className="bg-blue-50 min-h-screen flex-row items-center md:pt-4">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
              Are you looking for Freelancers?
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Hire Great Freelancers, Fast. Spacelance helps you hire elite
              freelancers at a moment's notice
            </p>
            <button
              onClick={() => navigate("/client/home")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-md transition duration-300 cursor-pointer"
            >
              Hire a freelancer
            </button>
          </div>

          <div className="md:w-1/2 relative">
            <img src={workingImg} alt="" />
          </div>
        </div>
      </section>
      <section className="w-full py-12 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                <Lock className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Create Account
              </h3>
              <p className="text-gray-500">
                First you have to create a account here
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                <FileSearch className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Search work
              </h3>
              <p className="text-gray-500">
                Search the best freelance work here
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                <RefreshCw className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Save and apply
              </h3>
              <p className="text-gray-500">Apply or save and start your work</p>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full px-12 py-12 md:py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-1/2 relative mb-10 md:mb-0">
              <div className="relative">
                <img
                  src={homeImag}
                  alt="Professional woman in blue suit"
                  className="mx-auto md:mx-0 max-w-full h-auto"
                />

                <div className="absolute top-16 right-0 md:right-50 bg-white p-4 rounded-lg shadow-md">
                  <div className="text-blue-500 text-3xl font-bold">500+</div>
                  <div className="text-gray-400">freelancers</div>
                </div>

                <div className="absolute bottom-60 text-center right-0 md:right-10 bg-white p-4 rounded-lg shadow-md">
                  <div className="text-blue-500 text-3xl font-bold">300+</div>
                  <div className="text-gray-400">freelance work Posted</div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 md:pl-8 flex justify-end">
              <div className="text-right">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                  <span className="text-gray-800">Find The Best</span>
                  <br />
                  <span className="text-blue-500">Freelancers</span>
                  <span className="text-gray-800"> Here</span>
                </h1>

                <p className="text-gray-500 text-lg mb-8 max-w-lg">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                  erat bibendum ornare urna, cursus eget convallis. Feugiat
                  imperdiet posuere justo, ultrices interdum sed orci nunc,
                  mattis. Ipsum viverra viverra neque adipiscing arcu, quam
                  dictum. Dui mi viverra dui, sit accumsan, tincidunt massa. Dui
                  cras magnis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full px-12 py-12 md:py-16 bg-white">
        <RecentlyPostedWorks/>
      </section>
      <section className="py-16 bg-gray-50">
        <PortfolioSlider/>
      </section>
      <Footer />
    </>
  );
};

export default Home;
