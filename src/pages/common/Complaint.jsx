import React, { useState } from "react";
import { AlertCircle, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { createComplaint, upload } from "../../apis/complaintApi";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/user/navbar/navbar";
import Footer from "../../components/user/footer/Footer";

export default function ComplaintForm() {
  const location = useLocation();
  const navigate = useNavigate()
  const complainantType = location.pathname.includes("/freelancer")
    ? "freelancer"
    : "client";
  const [formData, setFormData] = useState({
    complainantType,
    againstId: "",
    subject: "",
    description: "",
  });

  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedAttachments, setUploadedAttachments] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files || []);

    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    const maxSize = 5 * 1024 * 1024;

    const newErrors = { ...errors };

    const invalidFile = uploadedFiles.find((file) => {
      if (!validTypes.includes(file.type)) {
        newErrors.fileUpload = `File "${file.name}" has an invalid format.`;
        return true;
      }
      if (file.size > maxSize) {
        newErrors.fileUpload = `File "${file.name}" is too large (max 5MB).`;
        return true;
      }
      return false;
    });

    if (invalidFile) {
      setErrors(newErrors);
      return;
    }

    const totalFiles = files.length + uploadedFiles.length;
    if (totalFiles > 5) {
      setErrors({
        ...errors,
        fileUpload: "You can upload a maximum of 5 files.",
      });
      return;
    }
    setErrors((prev) => ({ ...prev, fileUpload: "" }));
    setFiles((prev) => [...prev, ...uploadedFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return [];

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
    });

    try {
      const response = await upload(formData);

      if (!response.data.status) throw new Error("Upload failed");

      return response.data.files;
    } catch (error) {
      console.error("File upload failed:", error);
      throw error;
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.complainantType)
      newErrors.complainantType = "Please select complainant type";
    if (!formData.againstId.trim())
      newErrors.againstId = "Against ID is required";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const attachments = await uploadFiles();
      console.log("attachment", attachments);
      const complaintData = {
        ...formData,
        attachments,
      };
      const response = await createComplaint(complaintData);

      if (!response.data.status) throw new Error("Failed to submit complaint");
      toast.success("Complaint submitted successfully!");
      handleCancel();
      navigate(`/${complainantType}/complaints`)
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Failed to submit complaint. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      complainantType: "",
      againstId: "",
      subject: "",
      description: "",
    });
    setFiles([]);
    setErrors({});
    setUploadedAttachments([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white py-8 px-4">
      <Navbar />
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg my-10">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Submit a Complaint
            </h1>
            <p className="text-gray-600">
              Report issues with clients or freelancers for resolution.
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-blue-400 mr-2" />
              <p className="text-blue-700 text-sm">
                Fields marked with an asterisk (*) are required.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Complainant Information
              </h2>

              <div className="space-y-6">
                {/* Against ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Against ID/Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="againstId"
                    value={formData.againstId}
                    onChange={handleInputChange}
                    placeholder="Enter the ID/username you're complaining against"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.againstId ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  {errors.againstId && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.againstId}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Complaint Details Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Complaint Details
              </h2>

              <div className="space-y-6">
                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Brief summary of your complaint"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.subject ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={6}
                    placeholder="Please provide detailed information about the issue, including dates, specific incidents, and how it has affected your project or working relationship."
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical ${
                      errors.description ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attach Evidence
              </label>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors relative">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="space-y-2">
                  <p className="text-gray-600">
                    Drag & drop files here or click to browse
                  </p>
                  <p className="text-xs text-gray-500">
                    Accepted formats: PDF, JPG, PNG (max 5MB each)
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {errors.fileUpload && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.fileUpload}
                  </p>
                )}
              </div>

              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Selected Files:
                  </p>
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                          <span className="text-xs text-blue-600 font-medium">
                            {file.name.split(".").pop().toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Complaint"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
