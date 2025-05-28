import { ChevronLeft, ChevronRight, Search, Eye, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { getComplaintsData } from "../../apis/adminApi";
import debounce from "lodash.debounce";

const ComplaintsTable = ({ onComplaintClick }) => {
  const [complaints, setComplaints] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const response = await getComplaintsData(page, search);
        if (response.data.status) {
          setComplaints(response.data.complaintsData
.complaints);
          setTotalPages(response.data.complaintsData.totalPages || 1);
        }
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [page, search]);

  const handleSearchChange = debounce((e) => {
    setSearch(e.target.value);
    setPage(1);
  }, 400);

  const formatDate = (dateStr) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "resolved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getComplainantTypeColor = (type) => {
    return type === "client" 
      ? "bg-blue-100 text-blue-700" 
      : "bg-purple-100 text-purple-700";
  };

  const handleViewDetails = (complaint) => {
    onComplaintClick(complaint);
  };

  const truncateText = (text, maxLength = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm mt-8 border-gray-100">
      <div className="p-6 flex justify-between items-center">
        <h2 className="text-lg font-bold">Complaints</h2>
        <div className="relative max-w-2xl mx-auto md:mx-0">
          <input
            type="text"
            placeholder="Search complaints..."
            className="w-full px-4 py-2 pl-10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
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
                Complaint ID
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">
                Type
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">
                Subject
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">
                Status
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">
                Attachments
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">
                Date
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-6 text-center">
                  <div className="flex justify-center items-center h-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                </td>
              </tr>
            ) : complaints.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  No complaints found.
                </td>
              </tr>
            ) : (
              complaints.map((complaint) => (
                <tr
                  key={complaint._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 pl-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center mr-3 text-white">
                        <FileText size={16} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          #{complaint._id.slice(-6).toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {complaint.complainantType}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getComplainantTypeColor(complaint.complainantType)}`}>
                      {complaint.complainantType === "client" ? "Client" : "Freelancer"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-sm">
                        {truncateText(complaint.subject, 30)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {truncateText(complaint.description, 40)}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                      {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      {complaint.attachments && complaint.attachments.length > 0 ? (
                        <span className="px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-600">
                          {complaint.attachments.length} file{complaint.attachments.length > 1 ? 's' : ''}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">No files</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {formatDate(complaint.createdAt)}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleViewDetails(complaint._id)}
                      className="flex items-center px-3 py-1.5 rounded-lg text-sm font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 transition-all duration-200"
                    >
                      <Eye size={14} className="mr-1" />
                      View Details
                    </button>
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

export default ComplaintsTable;