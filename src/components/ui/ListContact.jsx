import { TouchableOpacity, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { Avatar } from "react-native-paper";
import React from "react";

const ListContact = () => {
  const navigation = useNavigation();

  const user = useSelector((state) => state.user.user);

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Chat")}
      className="flex-row mx-5 mb-5"
    >
      <Avatar.Image size={50} source={{ uri: user?.profilePic }} />
      <View className="w-3 h-3 bg-green-500 rounded-full absolute  top-10 left-8 "></View>
      <Text className="text-lg font-semibold ml-3">Le Van Tuyen</Text>
      <View className="absolute -right-1 top-[52px] w-10/12 border-b border-gray-200"></View>
    </TouchableOpacity>
  );
};

export default ListContact;
