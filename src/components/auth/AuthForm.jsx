import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import Input from "./Input";

const AuthForm = ({ isLogin, onSubmit }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  function updateInputValue(inputType, value) {
    switch (inputType) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
    }
  }

  function submitHandler() {
    if (isLogin) {
      onSubmit({ email, password });
    } else {
      onSubmit({ name, email, password });
    }
  }

  return (
    <View className="w-full">
      {!isLogin && (
        <Input
          placeholder="Full Name"
          value={name}
          isPass={false}
          onChangeText={updateInputValue.bind(this, "name")}
        />
      )}
      <Input
        placeholder="Email"
        value={email}
        isPass={false}
        onChangeText={updateInputValue.bind(this, "email")}
      />
      <Input
        placeholder="Password"
        value={password}
        isPass={true}
        onChangeText={updateInputValue.bind(this, "password")}
      />
      {isLogin && (
        <View className="w-full flex-row items-center justify-end">
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text className="text-lg font-medium text-neutral-800">
              Quên mật khẩu?
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity
        onPress={submitHandler}
        className="w-full px-4 py-1 border border-sky-700 rounded-2xl bg-white my-3 flex items-center justify-center"
      >
        <Text className="py-2 text-sky-400 text-xl font-semibold">
          {isLogin ? "Đăng nhập" : "Đăng ký"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthForm;
