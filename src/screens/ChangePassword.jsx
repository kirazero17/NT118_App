import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import { Logo } from "../../assets";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useState } from "react";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Input, Toast } from "../components";
import { useToast } from "native-base";
import { firebaseAuth } from "../config/firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reNewPassword, setReNewPassword] = useState("");

  const toast = useToast();

  const showToast = (title, status, variant) => {
    toast.show({
      render: () => <Toast title={title} status={status} variant={variant} />,
      duration: status === "success" ? 1000 : 2000,
      placement: "bottom",
    });
  };

  function updateInputValue(inputType, value) {
    switch (inputType) {
      case "password":
        setPassword(value);
        break;
      case "newPassword":
        setNewPassword(value);
        break;
      case "reNewPassword":
        setReNewPassword(value);
        break;
    }
  }

  const handleSubmit = async () => {
    if (password && newPassword && reNewPassword) {
      const user = firebaseAuth.currentUser.email;
      const credential = EmailAuthProvider.credential(user, password);

      try {
        await reauthenticateWithCredential(
          firebaseAuth.currentUser,
          credential
        );

        if (newPassword !== reNewPassword) {
          showToast("Mật khẩu mới không trùng khớp!", "warning", "left-accent");
          return;
        }

        await updatePassword(firebaseAuth.currentUser, newPassword);
        showToast("Đổi mật khẩu thành công!", "success", "left-accent");

        navigation.navigate("Loading");
        setTimeout(() => {
          navigation.navigate("Profile");
        }, 2000);
      } catch (error) {
        if (error.code === "auth/invalid-login-credentials") {
          showToast("Mật khẩu cũ không đúng!", "warning", "left-accent");
        } else if (error.code === "auth/weak-password") {
          showToast(
            "Mật khẩu mới phải có ít nhất 6 ký tự!",
            "warning",
            "left-accent"
          );
        }
      }
    } else {
      showToast("Vui lòng nhập đầy đủ thông tin!", "warning", "left-accent");
    }
  };

  const navigation = useNavigation();
  return (
    <View
      className={`w-full h-full ${
        Platform.OS === "ios" ? "mt-32" : "mt-28"
      } flex items-center justify-start py-6 px-6 space-y-6`}
    >
      <StatusBar backgroundColor="#9ca3af" barStyle="default" />
      <View className="flex-row items-center justify-center">
        <Image source={Logo} className="w-24 h-24" resizeMode="contain" />
        <Text className="text-sky-950 text-2xl font-normal">
          Change password ?
        </Text>
      </View>
      <View className="bg-sky-300 w-full flex items-center justify-center px-4 pt-8 pb-6 rounded-2xl">
        <Input
          placeholder="Password"
          value={password}
          isPass={true}
          onChangeText={updateInputValue.bind(this, "password")}
        />
        <Input
          placeholder="New password"
          value={newPassword}
          isPass={true}
          onChangeText={updateInputValue.bind(this, "newPassword")}
        />
        <Input
          placeholder="Re-enter new password"
          value={reNewPassword}
          isPass={true}
          onChangeText={updateInputValue.bind(this, "reNewPassword")}
        />

        <TouchableOpacity
          onPress={handleSubmit}
          className="w-full px-4 py-1 border border-sky-700 rounded-2xl bg-white my-3 flex items-center justify-center"
        >
          <Text className="py-2 text-sky-300 text-xl font-semibold">
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
              Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ChangePassword;
