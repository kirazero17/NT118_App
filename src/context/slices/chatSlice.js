import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chat: [],
  },
  reducers: {
    SET_CHAT: (state, action) => {
      const newChat = action.payload;
      const existChat = state.chat.find((chat) => chat.id === newChat.id);

      if (!existChat) {
        state.chat.push(newChat);
      }
    },

    SET_CHAT_NULL: (state) => {
      state.chat = [];
    },
  },
});

export const { SET_CHAT, SET_CHAT_NULL } = chatSlice.actions;

export default chatSlice;
