import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
  Clock,
  DollarSign,
  User,
} from "lucide-react";
import ProjectStatusBadge from "./utilsComponent/ProjectStatusBadge ";
import { fetchProjects } from "../../apis/adminApi";
import debounce from "lodash.debounce";

const ProjectsTable = ({ onProjectClick }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProjectsData = async () => {
    setLoading(true);
    try {
      const response = await fetchProjects(page, searchTerm);

      if (response.data.status) {
        setProjects(response.data.data.projects);
        setTotalPages(response.data.data.totalPages || 1);
      } else {
        console.error("Failed to fetch projects:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectsData();
  }, [page, searchTerm]);

  const handleSearchChange = debounce((e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  }, 400);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Now simply passes the project to the parent component
  const handleViewDetails = (project) => {
    onProjectClick(project);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm mt-8 border-gray-100">
      <div className="p-6 flex justify-between items-center">
        <h2 className="text-lg font-bold">Projects</h2>
        <div className="relative max-w-2xl mx-auto md:mx-0">
          <input
            type="text"
            placeholder="Search projects..."
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
                Project
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">
                Client
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">
                Budget
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">
                Timeline
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">
                Status
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">
                Created
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">
                Actions
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
            ) : projects.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  No projects found.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr
                  key={project._id}
                  className="hover:bg-gray-50 transition-colors border-t border-gray-100"
                >
                  <td className="p-4 pl-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center mr-3 text-white">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="font-medium truncate max-w-xs">
                          {project.title}
                        </p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {project.description &&
                            project.description.substring(0, 50)}
                          {project.description &&
                          project.description.length > 50
                            ? "..."
                            : ""}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <User size={16} className="text-gray-400 mr-2" />
                      <span className="text-sm">
                        Client #{project.clientId?.substring(0, 8) || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-medium">
                    <div className="flex items-center">
                      ₹{project.budget?.toLocaleString()}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock size={16} className="text-gray-400 mr-1" />
                      {project.timeline} days
                    </div>
                  </td>
                  <td className="p-4">
                    <ProjectStatusBadge status={project.completionStatus} />
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {formatDate(project.createdAt)}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleViewDetails(project)}
                      className="px-4 py-1.5 rounded-lg text-sm font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 transition-all duration-200"
                    >
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

export default ProjectsTable;
