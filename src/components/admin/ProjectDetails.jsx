import React from "react";
import {
  ArrowLeft,
  Users,
  Calendar,
  DollarSign,
  Clock,
  Paperclip,
  FileText,
  AlertCircle,
} from "lucide-react";

const ProjectDetails = ({ project }) => {
  if (!project) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-700";
      case "hired":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getBiddingDeadlineStatus = (deadlineString) => {
    if (!deadlineString) return { color: "text-gray-500", text: "No deadline set" };
    
    const deadline = new Date(deadlineString);
    const now = new Date();
    const timeDiff = deadline - now;
    
    if (timeDiff < 0) {
      return { color: "text-red-600", text: "Deadline passed" };
    } else if (timeDiff < 24 * 60 * 60 * 1000) { // Less than 24 hours
      return { color: "text-orange-600", text: "Ending soon" };
    } else {
      return { color: "text-green-600", text: "Active" };
    }
  };

  const deadlineStatus = getBiddingDeadlineStatus(project.biddingDeadline);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Removed the back button since it's now handled in the parent component */}

      <h1 className="text-2xl font-bold text-gray-900 mb-6">{project.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div>
          <h4 className="text-lg font-semibold mb-4">Project Information</h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <div className="mt-1 text-base">{project.description}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Features
              </label>
              <div className="mt-1 text-base">
                {project.features || "No specific features mentioned"}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Preferences
              </label>
              <div className="mt-1 text-base">
                {project.preferences || "No specific preferences mentioned"}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Project Details</h4>

          <div className="space-y-4">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Budget
                </label>
                <div className="mt-1 text-base">
                  ₹{project.budget?.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Timeline
                </label>
                <div className="mt-1 text-base">{project.timeline} days</div>
              </div>
            </div>

            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Created On
                </label>
                <div className="mt-1 text-base">
                  {formatDate(project.createdAt)}
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bidding Deadline
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-base">
                    {formatDateTime(project.biddingDeadline)}
                  </span>
                  <span className={`text-xs font-medium ${deadlineStatus.color}`}>
                    ({deadlineStatus.text})
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <FileText className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="mt-1">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.completionStatus === "open"
                        ? "bg-blue-100 text-blue-700"
                        : project.completionStatus === "committed"
                        ? "bg-yellow-100 text-yellow-700"
                        : project.completionStatus === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {project.completionStatus?.charAt(0).toUpperCase() +
                      project.completionStatus?.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {project.attachments && project.attachments.length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-semibold mb-3">Attachments</h4>
          <div className="flex flex-wrap gap-2">
            {project.attachments.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center px-3 py-2 rounded bg-gray-50 border border-gray-200"
              >
                <Paperclip className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600 truncate max-w-xs">
                  {attachment.split("/").pop()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h4 className="text-lg font-semibold mb-3">Applied Freelancers</h4>
        {project.appliedUsers && project.appliedUsers.length > 0 ? (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">
                      Freelancer
                    </th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">
                      Status
                    </th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">
                      Applied Date
                    </th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">
                      Updated Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {project.appliedUsers.map((user) => (
                    <tr
                      key={user.freelancerId}
                      className="border-t border-gray-200"
                    >
                      <td className="py-3 px-3 text-sm">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center mr-2 text-white">
                            <span>{user.freelancerName?.charAt(0)}</span>
                          </div>
                          <div>{user.freelancerName}</div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            user.status
                          )}`}
                        >
                          {user.status?.charAt(0).toUpperCase() +
                            user.status?.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-sm">
                        {formatDate(user.appliedAt)}
                      </td>
                      <td className="py-3 px-3 text-sm">
                        {formatDate(user.updatedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 bg-gray-50 rounded-lg">
            <Users className="h-8 w-8 text-gray-400 mx-auto" />
            <p className="mt-2 text-sm text-gray-500">
              No freelancers have applied yet
            </p>
          </div>
        )}
      </div>

      {project.freelancerId && project.freelancerId.length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-semibold mb-3">Assigned Freelancers</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex flex-wrap gap-2">
              {project.freelancerId.map((freelancerId, index) => (
                <div
                  key={index}
                  className="flex items-center px-3 py-2 rounded bg-green-50 border border-green-200"
                >
                  <Users className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-700">
                    Freelancer #{freelancerId.substring(0, 8)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;