import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Avatar } from "native-base";
import { useLayoutEffect, useState } from "react";
import { formatDistance } from "date-fns";
import { de } from "date-fns/locale";

const MessageCard = ({ room, name, lastMessage, time, avatar }) => {
  const navigation = useNavigation();
  const [longTime, setLongTime] = useState("");
  const [messages, setMessages] = useState("");

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

    if (lastMessage.length > 30) {
      return setMessages(lastMessage.slice(0, 30) + "...");
    }

    return setMessages(lastMessage);
  }, [lastMessage]);

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Chat", { roomId: room })}
      className="w-full flex-row items-center justify-start py-2"
    >
      <Avatar source={{ uri: avatar }} size="lg">
        <Avatar.Badge bg="green.500" />
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
