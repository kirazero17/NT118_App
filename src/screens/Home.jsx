import {
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Text,
} from "react-native";
import { useState, useEffect } from "react";
import { ref, onValue, get } from "firebase/database";
import { fireStoreDB } from "../config/firebase";
import { useSelector } from "react-redux";
import { Header, MessageCard } from "../components";
import { faComments } from "@fortawesome/free-regular-svg-icons";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState([]);

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const chatRef = ref(fireStoreDB, "rooms/");

    setIsLoading(true);
    const handleData = (snapshot) => {
      const listChat = [];

      if (snapshot.exists()) {
        Object.keys(snapshot.val()).forEach((key) => {
          if (snapshot.val()[key].users.includes(user?.id)) {
            const userChat = snapshot
              .val()
              [key].users.find((item) => item !== user?.id);

            if (snapshot.val()[key]?.lastMessage) {
              onValue(ref(fireStoreDB, "users/" + userChat), (chat) => {
                listChat.push({
                  id: snapshot.val()[key].id,
                  userInfo: chat.val(),
                  lastMessage: snapshot.val()[key].lastMessage,
                  lastSend: snapshot.val()[key].lastSend,
                  time: snapshot.val()[key].time,
                });
              });
            }
          }
        });
      }

      listChat?.sort((a, b) => {
        return b.time - a.time;
      });

      setChats(listChat);
      setIsLoading(false);
    };

    const unsubscribe = onValue(chatRef, handleData);

    return () => {
      unsubscribe();
    };
  }, [user?.id]);

  return (
    <SafeAreaView className="flex-1 pt-3 justify-center items-center">
      <Header title="Đoạn chat" icon={faComments} size={40} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="w-full px-4 py-4"
      >
        <View className="w-full">
          {isLoading ? (
            <>
              <View className="w-full flex items-center justify-center mt-8">
                <ActivityIndicator size={"large"} color={"#13ceeb"} />
              </View>
            </>
          ) : (
            <>
              {chats && chats.length > 0 ? (
                <>
                  {chats.map((item, idx) => (
                    <MessageCard
                      key={idx}
                      name={item.userInfo.fullName}
                      avatar={item.userInfo.avatar}
                      status={item.userInfo.status}
                      lastMessage={item.lastMessage.message}
                      senderId={item.lastMessage.senderId}
                      time={item.lastSend}
                      room={item.id}
                    />
                  ))}
                </>
              ) : (
                <>
                  <Text className="text-center text-xl text-sky-600 font-semibold mt-5">
                    Bạn chưa có tin nhắn nào
                  </Text>
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default Home;
