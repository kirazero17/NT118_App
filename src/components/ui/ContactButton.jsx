import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faVideo,
  faPhone,
  faMessage,
  faEllipsis,
  faInfoCircle,
  faPen,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { useLayoutEffect, useState } from "react";

const ContactButton = ({ text, onPress, isRounded }) => {
  const [icon, setIcon] = useState(faMessage);

  useLayoutEffect(() => {
    switch (text) {
      case "Message":
        return setIcon(faMessage);
      case "Video Call":
        return setIcon(faVideo);
      case "Call":
        return setIcon(faPhone);
      case "Info":
        return setIcon(faInfoCircle);
      case "More":
        return setIcon(faEllipsis);
      case "Đổi tên":
        return setIcon(faPen);
      case "Thành viên":
        return setIcon(faUserGroup);
    }
  }, [text]);
  return (
    <View className="items-center justify-center">
      <TouchableOpacity
        onPress={onPress}
        className={`items-center justify-center w-12 h-12 ${
          isRounded ? "rounded-full bg-gray-200" : "rounded-lg bg-gray-300"
        } `}
      >
        <FontAwesomeIcon
          icon={icon}
          size={24}
          color={isRounded ? "#444" : "#666"}
        />
      </TouchableOpacity>
      <Text className="text-sm text-gray-600 py-1">{text}</Text>
    </View>
  );
};

export default ContactButton;
