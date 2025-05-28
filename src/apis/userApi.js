import { axiosInstance, axiosInstanceMultipart } from "../config/api";

export const getOtp = (formData) => {
  return axiosInstance.post("/api/verify/generate-otp", formData);
};

export const checkUserName = (formData) => {
  return axiosInstance.get(`/api/user/check-username?userName=${formData.userName}`);
};

export const validateOtp = (formData) => {
  return axiosInstance.post("/api/verify/verify-otp", formData);
};

export const validateUser = (formData) => {
  return axiosInstance.post("/api/user/register", formData);
};

export const loginUser = (formData) => {
  return axiosInstance.post("/api/auth/login", formData, {
    withCredentials: true,
  });
};

export const googleLogin = async () => {
  return await axiosInstance.get("/user/auth/google", {
    withCredentials: true,
  });
};

export const fetchUser = () => {
  return axiosInstance.get("/api/auth/verify", { withCredentials: true });
};

export const updateProfile = (formData) => {
  console.log(formData)
  return axiosInstance.patch("/api/user/update-pofile", formData);
};

export const ProfileImgUpdate = (formData, type) => {
  return axiosInstanceMultipart.post(
    `/api/upload/profile-image?type=${type}`,
    formData
  );
};

export const forgetPassword = (formData) => {
  return axiosInstance.post("/api/auth/forget-password", formData);
};

export const validateUserChangPswd = (formData) => {
  return axiosInstance.patch("/api/user/update-password", formData);
};

export const updateFreelancer = (formData) => {
  return axiosInstance.patch("/user/updateFreelancer", formData, {
    withCredentials: true,
  });
};

export const clientHome = (query) => {
  const queryString = new URLSearchParams(query).toString();
  return axiosInstance.get(`/api/user/client-home?${queryString}`, {
    withCredentials: true,
  });
};

export const freelancerFetch = (userId) => {
  return axiosInstance.get(`/api/user/profile?id=${userId}`);
};

export const freelancerHome = (query) => {
  const queryString = new URLSearchParams(query).toString();
  return axiosInstance.get(`/api/project/freelancer-home?${queryString}`, {
    withCredentials: true,
  });
};

export const applyProject = (formData) => {
  return axiosInstance.post(`/api/project/apply`, formData, {
    withCredentials: true,
  });
};

export const uploadResume = (formData) => {
  return axiosInstanceMultipart.post("/api/upload/upload-resume", formData, {
    withCredentials: true,
  });
};

export const removeResume = () => {
  return axiosInstance.patch("/api/user/update-pofile",{resume:""}, { withCredentials: true });
};


