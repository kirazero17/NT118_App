import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./slices/userSlice";
import userChatSlice from "./slices/userChatSlice";
import chatSlice from "./slices/chatSlice";

const Store = configureStore({
  reducer: {
    user: userSlice.reducer,
    userChat: userChatSlice.reducer,
    chat: chatSlice.reducer,
  },
});

export default Store;
