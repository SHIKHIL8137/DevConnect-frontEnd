import {
  Search,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  Users,
  Briefcase,
  FolderOpen,
  MessageSquare,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import NavItem from "./NavItem";
import { logout } from "../../redux/slices/adminSlice";
import { useDispatch } from "react-redux";
NavItem;

const SideNavbar = ({
  isOpen,
  toggleSidebar,
  activeTab,
  setActiveTab,
  handleTap,
}) => {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: (
        <div className=" p-2 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
        </div>
      ),
    },
    {
      id: "freelancers",
      label: "Freelancers",
      icon: (
        <div className="p-2">
          <Users className="h-5 w-5 text-blue-300" />
        </div>
      ),
    },
    {
      id: "clients",
      label: "Clients",
      icon: (
        <div className="p-2">
          <Briefcase className="h-5 w-5 text-blue-300" />
        </div>
      ),
    },
    {
      id: "clientVerification",
      label: "clientVerification",
      icon: (
        <div className="p-2">
          <ShieldCheck className="h-5 w-5 text-blue-300" />
        </div>
      ),
    },
    {
      id: "projects",
      label: "Projects",
      icon: (
        <div className="p-2">
          <FolderOpen className="h-5 w-5 text-blue-300" />
        </div>
      ),
    },
    {
      id: "complaint",
      label: "Complaint",
      icon: (
        <div className="p-2">
          <MessageSquare className="h-5 w-5 text-blue-300" />
        </div>
      ),
    },
    {
      id: "payments",
      label: "Payments",
      icon: (
        <div className="p-2">
          <CreditCard className="h-5 w-5 text-blue-300" />
        </div>
      ),
    },
  ];

  const dispatch = useDispatch();

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-gradient-to-b from-indigo-900 to-blue-800 transition-all duration-300 z-20 ${
        isOpen ? "w-64" : "w-0 md:w-20"
      } overflow-hidden`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4  border-blue-700 flex items-center justify-between">
          <div
            className={`flex items-center ${
              isOpen ? "justify-between w-full" : "justify-center"
            }`}
          >
            {isOpen && (
              <h2 className="text-white font-bold text-xl">
                Dev<span className="text-blue-300">Connect</span>
              </h2>
            )}
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-full hover:bg-blue-700 md:hidden"
            >
              <Menu size={20} className="text-white" />
            </button>
          </div>
        </div>

        <div className="py-6">
          <p className="px-4 text-xs text-blue-300 mb-4 font-semibold">
            {isOpen ? "MENU" : ""}
          </p>

          {menuItems.map((item) => (
            <NavItem
              key={item.id}
              isOpen={isOpen}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
              onClick={() => {
                setActiveTab(item.id);
                handleTap();
              }}
            />
          ))}

          <div className="mt-12">
            <p className="px-4 text-xs text-blue-300 mb-4 font-semibold">
              {isOpen ? "OTHERS" : ""}
            </p>
            <NavItem
              onClick={() => dispatch(logout())}
              isOpen={isOpen}
              icon={
                <div className="p-2">
                  <LogOut className="h-5 w-5 text-blue-300" />
                </div>
              }
              label="Logout"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideNavbar;
