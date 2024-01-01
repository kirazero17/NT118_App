import { View, TextInput, TouchableOpacity } from "react-native";
import { useLayoutEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

const Input = ({ placeholder, value, isPass, onChangeText }) => {
  const [showPass, setShowPass] = useState(true);
  const [icon, setIcon] = useState(faUser);

  useLayoutEffect(() => {
    switch (placeholder) {
      case "Full Name":
        return setIcon(faUser);
      case "Email":
        return setIcon(faEnvelope);
      case "Password":
      case "New Password":
      case "Re-enter new password":
        return setIcon(faLock);
    }
  }, [placeholder]);

  return (
    <View
      className={`border bg-white rounded-2xl px-4 h-14 flex-row items-center justify-between space-x-4 my-2 border-gray-200`}
    >
      <FontAwesomeIcon icon={icon} color="#4b5563" size={18} />
      <TextInput
        className="flex-1 text-lg text-gray-600 font-medium -mt-1 h-20"
        placeholder={placeholder}
        placeholderTextColor={"#c7c8d4"}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isPass && showPass}
        autoCapitalize="none"
      />
      {isPass && (
        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
          <FontAwesomeIcon
            icon={showPass ? faEye : faEyeSlash}
            color="#777777"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Input;
