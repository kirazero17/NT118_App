import {
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Text,
} from "react-native";
import { useState, useLayoutEffect } from "react";
import { ref, onValue } from "firebase/database";
import { fireStoreDB } from "../config/firebase";
import { useSelector } from "react-redux";
import { Header, MessageCard } from "../components";
import { faComments } from "@fortawesome/free-regular-svg-icons";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState([]);

  const user = useSelector((state) => state.user.user);

  useLayoutEffect(() => {
    const chatRef = ref(fireStoreDB, "userChats/" + user?.id);

    setIsLoading(true);
    const handleData = (snapshot) => {
      const listChat = [];

      if (snapshot.exists()) {
        Object.keys(snapshot.val()).forEach((key) => {
          if (snapshot.val()[key].lastMessage) {
            listChat.push({
              id: key,
              ...snapshot.val()[key],
            });
          }
        });
      }

      listChat.sort((a, b) => {
        return b.time - a.time;
      });

      setChats(listChat);
      setIsLoading(false);
    };

    const unsubscribe = onValue(chatRef, handleData);

    return () => {
      unsubscribe();
    };
  }, [user]);

  return (
    <SafeAreaView className="flex-1 pt-3 justify-center items-center">
      <Header title="Đoạn chat" icon={faComments} size={40} />
      <ScrollView className="w-full px-4 py-4">
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
                  {chats.map((item) => (
                    <MessageCard
                      key={item.id}
                      name={item.userInfo.name}
                      avatar={item.userInfo.avatar}
                      lastMessage={item.lastMessage}
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
