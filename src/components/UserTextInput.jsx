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

const UserTextInput = ({
  placeholder,
  isPass,
  setStateValue,
  setGetEmailValidation,
}) => {
  const [value, setValue] = useState("");
  const [showPass, setShowPass] = useState(true);
  const [icon, setIcon] = useState(faUser);
  const [isEmailValid, setIsEmailValid] = useState(false);

  const handleTextChanged = (text) => {
    setValue(text);
    setStateValue(value);

    if (placeholder === "Email") {
      const emailRegex = /\S+@\S+\.\S+/;
      const status = emailRegex.test(value);
      setIsEmailValid(status);
      setGetEmailValidation(status);
    }
  };

  useLayoutEffect(() => {
    switch (placeholder) {
      case "Full Name":
        return setIcon(faUser);
      case "Email":
        return setIcon(faEnvelope);
      case "Password":
        return setIcon(faLock);
    }
  }, []);

  return (
    <View
      className={`border bg-white rounded-2xl px-4 py-5 flex-row items-center justify-between space-x-4 my-2 border-gray-200`}
    >
      <FontAwesomeIcon icon={icon} color="#454343" size={18} />
      <TextInput
        className="flex-1 text-lg text-gray-600 font-semibold -mt-1"
        placeholder={placeholder}
        placeholderTextColor={"#c7c8d4"}
        value={value}
        onChangeText={handleTextChanged}
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

export default UserTextInput;
