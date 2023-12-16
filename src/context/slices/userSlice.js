import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    SET_USER: (state, action) => {
      state.user = action.payload;
    },
    SET_USER_NULL: (state) => {
      state.user = null;
    },
  },
});

export const { SET_USER, SET_USER_NULL } = userSlice.actions;

export default userSlice;
