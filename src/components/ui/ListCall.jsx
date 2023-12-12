import { TouchableOpacity, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { Avatar, List } from "react-native-paper";
import React, { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCircleInfo,
  faInfo,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

const ListCall = ({ typeIcon, typeCall, day }) => {
  const navigation = useNavigation();

  const user = useSelector((state) => state.user.user);

  return (
    <View className="flex items-end justify-center mx-5 mb-5">
      <TouchableOpacity className="flex-row">
        <Avatar.Image size={50} source={{ uri: user?.profilePic }} />
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <View className="ml-3">
              <Text className="text-lg font-semibold">Le Van Tuyen</Text>
              <View className="flex-row items-center">
                <List.Icon
                  icon={typeIcon}
                  color={`${typeCall === "Missing" ? "red" : "#555"}`}
                />
                <Text
                  className={`text-xs ml-1 ${
                    typeCall === "Missing" && "text-red-500"
                  }`}
                >
                  {typeCall} call - {day}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        className="absolute -right-1 top-2"
        onPress={() => navigation.navigate("Chat")}
      >
        <FontAwesomeIcon icon={faCircleInfo} size={16} color="#999" />
      </TouchableOpacity>
      <View className="absolute -right-1 top-14 w-10/12 border-b border-gray-200"></View>
    </View>
  );
};

export default ListCall;
