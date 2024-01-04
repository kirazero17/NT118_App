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
import { useNavigation } from "@react-navigation/native";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState([]);

  const user = useSelector((state) => state.user.user);
  const navigation = useNavigation();

  useEffect(() => {
    const chatRef = ref(fireStoreDB, "rooms/");

    setIsLoading(true);
    const handleData = (snapshot) => {
      const listChat = [];

      if (snapshot.exists()) {
        Object.keys(snapshot.val()).forEach((key) => {
          if (snapshot.val()[key].users.includes(user?.id)) {
            const userChats = snapshot
              .val()
              [key].users.filter((item) => item !== user?.id);

            if (snapshot.val()[key]?.lastMessage) {
              listChat.push({
                roomId: snapshot.val()[key].id,
                userChats,
                nameChat: snapshot.val()[key].name,
                lastMessage: snapshot.val()[key].lastMessage,
                time: snapshot.val()[key].time,
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
      <Header
        title="Đoạn chat"
        icon={faComments}
        size={40}
        onPress={() => navigation.navigate("CreateGroup")}
      />
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
                    <MessageCard key={idx} data={item} />
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
