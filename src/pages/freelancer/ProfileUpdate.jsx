import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Cropper from "react-easy-crop";
import {
  validateProfileForm,
  formatProfileData,
} from "../../util/formValidate";
import {
  Camera,
  FileUp,
  X,
  RefreshCw,
  FileText,
  Upload,
  Check,
} from "lucide-react";
import {
  ProfileImgUpdate,
  removeResume,
  updateProfile,
  uploadResume,
} from "../../apis/userApi";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../../redux/thunk/userThunk";
import Navbar from "../../components/user/navbar/navbar";
import Footer from "../../components/user/footer/Footer";
import dummy_profile_img from "../../assets/images/profile_dummy_img.png";

const ProfileUpdate = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    position: "",
    phoneNumber: "",
    skills: "",
    about: "",
    pricePerHour: "",
    gitHub: "",
    linkedIn: "",
    twitter: "",
    web: "",
    address: "",
    experienceLevel: "",
    languages: [{ name: "", proficiency: "" }],
    education: [{ degree: "", institution: "", field: "", year: "" }],
  });

  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState("");
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState({
    crop: false,
    update: false,
    resume: false,
  });
  const [resume, setResume] = useState(null);
  const [resumeFileName, setResumeFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        userName: user?.userName || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        position: user?.position || "",
        skills: Array.isArray(user?.skills)
          ? user?.skills.join(", ")
          : user?.skills || "",
        about: user?.about || "",
        pricePerHour: user?.pricePerHour || "",
        gitHub: user?.gitHub || "",
        linkedIn: user?.linkedIn || "",
        twitter: user?.twitter || "",
        web: user?.web || "",
        address: user?.address || "",
        experienceLevel: user?.experienceLevel || "",
        languages:
          user?.languages?.length > 0
            ? user.languages
            : [{ name: "", proficiency: "" }],
        education:
          user?.education?.length > 0
            ? user.education
            : [{ degree: "", institution: "", field: "", year: "" }],
      });

      if (user.profileImage) {
        setCroppedImage(user.profileImage);
      }
      if (user.resume) {
        setResumeFileName("resume");
        setResume(user.resume);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

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
            const response = await ProfileImgUpdate(formData, "profile");
            if (!response.data.status)
              return toast.error(response.data.message);
            const result = await dispatch(fetchUserData());

            if (fetchUserData.fulfilled.match(result)) {
              setShowCropper(false);
              toast.success(response.data.message);
            }
          } catch (error) {
            console.error(error);
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

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!validTypes.includes(file.type)) {
        toast.error("Only PDF and DOC/DOCX files are allowed");
        return;
      }

      setResume(file);
      setResumeFileName(file.name);
      handleResumeUpload(file);
    }
  };

  const handleRemoveFile = async () => {
    try {
      const response = await removeResume();
      if (!response.data.status) return toast.error(response.data.message);
      setResume(null);
      setResumeFileName("");
      setUploadSuccess(false);
      toast.success(response.data.message);
      const result = await dispatch(fetchUserData());
      if (fetchUserData.fulfilled.match(result)) {
        if (response.data.resumeFileName) {
          setResumeFileName(response.data.resumeFileName);
        }
      }
    } catch (error) {
      console.error("Error deleteing resume:", error);
      toast.error(error.response?.data?.message || "Failed to deleting resume");
    }
  };

  const handleResumeSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      const maxSizeInBytes = 5 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        toast.error("Only PDF and DOC/DOCX files are allowed");
        return;
      }

      if (file.size > maxSizeInBytes) {
        toast.error("File size must be less than 5MB");
        return;
      }
      const previousResume = resume;
      const previousFileName = resumeFileName;

      setResume(file);
      setResumeFileName(file.name);

      handleResumeUpload(file, previousResume, previousFileName);

      if (errors.resume) {
        setErrors((prev) => ({
          ...prev,
          resume: null,
        }));
      }
    }
  };

  const handleResumeUpload = async (file) => {
    try {
      const resumeFormData = new FormData();
      resumeFormData.append("resume", file);

      setLoading((val) => ({ ...val, resume: true }));
      const response = await uploadResume(resumeFormData);

      if (!response.data.status) {
        setResume(previousResume);
        setResumeFileName(previousFileName);
        return toast.error(response.data.message);
      }

      setUploadSuccess(true);
      const resumeFileName = response.data.files;
      const profileUpdateResponse = await updateProfile({
        resume: resumeFileName,
      });

      if (!profileUpdateResponse.data.status) {
        toast.error("Failed to update profile with new resume");
      } else {
        toast.success("Profile updated with resume");
      }

      const result = await dispatch(fetchUserData());
      if (fetchUserData.fulfilled.match(result)) {
        if (resumeFileName) {
          setResumeFileName(resumeFileName);
        }
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error(error.response?.data?.message || "Failed to upload resume");
    } finally {
      setLoading((val) => ({ ...val, resume: false }));
    }
  };

  const handleSubmit = async () => {
    const { errors, isValid } = validateProfileForm(formData);
    if (!isValid) {
      setErrors(errors);
      const firstError = Object.keys(errors)[0];
      const errorElement = document.getElementById(firstError);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    const formattedData = formatProfileData(formData);

    try {
      setLoading((val) => ({ ...val, update: true }));
      const response = await updateProfile(formattedData);
      if (!response.data.status) return toast.error(response.data.message);

      const result = await dispatch(fetchUserData());

      if (fetchUserData.fulfilled.match(result)) {
        toast.success(response.data.message);
        navigate("/freelancer/profile");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading((val) => ({ ...val, update: false }));
    }
  };

  const handleLanguageChange = (index, field, value) => {
    setFormData((prevData) => {
      const newLanguages = [...prevData.languages];
      newLanguages[index] = { ...newLanguages[index], [field]: value };
      return { ...prevData, languages: newLanguages };
    });

    if (errors.languages) {
      setErrors((prev) => ({ ...prev, languages: null }));
    }
  };

  const addLanguage = () => {
    setFormData((prevData) => ({
      ...prevData,
      languages: [...prevData.languages, { name: "", proficiency: "" }],
    }));
  };

  const removeLanguage = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      languages: prevData.languages.filter((_, i) => i !== index),
    }));
  };

  const handleEducationChange = (index, field, value) => {
    setFormData((prevData) => {
      const newEducation = [...prevData.education];
      newEducation[index] = { ...newEducation[index], [field]: value };
      return { ...prevData, education: newEducation };
    });

    if (errors.education) {
      setErrors((prev) => ({ ...prev, education: null }));
    }
  };

  const addEducation = () => {
    setFormData((prevData) => ({
      ...prevData,
      education: [
        ...prevData.education,
        { degree: "", institution: "", field: "", year: "" },
      ],
    }));
  };

  const removeEducation = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      education: prevData.education.filter((_, i) => i !== index),
    }));
  };

  const availabilityOptions = [
    { value: "Available", label: "Available" },
    { value: "Partially Available", label: "Partially Available" },
    { value: "Unavailable", label: "Unavailable" },
  ];

  const proficiencyOptions = [
    { value: "", label: "Select Proficiency" },
    { value: "Beginner", label: "Beginner" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Fluent", label: "Fluent" },
    { value: "Native", label: "Native" },
  ];

  const experienceLevels = [
    { value: "", label: "Select Experience Level" },
    { value: "entry", label: "Entry Level (0-2 years)" },
    { value: "intermediate", label: "Intermediate (2-5 years)" },
    { value: "expert", label: "Expert (5+ years)" },
  ];
  return (
    <div className="pt-8 w-full min-h-screen bg-gradient-to-br from-sky-50 to-white">
      <Navbar />
      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg my-10">
        <h1 className="text-2xl font-bold text-center mb-8">Profile Update</h1>

        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-4 border-blue-100 shadow-md">
              {croppedImage ? (
                <img
                  src={croppedImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={dummy_profile_img}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <label
              htmlFor="profile-image"
              className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 cursor-pointer"
            >
              <Camera size={16} />
              <input
                type="file"
                id="profile-image"
                accept="image/jpeg, image/png"
                className="hidden"
                onChange={handleImageSelect}
              />
            </label>
          </div>
        </div>
        <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Resume</h2>
          <p className="text-gray-500 mb-4 text-sm">
            Upload your resume to help employers learn about your experience
          </p>

          <div
            className={`relative w-full p-6 border-2 border-dashed rounded-lg transition-all duration-300 ${
              dragActive
                ? "border-blue-400 bg-blue-50"
                : resumeFileName
                ? "border-green-200 bg-green-50"
                : "border-gray-200 bg-gray-50"
            } flex flex-col items-center justify-center min-h-40`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {loading.resume ? (
              <div className="flex flex-col items-center justify-center py-4">
                <RefreshCw
                  size={36}
                  className="text-blue-500 animate-spin mb-3"
                />
                <p className="text-gray-600 font-medium">Processing file...</p>
              </div>
            ) : resumeFileName ? (
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-lg p-3 mr-3">
                      <FileText size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 truncate max-w-xs">
                        {resumeFileName}
                      </p>
                      <p className="text-xs text-gray-500">Added</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <a
                      href={resume}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                      title="Download"
                    >
                      <FileUp size={18} />
                    </a>
                    <button
                      onClick={handleRemoveFile}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                      title="Remove"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
                <div className="w-full h-1 bg-gray-200 rounded-full">
                  <div className="h-1 bg-green-500 rounded-full w-full"></div>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-blue-100 rounded-full p-4 mb-4">
                  <Upload size={28} className="text-blue-600" />
                </div>
                <p className="text-gray-700 font-medium mb-2">
                  Drag and drop your resume here
                </p>
                <p className="text-gray-500 text-sm mb-4">or</p>
                <label
                  htmlFor="resume-file"
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer font-medium transition-colors flex items-center"
                >
                  Browse Files
                </label>
                <input
                  type="file"
                  id="resume-file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleResumeSelect}
                />
                <p className="mt-4 text-xs text-gray-500">
                  Accepted formats: PDF, DOC, DOCX (Max 5MB)
                </p>
              </>
            )}

            {dragActive && (
              <div className="absolute inset-0 bg-blue-50 bg-opacity-80 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <Upload size={40} className="text-blue-500 mx-auto mb-2" />
                  <p className="text-blue-700 font-medium">
                    Drop your file here
                  </p>
                </div>
              </div>
            )}
          </div>

          {errors.resume && (
            <p className="mt-2 text-sm text-red-500 flex items-center">
              <X size={16} className="mr-1" />
              {errors.resume}
            </p>
          )}

          {uploadSuccess && (
            <p className="mt-2 text-sm text-green-600 flex items-center">
              <Check size={16} className="mr-1" />
              Resume uploaded successfully!
            </p>
          )}
        </div>

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
                  type="button"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="relative h-60 w-full mb-6">
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
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

        <div className="space-y-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <div>
                <label
                  htmlFor="userName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name:<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  value={formData?.userName || ""}
                  onChange={handleChange}
                  className={`w-full p-3 bg-gray-50 border ${
                    errors.userName ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                  placeholder="Enter your full name"
                  disabled
                />
                {errors.userName && (
                  <p className="mt-1 text-sm text-red-500">{errors.userName}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="position"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Position:<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData?.position || ""}
                  onChange={handleChange}
                  className={`w-full p-3 bg-gray-50 border ${
                    errors.position ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                  placeholder="Enter your Position"
                />
                {errors.position && (
                  <p className="mt-1 text-sm text-red-500">{errors.position}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="experienceLevel"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Experience Level: <span className="text-red-500">*</span>
                </label>
                <select
                  id="experienceLevel"
                  name="experienceLevel"
                  value={formData?.experienceLevel || ""}
                  onChange={handleChange}
                  className={`w-full p-3 bg-gray-50 border ${
                    errors.experienceLevel
                      ? "border-red-500"
                      : "border-gray-200"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                >
                  {experienceLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
                {errors.experienceLevel && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.experienceLevel}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email:<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData?.email || ""}
                  onChange={handleChange}
                  className={`w-full p-3 bg-gray-50 border ${
                    errors.email ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                  placeholder="your@email.com"
                  disabled
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone:<span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData?.phoneNumber || ""}
                  onChange={handleChange}
                  className={`w-full p-3 bg-gray-50 border ${
                    errors.phoneNumber ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                  placeholder="9548615486"
                  maxLength={10}
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="skills"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Skills:<span className="text-red-500">*</span>
                </label>
                <textarea
                  id="skills"
                  name="skills"
                  value={formData?.skills || ""}
                  onChange={handleChange}
                  rows="4"
                  className={`w-full p-3 bg-gray-50 border ${
                    errors.skills ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                  placeholder="List your key skills (comma separated)"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter skills separated by commas (e.g., React, JavaScript, UI
                  Design)
                </p>
                {errors.skills && (
                  <p className="mt-1 text-sm text-red-500">{errors.skills}</p>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div>
                <label
                  htmlFor="about"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  About:<span className="text-red-500">*</span>
                </label>
                <textarea
                  id="about"
                  name="about"
                  value={formData?.about || ""}
                  onChange={handleChange}
                  rows="4"
                  className={`w-full p-3 bg-gray-50 border ${
                    errors.about ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                  placeholder="Tell us about yourself..."
                />
                {errors.about && (
                  <p className="mt-1 text-sm text-red-500">{errors.about}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="pricePerHour"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price(/hr):<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="pricePerHour"
                  name="pricePerHour"
                  value={formData?.pricePerHour || ""}
                  onChange={handleChange}
                  className={`w-full p-3 bg-gray-50 border ${
                    errors.pricePerHour ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                  placeholder="₹0.00"
                />
                {errors.pricePerHour && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.pricePerHour}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address:<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData?.address || ""}
                  onChange={handleChange}
                  className={`w-full p-3 bg-gray-50 border ${
                    errors.address ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                  placeholder="Your location"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                )}
              </div>
            </div>
          </div>

          <div>
  <h2 className="text-lg font-medium text-gray-800 mb-4">Languages</h2>
  {formData?.languages?.map((language, index) => (
    <div key={index} className="mb-4 p-4 border rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Language {index + 1}</h3>
        {formData.languages.length > 1 && (
          <button
            type="button"
            onClick={() => removeLanguage(index)}
            className="text-red-500 hover:text-red-700"
          >
            <X size={18} />
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor={`language-name-${index}`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Language Name:
          </label>
          <input
            type="text"
            id={`language-name-${index}`}
            value={language.name}
            onChange={(e) =>
              handleLanguageChange(index, "name", e.target.value)
            }
            className={`w-full p-3 bg-gray-50 border ${
              errors.languages ? "border-red-500" : "border-gray-200"
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
            placeholder="e.g., English"
          />
        </div>
        <div>
          <label
            htmlFor={`language-proficiency-${index}`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Proficiency:
          </label>
          <select
            id={`language-proficiency-${index}`}
            value={language.proficiency}
            onChange={(e) =>
              handleLanguageChange(index, "proficiency", e.target.value)
            }
            className={`w-full p-3 bg-gray-50 border ${
              errors.languages ? "border-red-500" : "border-gray-200"
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
          >
            {proficiencyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  ))}
  <button
    type="button"
    onClick={addLanguage}
    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
  >
    Add Language
  </button>
  {errors.languages && (
    <p className="mt-1 text-sm text-red-500">{errors.languages}</p>
  )}
</div>

<div className="pt-4">
  <h2 className="text-lg font-medium text-gray-800 mb-4">Education</h2>
  {formData.education.map((edu, index) => (
    <div key={index} className="mb-4 p-4 border rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Education {index + 1}</h3>
        {formData.education.length > 1 && (
          <button
            type="button"
            onClick={() => removeEducation(index)}
            className="text-red-500 hover:text-red-700"
          >
            <X size={18} />
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {/* Degree */}
        <div>
          <label
            htmlFor={`education-degree-${index}`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Degree:
          </label>
          <input
            type="text"
            id={`education-degree-${index}`}
            value={edu.degree}
            onChange={(e) =>
              handleEducationChange(index, "degree", e.target.value)
            }
            className={`w-full p-3 bg-gray-50 border ${
              errors.education ? "border-red-500" : "border-gray-200"
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
            placeholder="e.g., Bachelor of Science"
          />
        </div>
        {/* Institution */}
        <div>
          <label
            htmlFor={`education-institution-${index}`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Institution:
          </label>
          <input
            type="text"
            id={`education-institution-${index}`}
            value={edu.institution}
            onChange={(e) =>
              handleEducationChange(index, "institution", e.target.value)
            }
            className={`w-full p-3 bg-gray-50 border ${
              errors.education ? "border-red-500" : "border-gray-200"
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
            placeholder="e.g., University Name"
          />
        </div>
        {/* Field of Study */}
        <div>
          <label
            htmlFor={`education-field-${index}`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Field of Study:
          </label>
          <input
            type="text"
            id={`education-field-${index}`}
            value={edu.field}
            onChange={(e) =>
              handleEducationChange(index, "field", e.target.value)
            }
            className={`w-full p-3 bg-gray-50 border ${
              errors.education ? "border-red-500" : "border-gray-200"
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
            placeholder="e.g., Computer Science"
          />
        </div>
        {/* Year */}
        <div>
          <label
            htmlFor={`education-year-${index}`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Year:
          </label>
          <input
            type="text"
            id={`education-year-${index}`}
            value={edu.year}
            onChange={(e) =>
              handleEducationChange(index, "year", e.target.value)
            }
            className={`w-full p-3 bg-gray-50 border ${
              errors.education ? "border-red-500" : "border-gray-200"
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
            placeholder="e.g., 2024"
          />
        </div>
      </div>
    </div>
  ))}
  <button
    type="button"
    onClick={addEducation}
    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
  >
    Add Education
  </button>
  {typeof errors.education === "string" && (
    <p className="mt-1 text-sm text-red-500">{errors.education}</p>
  )}
</div>

          <div className="pt-4">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Social Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="gitHub"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  GitHub:
                </label>
                <input
                  type="text"
                  id="gitHub"
                  name="gitHub"
                  value={formData?.gitHub || ""}
                  onChange={handleChange}
                  className={`w-full p-3 bg-gray-50 border ${
                    errors.gitHub ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                  placeholder="github.com/username"
                />
                {errors.gitHub && (
                  <p className="mt-1 text-sm text-red-500">{errors.gitHub}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="linkedIn"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  LinkedIn:
                </label>
                <input
                  type="text"
                  id="linkedIn"
                  name="linkedIn"
                  value={formData?.linkedIn || ""}
                  onChange={handleChange}
                  className={`w-full p-3 bg-gray-50 border ${
                    errors.linkedIn ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                  placeholder="linkedin.com/in/username"
                />
                {errors.linkedIn && (
                  <p className="mt-1 text-sm text-red-500">{errors.linkedIn}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="twitter"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Twitter:
                </label>
                <input
                  type="text"
                  id="twitter"
                  name="twitter"
                  value={formData?.twitter || ""}
                  onChange={handleChange}
                  className={`w-full p-3 bg-gray-50 border ${
                    errors.twitter ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                  placeholder="twitter.com/username"
                />
                {errors.twitter && (
                  <p className="mt-1 text-sm text-red-500">{errors.twitter}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="web"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Web:
                </label>
                <input
                  type="text"
                  id="web"
                  name="web"
                  value={formData?.web || ""}
                  onChange={handleChange}
                  className={`w-full p-3 bg-gray-50 border ${
                    errors.web ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                  placeholder="www.yourwebsite.com"
                />
                {errors.web && (
                  <p className="mt-1 text-sm text-red-500">{errors.web}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              onClick={() => navigate("/freelancer/profile")}
              type="button"
              className="px-6 py-3 border border-red-300 text-red-500 rounded-lg hover:bg-red-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium shadow-md transition-colors cursor-pointer flex justify-center items-center"
              disabled={loading.update}
            >
              {loading.update ? (
                <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              ) : (
                "Update"
              )}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfileUpdate;
