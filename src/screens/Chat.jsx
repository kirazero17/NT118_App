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
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { get, ref, onValue, remove, update } from "firebase/database";
import { fireStoreDB } from "../config/firebase";
import { Avatar } from "react-native-paper";
import { InputChat, MessageText } from "../components";

const Chat = ({ route }) => {
  const { roomId } = route.params;
  const user = useSelector((state) => state.user.user);

  const scrollViewRef = useRef();

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState({});
  const [block, setBlock] = useState({});
  const [isBlock, setIsBlock] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const getRoom = async () => {
      const snapshot = await get(ref(fireStoreDB, "rooms/" + roomId));
      const userChat = snapshot.val().users.find((item) => item !== user?.id);
      onValue(ref(fireStoreDB, "users/" + userChat), (snapshot) => {
        setChat(snapshot.val());
        if (snapshot.val().listBlocks?.includes(user?.id)) {
          setIsBlock(true);
        }
      });
    };

    getRoom();
  }, [roomId]);

  useEffect(() => {
    setLoading(true);
    onValue(ref(fireStoreDB, "rooms/" + roomId), (snapshot) => {
      if (snapshot.exists()) {
        setMessages(snapshot.val().messages);
      }
    });
    setLoading(false);
  }, [roomId]);

  useEffect(() => {
    onValue(ref(fireStoreDB, "middleware/blocks/" + roomId), (snapshot) => {
      if (snapshot.exists()) {
        setBlock(snapshot.val());
      }
    });
  }, [roomId]);

  const handleUnblock = async () => {
    try {
      await remove(ref(fireStoreDB, "middleware/blocks/" + roomId));

      const userRef = ref(fireStoreDB, `users/${chat?.id}`);
      const userSnapshot = await get(userRef);
      const listBlockUsers = userSnapshot.val().listBlocks || [];

      const updatedListBlockUsers = listBlockUsers.filter(
        (item) => item !== user?.id
      );
      await update(userRef, {
        listBlocks: updatedListBlockUsers,
      });

      const currentUserRef = ref(fireStoreDB, `users/${user?.id}`);
      const currentUserSnapshot = await get(currentUserRef);
      const listBlockCurrentUser = currentUserSnapshot.val().listBlocks || [];

      const updatedListBlockCurrentUser = listBlockCurrentUser.filter(
        (item) => item !== chat?.id
      );
      await update(currentUserRef, {
        listBlocks: updatedListBlockCurrentUser,
      });

      setIsBlock(false);
    } catch (error) {
      console.log(error);
    }
  };

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
            onPress={() => navigation.goBack()}
          >
            <FontAwesomeIcon icon={faChevronLeft} size={24} color="#555" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          disabled={isBlock}
          onPress={() =>
            navigation.navigate("SettingChat", {
              userId: chat?.id,
              roomId: roomId,
            })
          }
          className="flex-row items-center gap-3 flex-1"
        >
          <View className="w-12 h-12 relative border-2 border-sky-400 rounded-full">
            <Image
              source={{ uri: chat?.avatar }}
              className="w-full h-full rounded-full"
              resizeMode="contain"
            />
          </View>
          <View>
            <Text className="font-semibold text-lg capitalize">
              {chat?.fullName}
            </Text>
            <Text
              className={`text-sm ${
                chat?.status === "online" ? "text-green-700" : "text-gray-500"
              } font-semibold capitalize`}
            >
              {chat?.status}
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
          className="flex-1 w-full"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={100}
        >
          <>
            <ScrollView
              ref={scrollViewRef}
              onContentSizeChange={() =>
                scrollViewRef.current.scrollToEnd({ animated: true })
              }
              showsVerticalScrollIndicator={false}
            >
              {loading ? (
                <>
                  <View className="w-full flex items-center justify-center">
                    <ActivityIndicator size={"large"} color={"#13ceeb"} />
                  </View>
                </>
              ) : (
                <>
                  <View className="flex items-center justify-center mb-6 mt-3">
                    <Avatar.Image source={{ uri: chat?.avatar }} size={90} />
                    <Text className="text-[28px] text-gray-800 font-semibold mt-2 mb-1 capitalize">
                      {chat?.fullName}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      LET'S BREAK THE ICE
                    </Text>
                    {!isBlock && (
                      <>
                        {chat?.listFriends?.includes(user?.id) ? (
                          <Text className="text-sm text-gray-500 font-semibold text-center">
                            Các bạn là bạn bè trên hệ thống
                          </Text>
                        ) : (
                          <Text className="text-sm text-gray-500 font-semibold">
                            Các bạn chưa là bạn bè trên hệ thống
                          </Text>
                        )}
                      </>
                    )}
                  </View>
                  <>
                    {messages?.map((msg) =>
                      msg.sender === user?.id ? (
                        <MessageText
                          key={`sender-${msg.id}`}
                          typeUser="sender"
                          content={msg.message}
                          time={msg.date}
                          typeMessage={msg.type}
                        />
                      ) : (
                        <MessageText
                          key={`receiver-${msg.id}`}
                          avatar={chat?.avatar}
                          typeUser="receiver"
                          content={msg.message}
                          time={msg.date}
                          typeMessage={msg.type}
                        />
                      )
                    )}
                  </>
                </>
              )}
            </ScrollView>
            {isBlock ? (
              <View className="w-full flex-row items-center justify-center gap-4 px-6">
                {block?.blockId === user?.id ? (
                  <>
                    <Text className="text-lg font-semibold text-gray-500">
                      Bạn đã chặn người dùng này
                    </Text>
                    <TouchableOpacity onPress={handleUnblock}>
                      <Text className="text-lg font-semibold text-sky-500">
                        Bỏ chặn
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <Text className="text-lg font-semibold text-gray-500">
                    Bạn đã bị chặn bởi người dùng này
                  </Text>
                )}
              </View>
            ) : (
              <InputChat
                room={roomId}
                onFocus={() => {
                  scrollViewRef.current.scrollToEnd({ animated: true });
                }}
              />
            )}
          </>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default Chat;
