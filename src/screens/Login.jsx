import { View, Text, Image, TouchableOpacity, StatusBar } from "react-native";
import { Logo } from "../../assets";
import { AuthForm, Toast } from "../components";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { fireStoreDB, firebaseAuth } from "../config/firebase";
import { ref, get } from "firebase/database";
import { useDispatch } from "react-redux";
import { SET_USER } from "../context/slices/userSlice";
import { useToast } from "native-base";

const Login = () => {
  const toast = useToast();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const showToast = (title, status, variant) => {
    toast.show({
      render: () => <Toast title={title} status={status} variant={variant} />,
      duration: status === "success" ? 1000 : 2000,
      placement: "bottom",
    });
  };

  const handleSignIn = async ({ email, password }) => {
    if (email && password) {
      try {
        const userCred = await signInWithEmailAndPassword(
          firebaseAuth,
          email,
          password
        );

        const user = await get(ref(fireStoreDB, "users/" + userCred?.user.uid));

        dispatch(SET_USER(user.val()));

        showToast("Đăng nhập thành công!", "success", "left-accent");

        navigation.replace("Loading");
        setTimeout(() => {
          navigation.replace("Home");
        }, 2000);
      } catch (error) {
        if (error.code === "auth/invalid-login-credentials") {
          showToast(
            "Email hoặc mật khẩu không đúng!",
            "warning",
            "left-accent"
          );
        } else if (error.code === "auth/invalid-email") {
          showToast("Định dạng email không đúng!", "warning", "left-accent");
        }
      }
    } else {
      showToast("Vui lòng nhập đầy đủ thông tin!", "warning", "left-accent");
    }
  };

  return (
    <View className="w-full h-full mt-16 flex items-center justify-start py-6 px-6 space-y-6">
      <StatusBar backgroundColor="#9ca3af" barStyle="default" />
      <View className="flex-row items-center justify-center">
        <Image source={Logo} className="w-24 h-24" resizeMode="contain" />
        <Text className="text-sky-950 text-2xl font-normal">Welcome Back!</Text>
      </View>
      <View className="bg-sky-300 w-full flex items-center justify-center px-4 pt-6 rounded-2xl">
        <AuthForm isLogin onSubmit={handleSignIn} />
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
          <Text className="text-lg text-gray-600">Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text className="text-lg font-semibold text-blue-950">
              Create Here
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;
