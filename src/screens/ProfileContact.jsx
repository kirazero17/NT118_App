import { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import { ContactButton, SettingButton, Toast } from "../components";
import { Menu, PaperProvider } from "react-native-paper";
import { ref, onValue, update, get, serverTimestamp } from "firebase/database";
import { fireStoreDB } from "../config/firebase";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { useToast } from "native-base";

const ProfileContact = ({ route }) => {
  const { userId, roomId } = route.params;
  const currentUser = useSelector((state) => state.user.user);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({});
  const [visible, setVisible] = useState(false);
  const [statusFriendRequest, setStatusFriendRequest] = useState("previous");
  const [titleButton, setTitleButton] = useState("");
  const toast = useToast();

  const showToast = (title, status, variant) => {
    toast.show({
      render: () => <Toast title={title} status={status} variant={variant} />,
      duration: 1000,
      placement: "bottom",
    });
  };

  useEffect(() => {
    const userRef = ref(fireStoreDB, "users/" + userId);
    const currentUserRef = ref(
      fireStoreDB,
      "users/" + currentUser.id + "/friendRequest"
    );

    setIsLoading(true);

    onValue(currentUserRef, (snapshot) => {
      if (snapshot.exists()) {
        Object.keys(snapshot.val()).map((key) => {
          if (key === userId) {
            setStatusFriendRequest(snapshot.val()[key].status);
          }
        });
      }
    });

    const handleData = (snapshot) => {
      setUser(snapshot.val());

      setIsLoading(false);
    };

    const unsubscribe = onValue(userRef, handleData);

    return () => {
      unsubscribe();
    };
  }, []);

  useLayoutEffect(() => {
    switch (statusFriendRequest) {
      case "success":
        return setTitleButton("Remove Friend");
      case "waiting":
        return setTitleButton("Cancel Request");
      case "pending":
        return setTitleButton("Accept Request");
      default:
        return setTitleButton("Add Friend");
    }
  }, [statusFriendRequest]);

  const handleAddFriend = async () => {
    try {
      const notificationRef = ref(fireStoreDB, "middleware/");
      const snapshot = await get(notificationRef);
      const currentNotifications = snapshot.val()?.notifications || [];

      if (statusFriendRequest === "previous") {
        const dataRequest = {
          id: serverTimestamp(),
          senderId: currentUser?.id,
          senderName: currentUser?.fullName,
          avatar: currentUser?.avatar,
          receiverId: userId,
          type: "friendRequest",
          time: format(new Date(), "dd/MM/yyyy HH:mm"),
        };
        await update(notificationRef, {
          notifications: [...currentNotifications, dataRequest],
        });

        await update(
          ref(
            fireStoreDB,
            "users/" + currentUser?.id + "/friendRequest/" + userId
          ),
          {
            status: "waiting",
          }
        );

        await update(
          ref(
            fireStoreDB,
            "users/" + userId + "/friendRequest/" + currentUser?.id
          ),
          {
            status: "pending",
          }
        );
      } else if (statusFriendRequest === "waiting") {
        const updatedNotifications = currentNotifications.filter(
          (notification) =>
            !(
              notification.senderId === currentUser?.id &&
              notification.receiverId === userId &&
              notification.type === "friendRequest"
            )
        );

        await update(notificationRef, {
          notifications: updatedNotifications,
        });

        await update(
          ref(
            fireStoreDB,
            "users/" + currentUser?.id + "/friendRequest/" + userId
          ),
          {
            status: "previous",
          }
        );

        await update(
          ref(
            fireStoreDB,
            "users/" + userId + "/friendRequest/" + currentUser?.id
          ),
          {
            status: "previous",
          }
        );
      } else if (statusFriendRequest === "success") {
        const userRef = ref(fireStoreDB, "users/" + userId);
        const userSnapshot = await get(userRef);
        const listFriendsUser = userSnapshot.val()?.listFriends || [];

        const updatedListFriendsUser = listFriendsUser.filter(
          (friend) => friend !== currentUser?.id
        );

        await update(userRef, {
          listFriends: updatedListFriendsUser,
        });

        const currentUserRef = ref(fireStoreDB, "users/" + currentUser?.id);
        const currentUserSnapshot = await get(currentUserRef);
        const listFriendsCurrentUser =
          currentUserSnapshot.val()?.listFriends || [];

        const updatedListFriendsCurrentUser = listFriendsCurrentUser.filter(
          (friend) => friend !== userId
        );

        await update(currentUserRef, {
          listFriends: updatedListFriendsCurrentUser,
        });

        await update(
          ref(fireStoreDB, `users/${userId}/friendRequest/${currentUser?.id}`),
          {
            status: "previous",
          }
        );

        await update(
          ref(fireStoreDB, `users/${currentUser?.id}/friendRequest/${userId}`),
          {
            status: "previous",
          }
        );

        showToast(
          `Bạn đã xóa ${user?.fullName} khỏi danh sách bạn bè!`,
          "warning",
          "left-accent"
        );
      } else if (statusFriendRequest === "pending") {
        const userRef = ref(fireStoreDB, "users/" + userId);
        const userSnapshot = await get(userRef);
        const listFriendsUser = userSnapshot.val()?.listFriends || [];

        const updatedListFriendsUser = [...listFriendsUser, currentUser?.id];

        await update(userRef, {
          listFriends: updatedListFriendsUser,
        });

        const currentUserRef = ref(fireStoreDB, "users/" + currentUser?.id);
        const currentUserSnapshot = await get(currentUserRef);
        const listFriendsCurrentUser =
          currentUserSnapshot.val()?.listFriends || [];

        const updatedListFriendsCurrentUser = [
          ...listFriendsCurrentUser,
          userId,
        ];

        await update(currentUserRef, {
          listFriends: updatedListFriendsCurrentUser,
        });

        const updatedNotifications = currentNotifications.filter(
          (notification) =>
            !(
              notification.senderId === userId &&
              notification.receiverId === currentUser?.id &&
              notification.type === "friendRequest"
            )
        );

        await update(notificationRef, {
          notifications: updatedNotifications,
        });

        const snapshot2 = await get(notificationRef);
        const currentNotifications2 = snapshot2.val()?.notifications || [];
        const dataAccept = {
          id: serverTimestamp(),
          senderId: currentUser?.id,
          senderName: currentUser?.fullName,
          avatar: currentUser?.avatar,
          receiverId: userId,
          type: "friendAccept",
          time: format(new Date(), "dd/MM/yyyy HH:mm"),
        };

        await update(notificationRef, {
          notifications: [...currentNotifications2, dataAccept],
        });

        await update(
          ref(fireStoreDB, `users/${userId}/friendRequest/${currentUser?.id}`),
          {
            status: "success",
          }
        );

        await update(
          ref(fireStoreDB, `users/${currentUser?.id}/friendRequest/${userId}`),
          {
            status: "success",
          }
        );

        showToast(
          `Bạn đã thêm ${user?.fullName} vào danh sách bạn bè!`,
          "success",
          "left-accent"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <PaperProvider>
      <SafeAreaView
        className={`flex-1 items-center ${
          Platform.OS === "ios" ? "bg-[#eaeaea]" : "bg-[#dfdfdf]"
        }`}
      >
        <StatusBar backgroundColor="#9ca3af" barStyle="default" />
        <View className="w-full px-4 mt-3">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesomeIcon icon={faArrowLeft} size={24} color="#555" />
          </TouchableOpacity>
        </View>
        <View className="w-20 h-20 -mt-6 border-2 border-sky-300 rounded-full">
          <Image
            source={{ uri: user?.avatar }}
            className="w-full h-full rounded-full"
            resizeMode="contain"
          />
        </View>
        <Text className="text-2xl font-semibold text-sky-300 pt-3 capitalize">
          {user?.fullName}
        </Text>
        <Text className="text-base font-semibold text-gray-500">
          {user?.email}
        </Text>
        <View className="w-full flex-row items-center justify-evenly py-6">
          <ContactButton
            onPress={() => navigation.navigate("Chat", { roomId: roomId })}
            text="Message"
          />
          <ContactButton text="Video Call" />
          <ContactButton text="Call" />
          <Menu
            contentStyle={{
              padding: 0,
              marginTop: 5,
              backgroundColor: "#e5e7eb",
              borderRadius: 8,
            }}
            visible={visible}
            onDismiss={() => setVisible(false)}
            anchor={
              <ContactButton text="More" onPress={() => setVisible(true)} />
            }
            anchorPosition={`${Platform.OS === "ios" && "bottom"}`}
          >
            <Menu.Item
              onPress={handleAddFriend}
              className="bg-gray-200"
              title={titleButton}
            />
          </Menu>
        </View>

        <View className="w-full px-6 space-y-3">
          <View className="w-full flex-row items-center justify-between">
            <Text className="text-base font-semibold text-gray-600">
              Media shared
            </Text>
            <TouchableOpacity>
              <Text className="text-base font-semibold uppercase text-gray-600">
                View All
              </Text>
            </TouchableOpacity>
          </View>
          <View className="w-full flex-row items-center justify-between flex-wrap">
            <TouchableOpacity className="w-24 h-24 m-1 rounded-xl bg-gray-300 overflow-hidden">
              <Image
                className="w-full h-full"
                resizeMode="cover"
                source={{
                  uri: "https://images.pexels.com/photos/807598/pexels-photo-807598.jpeg?auto=compress&cs=tinysrgb&w=600",
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity className="w-24 h-24 m-1 rounded-xl bg-gray-300 overflow-hidden">
              <Image
                className="w-full h-full"
                resizeMode="cover"
                source={{
                  uri: "https://images.pexels.com/photos/3819046/pexels-photo-3819046.jpeg?auto=compress&cs=tinysrgb&w=600",
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity className="w-24 h-24 m-1 rounded-xl bg-gray-300 overflow-hidden">
              <Image
                className="w-full h-full"
                resizeMode="cover"
                source={{
                  uri: "https://images.pexels.com/photos/372166/pexels-photo-372166.jpeg?auto=compress&cs=tinysrgb&w=600",
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity className="w-24 h-24 m-1 rounded-xl bg-gray-300 overflow-hidden">
              <Image
                className="w-full h-full"
                resizeMode="cover"
                source={{
                  uri: "https://images.pexels.com/photos/459203/pexels-photo-459203.jpeg?auto=compress&cs=tinysrgb&w=600",
                }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View className="w-full items-center mt-4">
          <SettingButton label="Information" isFirst color="#2563eb" />
          <SettingButton label="Notification & Sound" isLast color="#d946ef" />
        </View>
        <View className="w-full items-center mt-4">
          <SettingButton label="Block" isFirst color="#dc2626" />
          <SettingButton label="Report" isLast color="#ca8a04" />
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
};

export default ProfileContact;
