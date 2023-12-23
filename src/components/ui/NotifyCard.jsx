import { View, Text, TouchableOpacity } from "react-native";
import { useState, useLayoutEffect } from "react";
import { Card, IconButton, Button } from "react-native-paper";
import { Avatar } from "native-base";
import { ref, update, get, serverTimestamp } from "firebase/database";
import { fireStoreDB } from "../../config/firebase";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { useToast } from "native-base";
import Toast from "./Toast";

const NotifyCard = ({ type, senderName, senderId, avatar, id }) => {
  const toast = useToast();
  const [content, setContent] = useState("");
  const user = useSelector((state) => state.user.user);

  const showToast = (title, status, variant) => {
    toast.show({
      render: () => <Toast title={title} status={status} variant={variant} />,
      duration: 1000,
      placement: "bottom",
    });
  };

  const handleAccept = async () => {
    try {
      const userRef = ref(fireStoreDB, `users/${senderId}`);
      const userSnapshot = await get(userRef);
      const currentListFriends = userSnapshot.val().listFriends || [];

      const updatedListFriends = [...currentListFriends, user?.id];
      await update(userRef, {
        listFriends: updatedListFriends,
      });

      await update(
        ref(fireStoreDB, `users/${senderId}/friendRequest/${user?.id}`),
        {
          status: "success",
        }
      );

      await update(
        ref(fireStoreDB, `users/${user?.id}/friendRequest/${senderId}`),
        {
          status: "success",
        }
      );

      const currentUserRef = ref(fireStoreDB, `users/${user?.id}`);
      const currentUserSnapshot = await get(currentUserRef);
      const currentListFriendsCurrentUser =
        currentUserSnapshot.val().listFriends || [];

      const updatedListFriendsCurrentUser = [
        ...currentListFriendsCurrentUser,
        senderId,
      ];
      await update(currentUserRef, {
        listFriends: updatedListFriendsCurrentUser,
      });

      const notifyRef = ref(fireStoreDB, `middleware/`);
      const snapshot = await get(notifyRef);

      const updatedNotifications = snapshot
        .val()
        ?.notifications.filter((notification) => {
          return !(notification.id === id);
        });

      await update(notifyRef, {
        notifications: updatedNotifications,
      });

      const snapshot2 = await get(notifyRef);
      const currentNotifications = snapshot2.val()?.notifications || [];
      const data = {
        id: serverTimestamp(),
        senderId: user?.id,
        senderName: user?.fullName,
        avatar: user?.avatar,
        receiverId: senderId,
        type: "friendAccept",
        time: format(new Date(), "dd/MM/yyyy HH:mm"),
      };

      await update(notifyRef, {
        notifications: [...currentNotifications, data],
      });

      showToast(
        `Bạn đã thêm ${senderName} vào danh sách bạn bè!`,
        "success",
        "left-accent"
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = async () => {
    try {
      const notifyRef = ref(fireStoreDB, `middleware/`);
      const snapshot = await get(notifyRef);
      const currentNotifications = snapshot.val()?.notifications || [];

      const updatedNotifications = currentNotifications.filter(
        (notification) => {
          return !(notification.id === id);
        }
      );

      await update(notifyRef, {
        notifications: updatedNotifications,
      });

      await update(
        ref(fireStoreDB, `users/${senderId}/friendRequest/${user?.id}`),
        {
          status: "previous",
        }
      );
      await update(
        ref(fireStoreDB, `users/${user?.id}/friendRequest/${senderId}`),
        {
          status: "previous",
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    switch (type) {
      case "friendRequest":
        return setContent("đã gửi cho bạn lời mời kết bạn");
      case "friendAccept":
        return setContent("đã chấp nhận lời mời kết bạn của bạn");
      default:
        return setContent("");
    }
  }, [type]);

  return (
    <Card mode="contained" className="mb-2 p-1 bg-gray-100">
      <View className="flex-row justify-start items-center my-1 mx-1">
        <TouchableOpacity className="flex-row items-center">
          <Avatar source={{ uri: avatar }} size="lg">
            <Avatar.Badge bg="green.500" />
          </Avatar>
        </TouchableOpacity>
        <Text className="ml-3 w-[65%]">
          <Text className="text-lg font-semibold ml-3 capitalize">
            {senderName}
          </Text>
          <Text> </Text>
          <Text className="text-base font-medium ml-1">{content}</Text>
        </Text>
        <IconButton className="flex-1" icon="dots-horizontal" size={30} />
      </View>

      {type === "friendRequest" && (
        <Card.Actions className="flex items-center justify-center">
          <Button
            onPress={handleAccept}
            mode="elevated"
            buttonColor="#60a5fa"
            textColor="#f3f4f6"
          >
            Xác nhận
          </Button>
          <Button
            onPress={handleRemove}
            mode="elevated"
            buttonColor="#d1d5db"
            textColor="#030712"
          >
            Xóa
          </Button>
        </Card.Actions>
      )}
    </Card>
  );
};

export default NotifyCard;
