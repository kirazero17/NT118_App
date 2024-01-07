import { useState, useEffect } from "react";
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
import { ref, onValue, get, update } from "firebase/database";
import { fireStoreDB } from "../../config/firebase";
import { ContactButton, SettingButton } from "../../components";
import { useSelector } from "react-redux";
import { List } from "react-native-paper";

const SettingChat = ({ route }) => {
  const { userId, roomId } = route.params;
  const navigation = useNavigation();
  const [user, setUser] = useState({});

  const currentUser = useSelector((state) => state.user.user);

  useEffect(() => {
    const userRef = ref(fireStoreDB, "users/" + userId);

    const handleData = (snapshot) => {
      setUser(snapshot.val());
    };

    const unsubscribe = onValue(userRef, handleData);

    return () => {
      unsubscribe();
    };
  }, []);
  const handleBlock = async () => {
    try {
      const userRef = ref(fireStoreDB, "users/" + userId);
      const userSnapshot = await get(userRef);
      const listBlockUser = userSnapshot.val()?.listBlocks || [];

      const updatedListBlockUser = [...listBlockUser, currentUser?.id];

      await update(userRef, {
        listBlocks: updatedListBlockUser,
      });

      const currentUserRef = ref(fireStoreDB, "users/" + currentUser?.id);
      const currentUserSnapshot = await get(currentUserRef);
      const listBlockCurrentUser = currentUserSnapshot.val()?.listBlocks || [];

      const updatedListBlockCurrentUser = [...listBlockCurrentUser, userId];

      await update(currentUserRef, {
        listBlocks: updatedListBlockCurrentUser,
      });

      await update(ref(fireStoreDB, "middleware/blocks/" + roomId), {
        blockId: currentUser?.id,
        blockedId: userId,
      });

      setTimeout(() => {
        navigation.goBack();
      }, 1000);
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
      <View className="w-20 h-20 -mt-7 border-2 border-sky-300 rounded-full">
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
      <View className="w-full flex-row items-center justify-evenly mt-8">
        <ContactButton
          onPress={() =>
            navigation.navigate("ProfileContact", {
              userId: userId,
              roomId: roomId,
            })
          }
          text="Info"
          isRounded
        />
        <ContactButton text="Call" isRounded />
        <ContactButton text="More" isRounded />
      </View>
      <List.Section className="w-full">
        <List.Subheader className="text-base text-gray-500 font-bold">
          Setting
        </List.Subheader>
        <View className="w-full items-center">
          <SettingButton label="Emoji" isFirst color="#6d28d9" />
          <SettingButton label="Nickname" isLast color="#27272a" />
        </View>
      </List.Section>
      <List.Section className="w-full">
        <List.Subheader className="text-base text-gray-500 font-bold">
          Others
        </List.Subheader>
        <View className="w-full items-center">
          <SettingButton label="Xem file phương tiện" isFirst color="#2563eb" />
          <SettingButton label="Thông báo & Âm Thanh" isLast color="#d946ef" />
        </View>
      </List.Section>
      <List.Section className="w-full">
        <List.Subheader className="text-base text-gray-500 font-bold">
          Privacy & Support
        </List.Subheader>
        <View className="w-full items-center">
          <SettingButton
            onPress={handleBlock}
            label="Chặn"
            isFirst
            color="#dc2626"
          />
          <SettingButton label="Báo cáo" isLast color="#ca8a04" />
        </View>
      </List.Section>
    </SafeAreaView>
  );
};

export default SettingChat;
