import { useEffect, useState } from "react";
import {
  Download,
  CheckCircle,
  X,
  Loader2,
  Check,
  ChevronDown,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { onStatusChange, projectDetails } from "../../apis/projectApi";
import { toast } from "sonner";
import Navbar from "../../components/user/navbar/navbar";
import Footer from "../../components/user/footer/Footer";
import { useNavigate, useLocation } from "react-router-dom";
import BiddingRoomSection from "../../components/user/biddingCard/BiddingCardClient";

const ProjectDetails = () => {
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [statusLoading, setStatusLoading] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [appliedUser, setAppliedUsers] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [biddingExpired, setBiddingExpired] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const getProjectDetails = async () => {
    try {
      setLoading(true);

      const response = await projectDetails(id);
      if (!response.status) {
        toast.error(
          response.data?.message || "Failed to fetch project",
          "error"
        );
        return;
      }
      setProject(response.data.projectData);
      setAppliedUsers(response.data.appliedUsers);
    } catch (error) {
      toast.error(error.message || "An error occurred", "error");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeRemaining = () => {
    if (!project?.biddingDeadline) return;

    const deadline = new Date(project.biddingDeadline);
    const now = new Date();
    const timeDiff = deadline.getTime() - now.getTime();

    if (timeDiff <= 0) {
      setBiddingExpired(true);
      setTimeRemaining("Bidding period has ended");
      return;
    }

    setBiddingExpired(false);
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      setTimeRemaining(
        `${days} day${days > 1 ? "s" : ""}, ${hours} hour${
          hours > 1 ? "s" : ""
        } remaining`
      );
    } else if (hours > 0) {
      setTimeRemaining(
        `${hours} hour${hours > 1 ? "s" : ""}, ${minutes} minute${
          minutes > 1 ? "s" : ""
        } remaining`
      );
    } else {
      setTimeRemaining(`${minutes} minute${minutes > 1 ? "s" : ""} remaining`);
    }
  };

  useEffect(() => {
    if (id) {
      getProjectDetails();
    }
  }, [id]);

  useEffect(() => {
    if (project?.biddingDeadline) {
      calculateTimeRemaining();
      const interval = setInterval(calculateTimeRemaining, 60000); 
      return () => clearInterval(interval);
    }
  }, [project?.biddingDeadline]);

  const handleStatusChange = async (
    freelancerId,
    freelancerName,
    newStatus,
    applicationId
  ) => {
    try {
      setStatusLoading(`${applicationId}-${newStatus}`);

      const response = await onStatusChange({
        projectId: id,
        freelancerId,
        freelancerName,
        newStatus,
      });
      if (!response.data.status) return toast.error(response.data.message);
      getProjectDetails();
      toast.success(response.data.message);
      setStatusLoading(null);
    } catch (error) {
      console.error("Error changing status:", error);
      setStatusLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800";
      case "hired":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getBiddingDeadlineStatus = () => {
    if (!project?.biddingDeadline) return null;

    const deadline = new Date(project.biddingDeadline);
    const now = new Date();
    const timeDiff = deadline.getTime() - now.getTime();
    const hoursRemaining = timeDiff / (1000 * 60 * 60);

    if (timeDiff <= 0) {
      return {
        status: "expired",
        color: "text-red-600 bg-red-50",
        icon: AlertTriangle,
      };
    } else if (hoursRemaining <= 24) {
      return {
        status: "urgent",
        color: "text-orange-600 bg-orange-50",
        icon: Clock,
      };
    } else {
      return {
        status: "active",
        color: "text-blue-600 bg-blue-50",
        icon: Clock,
      };
    }
  };

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
    currency: "INR",
  }).format(project.budget);

  const biddingStatus = getBiddingDeadlineStatus();

  return (
    <div className="bg-gradient-to-br from-sky-50 to-white min-h-screen p-6">
      <Navbar />
      <div className="max-w-6xl mt-5 mb-5 mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="flex justify-end items-end p-5">
          <button
            onClick={() => navigate(`/client/editProject?id=${id}`)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center text-sm"
          >
            <span className="mr-2"></span> Edit Project
          </button>
        </div>
        <div className="p-8">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
            {project.title}
          </h1>

          {project.biddingDeadline && biddingStatus && (
            <div
              className={`mb-8 p-4 rounded-lg border ${biddingStatus.color}`}
            >
              <div className="flex items-center space-x-2">
                <biddingStatus.icon className="h-5 w-5" />
                <div>
                  <h3 className="font-semibold">
                    {biddingExpired
                      ? "Bidding Period Ended"
                      : "Bidding Deadline"}
                  </h3>
                  <p className="text-sm">
                    {biddingExpired
                      ? `Bidding ended on ${formatDate(
                          project.biddingDeadline
                        )}`
                      : `Deadline: ${formatDate(project.biddingDeadline)}`}
                  </p>
                  <p className="text-sm font-medium mt-1">{timeRemaining}</p>
                </div>
              </div>
            </div>
          )}

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
                {project.biddingDeadline && (
                  <p>
                    Bidding Deadline:{" "}
                    <span
                      className={`font-medium ${
                        biddingExpired ? "text-red-600" : "text-blue-600"
                      }`}
                    >
                      {formatDate(project.biddingDeadline)}
                    </span>
                  </p>
                )}
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
                      "/upload/"
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

          {/* Applications Table */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Applications ({appliedUser ? appliedUser.length : 0})
              </h2>
              {biddingExpired && (
                <div className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full">
                  No new applications accepted
                </div>
              )}
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      No.
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Freelancer Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Applied Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appliedUser && appliedUser.length > 0 ? (
                    appliedUser.map((application, index) => (
                      <>
                        <tr
                          key={index}
                          className={
                            expandedRow === index
                              ? "bg-blue-50"
                              : "hover:bg-gray-50"
                          }
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {index + 1}
                          </td>
                          <td
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                            onClick={() =>
                              navigate(
                                `/client/freelancerProfile?id=${application.freelancerId}`
                              )
                            }
                          >
                            {application.freelancerName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(application.appliedAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                                application.status
                              )}`}
                            >
                              {application.status.charAt(0).toUpperCase() +
                                application.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              {application.status === "applied" && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleStatusChange(
                                        application.freelancerId,
                                        application.freelancerName,
                                        "selected",
                                        application._id
                                      )
                                    }
                                    disabled={
                                      statusLoading ===
                                      `${application._id}-hired`
                                    }
                                    className="px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors flex items-center"
                                  >
                                    <Check size={14} className="mr-1" />
                                    {statusLoading ===
                                    `${application._id}-hired`
                                      ? "Selecting..."
                                      : "Select"}
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleStatusChange(
                                        application.freelancerId,
                                        application.freelancerName,
                                        "rejected",
                                        application._id
                                      )
                                    }
                                    disabled={
                                      statusLoading ===
                                      `${application._id}-rejected`
                                    }
                                    className="px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors flex items-center"
                                  >
                                    <X size={14} className="mr-1" />
                                    {statusLoading ===
                                    `${application._id}-rejected`
                                      ? "Rejecting..."
                                      : "Reject"}
                                  </button>
                                </>
                              )}
                              {application.status !== "applied" && (
                                <span className="text-sm text-gray-500 italic">
                                  Status already updated
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() =>
                                setExpandedRow(
                                  expandedRow === index ? null : index
                                )
                              }
                              className="text-blue-600 hover:text-blue-900 flex items-center"
                            >
                              Details
                              <ChevronDown
                                className={`ml-1 transition-transform duration-200 ${
                                  expandedRow === index
                                    ? "transform rotate-180"
                                    : ""
                                }`}
                                size={16}
                              />
                            </button>
                          </td>
                        </tr>
                        {expandedRow === index && (
                          <tr className="bg-blue-50">
                            <td colSpan={6} className="px-6 py-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900">
                                    Freelancer ID
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {application.freelancerId}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900">
                                    Application ID
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {application._id}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900">
                                    Current Status
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {application.status}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900">
                                    Applied On
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {formatDate(application.appliedAt)}
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No applications found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <BiddingRoomSection projectId={id} project={project} />
          <div className="flex mt-10 flex-col items-center space-y-4">
            <p className="text-lg font-semibold">Project completion status:</p>
            <div className="flex space-x-4">
              <button
                className={`px-6 py-2 rounded-md ${
                  project.completionStatus === "completed"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
                onClick={() => {
                  setProject((prev) => ({
                    ...prev,
                    completionStatus: "completed",
                  }));
                  toast.success("Project status updated to completed");
                }}
              >
                Completed
              </button>
              <button
                className={`px-6 py-2 rounded-md ${
                  project.completionStatus !== "completed"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
                onClick={() => {
                  setProject((prev) => ({ ...prev, completionStatus: "open" }));
                  toast.success("Project status updated to not completed");
                }}
              >
                Not Completed
              </button>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProjectDetails;
