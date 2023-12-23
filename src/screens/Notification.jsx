import { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Header, NotifyCard } from "../components";
import { useSelector } from "react-redux";
import { ref, onValue, get } from "firebase/database";
import { fireStoreDB } from "../config/firebase";

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
      <ScrollView className="w-full px-3 pt-3">
        {isLoading ? (
          <View className="w-full flex items-center justify-center mt-8">
            <ActivityIndicator size={"large"} color={"#13ceeb"} />
          </View>
        ) : (
          <>
            {notify && notify.length > 0 ? (
              <>
                {notify.map((item, idx) => (
                  <NotifyCard
                    key={idx}
                    id={item.id}
                    type={item.type}
                    senderName={item.senderName}
                    avatar={item.avatar}
                    senderId={item.senderId}
                  />
                ))}
              </>
            ) : (
              <Text className="text-center text-gray-500 text-lg mt-4">
                Không có thông báo nào
              </Text>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notification;
