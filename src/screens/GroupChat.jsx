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

const GroupChat = ({ route }) => {
  const { roomId } = route.params;
  const user = useSelector((state) => state.user.user);

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState({});
  const [userChat, setUserChat] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    const getRoom = async () => {
      const userList = {};
      const snapshot = await get(ref(fireStoreDB, "rooms/" + roomId));
      const userChats = snapshot.val().users;

      userChats.map(async (item) => {
        onValue(ref(fireStoreDB, "users/" + item), (snapshot) => {
          if (snapshot.exists()) {
            userList[item] = snapshot.val();
          }
        });
      });
      setUserChat(userList);
    };

    getRoom();
  }, [roomId]);

  useEffect(() => {
    setLoading(true);
    onValue(ref(fireStoreDB, "rooms/" + roomId), (snapshot) => {
      if (snapshot.exists()) {
        setMessages(snapshot.val().messages);
        setChat(snapshot.val());
      }
    });
    setLoading(false);
  }, [roomId]);

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
          onPress={() =>
            navigation.navigate("SettingGroupChat", {
              roomId: roomId,
              members: userChat,
            })
          }
          className="flex-row items-center gap-3 flex-1"
        >
          <Avatar.Icon
            size={50}
            icon={"account-group"}
            color="#f9fafb"
            className="bg-blue-200 border border-cyan-500"
          />
          <View>
            <Text className="font-semibold text-lg capitalize">
              {chat?.name}
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
      <View className="w-full bg-slate-50 px-2 pb-4 rounded-2xl flex-1 -mt-4 items-center">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={100}
        >
          <>
            <ScrollView showsVerticalScrollIndicator={false}>
              {loading ? (
                <>
                  <View className="w-full flex items-center justify-center">
                    <ActivityIndicator size={"large"} color={"#13ceeb"} />
                  </View>
                </>
              ) : (
                <>
                  <View className="flex items-center justify-center mb-6 mt-3">
                    <Avatar.Icon
                      size={90}
                      icon={"account-group"}
                      color="#f9fafb"
                      className="bg-blue-200 border border-cyan-500"
                    />
                    <Text className="text-[28px] text-gray-800 font-semibold mt-2 mb-1 capitalize">
                      {chat?.name}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      LET'S BREAK THE ICE
                    </Text>
                  </View>
                  <>
                    {messages?.map((msg) =>
                      msg.sender === user?.id ? (
                        <MessageText
                          key={`sender-${msg.id}`}
                          type="sender"
                          content={msg.message}
                          time={msg.date}
                        />
                      ) : (
                        <MessageText
                          key={`receiver-${msg.id}`}
                          avatar={userChat[msg.sender]?.avatar}
                          name={userChat[msg.sender]?.fullName}
                          type="receiver"
                          content={msg.message}
                          time={msg.date}
                        />
                      )
                    )}
                  </>
                </>
              )}
            </ScrollView>
            <InputChat room={roomId} />
          </>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default GroupChat;
