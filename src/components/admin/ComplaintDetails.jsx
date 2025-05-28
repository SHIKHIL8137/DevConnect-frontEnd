import { useState, useEffect } from "react";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  MessageSquare,
  User,
  Clock,
  FileText,
  AlertTriangle,
  Eye,
  Download,
} from "lucide-react";

import { toast } from "sonner";
import { getComplaintDetails, updateComplaint } from "../../apis/adminApi";

const ComplaintDetail = ({ complaint: complaintId }) => {
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adminMessage, setAdminMessage] = useState("");
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  
  const fetchComplaintDetails = async () => {
    try {
      setLoading(true);
      const response = await getComplaintDetails(complaintId);
      console.log(response);

      if (response && response.data.status && response.data.complaintData) {
        const mappedComplaint = {
          ...response.data.complaintData.complaint,
          complainant: response.data.complaintData.complainter.user,
          againstUser: response.data.complaintData.againster.user
        };
        
        setComplaint(mappedComplaint);
      } else {
        toast.error("Failed to load complaint details");
      }
    } catch (error) {
      console.error("Error fetching complaint details:", error);
      toast.error("An error occurred while fetching complaint details");
    } finally {
      setLoading(false);
    }
  };

  const handleComplaintAction = async (action) => {
    try {
      const formData = {
        adminMessage: adminMessage,
        status: action,
      };

      if(!formData.adminMessage.trim()){
        toast.error('Please fill the message')
        return
      }

      const response = await updateComplaint(complaint._id,formData);
          
      if (response.data.status) {
        toast.success(response.data.message);
        setShowResolveModal(false);
        setShowRejectModal(false);
        setAdminMessage("");
        fetchComplaintDetails();
      } else {
        toast.error(response.data.message || "Action failed");
      }
    } catch (error) {
      console.error(`Error in ${action}:`, error);
      toast.error(`An error occurred during ${action}`);
    }
  };

  useEffect(() => {
    if (complaintId) {
      fetchComplaintDetails();
    }
  }, [complaintId]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const options = { 
      year: "numeric", 
      month: "long", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "resolved":
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
            Resolved
          </span>
        );
      case "rejected":
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
            Pending
          </span>
        );
    }
  };

  const getComplainantTypeBadge = (type) => {
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        type === 'client' 
          ? 'bg-blue-100 text-blue-700' 
          : 'bg-purple-100 text-purple-700'
      }`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        role === 'client' 
          ? 'bg-blue-100 text-blue-700' 
          : 'bg-purple-100 text-purple-700'
      }`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const getComplaintTypeDescription = (complainantType) => {
    switch (complainantType) {
      case 'client':
        return 'Client filed complaint against Freelancer';
      case 'freelancer':
        return 'Freelancer filed complaint against Client';
      default:
        return 'Complaint filed';
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Complaint Not Found
          </h2>
          <p className="text-gray-600">
            The requested complaint could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-lg flex items-center justify-center mr-4 text-white text-xl">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Complaint Details
                </h1>
                <div className="flex items-center mt-1 space-x-3">
                  <div className="text-gray-600 text-sm">
                    ID: {complaint._id}
                  </div>
                  <div>{getStatusBadge(complaint.status)}</div>
                  <div>{getComplainantTypeBadge(complaint.complainantType)}</div>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {getComplaintTypeDescription(complaint.complainantType)}
                </div>
              </div>
            </div>

            {complaint.status === "pending" && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowResolveModal(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <CheckCircle size={18} className="mr-2" />
                  Resolve
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                >
                  <XCircle size={18} className="mr-2" />
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Complaint Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Complaint Details */}
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Complaint Information
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Subject</p>
                  <p className="text-gray-800 font-medium">{complaint.subject}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Description</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-800 leading-relaxed">
                      {complaint.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Filed On</p>
                    <p className="text-gray-800">{formatDate(complaint.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Last Updated</p>
                    <p className="text-gray-800">{formatDate(complaint.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Parties Involved */}
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Parties Involved
              </h2>
              <div className="space-y-4">
                {/* Complainant */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <User className="w-5 h-5 text-gray-500 mr-2" />
                    <h3 className="font-medium text-gray-800">Complainant</h3>
                    <div className="ml-2 flex space-x-2">
                      {getRoleBadge(complaint.complainant.role)}
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        Filed By
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      {complaint.complainant.profileImage && (
                        <img 
                          src={complaint.complainant.profileImage} 
                          alt="Profile" 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="text-gray-800 font-medium">
                          {complaint.complainant.userName}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {complaint.complainant.email}
                        </p>
                      </div>
                    </div>
                    
                    {complaint.complainant.companyName && (
                      <p className="text-gray-600 text-sm">
                        <span className="font-medium">Company:</span> {complaint.complainant.companyName}
                      </p>
                    )}
                    
                    {complaint.complainant.phoneNumber && (
                      <p className="text-gray-600 text-sm">
                        <span className="font-medium">Phone:</span> {complaint.complainant.phoneNumber}
                      </p>
                    )}
                    
                    {complaint.complainant.address && (
                      <p className="text-gray-600 text-sm">
                        <span className="font-medium">Address:</span> {complaint.complainant.address}
                      </p>
                    )}

                    {complaint.complainant.skills && complaint.complainant.skills.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-600 mb-1">Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {complaint.complainant.skills.map((skill, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {complaint.complainant.role === 'freelancer' && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {complaint.complainant.position && (
                          <p className="text-gray-600 text-sm">
                            <span className="font-medium">Position:</span> {complaint.complainant.position}
                          </p>
                        )}
                        {complaint.complainant.experienceLevel && (
                          <p className="text-gray-600 text-sm">
                            <span className="font-medium">Experience:</span> {complaint.complainant.experienceLevel}
                          </p>
                        )}
                        {complaint.complainant.pricePerHour && complaint.complainant.pricePerHour !== "0" && (
                          <p className="text-gray-600 text-sm">
                            <span className="font-medium">Rate:</span> ${complaint.complainant.pricePerHour}/hr
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Against User */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <User className="w-5 h-5 text-gray-500 mr-2" />
                    <h3 className="font-medium text-gray-800">Complaint Against</h3>
                    <div className="ml-2 flex space-x-2">
                      {getRoleBadge(complaint.againstUser.role)}
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                        Accused
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      {complaint.againstUser.profileImage && (
                        <img 
                          src={complaint.againstUser.profileImage} 
                          alt="Profile" 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="text-gray-800 font-medium">
                          {complaint.againstUser.userName}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {complaint.againstUser.email}
                        </p>
                      </div>
                    </div>
                    
                    {complaint.againstUser.companyName && (
                      <p className="text-gray-600 text-sm">
                        <span className="font-medium">Company:</span> {complaint.againstUser.companyName}
                      </p>
                    )}
                    
                    {complaint.againstUser.phoneNumber && (
                      <p className="text-gray-600 text-sm">
                        <span className="font-medium">Phone:</span> {complaint.againstUser.phoneNumber}
                      </p>
                    )}
                    
                    {complaint.againstUser.address && (
                      <p className="text-gray-600 text-sm">
                        <span className="font-medium">Address:</span> {complaint.againstUser.address}
                      </p>
                    )}

                    {complaint.againstUser.skills && complaint.againstUser.skills.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-600 mb-1">Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {complaint.againstUser.skills.map((skill, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {complaint.againstUser.role === 'freelancer' && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {complaint.againstUser.position && (
                          <p className="text-gray-600 text-sm">
                            <span className="font-medium">Position:</span> {complaint.againstUser.position}
                          </p>
                        )}
                        {complaint.againstUser.experienceLevel && (
                          <p className="text-gray-600 text-sm">
                            <span className="font-medium">Experience:</span> {complaint.againstUser.experienceLevel}
                          </p>
                        )}
                        {complaint.againstUser.pricePerHour && complaint.againstUser.pricePerHour !== "0" && (
                          <p className="text-gray-600 text-sm">
                            <span className="font-medium">Rate:</span> ${complaint.againstUser.pricePerHour}/hr
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Attachments */}
        {complaint.attachments && complaint.attachments.length > 0 && (
          <div className="p-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Attachments
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {complaint.attachments.map((attachment, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center">
                    <FileText className="w-8 h-8 text-gray-400 mr-3" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {attachment.split('/').pop() || `Attachment ${index + 1}`}
                      </p>
                      <div className="flex space-x-2 mt-2">
                        <button 
                          onClick={() => window.open(attachment, '_blank')}
                          className="text-xs text-blue-600 hover:underline flex items-center"
                        >
                          <Eye size={12} className="mr-1" />
                          View
                        </button>
                        <a 
                          href={attachment}
                          download
                          className="text-xs text-blue-600 hover:underline flex items-center"
                        >
                          <Download size={12} className="mr-1" />
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin Action History */}
        {(complaint.status === "resolved" || complaint.status === "rejected") && (
          <div className="p-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Admin Action History
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                {complaint.status === "resolved" ? (
                  <CheckCircle size={18} className="text-green-600 mr-2" />
                ) : (
                  <XCircle size={18} className="text-red-600 mr-2" />
                )}
                <p className="font-medium">
                  Complaint {complaint.status} on {formatDate(complaint.updatedAt)}
                </p>
              </div>
              {complaint.adminMessage && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-600">
                    Admin Message:
                  </p>
                  <p className="text-gray-800 mt-1">
                    {complaint.adminMessage}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Resolve Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Resolve Complaint</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to resolve this complaint? This action will mark
              the complaint as resolved and notify both parties.
            </p>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Resolution Message
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="3"
                placeholder="Enter a message explaining the resolution..."
                value={adminMessage}
                onChange={(e) => setAdminMessage(e.target.value)}
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowResolveModal(false);
                  setAdminMessage("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleComplaintAction("resolved")}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Resolve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Reject Complaint</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to reject this complaint? This action will
              dismiss the complaint and notify both parties.
            </p>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                rows="3"
                placeholder="Please provide a reason for rejecting this complaint..."
                value={adminMessage}
                onChange={(e) => setAdminMessage(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setAdminMessage("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleComplaintAction("rejected")}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={!adminMessage.trim()}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintDetail;