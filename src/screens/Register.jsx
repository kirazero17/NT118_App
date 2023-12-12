import { View, Text, Image, TouchableOpacity, StatusBar } from "react-native";
import { Logo, defaultAvatar } from "../../assets";
import { AuthForm, Toast } from "../components";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { fireStoreDB, firebaseAuth } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useToast } from "native-base";

const Register = () => {
  const toast = useToast();

  const navigation = useNavigation();

  const showToast = (title, status, variant) => {
    toast.show({
      render: () => <Toast title={title} status={status} variant={variant} />,
      duration: status === "success" ? 1000 : 2000,
      placement: "top",
    });
  };

  const handleSignUp = async ({ name, email, password }) => {
    if (name && email && password) {
      try {
        const userCred = await createUserWithEmailAndPassword(
          firebaseAuth,
          email,
          password
        );

        showToast("Account created successfully!", "success", "top-accent");

        const data = {
          _id: userCred?.user.uid,
          fullName: name,
          profilePic: defaultAvatar,
          providerData: userCred.user.providerData[0],
        };

        await setDoc(doc(fireStoreDB, "users", userCred?.user.uid), data);

        navigation.navigate("Login");
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          showToast("Email already in use!", "warning", "top-accent");
        } else if (error.code === "auth/invalid-email") {
          showToast("Invalid email!", "warning", "top-accent");
        } else if (error.code === "auth/weak-password") {
          showToast("Weak password!", "warning", "top-accent");
        }
      }
    } else {
      showToast("Please fill all the fields!", "warning", "top-accent");
    }
  };

  return (
    <View className="w-full h-full mt-20 flex items-center justify-start py-6 px-6 space-y-6">
      <StatusBar backgroundColor="#9ca3af" barStyle="default" />
      <View className="flex-row items-center justify-center">
        <Image source={Logo} className="w-24 h-24" resizeMode="contain" />
        <Text className="text-sky-950 text-2xl font-normal">
          Create Account
        </Text>
      </View>
      <View className="bg-sky-300 w-full flex items-center justify-center px-4 pt-6 pb-4 rounded-2xl">
        <AuthForm isLogin={false} onSubmit={handleSignUp} />
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
