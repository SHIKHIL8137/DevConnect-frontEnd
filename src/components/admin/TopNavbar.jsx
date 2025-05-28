import {
  Search,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  Bell,
  Settings,
  MoreHorizontal,
} from "lucide-react";
import { useSelector } from "react-redux";

const TopNavbar = ({ toggleSidebar }) => {
  const { admin } = useSelector((state) => state.admin);

  return (
    <div className="bg-white shadow-sm flex items-center justify-end p-4 md:pl-24">
      <div className="flex items-center md:hidden">
        <button
          onClick={toggleSidebar}
          className="p-1 mr-4 hover:bg-gray-100 rounded-lg"
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="flex items-center ml-4 space-x-4">
        <div className="flex items-center">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white">
              <span className="text-sm font-medium">
                {admin?.name?.slice(0, 2)?.toUpperCase() || "AD"}
              </span>
            </div>
          </div>

          <div className="ml-3 hidden md:block">
            <p className="text-sm font-medium">{admin?.name || "Admin"}</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
