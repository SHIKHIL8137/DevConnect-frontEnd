import { createSlice } from "@reduxjs/toolkit";
import { fetchAdminData } from "../thunk/adminThunk";
const initialState = {
  admin: null,
  isAuthenticated: false,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    logout(state) {
      state.admin = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAdminData.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.admin = action.payload;
    });
    builder.addCase(fetchAdminData.rejected, (state) => {
      state.isAuthenticated = false;
      state.admin = null;
    });
  },
});

export const { setUser, logout } = adminSlice.actions;
export default adminSlice.reducer;
