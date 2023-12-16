import { TouchableOpacity, Text, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { Avatar } from "react-native-paper";
import { ref, set, update, get } from "firebase/database";
import { fireStoreDB } from "../../config/firebase";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { format } from "date-fns";

const ItemContact = ({ url, name, value }) => {
  const user = useSelector((state) => state.user.user);

  const navigation = useNavigation();

  const createChat = async () => {
    const combineId =
      user?.id > value?.id ? user?.id + value?.id : value?.id + user?.id;
    try {
      const snapshot = await get(ref(fireStoreDB, "rooms/" + combineId));

      if (!snapshot.exists()) {
        await set(ref(fireStoreDB, "rooms/" + combineId), {
          id: combineId,
          users: [user?.id, value?.id],
        });

        const currentTime = format(new Date(), "dd/MM HH:mm");

        await update(
          ref(fireStoreDB, "userChats/" + user?.id + "/" + combineId),
          {
            ["userInfo"]: {
              id: value?.id,
              name: value?.fullName,
              profilePic: value?.profilePic,
            },
            ["date"]: currentTime,
          }
        );

        await update(
          ref(fireStoreDB, "userChats/" + value?.id + "/" + combineId),
          {
            ["userInfo"]: {
              id: user?.id,
              name: user?.fullName,
              profilePic: user?.profilePic,
            },
            ["date"]: currentTime,
          }
        );
      }

      navigation.navigate("Chat", {
        room: combineId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View value={value} className="flex justify-center mx-5 mb-5">
      <TouchableOpacity onPress={createChat} className="flex-row items-center">
        <Avatar.Image size={50} source={{ uri: url }} />
        <View className="w-3 h-3 bg-green-500 rounded-full absolute top-9 left-9 "></View>
        <Text className="text-lg font-semibold ml-3">{name}</Text>
        <View className="absolute -right-1 top-[52px] w-10/12 border-b border-gray-200"></View>
      </TouchableOpacity>
      <TouchableOpacity className="absolute -right-1 top-2">
        <FontAwesomeIcon icon={faCircleInfo} size={16} color="#999" />
      </TouchableOpacity>
    </View>
  );
};

export default ItemContact;
