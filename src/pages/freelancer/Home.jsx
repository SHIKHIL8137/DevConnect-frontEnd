import { useState, useEffect, useCallback } from "react";
import {
  Star,
  ChevronDown,
  Filter,
  Search,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import Navbar from "../../components/user/navbar/navbar";
import Footer from "../../components/user/footer/Footer";

import { FreelancerSkeletonHome } from "../../components/common/skeleton";
import { useNavigate } from "react-router-dom";
import { freelancerHome } from "../../apis/userApi";
import { useSelector } from "react-redux";
import ProjectCard from "../../components/user/home/ProjectCard";

const FreelancerProjectListing = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [duration, setDuration] = useState(""); 
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
   const [completionStatus, setCompletionStatus] = useState("");
  const [selectedCompletionStatus, setSelectedCompletionStatus] = useState("All");
   const [datePosted, setDatePosted] = useState("");
  const [selectedDatePosted, setSelectedDatePosted] = useState("All");
  const [totalProjects, setTotalProjects] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await freelancerHome({
        search,
        category,
        minBudget,
        maxBudget,
        duration,
        page,
        limit: 5,
        sortBy,
        sortOrder,
        completionStatus,
    datePosted,
      });
      console.log(response.data)
      setProjects(response.data.data);
      setTotalPages(response.data.pages);
      setTotalProjects(response.data.total);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects", error);
      setProjects([]);
      setLoading(false);
    }
  }, [
    search,
    category,
    minBudget,
    maxBudget,
    duration,
    page,
    sortBy,
    completionStatus,
    datePosted,
    sortOrder,
    completionStatus,
    datePosted,
  ]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProjects();
  };

  const handleSort = (e) => {
    const value = e.target.value;

    if (value === "relevance") {
      setSortBy("");
      setSortOrder("");
    } else {
      const [newSortBy, newSortOrder] = value.split("_");
      setSortBy(newSortBy);
      setSortOrder(newSortOrder);
    }

    setPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setMinBudget("");
    setMaxBudget("");
    setSelectedBudget("");
    setDuration("");
    setCompletionStatus("");
    setDatePosted("");
    setSelectedDatePosted("All");
    setSelectedCompletionStatus("All");
    setSelectedDuration("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };



  const budgetRanges = [
    { label: "₹0 - ₹1,0000", min: "0", max: "10000" },
    { label: "₹10,000 - ₹50,000", min: "10000", max: "50000" },
    { label: "₹50,000 - ₹1,00,000", min: "50000", max: "10000" },
    { label: "₹1,00,000+", min: "100000", max: "" },
  ];

  const projectDurations = [
    "Less than 1 month",
    "1-3 months",
    "3-6 months",
    "6+ months",
  ];

const completionStatuses = [
    "open",
    "committed",
    "completed",
    "cancelled",
  ];

const datePostedOptions = [
    "Last 24 hours",
    "Last 3 days",
    "Last week",
    "Last month",
  ];

  const handleDatePostedSelect = (date) => {
    setSelectedDatePosted(date);
    setDatePosted(date === "All" ? "" : date);
    setPage(1);
  };

  const handleCompletionStatusSelect = (status) => {
    setSelectedCompletionStatus(status);
    setCompletionStatus(status === "All" ? "" : status);
    setPage(1);
  };



  const handleBudgetSelect = (budget) => {
    setSelectedBudget(budget.label);
    setMinBudget(budget.min);
    setMaxBudget(budget.max);
    setPage(1);
  };

  const handleDurationSelect = (duration) => {
    setSelectedDuration(duration);
    setDuration(duration);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const displayProjects = loading ? (
    []
  ) : projects.length > 0 ? (
    projects
  ) : (
    <p>No projects found.</p>
  );

  return (
    <>
      <div className="relative min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 px-4 py-8">
        <Navbar />
        <div className="text-center max-w-3xl mx-auto mt-30">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Find the Perfect Project for Your Skills
          </h1>
          <p className="text-white text-lg md:text-xl mb-8 opacity-90">
            Browse available projects that match your expertise in development,
            design, and IT solutions
          </p>
        </div>

        <div className="absolute bottom-6 right-6">
          <button className="bg-white text-blue-600 rounded-full p-4 shadow-lg hover:bg-blue-50 transition-colors">
            <MessageSquare size={24} />
          </button>
        </div>
      </div>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white">
        <div className="container mx-auto px-4 py-6">
            <div className="mb-6">
          <div className="relative flex-grow max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by skill, role or keyword..."
              className="block w-full pl-10 pr-3 py-4 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-center shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
          <div className="flex flex-col lg:flex-row">
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="flex items-center justify-center w-full bg-white p-3 rounded-lg shadow text-gray-700"
              >
                <Filter size={20} className="mr-2" />
                <span>Filters</span>
                <ChevronDown
                  size={20}
                  className={`ml-2 transition-transform ${
                    mobileFiltersOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            <div
              className={`lg:w-1/4 pr-0 lg:pr-6 ${
                mobileFiltersOpen ? "block" : "hidden lg:block"
              }`}
            >
              <div className="bg-white p-5 rounded-lg shadow mb-4">
                <div className="font-medium text-gray-800 mb-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Filter size={18} className="mr-2" />
                    Filters
                  </div>
                  {/* Add Reset Button */}
                  <button
                    onClick={resetFilters}
                    className="flex items-center text-blue-500 hover:text-blue-700 text-sm"
                  >
                    <RefreshCw size={14} className="mr-1" />
                    Reset All
                  </button>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-3">
                    Budget Range
                  </h3>
                  <ul>
                    {budgetRanges.map((budget) => (
                      <li
                        key={budget.label}
                        onClick={() => handleBudgetSelect(budget)}
                        className={`py-2 px-3 mb-1 rounded-md cursor-pointer hover:bg-gray-100 ${
                          budget.label === selectedBudget
                            ? "bg-blue-100 text-blue-600"
                            : ""
                        }`}
                      >
                        {budget.label}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-3">
                    Project Duration
                  </h3>
                  <ul>
                    {projectDurations.map((dur) => (
                      <li
                        key={dur}
                        onClick={() => handleDurationSelect(dur)}
                        className={`py-2 px-3 mb-1 rounded-md cursor-pointer hover:bg-gray-100 ${
                          dur === selectedDuration
                            ? "bg-blue-100 text-blue-600"
                            : ""
                        }`}
                      >
                        {dur}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-3">Project Status</h3>
                  <div className="space-y-1">
                    {completionStatuses.map((status) => (
                      <div
                        key={status}
                        onClick={() => handleCompletionStatusSelect(status)}
                        className={`py-2 px-3 rounded-md cursor-pointer hover:bg-gray-100 ${
                          status === selectedCompletionStatus ? "bg-blue-100 text-blue-600" : ""
                        }`}
                      >
                        {status}
                      </div>
                    ))}
                  </div>
                </div> */}

                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-3">Date Posted</h3>
                  <div className="space-y-1">
                    {datePostedOptions.map((date) => (
                      <div
                        key={date}
                        onClick={() => handleDatePostedSelect(date)}
                        className={`py-2 px-3 rounded-md cursor-pointer hover:bg-gray-100 ${
                          date === selectedDatePosted ? "bg-blue-100 text-blue-600" : ""
                        }`}
                      >
                        {date}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            <div className="lg:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {`Available Projects (${
                    totalProjects || displayProjects.length || 0
                  })`}
                </h2>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2 hidden sm:inline">
                    Sort by:
                  </span>
                  <div className="relative flex items-center">
                    <select
                      value={`${sortBy}_${sortOrder}` || "relevance"}
                      onChange={handleSort}
                      className="bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    >
                      <option value="createdAt_desc">Newest First</option>
                      <option value="createdAt_asc">Oldest First</option>
                      <option value="budget_desc">Highest Budget</option>
                      <option value="budget_asc">Lowest Budget</option>
                      <option value="title_asc">Title A-Z</option>
                      <option value="title_desc">Title Z-A</option>
                    </select>

                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    />
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <FreelancerSkeletonHome key={i} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {Array.isArray(displayProjects) &&
                  displayProjects.length > 0 ? (
                    displayProjects.map((project) => (
                      <ProjectCard
                        key={project._id}
                        project={project}
                        currentUserId={user._id}
                        fetchProject={fetchProjects}
                      />
                    ))
                  ) : (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                      <p className="text-gray-600">
                        No projects found matching your criteria.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(Math.max(1, page - 1))}
                      disabled={page === 1 || loading}
                      className={`px-4 py-2 rounded ${
                        page === 1 || loading
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      Previous
                    </button>
                    <div className="flex items-center px-4">
                      <span className="text-gray-700">
                        Page {page} of {totalPages}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, page + 1))
                      }
                      disabled={page === totalPages || loading}
                      className={`px-4 py-2 rounded ${
                        page === totalPages || loading
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FreelancerProjectListing;
