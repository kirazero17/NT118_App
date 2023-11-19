import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faEllipsisVertical,
  faPhone,
  faVideo,
  faMessage,
  faEllipsis,
  faShieldHalved,
  faChevronRight,
  faCircleInfo,
  faUserGroup,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { defaultAvatar } from "../../assets";
import { useSelector, useDispatch } from "react-redux";
import { firebaseAuth } from "../config/firebase";
import { SET_USER_NULL } from "../context/actions/userAction";

const Profile = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);

  const dispatch = useDispatch();

  const handleSignOut = async () => {
    await firebaseAuth.signOut().then(() => {
      dispatch(SET_USER_NULL());
      navigation.replace("Login");
    });
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-start mt-20">
      <View className="w-full flex-row items-center justify-between px-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} size={24} color="#555" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesomeIcon icon={faEllipsisVertical} size={24} color="#555" />
        </TouchableOpacity>
      </View>
      <View className=" item-center justify-center">
        <View className="w-20 h-20 relative border-2 border-primary p-1 rounded-full">
          <Image
            source={defaultAvatar}
            className="w-full h-full rounded-full"
            resizeMode="contain"
          />
        </View>
      </View>

      <Text className="text-2xl font-semibold text-primary pt-3">
        {user?.fullName}
      </Text>
      <Text className="text-base font-semibold text-gray-500">
        {user?.providerData.email}
      </Text>
      <View className="w-full flex-row items-center justify-evenly py-6">
        <View className="items-center justify-center">
          <TouchableOpacity className="items-center justify-center w-12 h-12 rounded-lg bg-gray-300">
            <FontAwesomeIcon icon={faMessage} size={24} color="#666" />
          </TouchableOpacity>
          <Text className="text-sm text-gray-600 py-1">Message</Text>
        </View>
        <View className="items-center justify-center">
          <TouchableOpacity className="items-center justify-center w-12 h-12 rounded-lg bg-gray-300">
            <FontAwesomeIcon icon={faVideo} size={24} color="#666" />
          </TouchableOpacity>
          <Text className="text-sm text-gray-600 py-1">Video Call</Text>
        </View>
        <View className="items-center justify-center">
          <TouchableOpacity className="items-center justify-center w-12 h-12 rounded-lg bg-gray-300">
            <FontAwesomeIcon icon={faPhone} size={24} color="#666" />
          </TouchableOpacity>
          <Text className="text-sm text-gray-600 py-1">Call</Text>
        </View>
        <View className="items-center justify-center">
          <TouchableOpacity className="items-center justify-center w-12 h-12 rounded-lg bg-gray-300">
            <FontAwesomeIcon icon={faEllipsis} size={24} color="#666" />
          </TouchableOpacity>
          <Text className="text-sm text-gray-600 py-1">More</Text>
        </View>
      </View>
      <View className="w-full px-6 py-8 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <FontAwesomeIcon icon={faShieldHalved} size={20} />
          <Text className="text-base font-semibold text-gray-600 px-3">
            Privacy
          </Text>
        </View>
        <FontAwesomeIcon icon={faChevronRight} size={20} color="#666" />
      </View>
      <View className="w-full px-6 py-8 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <FontAwesomeIcon icon={faUserGroup} size={20} />
          <Text className="text-base font-semibold text-gray-600 px-3">
            Groups
          </Text>
        </View>
        <FontAwesomeIcon icon={faChevronRight} size={20} color="#666" />
      </View>
      <View className="w-full px-6 py-8 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <FontAwesomeIcon icon={faCircleInfo} size={20} />
          <Text className="text-base font-semibold text-gray-600 px-3">
            Support
          </Text>
        </View>
        <FontAwesomeIcon icon={faChevronRight} size={20} color="#666" />
      </View>
      <View className="w-full px-6 py-8 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <FontAwesomeIcon icon={faUser} size={20} />
          <Text className="text-base font-semibold text-gray-600 px-3">
            Account
          </Text>
        </View>
        <FontAwesomeIcon icon={faChevronRight} size={20} color="#666" />
      </View>
      <TouchableOpacity
        onPress={handleSignOut}
        className="w-full px-6 py-4 flex-row items-center justify-center"
      >
        <Text className="text-xl font-semibold text-primary px-3">Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Profile;
