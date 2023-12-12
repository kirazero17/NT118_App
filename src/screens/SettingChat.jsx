import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

const SettingChat = () => {
  const navigation = useNavigation();
  return (
    <View className="mt-8">
      <View className="w-full px-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faChevronLeft} size={24} color="#555" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SettingChat;
