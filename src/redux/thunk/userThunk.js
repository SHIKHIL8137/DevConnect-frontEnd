import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUser } from "../../apis/userApi";
import { verifiedClient } from "../../apis/verificationApi";

export const fetchUserData = createAsyncThunk("user/fetch", async () => {
  const res = await fetchUser();
  return res.data;
});

export const verificationUser = createAsyncThunk('verify/fetch',async ()=>{
  const res = await verifiedClient();
  return res.data.verification
})