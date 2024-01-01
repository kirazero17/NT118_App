import { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Header, NotifyCard, SkeletonNotify } from "../components";
import { useSelector } from "react-redux";
import { ref, onValue } from "firebase/database";
import { fireStoreDB } from "../config/firebase";
import { FlatList } from "native-base";

const Notification = () => {
  const user = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(false);
  const [notify, setNotify] = useState([]);

  useLayoutEffect(() => {
    const notifyRef = ref(fireStoreDB, "middleware/");
    setIsLoading(true);

    const handleData = (snapshot) => {
      if (snapshot.exists()) {
        const notifications = snapshot.val().notifications;
        if (notifications) {
          const listNotify = notifications.filter((item) => {
            return item.receiverId === user?.id;
          });
          listNotify.sort((a, b) => {
            return b.id - a.id;
          });

          setNotify(listNotify);
        }
      }
      setIsLoading(false);
    };

    const unsubscribe = onValue(notifyRef, handleData);

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 pt-3">
      <Header title="Thông báo" />
      {isLoading ? (
        <>
          {Platform.OS === "ios" ? (
            <View className="w-full mt-6">
              <SkeletonNotify />
              <SkeletonNotify />
              <SkeletonNotify />
              <SkeletonNotify />
            </View>
          ) : (
            <View className="w-full flex items-center justify-center mt-8">
              <ActivityIndicator size={"large"} color={"#13ceeb"} />
            </View>
          )}
        </>
      ) : (
        <>
          {notify && notify.length > 0 ? (
            <>
              <FlatList
                className="w-full px-3 pt-3"
                data={notify}
                renderItem={({ item }) => (
                  <NotifyCard
                    id={item.id}
                    type={item.type}
                    senderName={item.senderName}
                    avatar={item.avatar}
                    senderId={item.senderId}
                  />
                )}
                keyExtractor={(item) => item.id}
              />
            </>
          ) : (
            <Text className="text-center text-xl text-sky-600 font-semibold mt-5">
              Không có thông báo nào
            </Text>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default Notification;
