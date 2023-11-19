import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import { useState } from "react";
import { Logo } from "../../assets";
import { UserTextInput } from "../components";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [getEmailValidation, setGetEmailValidation] = useState(false);

  const navigation = useNavigation();

  return (
    <View className="w-full h-full mt-44 flex items-center justify-start py-6 px-6 space-y-6">
      <View className="flex-row items-center justify-center">
        <Image source={Logo} className="w-24 h-24" resizeMode="contain" />
        <Text className="text-sky-950 text-2xl font-normal">
          Forgot password ?
        </Text>
      </View>
      <View className="bg-sky-300 w-full flex items-center justify-center px-4 pt-8 pb-6 rounded-2xl">
        <UserTextInput placeholder="Email" isPass={false} />
        <View className="w-full relative flex-row">
          <View className="bg-white flex-1 rounded-l-lg mr-2">
            <TextInput className="w-full pl-4 py-4 pr-3 rounded-l-md text-lg font-semibold " />
          </View>
          <TouchableOpacity className="rounded-r-xl bg-blue-400 flex items-center justify-center px-10">
            <Text className="text-xl font-semibold text-white">Send</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity className="w-full px-4 py-2 border border-sky-700 rounded-2xl bg-white my-3 flex items-center justify-center">
          <Text className="py-2 text-primary text-xl font-semibold">
            Submit
          </Text>
        </TouchableOpacity>
        <View className="w-full flex-row items-center justify-end mt-4">
          <TouchableOpacity
            className="flex-row items-center justify-center"
            onPress={() => navigation.goBack()}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <Text className="text-lg font-semibold text-blue-950 ml-2">
              Back to Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ForgotPassword;
