import { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
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
import Navbar from "../../components/user/navbar/navbar";
import Footer from "../../components/user/footer/Footer";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ProfileImgUpdate } from "../../apis/userApi";
import { fetchUserData } from "../../redux/thunk/userThunk";
import { verify } from "../../redux/slices/userSlice";
import { toast } from "sonner";
import dummy_profile_img from "../../assets/images/profile_dummy_img.png";
import { verificationRequest } from "../../apis/verificationApi";
import { fetchProjectOfUser } from "../../apis/projectApi";

const Profile = () => {
  const { user, verification } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState("");
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState({ crop: false, verification: false });
  const navigate = useNavigate();
  const [project, setProject] = useState([]);

  const verificationStatus = verification?.status || "incomplete";

  const isProfileComplete = Boolean(
    user?.userName &&
      user?.email &&
      user?.companyName &&
      user?.address &&
      user?.profileImage
  );

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

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleRequestVerification = async () => {
    if (!isProfileComplete) {
      toast.error(
        "Please complete your profile before requesting verification"
      );
      return;
    }

    try {
      setLoading((val) => ({ ...val, verification: true }));
      const response = await verificationRequest({ userId: user._id });
      console.log(response)
      if (!response.data.status) return toast.error(response.data.message);

      dispatch(verify(response.data.verification));
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error("Failed to submit verification request. Please try again.");
    } finally {
      setLoading((val) => ({ ...val, verification: false }));
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

  useEffect(() => {
    setCroppedImage(user?.profileCoverImg);
    fetch();
  }, [user?.profileCoverImg]);

  const renderVerificationBadge = () => {
    switch (verificationStatus) {
      case "verified":
        return (
          <div className="flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full">
            <CheckCircle size={16} className="mr-1" />
            <span className="text-sm font-medium">Verified</span>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
            <Clock size={16} className="mr-1" />
            <span className="text-sm font-medium">Pending</span>
          </div>
        );
      case "rejected":
        return (
          <div className="flex items-center bg-red-100 text-red-700 px-3 py-1 rounded-full">
            <AlertCircle size={16} className="mr-1" />
            <span className="text-sm font-medium"> Rejected</span>
          </div>
        );
      case "incomplete":
      default:
        return (
          <div className="flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
            <AlertCircle size={16} className="mr-1" />
            <span className="text-sm font-medium">Profile Incomplete</span>
          </div>
        );
    }
  };

  return (
    <div className="pt-8 w-full min-h-screen bg-gray-100 ">
      <Navbar />
      <div className="flex flex-col lg:flex-row gap-4 mt-15 p-4">
        <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-md p-6 flex flex-col h-fit">
          <div className="relative mb-16">
            <img
              src={croppedImage}
              className="w-full h-40 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg overflow-hidden object-cover relative"
              alt=""
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
                alt="Profile"
              />
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
                      className="text-gray-500 hover:text-gray-700 cursor-pointer"
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
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
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
          </div>

          <div className="mb-4 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{user?.userName}</h2>
              <p className="text-gray-600">{user?.companyName} Company</p>
            </div>
            <div>{renderVerificationBadge()}</div>
          </div>

          {verificationStatus !== "verified" && (
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span>Profile Completion</span>
                <span>{isProfileComplete ? "100%" : "Incomplete"}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    isProfileComplete ? "bg-green-500" : "bg-blue-500"
                  }`}
                  style={{ width: isProfileComplete ? "100%" : "60%" }}
                ></div>
              </div>
              {!isProfileComplete && (
                <p className="text-xs text-gray-500 mt-1">
                  Complete your profile to request verification
                </p>
              )}
            </div>
          )}

          <div className="space-y-3 mb-6">
            <div className="flex items-center text-gray-600">
              <MapPin size={16} className="mr-2" />
              <span>{user?.address || "No address added"}</span>
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

          <button
            className={`w-full font-medium cursor-pointer rounded-lg py-3 mb-4 ${
              verificationStatus === "verified"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={verificationStatus !== "verified"}
            onClick={() =>
              verificationStatus === "verified"
                ? navigate("/client/addProject")
                : null
            }
          >
            Create new project
          </button>

          <button
            onClick={() => navigate("/client/profileUpdate")}
            className="w-full cursor-pointer bg-gray-100 text-gray-700 font-medium rounded-lg py-3 mb-4 flex items-center justify-center"
          >
            <Edit size={18} className="mr-2" /> Edit Profile
          </button>

          {verificationStatus === "incomplete" && isProfileComplete && (
            <button
              onClick={handleRequestVerification}
              disabled={loading.verification}
              className={`w-full font-medium cursor-pointer rounded-lg py-3 mb-4 flex justify-center items-center ${
                loading.verification
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-500 text-white"
              }`}
            >
              {loading.verification ? (
                <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              ) : (
                "Request Verification"
              )}
            </button>
          )}

          {verificationStatus === "pending" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg text-center p-3 mb-4 text-sm text-yellow-700">
              Your profile verification is pending. An admin will review your
              profile soon.
            </div>
          )}

          {verificationStatus === "rejected" && (
            <div className="w-full mb-4">
              {verification.message && (
                <p className="text-red-600 text-sm mb-2 text-center">
                  {verification.message}
                </p>
              )}

              <button
                onClick={handleRequestVerification}
                disabled={loading.verification}
                className={`w-full font-medium cursor-pointer rounded-lg py-3 flex justify-center items-center ${
                  loading.verification
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-red-500 text-white"
                }`}
              >
                {loading.verification ? (
                  <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                ) : (
                  "Re-Submit Verification"
                )}
              </button>
            </div>
          )}

          {verificationStatus === "verified" && <></>}

          <button
            className={`w-full font-medium cursor-pointer rounded-lg py-3 mb-4 flex items-center justify-center ${
              verificationStatus === "verified"
                ? "bg-gray-100 text-gray-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={verificationStatus !== "verified"}
          >
            <MessageCircle size={18} className="mr-2" /> Messages
            {verificationStatus !== "verified" && (
              <span className="ml-2 text-xs bg-gray-400 text-white px-2 py-1 rounded-full">
                Locked
              </span>
            )}
          </button>

          <button onClick={()=>navigate('/client/complaints')} className="w-full bg-gray-100 text-gray-700 font-medium cursor-pointer rounded-lg py-3">
            Complaints
          </button>
        </div>

        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg text-gray-600 mb-4">Completed Projects</h3>
              <p className="text-4xl font-bold text-green-600">0</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg text-gray-600 mb-4">Active Projects</h3>
              <p className="text-4xl font-bold text-blue-600">0</p>
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
                const statusConfig = getStatusConfig(project.completionStatus);

                return (
                  <div
                    key={project._id}
                    className={`bg-white rounded-lg p-5 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1`}
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

            <div className="mt-8 flex justify-center">
              <p
                className="group flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                onClick={() => navigate("/client/allProject")}
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
      <Footer />
    </div>
  );
};

export default Profile;
