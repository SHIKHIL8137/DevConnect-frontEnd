import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAdmin } from "../../apis/adminApi";

export const fetchAdminData = createAsyncThunk("admin/fetch", async () => {
  const res = await fetchAdmin();
  return res.data;
});
