import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  Github,
  Linkedin,
  Twitter,
  MapPin,
  Calendar,
  Mail,
  Edit,
  ChevronRight,
  Pen,
  X,
  Globe,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  Clock,
  Clock3,
} from "lucide-react";
import { toast } from "sonner";
import { fetchProjectOfUser } from "../../apis/projectApi";
import Navbar from "../../components/user/navbar/navbar";
import Footer from "../../components/user/footer/Footer";
import { useNavigate } from "react-router-dom";

const AllProjects = () => {
  const [project, setProject] = useState([]);
  const navigate = useNavigate()

  const fetch = async () => {
    try {
      const response = await fetchProjectOfUser();
      if (!response.data.status) return toast.error(response.data.message);
      console.log(response.data.project.length);
      setProject(response.data.project);
      console.log(project);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  const getStatusConfig = (status) => {
    switch (status) {
      case "completed":
        return {
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          icon: <CheckCircle size={14} className="mr-1" />,
          borderColor: "border-green-500",
        };
      case "open":
        return {
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          icon: <AlertCircle size={14} className="mr-1" />,
          borderColor: "border-blue-500",
        };
      case "committed":
        return {
          bgColor: "bg-purple-100",
          textColor: "text-purple-800",
          icon: <Clock size={14} className="mr-1" />,
          borderColor: "border-purple-500",
        };
      case "cancelled":
        return {
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          icon: <XCircle size={14} className="mr-1" />,
          borderColor: "border-red-500",
        };
      default:
        return {
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          icon: null,
          borderColor: "border-gray-500",
        };
    }
  };
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  useEffect(() => {
    fetch();
  }, []);

  return (
    <div className="min-h-screenpt-8 w-full min-h-screen bg-gray-100 pt-8">
      <Navbar />
      <div className="flex flex-col lg:flex-row gap-4 mt-15 mb-15">
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-6 max-w-4xl mx-auto border border-blue-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <div className="w-2 h-8 bg-blue-500 rounded mr-3"></div>
              Projects
            </h2>
            <div className="bg-blue-100 text-blue-600 rounded-full px-4 py-1 text-sm font-medium">
              {project.length} Projects
            </div>
          </div>
          <div className="space-y-6">
            {project.map((project) => {
              const statusConfig = getStatusConfig(project.completionStatus);

              return (
                <div
                  key={project._id}
                  className={`bg-white rounded-lg p-5 shadow-md hover:shadow-lg transition-all cursor-pointer duration-300 transform hover:-translate-y-1`}
                  onClick={() =>
                    navigate(`/client/projectDetails?id=${project._id}`)
                  }
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {project.title}
                    </h3>
                    <div
                      className={`px-4 py-1 rounded-full text-sm font-medium flex items-center ${statusConfig.bgColor} ${statusConfig.textColor}`}
                    >
                      {statusConfig.icon}
                      {capitalizeFirstLetter(project.completionStatus)}
                    </div>
                  </div>

                  <p className="text-gray-600 mt-2">{project.description}</p>

                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex space-x-4">
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar size={14} className="mr-1" />
                        {
                          new Date(project.createdAt)
                            .toISOString()
                            .split("T")[0]
                        }
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock size={14} className="mr-1" />
                        {project.timeline} days
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AllProjects;
