import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Avatar as Avt } from "react-native-paper";
import { Avatar } from "native-base";
import { useLayoutEffect, useState, useEffect } from "react";
import { formatDistance } from "date-fns";
import { useSelector } from "react-redux";
import { onValue, ref } from "firebase/database";
import { fireStoreDB } from "../../config/firebase";

const MessageCard = ({ data }) => {
  const navigation = useNavigation();
  const [longTime, setLongTime] = useState("");
  const [messages, setMessages] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const user = useSelector((state) => state.user.user);

  const currentTime = new Date();

  useEffect(() => {
    if (!data.userChats || data.userChats.length > 1) return;

    if (data.userChats.length === 1) {
      const userChat = data.userChats[0];

      onValue(ref(fireStoreDB, "users/" + userChat), (snapshot) => {
        if (snapshot.exists()) {
          setUserInfo(snapshot.val());
        }
      });
    }
  }, [data.userChats]);

  useLayoutEffect(() => {
    if (!data.time) return;

    const date = new Date(data.time);

    const Time = formatDistance(currentTime, date, {
      addSuffix: true,
    });

    switch (Time) {
      case "in less than a minute":
        return setLongTime("bây giờ");
      case "less than a minute ago":
        return setLongTime("bây giờ");
      default:
        return setLongTime(Time);
    }
  }, [currentTime]);

  useLayoutEffect(() => {
    if (!data.lastMessage.message) return;

    const newLastMessage = `${
      data.lastMessage.senderId === user?.id ? "Bạn đã gửi" : ""
    } ${data.lastMessage.message}`;

    if (newLastMessage.length > 25) {
      return setMessages(newLastMessage.slice(0, 25) + "...");
    }

    return setMessages(newLastMessage);
  }, [data.lastMessage.message]);

  return (
    <TouchableOpacity
      onPress={() => {
        if (data.userChats.length === 1) {
          navigation.navigate("Chat", {
            roomId: data.roomId,
          });
        } else {
          navigation.navigate("GroupChat", {
            roomId: data.roomId,
          });
        }
      }}
      className="w-full flex-row items-center justify-start py-2"
    >
      {data.userChats.length === 1 ? (
        <Avatar source={{ uri: userInfo.avatar }} size="lg">
          {userInfo.status === "online" ? (
            <Avatar.Badge bg="green.500" />
          ) : (
            <Avatar.Badge bg="gray.500" />
          )}
        </Avatar>
      ) : (
        <Avt.Icon
          size={65}
          icon={"account-group"}
          color="#f9fafb"
          className="bg-blue-300 border border-cyan-300"
        />
      )}
      <View className="flex-1 flex items-start justify-center ml-4 ">
        <Text className="text-[#333] text-lg font-semibold capitalize">
          {data.userChats.length === 1 ? userInfo.fullName : data.nameChat}
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
