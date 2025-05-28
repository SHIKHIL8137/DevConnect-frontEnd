import {
  Briefcase,
  ChevronRight,
  FolderOpen,
  MessageSquare,
  Users,
} from "lucide-react";
import StatCard from "./StatCard";
import { useEffect, useState } from "react";
import { fetchDashboardData } from "../../apis/adminApi.js";
import { toast } from "sonner";
import { SkeletonCard } from "../common/skeleton.jsx";

const DashboardSummary = () => {
  const [data, setData] = useState(null);
  const [loading, setLoding] = useState(false);

  useEffect(() => {
    const dashboardData = async () => {
      try {
        setLoding(true);
        const response = await fetchDashboardData();
        if (!response.data.status) {
          toast.error(response.data.message);
        } else {
          setData(response.data.data);
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to fetch dashboard data"
        );
      } finally {
        setLoding(false);
      }
    };
    dashboardData();
  }, []);

  const getCount = (role) => {
    if (!data?.countByRole) return 0;
    const roleData = data.countByRole.find((item) => item._id === role);
    return roleData ? roleData.count : 0;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Freelancers"
          value={getCount("freelancer")}
          icon={<Users className="h-6 w-6 text-blue-600" />}
          color="blue"
        />
        <StatCard
          title="Total Clients"
          value={getCount("client")}
          icon={<Briefcase className="h-6 w-6 text-indigo-600" />}
          color="indigo"
        />
        <StatCard
          title="Active Projects"
          value="0"
          icon={<FolderOpen className="h-6 w-6 text-green-600" />}
          color="green"
        />
        <StatCard
          title="Pending Complaints"
          value="0"
          icon={<MessageSquare className="h-6 w-6 text-orange-600" />}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Recent Freelancers</h2>
            <button className="text-blue-600 flex items-center text-sm font-medium">
              View All <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
          <div className="space-y-4">
            {loading ? (
              <SkeletonCard />
            ) : (
              data?.recentFreelancers?.map((freelancer) => (
                <div
                  key={freelancer._id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {freelancer.profileImage ? (
                      <img
                        src={freelancer.profileImage}
                        alt={freelancer.userName}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center mr-3 text-white">
                        <span className="font-medium">
                          {freelancer.userName?.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{freelancer.userName}</p>
                      <p className="text-sm text-gray-500">
                        {freelancer.position}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, j) => (
                        <svg
                          key={j}
                          className={`w-4 h-4 ${
                            j < 4 ? "text-yellow-400" : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {new Date(freelancer.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Recent Clients</h2>
            <button className="text-blue-600 flex items-center text-sm font-medium">
              View All <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
          <div className="space-y-4">
            {loading ? (
              <SkeletonCard />
            ) : (
              data?.recentClients?.map((client) => (
                <div
                  key={client._id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {client.profileImage ? (
                      <img
                        src={client.profileImage}
                        alt={client.userName}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center mr-3 text-white">
                        <span className="font-medium">
                          {client.userName?.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="pl-">
                      <p className="font-medium">{client.userName}</p>
                      <p className="text-sm text-gray-500">
                        {client.companyName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {client.projects?.length || 0} Projects
                    </span>
                    <span className="ml-3 text-sm text-gray-600">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardSummary;
