import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Avatar } from "native-base";
import { useLayoutEffect, useState } from "react";
import { formatDistance } from "date-fns";

const MessageCard = ({ room, name, lastMessage, time, url }) => {
  const navigation = useNavigation();
  const [longTime, setLongTime] = useState("");

  useLayoutEffect(() => {
    if (!time) return;

    const currentTime = new Date();
    const date = new Date(time);

    const Time = formatDistance(currentTime, date, {
      addSuffix: true,
    });

    setLongTime(Time);
  }, [time]);

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Chat", { room: room })}
      className="w-full flex-row items-center justify-start py-2"
    >
      <Avatar source={{ uri: url }} size="lg">
        <Avatar.Badge bg="green.500" />
      </Avatar>
      <View className="flex-1 flex items-start justify-center ml-4">
        <Text className="text-[#333] text-lg font-semibold capitalize">
          {name}
        </Text>
        <Text className="text-gray-600 text-sm">{lastMessage}</Text>
      </View>
      <Text className="text-primary px-4 text-base font-semibold">
        {longTime}
      </Text>
    </TouchableOpacity>
  );
};

export default MessageCard;
