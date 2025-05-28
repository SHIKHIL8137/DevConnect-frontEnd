import axios from "axios";
const url = import.meta.env.VITE_BACKEND_URL;

const getRefreshToken = () => localStorage.getItem("refreshToken");
const clearAuthData = () => localStorage.removeItem("refreshToken");

const refreshAxios = axios.create({
  baseURL: url,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

const attachInterceptors = (instance) => {
  instance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      const isAuthRoute =
        [
          "/login",
          "/signup",
          "/forgot-password",
          "/verify-otp",
          "/generate-otp",
          "/check-username",
          "/register",
          "/refresh-token",
          "/auth/google",
          "/auth/google/callback",
        ].some((path) => originalRequest.url.includes(path));

      if (
        error.response?.status === 401 &&
        !isAuthRoute &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          console.warn("No refresh token available");
          clearAuthData();
          window.location.href = "/logout";
          return Promise.reject(error);
        }

        try {
          console.log("Attempting token refresh...");
          const response = await refreshAxios.post("/api/auth/refresh-token", {
            refreshToken,
          });

          if (response.data?.status) {
            console.log("Token refresh successful");

            if (response.data.refreshToken) {
              localStorage.setItem("refreshToken", response.data.refreshToken);
            }

            const { store } = await import("../redux/store/store");
            const { fetchUserData, verificationUser } = await import("../redux/thunk/userThunk");

            try {
              const res = await store.dispatch(fetchUserData()).unwrap();
              console.log(res)
              const res1 = await store.dispatch(verificationUser()).unwrap();
              console.log(res1)
              console.log("User verification successful after token refresh");

              return instance(originalRequest); 
            } catch (verifyError) {
              console.error("User verification failed:", verifyError);
              clearAuthData();
              window.location.href = "/logout";
              return Promise.reject(verifyError);
            }
          } else {
            console.warn("Token refresh failed - Invalid response");
            clearAuthData();
            window.location.href = "/logout";
            return Promise.reject(error);
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          clearAuthData();
          window.location.href = "/logout";
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export const axiosInstance = axios.create({
  baseURL: url,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const axiosInstanceMultipart = axios.create({
  baseURL: url,
  headers: { "Content-Type": "multipart/form-data" },
  withCredentials: true,
});

export const axiosInstanceWithOutMultipart = axios.create({
  baseURL: url,
  withCredentials: true,
});

[axiosInstance, axiosInstanceMultipart, axiosInstanceWithOutMultipart].forEach(attachInterceptors);
