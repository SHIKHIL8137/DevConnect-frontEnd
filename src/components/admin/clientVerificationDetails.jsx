import { useState, useEffect } from "react";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Twitter,
  Linkedin,
  Globe,
  MapPin,
  Phone,
  Mail,
  Building,
  User,
} from "lucide-react";

import { VerifyClientSkeleton } from "../common/skeleton.jsx";
import { toast } from "sonner";
import {
  getClientVerificationDetails,
  verifyOrRejectUser,
} from "../../apis/adminApi";

const ClientVerificationDetail = ({ verificationDataID}) => {

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const fetchClientDetails = async () => {
    try {
      setLoading(true);
      const response = await getClientVerificationDetails(verificationDataID);
      if (response) {
        setClient(response.data.verification);
      } else {
        toast.error("Failed to load client details");
      }
    } catch (error) {
      console.error("Error fetching client details:", error);
      toast.error("An error occurred while fetching client details");
    } finally {
      setLoading(false);
    }
  };
  const handleVerificationAction = async (action) => {
    try {
      const formData = {
        userId: client?.clientId,
        message: verificationMessage,
        action,
        requestId: client._id,
      };
      const response = await verifyOrRejectUser(formData);
      if (response.data.status) {
        toast.success(response.data.message);
        setShowRejectModal(false);
        setShowVerifyModal(false);
        fetchClientDetails();
      } else {
        toast.error(response.data.message || "Action failed");
      }
    } catch (error) {
      console.error(`Error in ${action}:`, error);
      toast.error(`An error occurred during ${action}`);
    }
  };

  useEffect(() => {
    fetchClientDetails();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const getVerificationStatusBadge = (status) => {
    switch (status) {
      case "verified":
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
            Verified
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {loading ? (
        <VerifyClientSkeleton />
      ) : (
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {client?.user?.profileImage ? (
                  <img
                    src={client?.user?.profileImage}
                    alt={client?.user?.userName}
                    className="w-16 h-16 rounded-lg mr-4 object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center mr-4 text-white text-xl font-bold">
                    {client?.user?.userName?.charAt(0)}
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {client?.user?.userName}
                  </h1>
                  <div className="flex items-center mt-1">
                    {client?.user?.companyName && (
                      <div className="flex items-center text-gray-600 mr-4">
                        <Building size={16} className="mr-1" />
                        {client?.user?.companyName}
                      </div>
                    )}
                    <div className="ml-2">
                      {getVerificationStatusBadge(
                        client?.status || "pending"
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {(!client?.status ||
                client?.status === "pending") && (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowVerifyModal(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <CheckCircle size={18} className="mr-2" />
                    Verify
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

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <User className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">User ID</p>
                    <p className="text-gray-800">{client?.clientId}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Email</p>
                    <p className="text-gray-800">{client?.user?.email}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Phone Number
                    </p>
                    <p className="text-gray-800">
                      {client?.user?.phoneNumber || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Address</p>
                    <p className="text-gray-800">
                      {client?.user?.address || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Online Presence
              </h2>
              <div className="space-y-4">
                {client?.user?.web && (
                  <div className="flex items-start">
                    <Globe className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Website
                      </p>
                      <a
                        href={
                          client?.user?.web.startsWith("http")
                            ? client?.user?.web
                            : `https://${client?.user?.web}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {client?.user?.web}
                      </a>
                    </div>
                  </div>
                )}

                {client?.user?.linkedIn && (
                  <div className="flex items-start">
                    <Linkedin className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        LinkedIn
                      </p>
                      <a
                        href={
                          client?.user?.linkedIn.startsWith("http")
                            ? client?.user?.linkedIn
                            : `https://linkedin.com/in/${client?.user?.linkedIn}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {client?.user?.linkedIn}
                      </a>
                    </div>
                  </div>
                )}

                {client?.user?.twitter && (
                  <div className="flex items-start">
                    <Twitter className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Twitter
                      </p>
                      <a
                        href={
                          client?.user?.twitter.startsWith("http")
                            ? client?.user?.twitter
                            : `https://twitter.com/${client?.user?.twitter}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {client?.user?.twitter}
                      </a>
                    </div>
                  </div>
                )}

                {!client?.user?.web && !client?.user?.linkedIn && !client?.user?.twitter && (
                  <p className="text-gray-500 italic">
                    No online presence information provided
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Account Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Account Created
                </p>
                <p className="text-gray-800">{formatDate(client?.user?.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Last Login</p>
                <p className="text-gray-800">
                  {formatDate(client?.user?.lastLogin) || "Never"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Verification Requested
                </p>
                <p className="text-gray-800">
                  {formatDate(client?.requestDate) ||
                    "N/A"}
                </p>
              </div>
            </div>
          </div>

          {(client?.status === "verified" ||
            client?.status === "rejected") && (
            <div className="p-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Verification History
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  {client?.status === "verified" ? (
                    <CheckCircle size={18} className="text-green-600 mr-2" />
                  ) : (
                    <XCircle size={18} className="text-red-600 mr-2" />
                  )}
                  <p className="font-medium">
                    {client?.status === "verified"
                      ? "Verified"
                      : "Rejected"}{" "}
                    on {formatDate(client?.verificationDate)}
                  </p>
                </div>
                {client?.message && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-600">
                      Message:
                    </p>
                    <p className="text-gray-800 mt-1">
                      {client?.message}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {showVerifyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Verify Client</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to verify {client?.user?.userName}? This action
              will grant them verified status on the platform.
            </p>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Verification Message (Optional)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Enter a message that will be sent to the client"
                value={verificationMessage}
                onChange={(e) => setVerificationMessage(e.target.value)}
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowVerifyModal(false);
                  setVerificationMessage("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleVerificationAction("verified")}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Reject Verification</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to reject {client?.user?.userName}'s verification
              request?
            </p>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Please provide a reason for rejection"
                value={verificationMessage}
                onChange={(e) => setVerificationMessage(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setVerificationMessage("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleVerificationAction("rejected")}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={!verificationMessage.trim()}
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

export default ClientVerificationDetail;
