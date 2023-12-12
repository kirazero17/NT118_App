import { View, Text } from "react-native";
import React from "react";

const ContactButton = () => {
  return (
    <View className="w-full flex-row items-center justify-evenly py-6">
      <View className="items-center justify-center">
        <TouchableOpacity className="items-center justify-center w-12 h-12 rounded-lg bg-gray-300">
          <FontAwesomeIcon icon={faMessage} size={24} color="#666" />
        </TouchableOpacity>
        <Text className="text-sm text-gray-600 py-1">Message</Text>
      </View>
      <View className="items-center justify-center">
        <TouchableOpacity className="items-center justify-center w-12 h-12 rounded-lg bg-gray-300">
          <FontAwesomeIcon icon={faVideo} size={24} color="#666" />
        </TouchableOpacity>
        <Text className="text-sm text-gray-600 py-1">Video Call</Text>
      </View>
      <View className="items-center justify-center">
        <TouchableOpacity className="items-center justify-center w-12 h-12 rounded-lg bg-gray-300">
          <FontAwesomeIcon icon={faPhone} size={24} color="#666" />
        </TouchableOpacity>
        <Text className="text-sm text-gray-600 py-1">Call</Text>
      </View>
      <View className="items-center justify-center">
        <TouchableOpacity className="items-center justify-center w-12 h-12 rounded-lg bg-gray-300">
          <FontAwesomeIcon icon={faEllipsis} size={24} color="#666" />
        </TouchableOpacity>
        <Text className="text-sm text-gray-600 py-1">More</Text>
      </View>
    </View>
  );
};

export default ContactButton;
