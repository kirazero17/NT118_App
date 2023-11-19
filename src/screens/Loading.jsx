import { View, Image, Text, ActivityIndicator } from "react-native";
import { useLayoutEffect } from "react";
import { Logo } from "../../assets";
import { fireStoreDB, firebaseAuth } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";
import { getDoc, doc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { SET_USER } from "../context/actions/userAction";

const Loading = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    firebaseAuth.onAuthStateChanged((userCred) => {
      if (userCred?.uid) {
        getDoc(doc(fireStoreDB, "users", userCred?.uid))
          .then((docSnap) => {
            if (docSnap.exists()) {
              console.log(docSnap.data());
              dispatch(SET_USER(docSnap.data()));
            }
          })
          .then(() => {
            setTimeout(() => {
              navigation.replace("Home");
            }, 2000);
          });
      } else {
        navigation.replace("Login");
      }
    });
  };

  return (
    <View className="flex-1 items-center justify-evenly">
      <View className="items-center justify-center">
        <Image source={Logo} className="w-40 h-40" resizeMode="contain" />
        <View className="flex items-center justify-center my-8">
          <Text className="text-6xl text-sky-900">ICE</Text>
          <Text className="text-2xl text-sky-500">LET'S BREAK THE ICE</Text>
        </View>
      </View>
      <ActivityIndicator size={"large"} color={"#13ceeb"} />
      <View className="flex-row items-center justify-center mt-56">
        <Text className="text-xl">from </Text>
        <Text className="text-xl text-blue-400">Group 17</Text>
      </View>
    </View>
  );
};

export default Loading;
