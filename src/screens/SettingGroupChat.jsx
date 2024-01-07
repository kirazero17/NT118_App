import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { useSelector } from "react-redux";
import { fireStoreDB } from "../config/firebase";
import { ContactButton, SettingButton } from "../components";
import { List, Avatar } from "react-native-paper";
import { useDisclose, Actionsheet } from "native-base";

const SettingGroupChat = ({ route }) => {
  const { roomId, members } = route.params;
  const navigation = useNavigation();
  const [setRoom, setSetRoom] = useState({});

  const { isOpen, onOpen, onClose } = useDisclose();

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const getRoom = async () => {
      onValue(ref(fireStoreDB, "rooms/" + roomId), (snapshot) => {
        if (snapshot.exists()) {
          setSetRoom(snapshot.val());
        }
      });
    };

    getRoom();
  }, [roomId]);

  return (
    <SafeAreaView className="flex-1 items-center bg-[#eaeaea]">
      <StatusBar backgroundColor="#9ca3af" barStyle="default" />
      <View className="w-full px-4 mt-2">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} size={24} color="#555" />
        </TouchableOpacity>
      </View>
      <ScrollView className="w-full -mt-3">
        <Avatar.Icon
          size={80}
          icon={"account-group"}
          color="#f9fafb"
          className="bg-blue-200 border border-cyan-50 mx-auto"
        />
        <Text className="text-2xl font-semibold text-sky-300 pt-3 capitalize text-center">
          {setRoom?.name}
        </Text>
        <View className="w-full flex-row items-center justify-evenly mt-6">
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
            Members
          </List.Subheader>
          <View className="w-full items-center">
            <SettingButton
              onPress={onOpen}
              label="Thành viên"
              isFirst
              isLast
              color="#059669"
            />
            <Actionsheet isOpen={isOpen} onClose={onClose}>
              <Actionsheet.Content>
                <View className="w-full flex items-center justify-center px-2">
                  <Text className="text-xl text-gray-700 font-semibold ml-2">
                    Thành viên
                  </Text>
                  {Object.keys(members).map((key) => {
                    return (
                      <TouchableOpacity
                        key={key}
                        onPress={() => {
                          onClose();
                        }}
                        className="w-full py-3 flex-row items-center"
                      >
                        <Avatar.Image
                          size={50}
                          source={{ uri: members[key].avatar }}
                        />
                        <Text className="text-xl text-gray-700 font-semibold ml-2">
                          {members[key].fullName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </Actionsheet.Content>
            </Actionsheet>
          </View>
        </List.Section>
        <List.Section className="w-full">
          <List.Subheader className="text-base text-gray-500 font-bold">
            Others
          </List.Subheader>
          <View className="w-full items-center">
            <SettingButton
              label="Tìm kiếm trong cuộc trò chuyện"
              isFirst
              color="#57534e"
            />
            <SettingButton label="Xem file phương tiện" color="#2563eb" />
            <SettingButton
              label="Thông báo & Âm Thanh"
              isLast
              color="#d946ef"
            />
          </View>
        </List.Section>
        <List.Section className="w-full">
          <List.Subheader className="text-base text-gray-500 font-bold">
            Privacy & Support
          </List.Subheader>
          <View className="w-full items-center">
            <SettingButton label="Chặn" isFirst color="#dc2626" />
            <SettingButton label="Báo cáo" color="#ca8a04" />
            <SettingButton
              label="Rời khỏi nhóm"
              isLast
              checked
              color="#ef4444"
            />
          </View>
        </List.Section>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingGroupChat;
