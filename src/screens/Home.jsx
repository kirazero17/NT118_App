import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";
import { Logo, defaultAvatar } from "../../assets";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMessage, faUser } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector((state) => state.user.user);
  const navigation = useNavigation();

  return (
    <View className="flex-1 mt-12">
      <SafeAreaView>
        <View className="w-full flex-row items-center justify-between px-4 py-2">
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile")}
            className="w-14 h-14 rounded-full border border-primary flex items-center justify-center"
          >
            <Image
              source={defaultAvatar}
              className="w-full h-full rounded-full"
              resizeMode="cover"
            />
          </TouchableOpacity>
          <Image source={Logo} className="w-12 h-12" resizeMode="contain" />
        </View>
        <ScrollView className="w-full px-4 py-4">
          <View className="w-full">
            <View className="w-full flex-row items-center justify-between px-2 mb-6">
              <Text className="text-gray-600 text-xl font-extrabold pb-2">
                Message
              </Text>
              <TouchableOpacity>
                <FontAwesomeIcon icon={faMessage} size={20} />
              </TouchableOpacity>
            </View>
            {isLoading ? (
              <>
                <View className="w-full flex items-center justify-center mt-8">
                  <ActivityIndicator size={"large"} color={"#13ceeb"} />
                </View>
              </>
            ) : (
              <>
                <MessageCard />
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const MessageCard = () => {
  return (
    <TouchableOpacity className="w-full flex-row items-center justify-start py-2">
      <View className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-primary p-1">
        <FontAwesomeIcon icon={faUser} size={24} />
      </View>
      <View className="flex-1 flex items-start justify-center ml-4">
        <Text className="text-[#333] text-base font-semibold capitalize">
          Message Title
        </Text>
        <Text className="text-gray-600 text-sm">Hello</Text>
      </View>
      <Text className="text-primary px-4 text-base font-semibold">30 min</Text>
    </TouchableOpacity>
  );
};

export default Home;
