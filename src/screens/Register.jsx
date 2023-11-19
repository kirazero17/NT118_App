import { View, Text, Image, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Logo } from "../../assets";
import { UserTextInput } from "../components";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { fireStoreDB, firebaseAuth } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (name && email && password) {
      try {
        await createUserWithEmailAndPassword(
          firebaseAuth,
          email,
          password
        ).then((userCred) => {
          const data = {
            id: userCred?.user.uid,
            fullName: name,
            profilePic: "",
            providerData: userCred.user.providerData[0],
          };

          setDoc(doc(fireStoreDB, "users", userCred?.user.uid), data).then(
            () => {
              navigation.navigate("Login");
            }
          );
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <View className="w-full h-full mt-28 flex items-center justify-start py-6 px-6 space-y-6">
      <View className="flex-row items-center justify-center">
        <Image source={Logo} className="w-24 h-24" resizeMode="contain" />
        <Text className="text-sky-950 text-2xl font-normal">
          Create Account
        </Text>
      </View>
      <View className="bg-sky-300 w-full flex items-center justify-center px-4 pt-8 pb-4 rounded-2xl">
        <UserTextInput
          placeholder="Full Name"
          value={name}
          isPass={false}
          onChangeText={setName}
        />
        <UserTextInput
          placeholder="Email"
          value={email}
          isPass={false}
          onChangeText={setEmail}
        />
        <UserTextInput
          placeholder="Password"
          value={password}
          isPass={true}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          onPress={handleSignUp}
          className="w-full px-4 py-2 border border-sky-700 rounded-2xl bg-white my-3 flex items-center justify-center"
        >
          <Text className="py-2 text-primary text-xl font-semibold">
            Sign Up
          </Text>
        </TouchableOpacity>
        <View className="w-full py-6 flex-row items-center justify-center space-x-2">
          <Text className="text-lg text-gray-600">
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text className="text-lg font-semibold text-blue-950">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Register;
