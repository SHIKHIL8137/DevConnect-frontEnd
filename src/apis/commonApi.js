import { axiosInstance } from "../config/api"

export const projectsDataHome = ()=>{
  return axiosInstance.get('/api/project/home');
}

export const freelancersDataHome =()=>{
  return axiosInstance.get('/api/user/home');
}