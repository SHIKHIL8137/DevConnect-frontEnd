import { axiosInstance, axiosInstanceMultipart } from "../config/api"

export const createComplaint =(formData)=>{
  return axiosInstance.post('/api/complaint/complaint',formData,{withCredentials:true})
}

export const upload = (formData)=>{
  return axiosInstanceMultipart.post('/api/upload/upload',formData,{withCredentials:true})
}

export const getComplaintById = (id) => {
  return axiosInstance.get(`/api/complaint/complaints/${id}`,{withCredentials:true});
};

export const getComplaintsByClient = () => {
  return axiosInstance.get(`/api/complaint/complaints`,{withCredentials:true});
};

