import { createSlice } from "@reduxjs/toolkit";
import { fetchUserData ,verificationUser} from "../thunk/userThunk";
const initialState = {
  user: null,
  isAuthenticated: false,
  verification:null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
    verify(state,action){
      state.verification=action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
    });
    builder.addCase(fetchUserData.rejected, (state) => {
      state.isAuthenticated = false;
      state.user = null;
    });
    builder.addCase(verificationUser.fulfilled,(state,action)=>{
      state.verification = action.payload
    });
    builder.addCase(verificationUser.rejected,(state)=>{
      state.verification = null
    });
  },
});

export const { setUser, logout ,verify} = userSlice.actions;
export default userSlice.reducer;
