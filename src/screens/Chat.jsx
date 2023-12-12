import {
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  TextInput,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faChevronLeft,
  faFaceSmile,
  faPhone,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { defaultAvatar } from "../../assets";

const Chat = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigation = useNavigation();

  return (
    <View className="w-full flex-1 items-center justify-start">
      <StatusBar backgroundColor="#9ca3af" barStyle="default" />
      <View className="w-full px-4 flex-row items-center justify-between bg-sky-200 py-4 pb-6">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            className="mr-[14px]"
            onPress={() => navigation.navigate("Home")}
          >
            <FontAwesomeIcon icon={faChevronLeft} size={24} color="#555" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("SettingChat")}
          className="flex-row items-center gap-3 flex-1"
        >
          <View className="w-12 h-12 relative border-2 border-primary rounded-full">
            <Image
              source={defaultAvatar}
              className="w-full h-full rounded-full"
              resizeMode="contain"
            />
          </View>
          <View>
            <Text className="font-semibold text-lg capitalize">Hoang Long</Text>
            <Text className="text-sm text-gray-400 font-semibold capitalize">
              online
            </Text>
          </View>
        </TouchableOpacity>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity>
            <FontAwesomeIcon icon={faPhone} size={22} color="#d946ef" />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesomeIcon icon={faVideo} size={24} color="#d946ef" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="w-full bg-slate-50 px-2 py-6 rounded-2xl flex-1 -mt-4">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={100}
        >
          <>
            <ScrollView>
              {loading ? (
                <>
                  <View className="w-full flex items-center justify-center">
                    <ActivityIndicator size={"large"} color={"#13ceeb"} />
                  </View>
                </>
              ) : (
                <></>
              )}
            </ScrollView>

            <View className="w-full flex-row items-center justify-center">
              <View className="bg-gray-200 rounded-2xl px-4 space-x-4 py-2 flex-row items-center justify-center">
                <TouchableOpacity>
                  <FontAwesomeIcon
                    icon={faFaceSmile}
                    size={20}
                    color="#93c5fd"
                  />
                </TouchableOpacity>

                <TextInput
                  className="flex-1 h-8 text-base text-gray-700 font-semibold"
                  placeholder="Type here..."
                  placeholderTextColor={"#999"}
                  value={message}
                  onChangeText={(text) => setMessage(text)}
                />
              </View>
            </View>
          </>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default Chat;
