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
} from "lucide-react";
import Footer from "../../components/user/footer/Footer";
import Navbar from "../../components/user/navbar/navbar";
import { ProfileSkeletonFreelancer } from "../../components/common/skeleton.jsx";

import { toast } from "sonner";

import dummy_profile_img from "../../assets/images/profile_dummy_img.png";
import { freelancerFetch } from "../../apis/userApi.js";

const FreelancerProfile = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await freelancerFetch(id);
      if (!response.data.status)
        return toast.error(response.data.message);
      setUser(response?.data?.user);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleResumeView = () => {
    if (!user?.resume) {
      toast.error("Resume not available");
      return;
    }
    window.open(user.resume, "_blank");
  };

  return (
    <div className="pt-8 w-full min-h-screen bg-gray-100 ">
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
            <div className="bg-white rounded-3xl shadow-md p-6 ">
              <h2 className="text-2xl font-bold mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {user?.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-gray-800">
                {user?.about ||
                  "Full stack developer with 6+ years of experience building responsive web applications. Passionate about clean code and user-centric design."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg text-gray-600 mb-4">
                  Completed Projects
                </h3>
                <p className="text-4xl font-bold text-green-600">
                  {user?.completedProjects || 0}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg text-gray-600 mb-4">Active Projects</h3>
                <p className="text-4xl font-bold text-blue-600">
                  {user?.activeProjects || 0}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-bold mb-6">Recent Projects</h3>

              {user?.committedProject && user?.committedProject.length > 0 ? (
                <div className="space-y-4">
                  {user?.committedProject.map((project, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                      <h4 className="font-bold text-lg">{project.title}</h4>
                      <p className="text-gray-600 text-sm">
                        {project.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center py-8">
                  <p className="text-gray-500">No projects</p>
                </div>
              )}

              <div className="mt-6 text-blue-500 flex items-center justify-end">
                <a href="#" className="flex items-center">
                  View all projects
                  <ChevronRight size={16} className="ml-1" />
                </a>
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
