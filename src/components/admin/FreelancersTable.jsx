import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { getFreelancersData, blockUser } from "../../apis/adminApi";
import debounce from "lodash.debounce";
import { toast } from "sonner";
import ConfirmBlockModal from "./bllockConformationModal";

const FreelancersTable = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState("block");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFreelancer = async () => {
      try {
        setLoading(true);
        const response = await getFreelancersData(page, search);
        console.log(response.data)
        if (response.status) {
          setFreelancers(response.data.data.freelancers);
          setTotalPages(response.data.data.totalPages);
        }
      } catch (error) {
        console.error("Error fetching freelancers:", error);
        toast.error("Failed to load freelancers");
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancer();
  }, [page, search]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleSearchChange = debounce((e) => {
    setSearch(e.target.value);
    setPage(1);
  }, 400);

  const openConfirmModal = (user) => {
    setSelectedUser(user);
    setActionType(user.block ? "unblock" : "block");
    setIsModalOpen(true);
  };

  const handleBlockAction = async (userId) => {
    try {
      if (!userId) {
        toast.error("User ID is missing");
        return;
      }

      const response = await blockUser(userId);

      if (!response || !response.data) {
        toast.error("Invalid response from server");
        return;
      }

      if (!response.data.status) {
        toast.error(response.data.message || "Failed to update user status");
        return;
      }

      setFreelancers((prevFreelancers) =>
        prevFreelancers.map((freelancer) =>
          freelancer._id === userId
            ? { ...freelancer, block: !freelancer.block }
            : freelancer
        )
      );

      toast.success(
        response.data.message || "User status updated successfully"
      );
    } catch (error) {
      console.error("Block action error:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while updating user status"
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm mt-8 border-gray-100">
      <div className="p-6 flex justify-between items-center">
        <h2 className="text-lg font-bold">Freelancers</h2>
        <div className="relative max-w-2xl mx-auto md:mx-0">
          <input
            type="text"
            placeholder="Search..."
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
                Freelancer
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">
                Skills
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">
                Rating
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">
                Joined Date
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-6 text-center">
                  <div className="flex justify-center items-center h-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                </td>
              </tr>
            ) : freelancers.length > 0 ? (
              freelancers.map((freelancer) => (
                <tr
                  key={freelancer._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-lg flex items-center justify-center  text-white">
                        {freelancer.profileImage ? (
                          <img
                            src={freelancer.profileImage}
                            alt={freelancer.userName}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center  text-white">
                            <span className="font-medium">
                              {freelancer.userName?.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {freelancer.userName || "Unknown"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {freelancer.position || "No position"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {freelancer.skills && freelancer.skills.length > 0
                      ? freelancer.skills.join(", ")
                      : "No skills listed"}
                  </td>
                  <td className="p-4 text-sm text-gray-600">N/A</td>
                  <td className="p-4 text-sm text-gray-600">
                    {freelancer.createdAt
                      ? new Date(freelancer.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </td>
                  <td className="p-4">
                    <button
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        freelancer.block
                          ? "text-red-600 border border-red-200 hover:bg-red-50"
                          : "text-green-600 border border-green-200 hover:bg-green-50"
                      }`}
                      onClick={() => openConfirmModal(freelancer)}
                    >
                      {freelancer.block ? "Blocked" : "Active"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No freelancers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && (
        <div className="p-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`w-8 h-8 flex items-center justify-center rounded-lg mr-2 ${
                page === 1 ? "text-gray-300" : "hover:bg-gray-50 text-gray-600"
              }`}
            >
              <ChevronLeft size={16} />
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
                  onClick={() => handlePageChange(pageToShow)}
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
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                page === totalPages
                  ? "text-gray-300"
                  : "hover:bg-gray-50 text-gray-600"
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      <ConfirmBlockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleBlockAction}
        user={selectedUser}
        actionType={actionType}
      />
    </div>
  );
};

export default FreelancersTable;
