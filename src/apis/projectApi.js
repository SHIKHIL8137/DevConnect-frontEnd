import {
  axiosInstance,
  axiosInstanceMultipart,
} from "../config/api";

export const uploadAttachments =(formData)=>{
  return axiosInstanceMultipart.post('/api/upload/upload-files',formData,{
    withCredentials:true,
  })
}
export const addProject = (formData) => {
  console.log(formData)
  return axiosInstance.post("/api/project/add", formData, {
    withCredentials: true,
  });
};

export const fetchProjectOfUser = () => {
  return axiosInstance.get(`/api/project/user`, {
    withCredentials: true,
  });
};

export const projectDetails = (id) => {
  return axiosInstance.get(`/api/project/details?id=${id}`);
};
export const projectDataFetch = (id) => {
  return axiosInstance.get(`/api/project/data?id=${id}`);
};

export const updateProject = (projectId, formData) => {
  return axiosInstance.patch(
    `/api/project/edit?projectId=${projectId}`,
    formData,
    { withCredentials: true }
  );
};

export const deleteProject = (projectId, attachmentId) => {
  return axiosInstance.delete(
    `/api/project/attachment?projectId=${projectId}&attachmentId=${attachmentId}`
  );
};
