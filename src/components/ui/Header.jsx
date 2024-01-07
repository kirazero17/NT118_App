import { View, TouchableOpacity, Image, Text, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Logo, defaultAvatar } from "../../../assets";
import React from "react";

const Header = ({ title, icon, size, onPress }) => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);

  return (
    <>
      <StatusBar backgroundColor="#9ca3af" barStyle="default" />
      <View className="w-full flex-row items-center justify-between px-4 py-2">
        <TouchableOpacity
          onPress={() => navigation.navigate("Profile")}
          className="w-[54px] h-[54px] rounded-full border-2 border-sky-400 flex items-center justify-center"
        >
          <Image
            source={{ uri: user?.avatar } || defaultAvatar}
            className="w-full h-full rounded-full"
            resizeMode="cover"
          />
        </TouchableOpacity>
        <Text className="text-2xl font-medium">{title}</Text>
        {icon ? (
          <TouchableOpacity onPress={onPress}>
            <FontAwesomeIcon icon={icon} size={size} color="#7dd3fc" />
          </TouchableOpacity>
        ) : (
          <Image source={Logo} className="w-10 h-10" resizeMode="contain" />
        )}
      </View>
      <View className="w-full border-b border-sky-100"></View>
    </>
  );
};

export default Header;
