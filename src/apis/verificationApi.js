import { axiosInstance } from "../config/api";

export const verificationRequest = (formData) => {
  return axiosInstance.post("/api/verify/verify-request", formData, {
    withCredentials: true,
  });
};

export const verifiedClient = () => {
  return axiosInstance.get(`/api/verify/user-verification`, {
    withCredentials: true,
  });
};
