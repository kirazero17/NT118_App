import { View, Text } from "react-native";
import React from "react";
import { Avatar } from "react-native-paper";

const MessageText = ({ type, content, time, avatar, name }) => {
  return (
    <View
      style={{ alignSelf: type === "sender" ? "flex-end" : "flex-start" }}
      className="flex items-center justify-center space-x-2 mt-3"
    >
      <View className="flex-row items-center justify-center space-x-2">
        {type !== "sender" && (
          <Avatar.Image source={{ uri: avatar }} size={50} />
        )}
        <View className="mt-1 w-1/2">
          {name && (
            <Text className="text-xs text-gray-600 font-semibold mb-1">
              {name}
            </Text>
          )}
          <View
            style={{ alignSelf: type === "sender" ? "flex-end" : "flex-start" }}
            className={`px-3 py-2 mb-1 rounded-tl-2xl rounded-tr-2xl ${
              type === "sender" ? "rounded-bl-2xl" : "rounded-br-2xl"
            } bg-sky-400 w-auto relative `}
          >
            <Text className="text-base font-semibold text-white">
              {content}
            </Text>
          </View>

          <View
            style={{ alignSelf: type === "sender" ? "flex-end" : "flex-start" }}
          >
            <Text className="text-[10px] text-gray-800 text font-semibold ">
              {time}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MessageText;
