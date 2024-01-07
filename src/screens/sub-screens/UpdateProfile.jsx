import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Image,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faCalendarDays,
  faPhone,
  faUser,
  faVenusMars,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Radio, Stack, useToast } from "native-base";
import { update, ref, get } from "firebase/database";
import { fireStoreDB } from "../../config/firebase";
import { SET_USER } from "../../context/slices/userSlice";
import { Toast } from "../../components";
import { Button } from "react-native-paper";

const UpdateProfile = () => {
  const user = useSelector((state) => state.user.user);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const toast = useToast();

  const showToast = (title, status, variant) => {
    toast.show({
      render: () => <Toast title={title} status={status} variant={variant} />,
      duration: 1000,
      placement: "bottom",
    });
  };

  const [name, setName] = useState(user?.fullName);
  const [birthDay, setBirthDay] = useState(user?.birthDay);
  const [phone, setPhone] = useState(user?.phone);
  const [gender, setGender] = useState(user?.gender);
  const [isLoading, setIsLoading] = useState(false);

  const handelUpdate = async () => {
    try {
      setIsLoading(true);
      await update(ref(fireStoreDB, "users/" + user?.id), {
        fullName: name,
        birthDay: birthDay,
        phone: phone,
        gender: gender,
      });

      const snapshot = await get(ref(fireStoreDB, "users/" + user?.id));

      dispatch(SET_USER(snapshot.val()));

      setIsLoading(false);
      showToast("Cập nhật thành công", "success", "left-accent");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center bg-[#f6f5f5]">
      <StatusBar backgroundColor="#9ca3af" barStyle="default" />
      <View className="w-full px-4 mt-6">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} size={24} color="#555" />
        </TouchableOpacity>
      </View>
      <Text className="text-2xl font-medium text-sky-500 -mt-8">
        Thông tin cá nhân
      </Text>
      <View className="w-20 h-20 mt-6 mb-3 border-2 border-sky-300 rounded-full">
        <Image
          source={{ uri: user?.avatar }}
          className="w-full h-full rounded-full"
          resizeMode="contain"
        />
      </View>
      <Text className="text-xl font-semibold text-gray-500">{user?.email}</Text>
      <View className="w-full px-6 space-y-3 mt-9">
        <View className="flex-row items-center justify-start">
          <FontAwesomeIcon icon={faUser} size={22} color="#22d3ee" />
          <Text className="text-xl font-semibold text-sky-400 ml-2">
            Họ và tên
          </Text>
        </View>
        <TextInput
          className="w-full text-lg font-medium text-gray-500 h-12 px-4 rounded-lg border border-gray-400 flex items-start justify-center"
          value={name}
          autoCapitalize="words"
          onFocus={() => setName("")}
          onChangeText={(text) => setName(text)}
        />
      </View>
      <View className="w-full px-6 space-y-3 mt-3">
        <View className="flex-row items-center justify-start">
          <FontAwesomeIcon icon={faCalendarDays} size={22} color="#22d3ee" />
          <Text className="text-xl font-semibold text-sky-400 ml-2">
            Ngày sinh
          </Text>
        </View>
        <TextInput
          className="w-full text-lg font-medium text-gray-500 h-12 px-4 rounded-lg border border-gray-400 flex items-start justify-center"
          value={birthDay}
          onFocus={() => setBirthDay("")}
          onChangeText={(text) => setBirthDay(text)}
        />
      </View>
      <View className="w-full px-6 space-y-3 mt-3">
        <View className="flex-row items-center justify-start">
          <FontAwesomeIcon icon={faPhone} size={22} color="#22d3ee" />
          <Text className="text-xl font-semibold text-sky-400 ml-2">
            Số điện thoại
          </Text>
        </View>
        <TextInput
          className="w-full text-lg font-medium text-gray-500 h-12 px-4 rounded-lg border border-gray-400 flex items-start justify-center"
          value={phone}
          onFocus={() => setPhone("")}
          onChangeText={(text) => setPhone(text)}
        />
      </View>
      <View className="w-full px-6 space-y-3 mt-3">
        <View className="flex-row items-center justify-start">
          <FontAwesomeIcon icon={faVenusMars} size={22} color="#22d3ee" />
          <Text className="text-xl font-semibold text-sky-400 ml-2">
            Giới tính
          </Text>
        </View>
        <Radio.Group
          onChange={(value) => setGender(value)}
          defaultValue={gender}
        >
          <Stack
            direction="row"
            alignItems="flex-start"
            space={6}
            w="75%"
            maxW="300px"
          >
            <Radio value="male" colorScheme="cyan" size="md" my={1}>
              Nam
            </Radio>
            <Radio value="female" colorScheme="rose" size="md" my={1}>
              Nữ
            </Radio>
            <Radio value="other" colorScheme="yellow" size="md" my={1}>
              Khác
            </Radio>
          </Stack>
        </Radio.Group>
      </View>

      <Button
        mode="contained"
        buttonColor="#fff"
        className="mt-12"
        loading={isLoading}
        labelStyle={{ color: "#38bdf8" }}
        onPress={handelUpdate}
        style={{ borderColor: "#38bdf8", borderWidth: 1, width: "90%" }}
      >
        <Text className="font-medium text-xl text-sky-400 px-3">Cập nhật</Text>
      </Button>
    </SafeAreaView>
  );
};

export default UpdateProfile;
