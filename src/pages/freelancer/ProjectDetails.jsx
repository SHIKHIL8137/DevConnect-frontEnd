import { useEffect, useState } from "react";
import { Download, CheckCircle, X, Loader2 } from "lucide-react";
import { projectDetails } from "../../apis/projectApi";
import { toast } from "sonner";
import Navbar from "../../components/user/navbar/navbar";
import Footer from "../../components/user/footer/Footer";
import { applyProject } from "../../apis/userApi";

const ProjectDetails = () => {
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [appliedUser, setAppliedUser] = useState({});
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const getProjectDetails = async () => {
    try {
      setLoading(true);

      const response = await projectDetails(id);
      console.log(response);
      if (!response.status) {
        toast.error(
          response.data?.message || "Failed to fetch project",
          "error"
        );
        return;
      }
      setProject(response.data.projectData);
      setHasApplied(response.data.hasApplied);
      setAppliedUser(response.data.appliedUser);
    } catch (error) {
      toast.error(error.message || "An error occurred", "error");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const apply = async () => {
    try {
      
      const response = await applyProject({ projectId: id });
      if (!response.status) return toast.error(response?.data?.message);
      getProjectDetails()
      toast.success(response?.data?.message);
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred", "error");
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      getProjectDetails();
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Project not found
          </h2>
          <p className="text-gray-600 mt-2">
            The project you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const featuresList = project.features
    ? project.features.split("\n").filter(Boolean)
    : [];
  const preferencesList = project.preferences
    ? project.preferences.split("\n").filter(Boolean)
    : [];

  const formattedBudget = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(project.budget);

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <Navbar />
      <div className="max-w-6xl mt-5 mb-5 mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
            {project.title}
          </h1>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Description
              </h2>
              <div className="space-y-2 text-gray-600">
                {project.description.split("\n").map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Required Features / Pages
              </h2>
              <div className="space-y-1 text-gray-600">
                {featuresList.length > 0 ? (
                  featuresList.map((feature, index) => (
                    <p key={index}>{feature}</p>
                  ))
                ) : (
                  <p>No features specified</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Tech Preferences
              </h2>
              <div className="space-y-2 text-gray-600">
                {preferencesList.length > 0 ? (
                  preferencesList.map((preference, index) => (
                    <p key={index}>{preference}</p>
                  ))
                ) : (
                  <p>No preferences specified</p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Additional Information
              </h2>
              <div className="space-y-2 text-gray-600">
                <p>
                  Status:{" "}
                  <span className="font-medium capitalize">
                    {project.completionStatus}
                  </span>
                </p>
                <p>
                  Client ID:{" "}
                  <span className="font-medium">{project.clientId}</span>
                </p>
                {project.freelancerId && (
                  <p>
                    Freelancer ID:{" "}
                    <span className="font-medium">{project.freelancerId}</span>
                  </p>
                )}
                <p>
                  Created:{" "}
                  <span className="font-medium">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800">Timeline</h2>
              <p className="text-gray-600">
                {project.timeline
                  ? `${project.timeline} days`
                  : "No timeline specified"}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800">Budget</h2>
              <p className="text-gray-600">Fixed: {formattedBudget}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Reference Links
              </h2>
              {project.referralLink ? (
                <a
                  href={project.referralLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {project.referralLink}
                </a>
              ) : (
                <p className="text-gray-600">No reference links provided</p>
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Attachments
              </h2>
              {project.attachments && project.attachments.length > 0 ? (
                <div className="space-y-2">
                  {project.attachments.map((attachment, index) => {
                    const fileName = attachment.split("/").pop();
                    const downloadUrl = attachment.replace(
                      "/upload/",
                      "/upload/fl_attachment/"
                    );

                    return (
                      <div
                        key={index}
                        className="bg-gray-100 rounded-lg p-3 flex items-center space-x-2 w-fit"
                      >
                        <a
                          href={downloadUrl}
                          download={fileName}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download size={18} className="text-gray-600" />
                        </a>
                        <span className="text-gray-700">
                          {`Attachment ${index + 1}`} - {fileName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-600">No attachments</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center mb-10">
          {hasApplied ? (
            <div className="text-center">
              <p className="text-lg font-semibold text-yellow-500">
                You have already applied.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Application Status:{" "}
                <strong
                  className={
                    appliedUser.status === "applied"
                      ? "text-blue-500"
                      : appliedUser.status === "rejected"
                      ? "text-red-500"
                      : appliedUser.status === "hired"
                      ? "text-green-600"
                      : ""
                  }
                >
                  {appliedUser.status}
                </strong>
              </p>
            </div>
          ) : (
            <button
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition duration-300 transform hover:scale-105"
              onClick={apply}
            >
              Apply Now
            </button>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProjectDetails;
