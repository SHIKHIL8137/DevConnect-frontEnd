import { axiosInstance } from "../config/api"


export const getBiddingRoomData = (id)=>{
  return axiosInstance.get(`/api/bidding/bidding/${id}`,{withCredentials:true});
}

export const UpdateBiddingWinner =(id,data)=>{
  return axiosInstance.patch(`/api/bidding/update/${id}`,data,{withCredentials:true});
}

export const getBiddings = (id)=>{
  return axiosInstance.get(`/api/bidding/bidding/${id}/project`,{withCredentials:true})
}

export const cancelBidding = ()=>{
  
}

export const getBiddingData =(id)=>{
  return axiosInstance.get(`/api/bidding/bidding/${id}/user`,{withCredentials:true});
}