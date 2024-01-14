import { View, Text, Image, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Avatar } from "react-native-paper";

const MessageText = ({
  typeUser,
  content,
  time,
  avatar,
  name,
  typeMessage,
}) => {
  return (
    <View
      style={{ alignSelf: typeUser === "sender" ? "flex-end" : "flex-start" }}
      className="flex items-center justify-center space-x-2 mt-3"
    >
      <View className="flex-row items-center item justify-center space-x-2">
        {typeUser !== "sender" && (
          <Avatar.Image
            style={{ alignSelf: "flex-end" }}
            source={{ uri: avatar }}
            size={50}
          />
        )}
        <View className="mt-1 w-1/2">
          {name && (
            <Text className="text-xs text-gray-600 font-semibold mb-1">
              {name}
            </Text>
          )}
          {typeMessage === "text" ? (
            <TouchableOpacity
              style={{
                alignSelf: typeUser === "sender" ? "flex-end" : "flex-start",
              }}
              className={`px-3 py-2 mb-1 rounded-tl-2xl rounded-tr-2xl ${
                typeUser === "sender" ? "rounded-bl-2xl" : "rounded-br-2xl"
              } bg-sky-400 w-auto relative `}
            >
              <Text className="text-base font-semibold text-white">
                {content}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                alignSelf: typeUser === "sender" ? "flex-end" : "flex-start",
              }}
              className="mb-1"
            >
              <Image
                source={{ uri: content }}
                style={{ width: 200, height: 200 }}
              />
            </TouchableOpacity>
          )}

          <View
            style={{
              alignSelf: typeUser === "sender" ? "flex-end" : "flex-start",
            }}
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
