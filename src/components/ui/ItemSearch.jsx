import { TouchableOpacity, Text, View } from "react-native";
import { Avatar } from "react-native-paper";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useState } from "react";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const ItemSearch = ({ value, isCheck, onPress }) => {
  function handler() {
    onPress(value);
  }
  return (
    <View className="flex justify-center mx-5 mb-5">
      <TouchableOpacity
        onPress={handler}
        className="flex-row items-center justify-between"
      >
        <View className="flex-row items-center">
          <Avatar.Image size={55} source={{ uri: value.avatar }} />
          <View
            className={`w-3 h-3 ${
              value.status === "online" ? "bg-green-500" : "bg-gray-500"
            } rounded-full absolute top-10 left-10`}
          ></View>
          <Text className="text-lg font-semibold ml-3 capitalize">
            {value.fullName}
          </Text>
        </View>
        <View className="absolute -right-1 top-[52px] w-10/12 border-b border-gray-300"></View>
        <FontAwesomeIcon
          icon={isCheck ? faCircleCheck : faCircle}
          size={22}
          color={isCheck ? "#22d3ee" : "#555"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ItemSearch;
