import React, { useEffect, useState } from "react";
import { Calendar, ChevronRight, Clock, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { freelancerFetch } from "../../apis/userApi";
import Navbar from "../../components/user/navbar/navbar";
import Footer from "../../components/user/footer/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { ProjectSkeleton } from "../../components/common/skeleton";
import { fetchProjectsByIds } from "../../apis/projectApi";

function chunkArray(array, size) {
  if (!array) return [];
  const chunkedArr = [];
  for (let i = 0; i < array.length; i += size) {
    chunkedArr.push(array.slice(i, i + size));
  }
  return chunkedArr;
}

const AllProjects = () => {
  const [project, setProject] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  const fetchUser = async () => {
    try {
      setLoading(true);
      if (!id) {
        toast.error("User ID is missing");
        return;
      }
      const response = await freelancerFetch(id);
      if (!response.data.status) {
        toast.error(response.data.message);
        return;
      }
      setUser(response.data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch user data");
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      if (!user?.projects?.length) {
        setProject([]);
        return;
      }
      const chunks = chunkArray(user.projects, 20);
      const allProjects = [];

      for (const chunk of chunks) {
        const response = await fetchProjectsByIds(chunk);
        const data = response.data;
        allProjects.push(...data);
      }
      setProject(allProjects);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      toast.error("Failed to fetch projects");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  useEffect(() => {
    if (user._id) {
      fetchProjects();
    }
  }, [user]);

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

  return (
    <div className="min-h-screen pt-8 w-full bg-gradient-to-br from-sky-50 to-white">
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
          {loading ? (
            <ProjectSkeleton />
          ) : project.length > 0 ? (
            <div className="space-y-6">
              {project.map((project) => {
                const statusConfig = getStatusConfig(project.completionStatus);

                return (
                  <div
                    key={project._id}
                    className={`bg-white rounded-lg p-5 shadow-md hover:shadow-lg transition-all cursor-pointer duration-300 transform hover:-translate-y-1`}
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
                          {new Date(project.createdAt).toISOString().split("T")[0]}
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
          ) : (
            <p className="text-gray-600 text-center">No projects found.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AllProjects;