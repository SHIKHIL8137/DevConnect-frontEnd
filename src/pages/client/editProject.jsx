import { useState, useEffect } from "react";
import {
  Calendar,
  Paperclip,
  DollarSign,
  Clock,
  Link2,
  AlertCircle,
} from "lucide-react";
import Navbar from "../../components/user/navbar/navbar";
import Footer from "../../components/user/footer/Footer";
import {
  deleteProject,
  projectDataFetch,
  updateProject,
  uploadAttachments,
} from "../../apis/projectApi";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { EditProjectSkeleton } from "../../components/common/skeleton";

const EditProjectForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    features: "",
    preferences: "",
    timeline: "",
    budget: "",
    biddingDeadline: "",
    biddingTime: "",
    referralLink: "",
    attachments: [],
    existingAttachments: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProject();
    } else {
      toast.error("Project ID is missing");
      navigate("/client/profile");
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      setIsLoading(true);
      const response = await projectDataFetch(id);
      if (!response.data.status) {
        toast.error(response.data.message || "Failed to fetch project details");
        navigate("/client/profile");
        return;
      }

      const projectData = response.data.projectData;
      
      let formattedBiddingDeadline = "";
      let formattedBiddingTime = "";
      if (projectData.biddingDeadline) {
        const date = new Date(projectData.biddingDeadline);
        // Format to local date and time
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        formattedBiddingDeadline = `${year}-${month}-${day}`;
        
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        formattedBiddingTime = `${hours}:${minutes}`;
      }

      setFormData({
        title: projectData.title || "",
        description: projectData.description || "",
        features: projectData.features || "",
        preferences: projectData.preferences || "",
        timeline: projectData.timeline || "",
        budget: projectData.budget || "",
        biddingDeadline: formattedBiddingDeadline,
        biddingTime: formattedBiddingTime,
        referralLink: projectData.referralLink || "",
        attachments: [],
        existingAttachments: projectData.attachments || [],
      });
    } catch (error) {
      console.error("Error fetching project:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch project details"
      );
      navigate("/client/profile");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Project title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.features.trim()) newErrors.features = "Features are required";

    if (!formData.timeline) {
      newErrors.timeline = "Timeline is required";
    } else if (parseInt(formData.timeline) <= 0) {
      newErrors.timeline = "Timeline must be greater than 0";
    }

    if (!formData.budget) {
      newErrors.budget = "Budget is required";
    } else if (parseInt(formData.budget) <= 0) {
      newErrors.budget = "Budget must be greater than 0";
    }

    if (!formData.biddingDeadline) {
      newErrors.biddingDeadline = 'Bidding deadline is required';
    } else if (!formData.biddingTime) {
      newErrors.biddingTime = 'Bidding time is required';
    } else {
      // Validate the combined date and time
      const selectedDateTime = new Date(`${formData.biddingDeadline}T${formData.biddingTime}`);
      const currentDateTime = new Date();
      
      if (isNaN(selectedDateTime.getTime())) {
        newErrors.biddingDeadline = 'Invalid date or time format';
      } else if (selectedDateTime <= currentDateTime) {
        newErrors.biddingTime = 'Bidding deadline must be in the future';
      }
      
      // Additional check for minimum date
      const selectedDate = new Date(formData.biddingDeadline);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate < currentDate) {
        newErrors.biddingDeadline = 'Bidding deadline cannot be in the past';
      }
    }

    if (!formData.biddingTime && formData.biddingDeadline) {
      newErrors.biddingTime = 'Bidding time is required';
    }

    if (formData.referralLink && !isValidUrl(formData.referralLink)) {
      newErrors.referralLink = "Please enter a valid URL";
    }

    if (formData.attachments.length > 0) {
      const invalidFiles = formData.attachments.filter((file) => {
        const fileSize = file.size / 1024 / 1024; 
        const validExtensions = ["jpg", "jpeg", "png", "pdf", "doc", "docx"];
        const fileExt = file.name.split(".").pop().toLowerCase();

        return fileSize > 10 || !validExtensions.includes(fileExt);
      });

      if (invalidFiles.length > 0) {
        newErrors.attachments =
          "Only JPG, PDF, DOCX files up to 10MB are allowed";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));

    if (errors.attachments) {
      setErrors((prev) => ({ ...prev, attachments: "" }));
    }
  };

  const removeNewAttachment = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const removeExistingAttachment = async (attachmentIndex) => {
    try {
      const response = await deleteProject(id, attachmentIndex);
      if (!response.data.status) return toast.error(response.data.message);
      
      setFormData((prev) => ({
        ...prev,
        existingAttachments: prev.existingAttachments.filter(
          (_, index) => index !== attachmentIndex
        ),
      }));
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove attachment");
      console.log(error.response?.data?.message);
    }
  };

  const handleFileUpload = async (files) => {
    if (files.length === 0) return [];

    setUploadingFiles(true);
    try {
      const fileFormData = new FormData();
      files.forEach(file => {
        fileFormData.append('attachments', file);
      });

      const uploadResponse = await uploadAttachments(fileFormData);
      
      if (!uploadResponse.data.status) {
        throw new Error(uploadResponse.data.message || 'File upload failed');
      }

      return uploadResponse.data.files || [];
    } catch (error) {
      console.error('Error uploading files:', error);
      throw new Error(error.response?.data?.message || 'Failed to upload attachments');
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let newAttachmentUrls = [];

      // Only upload new files if there are any
      if (formData.attachments.length > 0) {
        toast.loading('Uploading new attachments...');
        newAttachmentUrls = await handleFileUpload(formData.attachments);
        toast.dismiss();
      }

      toast.loading('Updating project...');

      // Create the bidding deadline with proper timezone handling
      const biddingDateTime = new Date(`${formData.biddingDeadline}T${formData.biddingTime}`);

      // Get existing attachment IDs (only the ones that weren't removed)
      const existingAttachmentIds = formData.existingAttachments.map(
        (attachment) => attachment._id || attachment.id
      ).filter(Boolean); // Remove any undefined values

      // Combine existing attachments with new uploads
      const allAttachments = [...existingAttachmentIds, ...newAttachmentUrls];

      const projectData = {
        title: formData.title,
        description: formData.description,
        features: formData.features,
        preferences: formData.preferences,
        timeline: parseInt(formData.timeline),
        budget: parseInt(formData.budget),
        biddingDeadline: biddingDateTime.toISOString(),
        referralLink: formData.referralLink,
        attachments: allAttachments,
      };

      console.log('Submitting project data:', projectData); // Debug log

      const response = await updateProject(id, projectData);
      toast.dismiss();

      if (!response.data.status) {
        return toast.error(response.data.message);
      }

      navigate("/client/profile");
      toast.success(response.data.message || "Project updated successfully");
    } catch (error) {
      console.error("Error updating project:", error);
      toast.dismiss();
      toast.error(
        error.message || error.response?.data?.message ||
          "Failed to update project. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBorderClass = (fieldName) => {
    return errors[fieldName]
      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500";
  };

  const isFormDisabled = isSubmitting || uploadingFiles;

  return (
    <div className="pt-8 w-full min-h-screen bg-gray-100">
      <Navbar />
      {isLoading ? (
        <EditProjectSkeleton />
      ) : (
        <div className="flex flex-col py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-full mx-20">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="px-6 py-4">
                <h2 className="text-2xl font-medium text-black text-center">
                  Edit Project
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Project Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    disabled={isFormDisabled}
                    className={`mt-1 block w-full px-4 py-3 bg-gray-50 border rounded-lg transition duration-200 ${getBorderClass(
                      "title"
                    )} ${isFormDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="Enter project title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs text-red-500">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={isFormDisabled}
                    rows={4}
                    className={`mt-1 block w-full px-4 py-3 bg-gray-50 border rounded-lg transition duration-200 ${getBorderClass(
                      "description"
                    )} ${isFormDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="Describe your project in detail"
                  />
                  {errors.description && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.description}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="features"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Required Features / Pages{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="features"
                    id="features"
                    value={formData.features}
                    onChange={handleChange}
                    disabled={isFormDisabled}
                    rows={3}
                    className={`mt-1 block w-full px-4 py-3 bg-gray-50 border rounded-lg transition duration-200 ${getBorderClass(
                      "features"
                    )} ${isFormDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="List the key features or pages needed"
                  />
                  {errors.features && (
                    <p className="mt-1 text-xs text-red-500">{errors.features}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="preferences"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tech Preferences
                  </label>
                  <textarea
                    name="preferences"
                    id="preferences"
                    value={formData.preferences}
                    onChange={handleChange}
                    disabled={isFormDisabled}
                    rows={3}
                    className={`mt-1 block w-full px-4 py-3 bg-gray-50 border rounded-lg transition duration-200 ${getBorderClass(
                      "preferences"
                    )} ${isFormDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="Specify technologies, frameworks, or platforms"
                  />
                  {errors.preferences && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.preferences}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="timeline"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Timeline (days) <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="timeline"
                        id="timeline"
                        value={formData.timeline}
                        onChange={handleChange}
                        disabled={isFormDisabled}
                        className={`block w-full pl-10 px-4 py-3 bg-gray-50 border rounded-lg transition duration-200 ${getBorderClass(
                          "timeline"
                        )} ${isFormDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        placeholder="30"
                      />
                    </div>
                    {errors.timeline && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.timeline}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="budget"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Budget (₹) <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="budget"
                        id="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        disabled={isFormDisabled}
                        className={`block w-full pl-10 px-4 py-3 bg-gray-50 border rounded-lg transition duration-200 ${getBorderClass(
                          "budget"
                        )} ${isFormDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        placeholder="1000"
                      />
                    </div>
                    {errors.budget && (
                      <p className="mt-1 text-xs text-red-500">{errors.budget}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="biddingDeadline"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Bidding Deadline <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="biddingDeadline"
                        id="biddingDeadline"
                        value={formData.biddingDeadline}
                        onChange={handleChange}
                        disabled={isFormDisabled}
                        min={getMinDate()}
                        className={`block w-full pl-10 px-4 py-3 bg-gray-50 border rounded-lg transition duration-200 ${getBorderClass(
                          "biddingDeadline"
                        )} ${isFormDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                    {errors.biddingDeadline && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.biddingDeadline}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="biddingTime" className="block text-sm font-medium text-gray-700">
                    Bidding Time <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="time"
                      name="biddingTime"
                      id="biddingTime"
                      value={formData.biddingTime}
                      onChange={handleChange}
                      disabled={isFormDisabled}
                      className={`block w-full pl-10 px-4 py-3 bg-gray-50 border rounded-lg transition duration-200 ${getBorderClass('biddingTime')} ${isFormDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                  </div>
                  {errors.biddingTime && (
                    <p className="mt-1 text-xs text-red-500">{errors.biddingTime}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Exact time when bidding will close
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="referralLink"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Referral Link (optional)
                  </label>
                  <div className="mt-1 relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Link2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="url"
                      name="referralLink"
                      id="referralLink"
                      value={formData.referralLink}
                      onChange={handleChange}
                      disabled={isFormDisabled}
                      className={`block w-full pl-10 px-4 py-3 bg-gray-50 border rounded-lg transition duration-200 ${getBorderClass(
                        "referralLink"
                      )} ${isFormDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      placeholder="https://example.com"
                    />
                  </div>
                  {errors.referralLink && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.referralLink}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Attachments
                  </label>

                  {formData.existingAttachments.length > 0 ? (
                    <div className="space-y-2">
                      {formData.existingAttachments.map((attachment, index) => (
                        <div
                          key={attachment._id || attachment.id || index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center">
                            <Paperclip className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm text-gray-700 truncate max-w-xs">
                              {attachment.name || attachment.filename || `Attachment ${index + 1}`}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeExistingAttachment(index)}
                            disabled={isFormDisabled}
                            className={`text-red-500 hover:text-red-700 ${isFormDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No attachments</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Add New Attachments
                  </label>
                  <div
                    className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg ${
                      errors.attachments ? "border-red-300" : "border-gray-300"
                    } ${isFormDisabled ? 'opacity-50' : ''}`}
                  >
                    <div className="space-y-1 text-center">
                      <Paperclip
                        className={`mx-auto h-12 w-12 ${
                          errors.attachments ? "text-red-400" : "text-gray-400"
                        }`}
                      />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className={`relative cursor-pointer bg-white rounded-md font-medium ${
                            errors.attachments
                              ? "text-red-600 hover:text-red-500"
                              : "text-blue-600 hover:text-blue-500"
                          } focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 ${isFormDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
                        >
                          <span>Upload files</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            multiple
                            disabled={isFormDisabled}
                            className="sr-only cursor-pointer"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        JPG, PDF, DOCX up to 10MB
                      </p>
                    </div>
                  </div>

                  {errors.attachments && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.attachments}
                    </p>
                  )}

                  {formData.attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm font-medium text-gray-700">
                        New uploads:
                      </p>
                      {formData.attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center">
                            <Paperclip className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm text-gray-700 truncate max-w-xs">
                              {file.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeNewAttachment(index)}
                            disabled={isFormDisabled}
                            className={`text-red-500 hover:text-red-700 ${isFormDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 mt-8">
                  <button
                    type="button"
                    onClick={() => navigate("/client/profile")}
                    disabled={isFormDisabled}
                    className={`px-6 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ${isFormDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isFormDisabled}
                    className={`px-6 py-2 border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition duration-200 ${
                      isFormDisabled ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
                    }`}
                  >
                    {isSubmitting || uploadingFiles ? (
                      <div className="flex items-center space-x-2">
                        <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                        <span>{uploadingFiles ? 'Uploading...' : 'Updating...'}</span>
                      </div>
                    ) : (
                      "Update Project"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default EditProjectForm;