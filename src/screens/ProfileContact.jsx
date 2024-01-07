import { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import { ContactButton, SettingButton, Toast } from "../components";
import { ref, onValue, update, get, serverTimestamp } from "firebase/database";
import { fireStoreDB } from "../config/firebase";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { Icon } from "react-native-paper";
import { useToast, useDisclose, Actionsheet } from "native-base";

const ProfileContact = ({ route }) => {
  const { userId, roomId } = route.params;
  const currentUser = useSelector((state) => state.user.user);
  const navigation = useNavigation();
  const [user, setUser] = useState({});
  const [statusFriendRequest, setStatusFriendRequest] = useState("previous");
  const [titleButton, setTitleButton] = useState("");
  const [iconButton, setIconButton] = useState("account");
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclose();

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
    };

    const unsubscribe = onValue(userRef, handleData);

    return () => {
      unsubscribe();
    };
  }, []);

  useLayoutEffect(() => {
    switch (statusFriendRequest) {
      case "success":
        setTitleButton("Hủy kết bạn");
        setIconButton("account-off");
        break;
      case "waiting":
        setTitleButton("Hủy yêu cầu kết bạn");
        setIconButton("account-remove");
        break;
      case "pending":
        setTitleButton("Chấp nhận yêu cầu kết bạn");
        setIconButton("account-check");
        break;
      default:
        setTitleButton("Kết bạn");
        setIconButton("account-plus");
    }
  }, [statusFriendRequest]);

  const handleAddFriend = async () => {
    try {
      onClose();
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
    <SafeAreaView className="flex-1 items-center bg-[#eaeaea]">
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

        <ContactButton text="More" onPress={onOpen} />
        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content>
            <View className="w-full flex items-center justify-center px-2 ">
              <TouchableOpacity
                onPress={handleAddFriend}
                className="w-full py-3 flex-row items-center"
              >
                <Icon
                  source={iconButton}
                  size={24}
                  color={`${
                    titleButton === "Hủy kết bạn" ||
                    titleButton === "Hủy yêu cầu kết bạn"
                      ? "#f87171"
                      : "#374151"
                  }`}
                />
                <Text
                  className={`text-xl ${
                    titleButton === "Hủy kết bạn" ||
                    titleButton === "Hủy yêu cầu kết bạn"
                      ? "text-red-400"
                      : "text-gray-700"
                  } font-semibold ml-2`}
                >
                  {titleButton}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="w-full py-3 flex-row items-center">
                <Icon source="account-lock" size={24} color="#374151" />
                <Text className="text-xl text-gray-700 font-semibold ml-2">
                  Chặn người dùng
                </Text>
              </TouchableOpacity>
            </View>
          </Actionsheet.Content>
        </Actionsheet>
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
        <SettingButton label="Thông tin tài khoản" isFirst color="#2563eb" />
        <SettingButton label="Thông báo & Âm Thanh" isLast color="#d946ef" />
      </View>
      <View className="w-full items-center mt-4">
        <SettingButton label="Chặn" isFirst color="#dc2626" />
        <SettingButton label="Báo cáo" isLast color="#ca8a04" />
      </View>
    </SafeAreaView>
  );
};

export default ProfileContact;
