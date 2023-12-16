import { createSlice } from "@reduxjs/toolkit";

const userChatSlice = createSlice({
  name: "userChat",
  initialState: {
    userChat: [],
  },
  reducers: {
    SET_USER_CHAT: (state, action) => {
      const newUser = action.payload;
      const existUser = state.userChat.find((user) => user.id === newUser.id);

      if (!existUser) {
        state.userChat.push(newUser);
      }
    },

    SET_NULL: (state) => {
      state.userChat = [];
    },
  },
});

export const { SET_USER_CHAT, SET_NULL } = userChatSlice.actions;

export default userChatSlice;
