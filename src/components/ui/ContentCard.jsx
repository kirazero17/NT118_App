import { View, Text, TouchableOpacity } from "react-native";
import { Card, Avatar, IconButton } from "react-native-paper";
import { defaultAvatar } from "../../../assets";
import { useState } from "react";

const ContentCard = ({ url, name }) => {
  const [isHeart, setIsHeart] = useState(false);
  return (
    <Card className="mb-2">
      <View className="flex-row justify-between items-center my-1 mx-1">
        <TouchableOpacity className="flex-row items-center">
          <Avatar.Image size={50} source={defaultAvatar} />
          <Text className="text-lg font-semibold ml-3">{name}</Text>
        </TouchableOpacity>
        <IconButton icon="dots-horizontal" />
      </View>
      <Card.Cover
        className="mx-2"
        source={{
          uri: url,
        }}
      />
      <Card.Actions>
        <IconButton
          onPress={() => setIsHeart(!isHeart)}
          mode="default"
          icon={`${isHeart ? "heart" : "heart-outline"}`}
          iconColor={`${isHeart ? "#ef4444" : "#27272a"}`}
        />
        <IconButton icon="chat-outline" mode="default" iconColor="#27272a" />
      </Card.Actions>
    </Card>
  );
};

export default ContentCard;
