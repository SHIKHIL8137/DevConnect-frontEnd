import { useState } from "react";
import { X, Save, AlertCircle } from "lucide-react";
import { updateFreelancer } from "../../../apis/userApi";
import { toast } from "sonner";

const ProfileCompletionModal = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({
    position: "",
    skills: "",
    about: "",
    pricePerHour: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.position.trim()) newErrors.position = "Position is required";
    if (!formData.skills.trim())
      newErrors.skills = "Please add at least one skill";
    if (!formData.about.trim())
      newErrors.about = "Please provide a brief description about yourself";
    if (!formData.pricePerHour.trim()) {
      newErrors.pricePerHour = "Price is required";
    } else if (
      isNaN(formData.pricePerHour) ||
      Number(formData.pricePerHour) <= 0
    ) {
      newErrors.pricePerHour = "Please enter a valid price";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const submissionData = {
      ...formData,
      skills: formData.skills.split(",").map((skill) => skill.trim()),
    };

    try {
      setIsSubmitting(true);
      const response = await updateFreelancer(submissionData);
      if (!response.data.status) {
        toast.error(response.data.message);
      }
      setIsCompleted(true);
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur bg-opacity-50">
      <div className="relative w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-gray-600">
            Please provide the following information to complete your profile
          </p>
        </div>

        {isCompleted ? (
          <div className="py-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-sky-100">
                <Save className="w-8 h-8 text-sky-600" />
              </div>
            </div>
            <h3 className="text-xl font-medium text-gray-800">
              Profile Completed!
            </h3>
            <p className="mt-2 text-gray-600">
              Your profile has been successfully updated.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="position"
              >
                Position
              </label>
              <input
                id="position"
                name="position"
                type="text"
                placeholder="e.g. Frontend Developer"
                value={formData.position}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.position ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-sky-500`}
              />
              {errors.position && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle size={16} className="mr-1" />
                  {errors.position}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="skills"
              >
                Skills (comma separated)
              </label>
              <input
                id="skills"
                name="skills"
                type="text"
                placeholder="e.g. React, JavaScript, UI Design"
                value={formData.skills}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.skills ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-sky-500`}
              />
              {errors.skills && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle size={16} className="mr-1" />
                  {errors.skills}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="about"
              >
                About
              </label>
              <textarea
                id="about"
                name="about"
                rows="3"
                placeholder="Write a short bio about yourself"
                value={formData.about}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.about ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-sky-500`}
              />
              {errors.about && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle size={16} className="mr-1" />
                  {errors.about}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="pricePerHour"
              >
                Hourly Rate ($)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  id="pricePerHour"
                  name="pricePerHour"
                  type="text"
                  placeholder="0.00"
                  value={formData.pricePerHour}
                  onChange={handleChange}
                  className={`w-full pl-8 pr-3 py-2 border rounded-md ${
                    errors.pricePerHour ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-sky-500`}
                />
              </div>
              {errors.pricePerHour && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle size={16} className="mr-1" />
                  {errors.pricePerHour}
                </p>
              )}
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full cursor-pointer flex justify-center items-center px-4 py-2 font-medium text-white transition-colors bg-sky-500 rounded-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:bg-sky-300"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              ) : (
                "Complete Profile"
              )}
            </button>

            <p className="mt-4 text-sm text-center text-gray-500">
              You can edit these details later from your profile settings
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCompletionModal;
