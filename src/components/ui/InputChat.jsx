import {
  View,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Platform,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCirclePlus,
  faFaceSmile,
  faMicrophone,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useRef } from "react";
import { ref, update, get, serverTimestamp } from "firebase/database";
import { fireStoreDB } from "../../config/firebase";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import * as ImagePicker from "expo-image-picker";

const InputChat = ({ room, onFocus }) => {
  const [message, setMessage] = useState("");
  const [isFocus, setIsFocus] = useState(false);
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

    const currentChat = format(new Date(), "dd/MM HH:mm");

    try {
      setMessage("");
      Keyboard.dismiss();
      const newMessage = {
        id: `${Math.round(Math.random() * 1000000000)}`,
        message,
        sender: user?.id,
        date: currentChat,
        type: "text",
      };

      const roomRef = ref(fireStoreDB, "rooms/" + room);
      const roomSnapshot = await get(roomRef);
      const currentMessages = roomSnapshot.val().messages || [];

      const updatedMessages = [...currentMessages, newMessage];

      await update(roomRef, {
        messages: updatedMessages,
      });

      await update(roomRef, {
        ["time"]: serverTimestamp(),
        ["lastMessage"]: {
          senderId: user?.id,
          message,
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <View
      className={`w-full flex-row items-center justify-center pt-1 ${
        Platform.OS === "ios" ? "" : "-mb-2"
      }`}
    >
      <View
        className={`flex-row items-center gap-4 px-2 ${
          isFocus ? "hidden" : ""
        }`}
      >
        <TouchableOpacity>
          <FontAwesomeIcon icon={faCirclePlus} size={24} color="#93c5fd" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesomeIcon icon={faMicrophone} size={24} color="#93c5fd" />
        </TouchableOpacity>
      </View>
      <View className="bg-gray-200 rounded-2xl px-4 space-x-4 mr-4 py-2 flex-row flex-1 items-center justify-center">
        <TouchableOpacity onPress={handleKeyboardOpen}>
          <FontAwesomeIcon icon={faFaceSmile} size={20} color="#93c5fd" />
        </TouchableOpacity>

        <TextInput
          ref={inputRef}
          className=" h-8 flex-1 text-base text-gray-700 font-semibold"
          placeholder="Type here..."
          placeholderTextColor={"#999"}
          value={message}
          onFocus={() => {
            onFocus();
            setIsFocus(true);
          }}
          onBlur={() => setIsFocus(false)}
          onChangeText={(text) => setMessage(text)}
          onSubmitEditing={handleSendMessage}
        />
      </View>
      <TouchableOpacity onPress={handleSendMessage}>
        <FontAwesomeIcon icon={faPaperPlane} size={22} color="#93c5fd" />
      </TouchableOpacity>
    </View>
  );
};

export default InputChat;
