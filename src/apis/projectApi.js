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


export const onStatusChange =(formData)=>{
  return axiosInstance.post('/api/project/application/status',formData,{withCredentials:true})
}

export const fetchProjectsByIds = (ids) => {
  return axiosInstance.get('/api/project/projectDatas', {
    params: { ids: ids.join(",") }
  });
};

export const projectCount = (id)=>{
  return axiosInstance.get(`/api/project/projectCount/${id}`,{withCredentials:true});
}

export const updateProjectDeadLine =(projectId,formData)=>{
  return axiosInstance.patch(`/api/project/recreateBidding/${projectId}`,formData,{withCredentials:true})
}