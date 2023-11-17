import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Logo } from "../../assets";
import { UserTextInput } from "../components";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { fireStoreDB } from "../config/firebase.config";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";

const LoginScreen = () => {
  const screenWidth = Math.round(Dimensions.get("window").width);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [getEmailValidation, setGetEmailValidation] = useState(false);

  const navigation = useNavigation();

  const handleLogin = async () => {
    if (getEmailValidation && email !== "" && password !== "") {
      await signInWithEmailAndPassword(firebaseAuth, email, password)
        .then((useCred) => {
          if (useCred) {
            navigation.navigate("HomeScreen");
            getDoc(doc(fireStoreDB, "users", useCred?.user.uid)).then(
              (docSnap) => {
                if (docSnap.exists()) {
                  console.log(docSnap.data());
                }
              }
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <View className="flex items-center justify-center">
      <View className="w-full h-full mt-56 flex items-center justify-start py-6 px-6 space-y-6">
        <View className="flex-row items-center justify-center">
          <Image source={Logo} className="w-24 h-24" resizeMode="contain" />
          <Text className="text-sky-950 text-2xl font-normal">
            Welcome Back!
          </Text>
        </View>
        <View className="bg-sky-300 w-full flex items-center justify-center px-4 pt-8 rounded-2xl">
          <UserTextInput
            placeholder="Email"
            isPass={false}
            setStateValue={setEmail}
            setGetEmailValidation={setGetEmailValidation}
          />
          <UserTextInput
            placeholder="Password"
            isPass={true}
            setStateValue={setPassword}
          />
          <View className="w-full flex-row items-center justify-end">
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPasswordScreen")}
            >
              <Text className="text-lg font-semibold text-blue-950">
                Forgot password ?
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleLogin}
            className="w-full px-4 py-2 border border-sky-700 rounded-2xl bg-white my-3 flex items-center justify-center"
          >
            <Text className="py-2 text-primary text-xl font-semibold">
              Sign In
            </Text>
          </TouchableOpacity>
          <View className="mt-2 flex justify-center relative">
            <Text className="text-gray-800 bg-sky-300 uppercase px-3 z-10 relative">
              Or Login With
            </Text>
            <View className="absolute -right-[102px] top-2 w-full border-b-2 border-blue-950"></View>
          </View>
          <View className="flex-row gap-2 mt-2">
            <TouchableOpacity className="w-1/2 flex items-center justify-center rounded-md bg-white px-4 py-2 text-gray-500 shadow-sm ">
              <FontAwesomeIcon icon={faGithub} size={24} />
            </TouchableOpacity>
            <TouchableOpacity className="w-1/2 flex items-center justify-center rounded-md bg-white px-4 py-2 text-gray-500 shadow-sm ">
              <FontAwesomeIcon icon={faGoogle} size={24} />
            </TouchableOpacity>
          </View>
          <View className="w-full py-6 flex-row items-center justify-center space-x-2">
            <Text className="text-lg text-gray-600">
              Don't have an account?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("RegisterScreen")}
            >
              <Text className="text-lg font-semibold text-blue-950">
                Create Here
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
