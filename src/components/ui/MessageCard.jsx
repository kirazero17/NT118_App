import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Avatar } from "native-base";
import { useLayoutEffect, useState } from "react";
import { formatDistance } from "date-fns";
import { useSelector } from "react-redux";

const MessageCard = ({
  room,
  name,
  lastMessage,
  time,
  avatar,
  senderId,
  status,
}) => {
  const navigation = useNavigation();
  const [longTime, setLongTime] = useState("");
  const [messages, setMessages] = useState("");
  const user = useSelector((state) => state.user.user);

  const currentTime = new Date();
  useLayoutEffect(() => {
    if (!time) return;

    const date = new Date(time);

    const Time = formatDistance(currentTime, date, {
      addSuffix: true,
    });

    switch (Time) {
      case "in less than a minute":
        return setLongTime("Just now");
      case "less than a minute ago":
        return setLongTime("Just now");
      default:
        return setLongTime(Time);
    }
  }, [currentTime]);

  useLayoutEffect(() => {
    if (!lastMessage) return;

    const newLastMessage = `${
      senderId === user?.id ? "Bạn đã gửi" : ""
    } ${lastMessage}`;

    if (newLastMessage.length > 25) {
      return setMessages(newLastMessage.slice(0, 25) + "...");
    }

    return setMessages(newLastMessage);
  }, [lastMessage]);

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Chat", { roomId: room })}
      className="w-full flex-row items-center justify-start py-2"
    >
      <Avatar source={{ uri: avatar }} size="lg">
        {status === "online" ? (
          <Avatar.Badge bg="green.500" />
        ) : (
          <Avatar.Badge bg="gray.500" />
        )}
      </Avatar>
      <View className="flex-1 flex items-start justify-center ml-4 ">
        <Text className="text-[#333] text-lg font-semibold capitalize">
          {name}
        </Text>
        <Text className="text-gray-600 text-sm truncate">{messages}</Text>
      </View>
      <Text className="text-sky-300 pl-2 text-xs font-semibold">
        {longTime}
      </Text>
    </TouchableOpacity>
  );
};

export default MessageCard;
