import React, { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import { Camera, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  validateProfileForm,
  formatProfileData,
} from "../../util/fromValidationClient";
import { ProfileImgUpdate, updateProfile } from "../../apis/userApi";
import { toast } from "sonner";
import { fetchUserData } from "../../redux/thunk/userThunk";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/user/navbar/navbar";
import Footer from "../../components/user/footer/Footer";
import dummy_user_img from "../../assets/images/profile_dummy_img.png";
import { verify } from "../../redux/slices/userSlice";

const ProfileUpdate = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    companyName: "",
    email: "",
    phoneNumber: "",
    twitter: "",
    linkedIn: "",
    address: "",
    web: "",
  });
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState("");
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoding] = useState({ crop: false, submit: false });

  useEffect(() => {
    if (user) {
      setFormData({
        userName: user?.userName || "",
        companyName: user?.companyName || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        linkedIn: user?.linkedIn || "",
        twitter: user?.twitter || "",
        web: user?.web || "",
        address: user?.address || "",
      });

      if (user.profileImage) {
        setCroppedImage(user.profileImage);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
            setLoding((val) => ({ ...val, crop: true }));
            const response = await ProfileImgUpdate(formData, "profile");
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
            setLoding((val) => ({ ...val, crop: false }));
          }
        }, "image/jpeg");
      };
    } catch (error) {
      console.error("Error cropping image:", error);
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
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
      setLoding((val) => ({ ...val, submit: true }));
      const response = await updateProfile(formattedData);
      if (!response.data.status) return toast.error(response.data.message);
      const result = await dispatch(fetchUserData());

      if (fetchUserData.fulfilled.match(result)) {
        toast.success(response.data.message);
        dispatch(verify());
        navigate("/client/profile");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoding((val) => ({ ...val, submit: false }));
    }
  };
  return (
    <div className="pt-8 w-full min-h-screen bg-gradient-to-br from-sky-50 to-white ">
      <Navbar />
      <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-xl border border-gray-200 shadow-sm my-10 py-10">
        <h1 className="text-3xl font-bold text-center mb-10">Profile Update</h1>

        <div className="relative">
          <div className="space-y-6">
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
                      src={dummy_user_img}
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
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex justify-center items-center"
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

            <div>
              <label
                htmlFor="name"
                className="block font-medium text-gray-800 mb-2"
              >
                Name:
              </label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className={`w-full p-3 bg-gray-100 rounded-lg ${
                  errors.userName ? "border-red-500" : "border-gray-200"
                }`}
                disabled
              />
            </div>

            <div>
              <label
                htmlFor="companyName"
                className="block font-medium text-gray-800 mb-2"
              >
                Company Name:
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className={`w-full p-3 bg-gray-100 rounded-lg ${
                  errors.companyName ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.companyName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block font-medium text-gray-800 mb-2"
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`${
                  errors.email ? "border-red-500" : "border-gray-200"
                } w-full p-3 bg-gray-100 rounded-lg`}
                disabled
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block font-medium text-gray-800 mb-2"
              >
                Phone:
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`w-full p-3 bg-gray-100 rounded-lg ${
                  errors.userName ? "border-red-500" : "border-gray-200"
                }`}
                maxLength={10}
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="twitter"
                  className="block font-medium text-gray-800 mb-2"
                >
                  Twitter:
                </label>
                <input
                  type="text"
                  id="twitter"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  className={`${
                    errors.twitter ? "border-red-500" : "border-gray-200"
                  } w-full p-3 bg-gray-100 rounded-lg`}
                />
                {errors.twitter && (
                  <p className="mt-1 text-sm text-red-500">{errors.twitter}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="linkedin"
                  className="block font-medium text-gray-800 mb-2"
                >
                  LinkedIn:
                </label>
                <input
                  type="text"
                  id="linkedIn"
                  name="linkedIn"
                  value={formData.linkedIn}
                  onChange={handleChange}
                  className={`w-full p-3 bg-gray-100 rounded-lg ${
                    errors.linkedIn ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.linkedIn && (
                  <p className="mt-1 text-sm text-red-500">{errors.linkedIn}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="address"
                  className="block font-medium text-gray-800 mb-2"
                >
                  Address:
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full p-3 bg-gray-100 rounded-lg ${
                    errors.address ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="web"
                  className="block font-medium text-gray-800 mb-2"
                >
                  Web:
                </label>
                <input
                  type="text"
                  id="web"
                  name="web"
                  value={formData.web}
                  onChange={handleChange}
                  className={`w-full p-3 bg-gray-100 rounded-lg ${
                    errors.web ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.web && (
                  <p className="mt-1 text-sm text-red-500">{errors.web}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-10">
          <button
            onClick={() => navigate("/client/profile")}
            type="button"
            className="px-8 py-3 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm flex justify-center items-center"
            disabled={loading.submit}
          >
            {loading.submit ? (
              <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
            ) : (
              "Update"
            )}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfileUpdate;
