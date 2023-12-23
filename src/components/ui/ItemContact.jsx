import { TouchableOpacity, Text, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { Avatar } from "react-native-paper";
import { ref, set, update, get } from "firebase/database";
import { fireStoreDB } from "../../config/firebase";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { format } from "date-fns";

const ItemContact = ({ value }) => {
  const user = useSelector((state) => state.user.user);

  const navigation = useNavigation();
  const combineId =
    user?.id > value?.id ? user?.id + value?.id : value?.id + user?.id;
  const createChat = async () => {
    try {
      const snapshot = await get(ref(fireStoreDB, "rooms/" + combineId));

      if (!snapshot.exists()) {
        await set(ref(fireStoreDB, "rooms/" + combineId), {
          id: combineId,
          users: [user?.id, value?.id],
          createAt: format(new Date(), "dd/MM/yyyy HH:mm:ss"),
        });

        await update(
          ref(fireStoreDB, "userChats/" + user?.id + "/" + combineId),
          {
            ["userInfo"]: {
              id: value?.id,
              name: value?.fullName,
              email: value?.email,
              avatar: value?.avatar,
            },
          }
        );

        await update(
          ref(fireStoreDB, "userChats/" + value?.id + "/" + combineId),
          {
            ["userInfo"]: {
              id: user?.id,
              name: user?.fullName,
              email: user?.email,
              avatar: user?.avatar,
            },
          }
        );
      }

      navigation.navigate("Chat", {
        roomId: combineId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="flex justify-center mx-5 mb-5">
      <TouchableOpacity onPress={createChat} className="flex-row items-center">
        <Avatar.Image size={50} source={{ uri: value?.avatar }} />
        <View className="w-3 h-3 bg-green-500 rounded-full absolute top-9 left-9 "></View>
        <Text className="text-lg font-semibold ml-3 capitalize">
          {value?.fullName}
        </Text>
        <View className="absolute -right-1 top-[52px] w-10/12 border-b border-gray-200"></View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ProfileContact", {
            userId: value?.id,
            roomId: combineId,
          })
        }
        className="absolute -right-1 top-2"
      >
        <FontAwesomeIcon icon={faCircleInfo} size={16} color="#999" />
      </TouchableOpacity>
    </View>
  );
};

export default ItemContact;
