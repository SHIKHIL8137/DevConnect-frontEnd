import { useState, useEffect, useCallback } from "react";
import {
  Star,
  ChevronDown,
  Filter,
  Search,
  MessageSquare,
  RefreshCw,
  Award,
} from "lucide-react";
import Navbar from "../../components/user/navbar/navbar";
import Footer from "../../components/user/footer/Footer";
import { clientHome } from "../../apis/userApi";
import { FreelancerSkeletonHome } from "../../components/common/skeleton";
import { useNavigate } from "react-router-dom";

const FreelancerMarketplace = () => {
  const navigate = useNavigate();
  const [freelancers, setFreelancers] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [skill, setSkill] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(3);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedRate, setSelectedRate] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [sortOrder, setSortOrder] = useState("desc");
  const [totalFreelancers, setTotalFreelancers] = useState(0);
  const [loading, setLoading] = useState(false);
   const [skillFilter, setSkillFilter] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);

  const fetchFreelancer = useCallback(async () => {
    try {
      setLoading(true);
      const response = await clientHome({
        search,
        location,
        skill,
        minPrice,
        maxPrice,
        minRating,
        experienceLevel,
        page,
        limit: 5,
        sortBy,
        sortOrder,
        skill: selectedSkills.join(','),
      });
      setFreelancers(response.data.data);
      setTotalPages(response.data.totalPage);
      setTotalFreelancers(response.data.total);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching freelancers", error);
      setFreelancers([]);
      setLoading(false);
    }
  }, [
    search,
    location,
    skill,
    minPrice,
    maxPrice,
    minRating,
    experienceLevel,
    page,
    sortBy,
    sortOrder,
    selectedSkills,
  ]);

  useEffect(() => {
    fetchFreelancer();
  }, [fetchFreelancer]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchFreelancer();
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
    setLocation("");
    setSkill("");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setExperienceLevel("");
    setSelectedRate("");
    setSelectedExperience("");
    setSortBy("rating");
    setSortOrder("desc");
    setPage(1);
    setSkillFilter("");
    setSelectedSkills([]);
  };


  const hourlyRates = [
    { label: "₹0 - ₹500", min: "0", max: "500" },
    { label: "₹500 - ₹1000", min: "500", max: "1000" },
    { label: "₹1000 - ₹1500", min: "1000", max: "1500" },
    { label: "₹1500+", min: "1500", max: "" },
  ];

    const popularSkills = [
    "react", "javascript", "node", "mongo", "python", "django", 
    "flutter", "react native", "vue", "angular", "php", "laravel",
    "wordpress", "shopify", "figma", "photoshop", "illustrator",
    "html", "css", "bootstrap", "tailwind", "sass", "typescript",
    "express", "next.js", "nuxt.js", "firebase", "aws", "docker"
  ];


  const experienceLevels = ["Entry", "Intermediate", "Expert"];

 const handleSkillToggle = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
    setPage(1);
  };

  const handleRateSelect = (rate) => {
    setSelectedRate(rate.label);
    setMinPrice(rate.min);
    setMaxPrice(rate.max);
    setPage(1);
  };

  const handleExperienceSelect = (level) => {
    setSelectedExperience(level);
    const dbLevel = level.toLowerCase();
    setExperienceLevel(dbLevel);

    setMinRating(
      level === "Entry" ? "1" : level === "Intermediate" ? "3" : "4"
    );
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const displayFreelancers = loading ? (
    []
  ) : freelancers.length > 0 ? (
    freelancers
  ) : (
    <p>No freelancers found.</p>
  );

  return (
    <>
      <div className="relative min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 px-4 py-8">
        <Navbar />
        <div className="text-center max-w-3xl mx-auto mt-30">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Find the Perfect IT Freelancer for Your Project
          </h1>
          <p className="text-white text-lg md:text-xl mb-8 opacity-90">
            Connect with skilled professionals specializing in development,
            design, and IT solutions
          </p>
        </div>

        <div className="absolute bottom-6 right-6">
          <button className="bg-white text-blue-600 rounded-full p-4 shadow-lg hover:bg-blue-50 transition-colors">
            <MessageSquare size={24} />
          </button>
        </div>
      </div>
      <div className="min-h-screenbg-gradient-to-br from-sky-50 to-white">
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
                <div className="flex items-center justify-between mb-4">
                  <div className="font-medium text-gray-800 flex items-center">
                    <Filter size={18} className="mr-2" />
                    Filters
                  </div>
                  <button
                    onClick={resetFilters}
                    className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    <RefreshCw size={14} className="mr-1" />
                    Reset All
                  </button>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                    Skills
                  </h3>
                  <div className="mb-3">
                    <input
                      type="text"
                      placeholder="Search skills..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={skillFilter}
                      onChange={(e) => setSkillFilter(e.target.value)}
                    />
                  </div>
                  <div className="max-h-40 overflow-y-auto">
                    <div className="flex flex-wrap gap-2">
                      {popularSkills
                        .filter(skill => 
                          skill.toLowerCase().includes(skillFilter.toLowerCase())
                        )
                        .map((skill) => (
                          <button
                            key={skill}
                            onClick={() => handleSkillToggle(skill)}
                            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                              selectedSkills.includes(skill)
                                ? "bg-blue-500 text-white border-blue-500"
                                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                            }`}
                          >
                            {skill}
                          </button>
                        ))}
                    </div>
                  </div>
                  {selectedSkills.length > 0 && (
                    <div className="mt-2 text-sm text-blue-600">
                      {selectedSkills.length} skill{selectedSkills.length > 1 ? 's' : ''} selected
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-3">
                    Hourly Rate
                  </h3>
                  <ul>
                    {hourlyRates.map((rate) => (
                      <li
                        key={rate.label}
                        onClick={() => handleRateSelect(rate)}
                        className={`py-2 px-3 mb-1 rounded-md cursor-pointer hover:bg-gray-100 ${
                          rate.label === selectedRate
                            ? "bg-blue-100 text-blue-600"
                            : ""
                        }`}
                      >
                        {rate.label}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-3">
                    Experience Level
                  </h3>
                  <ul>
                    {experienceLevels.map((level) => (
                      <li
                        key={level}
                        onClick={() => handleExperienceSelect(level)}
                        className={`py-2 px-3 mb-1 rounded-md cursor-pointer hover:bg-gray-100 ${
                          level === selectedExperience
                            ? "bg-blue-100 text-blue-600"
                            : ""
                        }`}
                      >
                        {level}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="lg:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {`Available Freelancers (${
                    totalFreelancers || displayFreelancers.length || 0
                  })`}
                </h2>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2 hidden sm:inline">
                    Sort by:
                  </span>
                  <div className="relative">
                    <select
                      value={`${sortBy}_${sortOrder}` || "relevance"}
                      onChange={handleSort}
                      className="bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    >
                      <option value="relevance">Most Relevant</option>
                      <option value="pricePerHour_asc">Lowest Rate</option>
                      <option value="pricePerHour_desc">Highest Rate</option>
                      <option value="position_asc">Position A-Z</option>
                      <option value="position_desc">Position Z-A</option>
                      <option value="userName_asc">Name A-Z</option>
                      <option value="userName_desc">Name Z-A</option>
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
                  {displayFreelancers.length > 0 ? (
                    displayFreelancers.map((freelancer) => (
                      <div
                        key={freelancer._id}
                        className="bg-white rounded-lg shadow p-6"
                      >
                        <div className="flex flex-col sm:flex-row justify-between">
                          <div className="flex items-start">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300 mr-4">
                              <div className="w-full h-full bg-gray-400 rounded-full"></div>
                            </div>
                            <div>
                              <h3 className="font-medium text-lg">
                                {freelancer.userName}
                              </h3>
                              <p className="text-gray-600 text-sm">
                                {freelancer.position}
                              </p>
                              <div className="flex items-center mt-1">
                                <Star
                                  size={16}
                                  className="text-yellow-400 fill-current"
                                />
                                <span className="ml-1 text-sm">
                                  {freelancer.rating}/5.0
                                </span>
                                {freelancer.experienceLevel && (
                                  <span className="ml-3 text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded capitalize">
                                    {freelancer.experienceLevel}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 sm:mt-0 text-right">
                            <p className="font-bold text-xl">
                              ₹{freelancer.pricePerHour}/hr
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {freelancer.skills &&
                            freelancer.skills.map((skill) => (
                              <span
                                key={skill}
                                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                        </div>

                        <div className="border-t mt-6 pt-4 flex justify-end">
                          <button
                            className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                            onClick={() =>
                              navigate(
                                `/client/freelancerProfile?id=${freelancer._id}`
                              )
                            }
                          >
                            View Profile
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                      <p className="text-gray-600">
                        No freelancers found matching your criteria.
                      </p>
                      <button
                        onClick={resetFilters}
                        className="mt-4 px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        Reset Filters
                      </button>
                    </div>
                  )}
                </div>
              )}
   
              {totalPages>1 && (
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

export default FreelancerMarketplace;
