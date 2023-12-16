import {
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Text,
} from "react-native";
import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { fireStoreDB } from "../config/firebase";
import { useSelector } from "react-redux";
import { Header, MessageCard } from "../components";
import { faComments } from "@fortawesome/free-regular-svg-icons";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState([]);

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const chatRef = ref(fireStoreDB, "userChats/" + user?.id);

    setIsLoading(true);
    const handleData = (snapshot) => {
      const listChat = [];

      if (snapshot.exists()) {
        Object.keys(snapshot.val()).forEach((key) => {
          listChat.push({
            id: key,
            ...snapshot.val()[key],
          });
        });
      }

      setChats(listChat);
      setIsLoading(false);
    };

    const unsubscribe = onValue(chatRef, handleData);

    return () => {
      unsubscribe();
    };
  }, [user]);

  return (
    <SafeAreaView className="flex-1 mt-3 justify-center items-center">
      <Header title="Messages" icon={faComments} size={40} />
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
                      url={item.userInfo.profilePic}
                      lastMessage={item.lastMessage}
                      time={item.lastSend}
                      room={item.id}
                    />
                  ))}
                </>
              ) : (
                <>
                  <Text className="text-center text-xl text-sky-600 font-semibold mt-5">
                    No Messages
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
