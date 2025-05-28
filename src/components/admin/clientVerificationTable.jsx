import {
  ChevronLeft,
  ChevronRight,
  Search,
  ExternalLink,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getVerificationRequests } from "../../apis/adminApi";

const ClientVerificationTable = ({ onReviewClick }) => {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVerificationRequests = async () => {
      setLoading(true);
      try {
        const response = await getVerificationRequests(page,search);
        if (response.data.status) {
          setRequests(response.data?.verifications);
          setTotalPages(response.data?.pagination?.pages || 1);
        }
      } catch (error) {
        console.error("Error fetching verification requests:", error);
        toast.error("Failed to load verification requests");
      } finally {
        setLoading(false);
      }
    };

    fetchVerificationRequests();
  }, [page, search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "verified":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            Verified
          </span>
        );
      case "rejected":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm mt-8 border border-gray-100">
      <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-lg font-bold">Verification Requests</h2>
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full md:w-64 px-4 py-2 pl-10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            onChange={handleSearchChange}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-4 pl-6 text-sm font-medium text-gray-500">
                Client
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">
                Email
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">
                Phone
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">
                Requested Date
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">
                Status
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-6 text-center">
                  <div className="flex justify-center items-center h-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-8 text-gray-500">
                  No verification requests found
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr
                  key={request._id || request.requestId}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 pl-6">
                    <div className="flex items-center">
                      {request.profileImage ? (
                        <img
                          src={request.profileImage}
                          alt={request.userName}
                          className="w-10 h-10 rounded-lg mr-3 object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-lg flex items-center justify-center mr-3 text-white">
                          <span className="font-medium">
                            {request.userName?.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{request.userName}</p>
                        <p className="text-sm text-gray-500">
                          {request.companyName || "Individual"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm">{request.email}</td>
                  <td className="p-4 text-sm">{request.phoneNumber}</td>
                  <td className="p-4 text-sm text-gray-600">
                    {formatDate(request.requestDate || request.createdAt)}
                  </td>
                  <td className="p-4">{getStatusBadge(request.status)}</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onReviewClick(request.clientId
)}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center"
                      >
                        <ExternalLink size={14} className="mr-1" />
                        Review
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </div>
        <div className="flex items-center">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="w-8 h-8 flex items-center justify-center rounded-lg mr-2 hover:bg-gray-50"
            disabled={page === 1}
          >
            <ChevronLeft
              size={16}
              className={page === 1 ? "text-gray-300" : "text-gray-600"}
            />
          </button>

          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let pageToShow;
            if (totalPages <= 5) {
              pageToShow = i + 1;
            } else if (page <= 3) {
              pageToShow = i + 1;
            } else if (page >= totalPages - 2) {
              pageToShow = totalPages - 4 + i;
            } else {
              pageToShow = page - 2 + i;
            }

            return (
              <button
                key={pageToShow}
                onClick={() => setPage(pageToShow)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg mr-2 ${
                  pageToShow === page
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-50 text-gray-600"
                }`}
              >
                <span className="text-sm">
                  {String(pageToShow).padStart(2, "0")}
                </span>
              </button>
            );
          })}

          <button
            onClick={() =>
              setPage((prev) => (prev < totalPages ? prev + 1 : prev))
            }
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50"
            disabled={page === totalPages}
          >
            <ChevronRight
              size={16}
              className={
                page === totalPages ? "text-gray-300" : "text-gray-600"
              }
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientVerificationTable;
