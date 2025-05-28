import { axiosInstance } from "../config/api";

export const loginValidate = (formData) => {
  return axiosInstance.post(`/api/auth/login?role=admin`, formData, {
    withCredentials: true,
  });
};
export const fetchAdmin = () => {
  return axiosInstance.get(`/api/auth/verify?role=admin`, { withCredentials: true });
};

export const fetchDashboardData = () => {
  return axiosInstance.get("/api/admin/dashboard", {
    withCredentials: true,
  });
};

export const getFreelancersData = (page, prefix) => {
  return axiosInstance.get(
    `/api/admin/freelancers?page=${page}&search=${prefix}`,
    { withCredentials: true }
  );
};

export const getClientsData = (page, prefix) => {
  return axiosInstance.get(
    `/api/admin/clients?page=${page}&search=${prefix}`,
    { withCredentials: true }
  );
};

export const blockUser = (userId) => {
  return axiosInstance.patch(`/api/admin/block?userId=${userId}`);
};

export const getVerificationRequests = (page,search) => {
  return axiosInstance.get(`/api/verify/admin-verifications?page=${page}&search=${search}`);
};

export const getClientVerificationDetails = (userId) => {
  return axiosInstance.get(
    `/api/verify/client-request?id=${userId}`,
    { withCredentials: true }
  );
};

export const verifyOrRejectUser = (formData) => {
  return axiosInstance.patch(`/api/verify/update-verification`, formData, {
    withCredentials: true,
  });
};

export const fetchProjects = (page, prefix) => {
  return axiosInstance.get(
    `/api/project/projects?page=${page}&search=${prefix}`,
    { withCredentials: true }
  );
};


export const getComplaintsData = (page,search)=>{
  return axiosInstance.get(`/api/complaint/admin/complaints?page=${page}&search=${search}`,{withCredentials:true});
}

export const getComplaintDetails = (id)=>{
  return axiosInstance.get(`/api/complaint/admin/complaint?id=${id}`,{withCredentials:true});
}

export const updateComplaint = (id,formData)=>{
  return axiosInstance.put(`/api/complaint/complaints/${id}/admin`,formData,{withCredentials:true});
}