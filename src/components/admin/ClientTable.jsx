import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { getClientsData, blockUser } from "../../apis/adminApi";
import debounce from "lodash.debounce";
import { toast } from "sonner";
import ConfirmBlockModal from "./bllockConformationModal";

const ClientsTable = () => {
  const [clients, setClients] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState("block");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const response = await getClientsData(page, search);
        if (response.status) {
          setClients(response.data.data.clients);
          setTotalPages(response.data.data.totalPages || 1);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [page, search]);

  const handleSearchChange = debounce((e) => {
    setSearch(e.target.value);
    setPage(1);
  }, 400);

  const formatDate = (dateStr) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const openConfirmModal = (client) => {
    setSelectedUser(client);
    setActionType(client.block ? "unblock" : "block");
    setIsModalOpen(true);
  };

  const blockAction = async (clientId) => {
    try {
      const response = await blockUser(clientId);
      if (!response.data.status) return toast.error(response.data.message);

      setClients((prevClients) =>
        prevClients.map((client) =>
          client._id === clientId ? { ...client, block: !client.block } : client
        )
      );

      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm mt-8 border-gray-100">
      <div className="p-6 flex justify-between items-center">
        <h2 className="text-lg font-bold">Clients</h2>
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
                Client
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">
                Projects
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">
                Total Spent
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
            ) : clients.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No clients found.
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr
                  key={client._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 pl-6">
                    <div className="flex items-center">
                      {client.profileImage ? (
                        <img
                          src={client.profileImage}
                          alt={client.userName}
                          className="w-10 h-10 rounded-lg mr-3 object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center mr-3 text-white">
                          <span className="font-medium">
                            {client.userName?.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{client.userName}</p>
                        <p className="text-sm text-gray-500">
                          {client.companyName || "Individual"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {client.projects?.length || 0} Projects
                    </span>
                  </td>
                  <td className="p-4 text-sm font-medium">₹0</td>
                  <td className="p-4 text-sm text-gray-600">
                    {formatDate(client.createdAt)}
                  </td>
                  <td className="p-4">
                    <button
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        client.block
                          ? "text-red-600 border border-red-200 hover:bg-red-50"
                          : "text-green-600 border border-green-200 hover:bg-green-50"
                      }`}
                      onClick={() => openConfirmModal(client)}
                    >
                      {client.block ? "Blocked" : "Active"}
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
            // Show current page and adjacent pages
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

      <ConfirmBlockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={blockAction}
        user={selectedUser}
        actionType={actionType}
      />
    </div>
  );
};

export default ClientsTable;
