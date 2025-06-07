import { useEffect, useState } from "react";
import {
  Pen,
  Github,
  Linkedin,
  Twitter,
  MapPin,
  Calendar,
  Mail,
  Edit,
  ChevronRight,
  MessageCircle,
  Wallet,
  X,
  Globe,
  FileText,
  Download,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle,
} from "lucide-react";
import Footer from "../../components/user/footer/Footer";
import Navbar from "../../components/user/navbar/navbar";
import { ProfileSkeletonFreelancer } from "../../components/common/skeleton.jsx";
import { toast } from "sonner";
import dummy_profile_img from "../../assets/images/profile_dummy_img.png";
import { freelancerFetch } from "../../apis/userApi.js";
import { fetchProjectsByIds, projectCount } from "../../apis/projectApi.js";
import { useNavigate } from "react-router-dom";

function chunkArray(array, size) {
  const chunkedArr = [];
  for (let i = 0; i < array.length; i += size) {
    chunkedArr.push(array.slice(i, i + size));
  }
  return chunkedArr;
}

const FreelancerProfile = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const [project, setProjects] = useState([]);
  const [completedProject, setCompletedProject] = useState(0);
  const [activeProject, setActiveProject] = useState(0);
  const navigate = useNavigate()

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await freelancerFetch(id);
      if (!response.data.status) return toast.error(response.data.message);
      setUser(response?.data?.user);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchProjects = async () => {
    try {
      const chunks = chunkArray(user.projects, 20);
      const allProjects = [];

      for (const chunk of chunks) {
        const response = await fetchProjectsByIds(chunk);
        const data = response.data;
        allProjects.push(...data);
      }
      setProjects(allProjects);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  const Count = async () => {
    try {
      const response = await projectCount(user._id);
      if (!response.status) {
        toast.error("error to fetch the count");
        return;
      }

      setCompletedProject(response.data.completedCount);
      setActiveProject(response.data.activeCount);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
useEffect(() => {
    if (user._id) {
      fetchProjects();
      Count();
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
  const handleResumeView = () => {
    if (!user?.resume) {
      toast.error("Resume not available");
      return;
    }
    window.open(user.resume, "_blank");
  };

  return (
    <div className="pt-8 w-full min-h-screen bg-gradient-to-br from-sky-50 to-white">
      <Navbar />
      {loading ? (
        <ProfileSkeletonFreelancer />
      ) : (
        <div className="flex flex-col lg:flex-row gap-4 mt-15 p-4">
          <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-md p-6 flex flex-col h-fit">
            <div className="relative mb-16">
              <div className="w-full h-40 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg overflow-hidden object-cover" />
              <div className="absolute -bottom-12 left-6 w-24 h-24 rounded-full border-4 border-white overflow-hidden">
                <img
                  src={user?.profileImage || dummy_profile_img}
                  className="w-full h-full bg-gray-300 rounded-full"
                  alt="Profile"
                />
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">{user?.userName}</h2>
              <p className="text-gray-600">{user?.position}</p>
              {user?.experienceLevel && (
                <span className="inline-block mt-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full capitalize">
                  {user.experienceLevel}
                </span>
              )}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-600">
                <MapPin size={16} className="mr-2" />
                <span>{user?.address}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar size={16} className="mr-2" />
                <span>
                  Member since{" "}
                  {new Date(user?.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <Mail size={16} className="mr-2" />
                <span>{user?.email}</span>
              </div>
            </div>

            {user?.resume && (
              <div className="mb-6 bg-blue-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <FileText size={18} className="text-blue-600 mr-2" />
                  <h3 className="font-medium text-blue-800">Resume</h3>
                </div>

                <div className="flex space-x-2 mt-3">
                  <button
                    onClick={handleResumeView}
                    className="flex items-center justify-center bg-blue-600 text-white rounded-md px-3 py-2 text-sm hover:bg-blue-700 transition-colors flex-1"
                  >
                    <ExternalLink size={16} className="mr-1" />
                    View
                  </button>
                </div>
              </div>
            )}

            <div className="flex space-x-3 mb-6">
              {user?.linkedIn && (
                <a
                  href={user.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors"
                >
                  <Linkedin size={20} />
                </a>
              )}
              {user?.gitHub && (
                <a
                  href={user.gitHub}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Github size={20} />
                </a>
              )}
              {user?.twitter && (
                <a
                  href={user.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors"
                >
                  <Twitter size={20} />
                </a>
              )}
              {user?.web && (
                <a
                  href={user.web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-100 rounded-full hover:bg-green-100 transition-colors"
                >
                  <Globe size={20} />
                </a>
              )}
            </div>

            <button className="w-full bg-blue-500 text-white font-medium cursor-pointer rounded-lg py-3 mb-4 hover:bg-blue-600 transition-colors flex items-center justify-center">
              <MessageCircle size={18} className="mr-2" />
              Message
            </button>
          </div>

          <div className="w-full lg:w-2/3 flex flex-col gap-4">
            <div className="bg-white rounded-3xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {user?.skills?.length > 0 ? (
                  user.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-600">No skills listed.</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-gray-800">
                {user?.about || "No description provided."}
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Languages</h2>
              {user?.languages?.length > 0 ? (
                <div className="space-y-4">
                  {user.languages.map((language, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-600">{language.name}</span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                        {language.proficiency}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No languages listed.</p>
              )}
            </div>

            <div className="bg-white rounded-3xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Education</h2>
              {user?.education?.length > 0 ? (
                <div className="space-y-4">
                  {user.education.map((edu, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 pb-4 last:border-b-0"
                    >
                      <h4 className="text-lg font-semibold">{edu.degree}</h4>
                      <p className="text-gray-600">{edu.institution}</p>
                      {edu.field && (
                        <p className="text-gray-500">{edu.field}</p>
                      )}
                      <p className="text-gray-500">{edu.year}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No education listed.</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg text-gray-600 mb-4">
                  Completed Projects
                </h3>
                <p className="text-4xl font-bold text-green-600">
                  {completedProject || 0}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg text-gray-600 mb-4">Active Projects</h3>
                <p className="text-4xl font-bold text-blue-600">
                  {activeProject || 0}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-6  border border-blue-100">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <div className="w-2 h-8 bg-blue-500 rounded mr-3"></div>
                  Recent Projects
                </h2>
                <div className="bg-blue-100 text-blue-600 rounded-full px-4 py-1 text-sm font-medium">
                  {project.length} Projects
                </div>
              </div>
              <div className="space-y-6">
                {project.slice(0, 5).map((project) => {
                  const statusConfig = getStatusConfig(
                    project.completionStatus
                  );

                  return (
                    <div
                      key={project._id}
                      className={`bg-white rounded-lg p-5 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1`}
              
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

                      <p className="text-gray-600 mt-2">
                        {project.description}
                      </p>

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

              <div className="mt-8 flex justify-center">
                <p
                  className="group flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                  onClick={() => navigate(`/client/freelancer-projects/${user._id}`)}
                >
                  View all projects
                  <ChevronRight
                    size={18}
                    className="ml-1 group-hover:ml-2 transition-all duration-300"
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default FreelancerProfile;
