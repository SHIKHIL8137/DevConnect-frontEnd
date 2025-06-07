import Footer from "../user/footer/Footer";
import Navbar from "../user/navbar/navbar";

export const SkeletonCard = () => (
  <div className="animate-pulse flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
      <div>
        <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
    <div className="h-4 bg-gray-200 rounded w-20"></div>
  </div>
);

export const VerifyClientSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gray-300 rounded-lg mr-4"></div>
              <div>
                <div className="h-5 w-40 bg-gray-300 rounded mb-2"></div>
                <div className="flex space-x-4">
                  <div className="h-4 w-28 bg-gray-200 rounded"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <div className="h-10 w-24 bg-gray-300 rounded-lg"></div>
              <div className="h-10 w-24 bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="h-5 w-40 bg-gray-300 mb-4 rounded"></div>
            <div className="space-y-4">
              {Array(4)
                .fill()
                .map((_, i) => (
                  <div className="flex items-start" key={i}>
                    <div className="w-5 h-5 bg-gray-300 rounded-full mt-0.5 mr-3"></div>
                    <div>
                      <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
                      <div className="h-5 w-48 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <div className="h-5 w-40 bg-gray-300 mb-4 rounded"></div>
            <div className="space-y-4">
              {Array(3)
                .fill()
                .map((_, i) => (
                  <div className="flex items-start" key={i}>
                    <div className="w-5 h-5 bg-gray-300 rounded-full mt-0.5 mr-3"></div>
                    <div>
                      <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
                      <div className="h-5 w-48 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="h-5 w-40 bg-gray-300 mb-4 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array(3)
              .fill()
              .map((_, i) => (
                <div key={i}>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
                  <div className="h-5 w-32 bg-gray-300 rounded"></div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const FreelancerSkeletonHome = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6 animate-pulse">
      <div className="flex flex-col sm:flex-row justify-between">
        <div className="flex items-start">
          <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
          <div>
            <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-24 mb-1"></div>
            <div className="h-3 bg-yellow-100 rounded w-16 mt-2"></div>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 text-right">
          <div className="h-5 bg-gray-300 rounded w-20"></div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-6 w-16 bg-gray-200 rounded-full"></div>
        ))}
      </div>

      <div className="border-t mt-6 pt-4 flex justify-end">
        <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
};

export const ProfileSkeletonFreelancer = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mt-15 p-4">
      <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-md p-6 flex flex-col h-fit">
        <div className="relative mb-16">
          <div className="w-full h-40 bg-gray-200 rounded-lg animate-pulse" />
          <div className="absolute -bottom-12 left-6 w-24 h-24 rounded-full border-4 border-white overflow-hidden">
            <div className="w-full h-full bg-gray-300 rounded-full animate-pulse" />
          </div>
        </div>

        <div className="mb-6">
          <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-200 rounded mr-2 animate-pulse" />
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-200 rounded mr-2 animate-pulse" />
            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-200 rounded mr-2 animate-pulse" />
            <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        <div className="flex space-x-3 mb-6">
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
        </div>

        <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse" />
      </div>

      <div className="w-full lg:w-2/3 flex flex-col gap-4">
        <div className="bg-white rounded-3xl shadow-md p-6">
          <div className="h-8 w-1/4 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-md p-6">
          <div className="h-8 w-1/4 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="h-10 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="h-10 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse mb-6" />

          <div className="flex justify-center items-center py-8">
            <div className="h-6 w-1/4 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="mt-6 flex items-center justify-end">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const EditProjectSkeleton = () => (
  <div className="flex flex-col py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-full mx-20">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden animate-pulse">
        <div className="px-6 py-4">
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded-lg"></div>
          </div>

          <div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="space-y-2">
              <div className="h-24 bg-gray-200 rounded-lg"></div>
            </div>
          </div>

          <div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-20 bg-gray-200 rounded-lg"></div>
          </div>

          <div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-20 bg-gray-200 rounded-lg"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-10 bg-gray-200 rounded-lg"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-10 bg-gray-200 rounded-lg"></div>
            </div>
          </div>

          <div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded-lg"></div>
          </div>

          <div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="space-y-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>

          <div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>

          <div className="flex justify-end space-x-3 mt-8">
            <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const ProjectSkeleton = () => {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg p-5 shadow-md animate-pulse"
        >
          <div className="flex justify-between items-start">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="mt-2 h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="mt-4 flex justify-between items-center">
            <div className="flex space-x-4">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};