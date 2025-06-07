import { useCallback, useEffect, useState } from "react";
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
  AlertCircle,
  Clock,
  XCircle,
  CheckCircle,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import Cropper from "react-easy-crop";
import Footer from "../../components/user/footer/Footer";
import Navbar from "../../components/user/navbar/navbar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { changePassword, ProfileImgUpdate } from "../../apis/userApi";
import { fetchUserData } from "../../redux/thunk/userThunk";
import dummy_profile_img from "../../assets/images/profile_dummy_img.png";
import { fetchProjectsByIds, projectCount } from "../../apis/projectApi";

function chunkArray(array, size) {
  const chunkedArr = [];
  for (let i = 0; i < array.length; i += size) {
    chunkedArr.push(array.slice(i, i + size));
  }
  return chunkedArr;
}

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState("");
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState({ crop: false, password: false });
  const [project, setProjects] = useState([]);
  const navigate = useNavigate();
  const [completedProject, setCompletedProject] = useState(0);
  const [activeProject, setActiveProject] = useState(0);
  
  // Password change state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordErrors, setPasswordErrors] = useState({});

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
    fetchProjects();
    Count();
  }, []);

  const handleImageSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        toast.error("Only JPG and PNG files are allowed");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = async () => {
    try {
      const canvas = document.createElement("canvas");
      const imageObj = new Image();
      imageObj.src = image;

      imageObj.onload = () => {
        const scaleX = imageObj.naturalWidth / imageObj.width;
        const scaleY = imageObj.naturalHeight / imageObj.height;
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          imageObj,
          croppedAreaPixels.x * scaleX,
          croppedAreaPixels.y * scaleY,
          croppedAreaPixels.width * scaleX,
          croppedAreaPixels.height * scaleY,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );

        canvas.toBlob(async (blob) => {
          const formData = new FormData();
          formData.append("croppedImage", blob, "cropped.jpg");

          try {
            setLoading((val) => ({ ...val, crop: true }));
            const response = await ProfileImgUpdate(formData, "cover");
            if (!response.data.status)
              return toast.error(response.data.message);
            const result = await dispatch(fetchUserData());

            if (fetchUserData.fulfilled.match(result)) {
              setShowCropper(false);
              toast.success(response.data.message);
            }
          } catch (error) {
            console.log(error);
            toast.error(
              error.response?.data?.message || "Something went wrong"
            );
          } finally {
            setLoading((val) => ({ ...val, crop: false }));
          }
        }, "image/jpeg");
      };
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };


  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validatePassword = () => {
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    if (passwordData.currentPassword === passwordData.newPassword) {
      errors.newPassword = "New password must be different from current password";
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }
    
    try {
      setLoading(prev => ({ ...prev, password: true }));
      
      const response = await changePassword({
        oldPassword: passwordData.currentPassword,
        password: passwordData.newPassword,
        email:user.email
      });
      
      
      toast.success(response.data.message);
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setPasswordErrors({});
      
    } catch (error) {
      console.error("Password change error:", error);
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(prev => ({ ...prev, password: false }));
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setPasswordErrors({});
    setShowPasswords({
      current: false,
      new: false,
      confirm: false
    });
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
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

  useEffect(() => {
    setCroppedImage(user.profileCoverImg);
  }, [createCroppedImage]);

  return (
    <div className="pt-8 w-full min-h-screen bg-gradient-to-br from-sky-50 to-white">
      <Navbar />
      <div className="flex flex-col lg:flex-row gap-4 mt-15 p-4">
        <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-md p-6 flex flex-col h-fit">
          <div className="relative mb-16">
            <img
              src={croppedImage || null}
              className="w-full h-40 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg overflow-hidden object-cover relative"
            />

            <div className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg cursor-pointer">
              <label htmlFor="profile-image" className="cursor-pointer">
                <Pen size={15} className="text-blue-500" />
              </label>
              <input
                type="file"
                id="profile-image"
                accept="image/jpeg, image/png"
                className="hidden"
                onChange={handleImageSelect}
              />
            </div>

            <div className="absolute -bottom-12 left-6 w-24 h-24 rounded-full border-4 border-white overflow-hidden">
              <img
                src={user?.profileImage || dummy_profile_img}
                className="w-full h-full bg-gray-300 rounded-full"
              />
            </div>
            
            {/* Image Cropper Modal */}
            {showCropper && (
              <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg max-w-xl w-full p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Crop Image</h3>
                    <button
                      onClick={() => {
                        setShowCropper(false);
                        setImage(null);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="relative h-60 w-full mb-6">
                    <Cropper
                      image={image}
                      crop={crop}
                      zoom={zoom}
                      aspect={16 / 9}
                      cropShape="rect"
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="zoom"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Zoom: {zoom.toFixed(1)}x
                    </label>
                    <input
                      type="range"
                      id="zoom"
                      min={1}
                      max={3}
                      step={0.1}
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCropper(false);
                        setImage(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={createCroppedImage}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer flex justify-center items-center"
                      disabled={loading.crop}
                    >
                      {loading.crop ? (
                        <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                      ) : (
                        "Apply"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="absolute -bottom-4 right-4">
              <button className="bg-blue-500 text-white p-2 rounded-full">
                <Wallet size={20} />
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold">{user?.userName}</h2>
            <p className="text-gray-600">{user?.position}</p>
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

          <div className="flex space-x-3 mb-6">
            {user?.linkedIn && (
              <a
                href={user.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 rounded-full"
              >
                <Linkedin size={20} />
              </a>
            )}
            {user?.gitHub && (
              <a
                href={user.gitHub}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 rounded-full"
              >
                <Github size={20} />
              </a>
            )}
            {user?.twitter && (
              <a
                href={user.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 rounded-full"
              >
                <Twitter size={20} />
              </a>
            )}
            {user?.web && (
              <a
                href={user.web}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 rounded-full"
              >
                <Globe size={20} />
              </a>
            )}
          </div>

          <button className="w-full bg-blue-500 text-white font-medium cursor-pointer rounded-lg py-3 mb-4">
            Message
          </button>
          <button
            onClick={() => navigate("/freelancer/profileUpdate")}
            className="w-full cursor-pointer bg-gray-100 text-gray-700 font-medium rounded-lg py-3 mb-4 flex items-center justify-center"
          >
            <Edit size={18} className="mr-2" /> Edit Profile
          </button>
          {!user?.googleId && (
            <button 
              onClick={() => setShowPasswordModal(true)}
              className="w-full cursor-pointer bg-gray-100 text-gray-700 font-medium rounded-lg py-3 mb-4 flex items-center justify-center"
            >
              <Lock size={18} className="mr-2" /> Change Password
            </button>
          )}
          <button onClick={() => navigate('/freelancer/complaints')} className="w-full bg-gray-100 cursor-pointer text-gray-700 font-medium rounded-lg py-3">
            Complaints
          </button>
        </div>

        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg text-gray-600 mb-4">Completed Projects</h3>
              <p className="text-4xl font-bold text-green-600">{completedProject}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg text-gray-600 mb-4">Active Projects</h3>
              <p className="text-4xl font-bold text-blue-600">{activeProject}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-bold mb-6">About</h3>
            <p className="text-gray-600">{user?.about || "No description provided."}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-bold mb-6">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {user?.skills?.length > 0 ? (
                user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-600">No skills listed.</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-bold mb-6">Languages</h3>
            {user?.languages?.length > 0 ? (
              <div className="space-y-4">
                {user.languages.map((language, index) => (
                  <div key={index} className="flex justify-between items-center">
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

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-bold mb-6">Education</h3>
            {user?.education?.length > 0 ? (
              <div className="space-y-4">
                {user.education.map((edu, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <h4 className="text-lg font-semibold">{edu.degree}</h4>
                    <p className="text-gray-600">{edu.institution}</p>
                    {edu.field && <p className="text-gray-500">{edu.field}</p>}
                    <p className="text-gray-500">{edu.year}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No education listed.</p>
            )}
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
                const statusConfig = getStatusConfig(project.completionStatus);

                return (
                  <div
                    key={project._id}
                    className={`bg-white rounded-lg p-5 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1`}
                    onClick={() =>
                      navigate(`/freelancer/projectDetail/${project._id}`)
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

            <div className="mt-8 flex justify-center">
              <p
                className="group flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                onClick={() => navigate("/freelancer/allProjects")}
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

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center">
                <Lock size={20} className="mr-2" />
                Change Password
              </h3>
              <button
                onClick={closePasswordModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 ${
                      passwordErrors.currentPassword ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword}</p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 ${
                      passwordErrors.newPassword ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 ${
                      passwordErrors.confirmPassword ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword}</p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Password requirements:</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li className={`flex items-center ${passwordData.newPassword.length >= 6 ? 'text-green-600' : ''}`}>
                    <div className={`w-1.5 h-1.5 rounded-full mr-2 ${passwordData.newPassword.length >= 6 ? 'bg-green-600' : 'bg-gray-400'}`}></div>
                    At least 6 characters
                  </li>
                  <li>• Different from current password</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading.password}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
                >
                  {loading.password ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                      Changing...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer/>
    </div>
  );
};

export default Profile;