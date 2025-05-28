import { useState } from "react";
import { applyProject } from "../../../apis/userApi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ProjectCard = ({ project, currentUserId, fetchProject }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const hasApplied = project.appliedUsers?.some(
    (application) => application.freelancerId === currentUserId
  );
  const [loading, setLoading] = useState(false);
  const apply = async (id) => {
    try {
      setLoading(true)
      const response = await applyProject({ projectId: id });
      if (!response.status) return toast.error(response?.data?.message);
      fetchProject();
      toast.success(response?.data?.message);
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred", "error");
      console.log(error);
    } finally {
      setLoading(false)
      setShowModal(false);
    }
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col sm:flex-row justify-between">
        <div>
          <h3 className="font-medium text-lg">{project.title}</h3>
          <p className="text-gray-600 text-sm">
            {project.category || "Uncategorized"}
          </p>
          <div className="flex items-center mt-1">
            <span className="text-sm text-gray-500">
              Posted {formatDate(project.createdAt)}
            </span>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 text-right">
          <p className="font-bold text-xl">₹{project.budget}</p>
          <p className="text-sm text-gray-500">
            {project.timeline
              ? `${project.timeline} days`
              : "No timeline specified"}
          </p>
        </div>
      </div>

      <p className="mt-4 text-gray-700">
        {truncateText(project.description, 150)}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.skills &&
          project.skills.map((skill) => (
            <span
              key={skill}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
      </div>

      <div className="border-t mt-6 pt-4 flex justify-end">
        <button
          className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50 transition-colors mr-3"
          onClick={() =>
            navigate(`/freelancer/projectDetails?id=${project._id}`)
          }
        >
          View Details
        </button>

        {hasApplied ? (
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
            disabled
          >
            Already Applied
          </button>
        ) : (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => setShowModal(true)}
          >
            Apply Now
          </button>
        )}
      </div>


      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Confirm Application</h3>
            <p className="mb-6">
              Are you sure you want to apply for this project? Once submitted,
              the client will be able to review your profile.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={() => apply(project._id)}
              >
                {loading ? (
                  <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                ) : (
                  " Confirm & Apply"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
