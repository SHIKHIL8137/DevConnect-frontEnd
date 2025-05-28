import { useEffect, useState, useRef } from "react";
import { ArrowLeft, ArrowRight, Clock, DollarSign } from "lucide-react";
import { projectsDataHome } from "../../apis/commonApi";
import { useNavigate } from "react-router-dom";

const RecentlyPostedWorks = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState(null);
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  
  const itemsPerPage = {
    lg: 3, 
    md: 2, 
    sm: 1 
  };
  
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  const getItemsPerPage = () => {
    if (windowWidth >= 1024) return itemsPerPage.lg;
    if (windowWidth >= 768) return itemsPerPage.md;
    return itemsPerPage.sm;
  };
  
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await projectsDataHome();
      if (response.data.status) {
        setProjects(response.data.projects);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  
  const animateSlide = (direction) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setSlideDirection(direction);
    
    setTimeout(() => {
      if (direction === 'next') {
        const totalPages = Math.ceil(projects.length / getItemsPerPage());
        setCurrentPage(current => 
          current < totalPages - 1 ? current + 1 : 0
        );
      } else {
        const totalPages = Math.ceil(projects.length / getItemsPerPage());
        setCurrentPage(current => 
          current > 0 ? current - 1 : totalPages - 1
        );
      }
      
      setIsAnimating(false);
      setSlideDirection(null);
    }, 300);
  };
  

  const goToNextPage = () => {
    if (projects.length <= getItemsPerPage()) return;
    animateSlide('next');
  };
  
  const goToPrevPage = () => {
    if (projects.length <= getItemsPerPage()) return;
    animateSlide('prev');
  };
  
  const goToPage = (pageIndex) => {
    if (pageIndex === currentPage) return;
    animateSlide(pageIndex > currentPage ? 'next' : 'prev');
    
    setTimeout(() => {
      setCurrentPage(pageIndex);
    }, 300);
  };
  
  const getCurrentProjects = () => {
    const start = currentPage * getItemsPerPage();
    const end = start + getItemsPerPage();
    return projects.slice(start, end);
  };
  
  const totalPages = Math.ceil(projects.length / getItemsPerPage());
  const isLastPage = currentPage === totalPages - 1;
  const isFirstPage = currentPage === 0;

  const handleViewDetails = (projectId) => {
    navigate(`/freelancer/projectDetails?id=${projectId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h2 className="text-gray-400 text-xl mb-2">
            The latest freelance work!
          </h2>
          <div className="text-3xl md:text-4xl font-bold">
            <span className="text-gray-800">Recently Posted</span>
            <span className="text-blue-500"> Works</span>
          </div>
        </div>

        <div className="flex space-x-3">
          <button 
            className={`w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center ${
              projects.length <= getItemsPerPage() || isAnimating
                ? "text-gray-300 cursor-not-allowed" 
                : "text-gray-400 hover:bg-gray-100"
            }`}
            onClick={goToPrevPage}
            disabled={projects.length <= getItemsPerPage() || isAnimating}
            aria-label="Previous page"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button 
            className={`w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center ${
              projects.length <= getItemsPerPage() || isAnimating
                ? "bg-blue-300 cursor-not-allowed" 
                : "text-white hover:bg-blue-600"
            }`}
            onClick={goToNextPage}
            disabled={projects.length <= getItemsPerPage() || isAnimating}
            aria-label="Next page"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
          {[...Array(getItemsPerPage())].map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 h-64 animate-pulse">
              <div className="p-6 h-full flex flex-col">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6 mb-4"></div>
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No projects available at the moment.</p>
        </div>
      ) : (
        <>
          <div 
            ref={sliderRef}
            className="relative overflow-hidden"
          >
            <style jsx>{`
              @keyframes slideLeft {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(-100%); opacity: 0; }
              }
              @keyframes slideRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
              }
              @keyframes slideInLeft {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
              }
              @keyframes slideInRight {
                from { transform: translateX(-100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
              }
              .slide-left {
                animation: slideLeft 300ms ease-in-out forwards;
              }
              .slide-right {
                animation: slideRight 300ms ease-in-out forwards;
              }
              .slide-in-left {
                animation: slideInLeft 300ms ease-in-out forwards;
              }
              .slide-in-right {
                animation: slideInRight 300ms ease-in-out forwards;
              }
            `}</style>
            
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5 ${
              slideDirection === 'next' ? 'slide-left' : 
              slideDirection === 'prev' ? 'slide-right' : ''
            }`}>
              {getCurrentProjects().map((project) => (
                <div
                  key={project._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 ${
                        project.completionStatus === "open" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                        } text-xs font-medium rounded-full`}
                      >
                        {project.completionStatus === "open" ? "Open" : project.completionStatus}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(project.createdAt)}
                      </span>
                    </div>

                    <h3 className="font-bold text-xl mb-3 text-gray-800 line-clamp-2">
                      {project.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-sm">{project.timeline} days</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span className="text-sm">${project.budget.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <span className="text-sm">
                          {project.appliedUsers.length} applied
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-3 bg-gray-50 flex justify-end">
                    <button 
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
                      onClick={() => handleViewDetails(project._id)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {isAnimating && (
              <div className={`absolute top-0 left-0 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5 ${
                slideDirection === 'next' ? 'slide-in-right' : 
                slideDirection === 'prev' ? 'slide-in-left' : ''
              }`}>
                {(() => {
                  let nextPage;
                  if (slideDirection === 'next') {
                    nextPage = currentPage < totalPages - 1 ? currentPage + 1 : 0;
                  } else {
                    nextPage = currentPage > 0 ? currentPage - 1 : totalPages - 1;
                  }
                  
                  const start = nextPage * getItemsPerPage();
                  const end = start + getItemsPerPage();
                  return projects.slice(start, end).map((project) => (
                    <div
                      key={project._id}
                      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <span className={`px-3 py-1 ${
                            project.completionStatus === "open" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                            } text-xs font-medium rounded-full`}
                          >
                            {project.completionStatus === "open" ? "Open" : project.completionStatus}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(project.createdAt)}
                          </span>
                        </div>

                        <h3 className="font-bold text-xl mb-3 text-gray-800 line-clamp-2">
                          {project.title}
                        </h3>

                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {project.description}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-1" />
                            <span className="text-sm">{project.timeline} days</span>
                          </div>

                          <div className="flex items-center text-gray-600">
                            <DollarSign className="w-4 h-4 mr-1" />
                            <span className="text-sm">${project.budget.toLocaleString()}</span>
                          </div>

                          <div className="flex items-center text-gray-600">
                            <span className="text-sm">
                              {project.appliedUsers.length} applied
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="px-6 py-3 bg-gray-50 flex justify-end">
                        <button 
                          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
                          onClick={() => handleViewDetails(project._id)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            )}
          </div>
          
          {projects.length > getItemsPerPage() && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center space-x-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300 ${
                      currentPage === index
                        ? "bg-blue-500 text-white scale-110"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    } ${isAnimating ? "pointer-events-none" : ""}`}
                    onClick={() => goToPage(index)}
                    disabled={isAnimating}
                    aria-label={`Page ${index + 1}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecentlyPostedWorks;