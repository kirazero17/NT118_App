import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import React from "react";

const MessageCard = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Chat")}
      className="w-full flex-row items-center justify-start py-2"
    >
      <View className="w-16 h-16 rounded-full flex items-center justify-center border border-sky-400 p-1">
        <FontAwesomeIcon icon={faUser} size={24} />
      </View>
      <View className="flex-1 flex items-start justify-center ml-4">
        <Text className="text-[#333] text-base font-semibold capitalize">
          Message Title
        </Text>
        <Text className="text-gray-600 text-sm">Hello</Text>
      </View>
      <Text className="text-primary px-4 text-base font-semibold">30 min</Text>
      <View className="w-3 h-3 bg-green-500 rounded-full absolute bottom-3 left-12 border border-slate-400"></View>
    </TouchableOpacity>
  );
};

export default MessageCard;
