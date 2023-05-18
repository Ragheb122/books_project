import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  email: "",
  isLogined: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginData: (state, { payload }) => {
      return (state = payload);
    },
    logOutData: (state) => {
      const emptyState = {
        username: "",
        email: "",
        isLogined: false,
      };

      return (state = emptyState);
    },
  },
});

export const { loginData, logOutData } = userSlice.actions;
export default userSlice.reducer;
