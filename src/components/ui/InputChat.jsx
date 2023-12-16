import { View, TouchableOpacity, TextInput } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faFaceSmile, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef } from "react";
import { ref, update, get } from "firebase/database";
import { fireStoreDB } from "../../config/firebase";
import { useSelector } from "react-redux";
import { format } from "date-fns";

const InputChat = ({ room, data }) => {
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.user.user);
  const inputRef = useRef(null);

  const handleKeyboardOpen = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSendMessage = async () => {
    if (message.trim() === "") {
      return;
    }

    const currentChat = format(new Date(), "HH:mm");
    const currentTime = new Date().toISOString();

    try {
      const newMessage = {
        id: `${user?.id}-${currentChat}`,
        message,
        sender: user?.id,
        date: currentChat,
      };

      const roomRef = ref(fireStoreDB, "rooms/" + room);
      const roomSnapshot = await get(roomRef);
      const currentMessages = roomSnapshot.val().messages || [];

      const updatedMessages = [...currentMessages, newMessage];

      await update(roomRef, {
        messages: updatedMessages,
      });

      await update(ref(fireStoreDB, "userChats/" + user?.id + "/" + room), {
        ["lastMessage"]: `You: ${message}`,
        ["lastSend"]: currentTime,
        ["messages"]: [message],
      });

      await update(
        ref(fireStoreDB, "userChats/" + data?.userInfo?.id + "/" + room),
        {
          ["lastMessage"]: `${user?.fullName}: ${message}`,
          ["lastSend"]: currentTime,
        }
      );

      setMessage("");
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <View className="w-11/12 flex-row items-center justify-center">
      <View className="bg-gray-200 rounded-2xl px-4 space-x-4 mr-4 py-2 flex-row items-center justify-center">
        <TouchableOpacity onPress={handleKeyboardOpen}>
          <FontAwesomeIcon icon={faFaceSmile} size={20} color="#93c5fd" />
        </TouchableOpacity>

        <TextInput
          ref={inputRef}
          className="flex-1 h-8 text-base text-gray-700 font-semibold"
          placeholder="Type here..."
          placeholderTextColor={"#999"}
          value={message}
          onChangeText={(text) => setMessage(text)}
        />
      </View>
      <TouchableOpacity onPress={handleSendMessage}>
        <FontAwesomeIcon icon={faPaperPlane} size={22} color="#93c5fd" />
      </TouchableOpacity>
    </View>
  );
};

export default InputChat;
