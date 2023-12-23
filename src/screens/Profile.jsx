import { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  ScrollView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faPen } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { fireStoreDB, firebaseAuth } from "../config/firebase";
import { SET_USER, SET_USER_NULL } from "../context/slices/userSlice";
import SettingButton from "../components/ui/SettingButton";
import { avatars } from "../utils/avatarsApi";
import { update, ref, get } from "firebase/database";

const Profile = () => {
  const [isMenu, setIsMenu] = useState(false);
  const screenWidth = Math.round(Dimensions.get("window").width);
  const screenHeight = Math.round(Dimensions.get("window").height);

  const navigation = useNavigation();

  const user = useSelector((state) => state.user.user);

  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      await firebaseAuth.signOut().then(() => {
        dispatch(SET_USER_NULL());
        navigation.replace("Login");
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const handleAvatar = async (item) => {
    setIsMenu(false);

    try {
      const userChats = await get(ref(fireStoreDB, "userChats/"));

      if (userChats.exists()) {
        Object?.keys(userChats.val())?.map(async (key) => {
          const userChat = await get(ref(fireStoreDB, "userChats/" + key));

          Object?.keys(userChat.val())?.map(async (chat) => {
            if (userChat.val()[chat]?.userInfo?.id === user?.id) {
              await update(
                ref(fireStoreDB, "userChats/" + key + "/" + chat + "/userInfo"),
                {
                  avatar: item?.image.asset.url,
                }
              );
            }
          });
        });
      }

      await update(ref(fireStoreDB, "users/" + user?.id), {
        avatar: item?.image.asset.url,
      });

      const snapshot = await get(ref(fireStoreDB, "users/" + user?.id));

      dispatch(SET_USER(snapshot.val()));
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-start bg-[#dfdfdf]">
      <StatusBar backgroundColor="#9ca3af" barStyle="default" />
      {isMenu && (
        <>
          <View
            className="absolute inset-0 z-10 bg-blue-50"
            style={{ width: screenWidth, height: screenHeight }}
          >
            <ScrollView>
              <View
                className={`w-full h-full px-4 py-2 flex-row flex-wrap items-center justify-evenly ${
                  Platform.OS === "ios" ? "mt-8" : ""
                }`}
                style={{ width: screenWidth, height: screenHeight }}
              >
                {avatars?.map((item) => (
                  <TouchableOpacity
                    onPress={() => handleAvatar(item)}
                    key={item._id}
                    className="w-20 m-3 h-20 p-1 rounded-full border border-sky-300 relative"
                  >
                    <Image
                      source={{ uri: item?.image.asset.url }}
                      className="w-full h-full"
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </>
      )}
      <View className="w-full px-4 mt-3">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} size={24} color="#555" />
        </TouchableOpacity>
      </View>
      <View className=" item-center justify-center -mt-5">
        <TouchableOpacity
          onPress={() => setIsMenu(true)}
          className="w-20 h-20 relative border-2 border-sky-300 rounded-full"
        >
          <Image
            source={{ uri: user?.avatar }}
            className="w-full h-full rounded-full"
            resizeMode="contain"
          />
          <View className="w-6 h-6 bg-sky-400 rounded-full absolute top-0 right-0 flex items-center justify-center">
            <FontAwesomeIcon icon={faPen} color="#cffafe" size={12} />
          </View>
        </TouchableOpacity>
      </View>

      <Text className="text-2xl font-semibold text-sky-300 pt-3 capitalize">
        {user?.fullName}
      </Text>
      <Text className="text-base font-semibold text-gray-500">
        {user?.email}
      </Text>

      <View className="w-full items-center mt-8">
        <SettingButton label="Theme" isFirst status="Auto" color="#1e293b" />
        <SettingButton label="Status" status="On" color="#22c55e" />
        <SettingButton label="Privacy & Security" color="#f472b6" />
        <SettingButton label="Support" isLast color="#38bdf8" />
      </View>
      <View className="w-full items-center mt-8">
        <SettingButton label="Avatar" isFirst color="#a78bfa" />
        <SettingButton label="Notification & Sound" color="#fbbf24" />
        <SettingButton label="File & Images" isLast color="#d946ef" />
      </View>
      <View className="w-full items-center mt-8">
        <SettingButton label="Account" isFirst isLast color="#374151" />
      </View>

      <TouchableOpacity
        onPress={handleSignOut}
        className="w-11/12 px-3 py-3 mt-12 border border-sky-300 rounded-xl bg-white flex-row items-center justify-center"
      >
        <Text className="font-medium text-xl text-sky-400 px-3">Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Profile;
