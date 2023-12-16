import {
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faChevronLeft,
  faPhone,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { get, ref, onValue } from "firebase/database";
import { fireStoreDB } from "../config/firebase";
import { Avatar } from "react-native-paper";
import { InputChat, MessageText } from "../components";

const Chat = ({ route }) => {
  const { room } = route.params;
  const user = useSelector((state) => state.user.user);

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    const getRoom = async () => {
      const snapshot = await get(ref(fireStoreDB, "userChats/" + user?.id));
      Object.keys(snapshot.val()).map((key) => {
        if (key === room) {
          setChat(snapshot.val()[key]);
        }
      });
    };

    getRoom();
  }, [user.id]);

  useEffect(() => {
    setLoading(true);
    onValue(ref(fireStoreDB, "rooms/" + room), (snapshot) => {
      if (snapshot.exists()) {
        setMessages(snapshot.val().messages);
      }
    });
    setLoading(false);
  }, [room]);

  return (
    <View className="w-full flex-1 items-center justify-start ">
      <StatusBar backgroundColor="#9ca3af" barStyle="default" />
      <View
        className={`w-full px-4 flex-row items-center justify-between bg-sky-200  pb-6 ${
          Platform.OS == "ios" ? "pt-10" : "pt-4"
        }`}
      >
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
              source={{ uri: chat?.userInfo?.profilePic }}
              className="w-full h-full rounded-full"
              resizeMode="contain"
            />
          </View>
          <View>
            <Text className="font-semibold text-lg capitalize">
              {chat?.userInfo?.name}
            </Text>
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
      <View className="w-full bg-slate-50 px-2 py-6 rounded-2xl flex-1 -mt-4 items-center">
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
                <>
                  <View className="flex items-center justify-center mb-6">
                    <Avatar.Image
                      source={{ uri: chat?.userInfo?.profilePic }}
                      size={90}
                    />
                    <Text className="text-[28px] text-gray-800 font-semibold mt-2 mb-1">
                      {chat?.userInfo?.name}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      LET'S BREAK THE ICE
                    </Text>
                  </View>
                  <>
                    {messages?.map((msg) =>
                      msg.sender === user?.id ? (
                        <>
                          <MessageText
                            key={msg.id}
                            type="sender"
                            content={msg.message}
                            time={msg.date}
                          />
                        </>
                      ) : (
                        <>
                          <MessageText
                            key={msg.id}
                            url={chat?.userInfo?.profilePic}
                            type="receiver"
                            content={msg.message}
                            time={msg.date}
                          />
                        </>
                      )
                    )}
                  </>
                </>
              )}
            </ScrollView>
            <InputChat data={chat} room={room} />
          </>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default Chat;
