import { useState } from "react";
import { FileUp, Check, X, FileText, Upload, RefreshCw } from "lucide-react";

export default function ResumeUploadComponent() {
  const [resumeFileName, setResumeFileName] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleResumeSelect = (e) => {
    setLoading(true);
    const file = e.target.files[0];

    if (file) {
      setTimeout(() => {
        setResumeFileName(file.name);
        setResume(URL.createObjectURL(file));
        setLoading(false);
        setErrors({});
        setUploadSuccess(true);

        setTimeout(() => {
          setUploadSuccess(false);
        }, 3000);
      }, 1000);
    } else {
      setLoading(false);
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
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = (file) => {
    setLoading(true);

    setTimeout(() => {
      setResumeFileName(file.name);
      setResume(URL.createObjectURL(file));
      setLoading(false);
      setErrors({});
      setUploadSuccess(true);

      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    }, 1000);
  };

  const handleRemoveFile = () => {
    setResumeFileName("");
    setResume(null);
  };

  return (
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
        {loading ? (
          <div className="flex flex-col items-center justify-center py-4">
            <RefreshCw size={36} className="text-blue-500 animate-spin mb-3" />
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
                  <p className="text-xs text-gray-500">Added just now</p>
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
              <p className="text-blue-700 font-medium">Drop your file here</p>
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
  );
}
