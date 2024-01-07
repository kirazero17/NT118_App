import { View, Image, Text, ActivityIndicator, StatusBar } from "react-native";
import { Logo } from "../../../assets";

const Loading = () => {
  return (
    <View className="flex-1 items-center justify-evenly">
      <StatusBar backgroundColor="#9ca3af" barStyle="default" />
      <View className="items-center justify-center">
        <Image source={Logo} className="w-40 h-40" resizeMode="contain" />
        <View className="flex items-center justify-center my-8">
          <Text className="text-6xl text-sky-900">ICE</Text>
          <Text className="text-2xl text-sky-500">LET'S BREAK THE ICE</Text>
        </View>
      </View>
      <ActivityIndicator size={"large"} color={"#13ceeb"} />
      <View className="flex-row items-center justify-center mt-56">
        <Text className="text-xl">from </Text>
        <Text className="text-xl text-blue-400">Group 17</Text>
      </View>
    </View>
  );
};

export default Loading;
