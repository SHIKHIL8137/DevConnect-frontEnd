import { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { freelancersDataHome } from '../../apis/commonApi';

const PortfolioSlider = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState(null);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);
  
  const itemsPerSlide = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  };
  
  const [itemsToShow, setItemsToShow] = useState(itemsPerSlide.desktop);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await freelancersDataHome();
      if(response.data.status){
        setPortfolios(response.data.freelancers);
      }
    } catch (error) {
      console.log(error?.response?.data?.message || 'Error fetching portfolios');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(itemsPerSlide.mobile);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(itemsPerSlide.tablet);
      } else {
        setItemsToShow(itemsPerSlide.desktop);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const totalSlides = Math.ceil(portfolios.length / itemsToShow);
  
  const goToSlide = (index) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setSlideDirection(index > activeSlide ? 'next' : 'prev');
    setActiveSlide(index);
    
    setTimeout(() => {
      setIsTransitioning(false);
      setSlideDirection(null);
    }, 500); 
  };
  
  const nextSlide = () => {
    if (isTransitioning) return;
    
    const nextIndex = activeSlide < totalSlides - 1 ? activeSlide + 1 : 0;
    goToSlide(nextIndex);
  };
  
  const prevSlide = () => {
    if (isTransitioning) return;
    
    const prevIndex = activeSlide > 0 ? activeSlide - 1 : totalSlides - 1;
    goToSlide(prevIndex);
  };
  
  const getCurrentPortfolios = () => {
    const startIndex = activeSlide * itemsToShow;
    return portfolios.slice(startIndex, startIndex + itemsToShow);
  };
  
  const getNextPortfolios = () => {
    let nextPageIndex;
    if (slideDirection === 'next') {
      nextPageIndex = activeSlide < totalSlides - 1 ? activeSlide + 1 : 0;
    } else {
      nextPageIndex = activeSlide > 0 ? activeSlide - 1 : totalSlides - 1;
    }
    
    const startIndex = nextPageIndex * itemsToShow;
    return portfolios.slice(startIndex, startIndex + itemsToShow);
  };
  
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      nextSlide();
    }
    
    if (touchStart - touchEnd < -100) {
      prevSlide();
    }
  };

  useEffect(() => {
    if (loading) return;
    
    const autoSlide = setInterval(() => {
      if (!isTransitioning) {
        nextSlide();
      }
    }, 5000); 
    
    return () => clearInterval(autoSlide);
  }, [activeSlide, isTransitioning, totalSlides, loading]);
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h2 className="text-gray-400 text-xl mb-2">
            Logos, websites, book covers & more!
          </h2>
          <div className="text-3xl md:text-4xl font-bold">
            <span className="text-gray-800">Checkout The Best</span>
            <span className="text-blue-500"> Portfolios</span> Here
          </div>
        </div>

        <div className="flex space-x-3">
          <button 
            onClick={prevSlide}
            className={`w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center ${
              isTransitioning || loading
                ? "text-gray-300 cursor-not-allowed" 
                : "text-gray-400 hover:bg-gray-100"
            }`}
            disabled={isTransitioning || loading}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button 
            onClick={nextSlide}
            className={`w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center ${
              isTransitioning || loading
                ? "bg-blue-300 cursor-not-allowed" 
                : "text-white hover:bg-blue-600"
            }`}
            disabled={isTransitioning || loading}
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div ref={sliderRef} className="relative overflow-hidden">
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
          @keyframes pulse {
            0%, 100% {
              opacity: 0.6;
            }
            50% {
              opacity: 0.8;
            }
          }
          .skeleton-pulse {
            animation: pulse 1.5s ease-in-out infinite;
          }
        `}</style>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
              >
                <div className="h-64 bg-gray-200 skeleton-pulse" />
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="h-8 w-48 bg-gray-200 rounded skeleton-pulse mb-2" />
                      <div className="h-4 w-32 bg-gray-200 rounded skeleton-pulse" />
                    </div>
                    <div className="h-6 w-6 bg-gray-200 rounded-full skeleton-pulse" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={`tag-${i}`} className="h-6 w-16 bg-gray-200 rounded-full skeleton-pulse" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div 
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5 ${
              slideDirection === 'next' ? 'slide-left' : 
              slideDirection === 'prev' ? 'slide-right' : ''
            }`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {getCurrentPortfolios().map((portfolio) => (
              <div
                key={portfolio._id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-64 bg-gray-200 relative">
                  <img
                    src={portfolio.profileImage}
                    alt={`${portfolio.userName}'s portfolio`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs uppercase font-bold py-1 px-2 rounded">
                    {portfolio.experienceLevel}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-2xl font-bold">{portfolio.userName}</h3>
                      <p className="text-gray-500">{portfolio.role}</p>
                    </div>
                    <div className="text-blue-500">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {portfolio.skills.map((skill, index) => (
                      <span key={index} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && isTransitioning && slideDirection && (
          <div className={`absolute top-0 left-0 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5 ${
            slideDirection === 'next' ? 'slide-in-right' : 'slide-in-left'
          }`}>
            {getNextPortfolios().map((portfolio) => (
              <div
                key={portfolio._id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-64 bg-gray-200 relative">
                  <img
                    src={portfolio.profileImage}
                    alt={`${portfolio.userName}'s portfolio`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs uppercase font-bold py-1 px-2 rounded">
                    {portfolio.experienceLevel}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-2xl font-bold">{portfolio.userName}</h3>
                      <p className="text-gray-500">{portfolio.role}</p>
                    </div>
                    <div className="text-blue-500">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {portfolio.skills.map((skill, index) => (
                      <span key={index} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {!loading && totalSlides > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300 ${
                  activeSlide === index
                    ? "bg-blue-500 text-white scale-110"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                } ${isTransitioning ? "pointer-events-none" : ""}`}
                onClick={() => goToSlide(index)}
                disabled={isTransitioning}
                aria-label={`Page ${index + 1}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PortfolioSlider;