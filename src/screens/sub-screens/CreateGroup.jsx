import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ScrollView,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import { Searchbar } from "react-native-paper";
import { useState, useEffect } from "react";
import { ref, onValue, set, serverTimestamp } from "firebase/database";
import { fireStoreDB } from "../../config/firebase";
import { useSelector } from "react-redux";
import { ItemSearch } from "../../components";
import { format } from "date-fns";

const CreateGroup = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [nameChat, setNameChat] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [listUser, setListUser] = useState([]); // [
  const [listSelected, setListSelected] = useState([]); // [
  const [searchResult, setSearchResult] = useState([]);
  const navigation = useNavigation();

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const userRef = ref(fireStoreDB, "users/");
    const listUser = [];

    const handleData = (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const userData = childSnapshot.val();
        if (
          userData?.id !== user?.id &&
          !userData?.listBlocks?.includes(user?.id)
        ) {
          listUser.push(userData);
        }
      });

      setListUser(listUser);

      const filterUser = listUser.filter((item) => {
        return item?.fullName
          ?.toLowerCase()
          .includes(searchQuery?.toLowerCase());
      });

      setSearchResult(filterUser);
    };

    const unsubscribe = onValue(userRef, handleData);

    return () => {
      unsubscribe();
    };
  }, [searchQuery]);

  const handleSelect = (value) => {
    const index = listSelected.includes(value?.id);

    if (!index) {
      setListSelected([...listSelected, value.id]);
    } else {
      const newList = listSelected.filter((item) => item !== value?.id);
      setListSelected(newList);
    }
  };

  const handleCreateGroup = async () => {
    if (nameChat) {
      try {
        const listUser = [];
        listSelected.forEach((item) => {
          listUser.push(item);
        });
        listUser.push(user?.id);

        const roomId = nameChat + Math.round(Math.random() * 1000000000);

        await set(ref(fireStoreDB, "rooms/" + roomId), {
          id: roomId,
          name: nameChat,
          users: listUser,
          createAt: format(new Date(), "dd/MM/yyyy HH:mm:ss"),
          lastMessage: {
            message: "😇😇😇",
            senderId: user?.id,
          },
          time: serverTimestamp(),
          admin: user?.id,
        });
        navigation.navigate("GroupChat", {
          roomId: roomId,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Vui lòng nhập tên nhóm!");
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center">
      <StatusBar backgroundColor="#9ca3af" barStyle="default" />
      <View className="w-full px-4 my-3 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} size={24} color="#555" />
        </TouchableOpacity>
        <Text className="text-2xl font-medium">Tin nhắn mới</Text>
        <TouchableOpacity
          disabled={listSelected.length < 2}
          onPress={handleCreateGroup}
        >
          <Text
            className={`text-xl font-medium ${
              listSelected.length > 1 ? "text-cyan-400" : "text-gray-400"
            }`}
          >
            Tạo
          </Text>
        </TouchableOpacity>
      </View>
      {!isSearch && (
        <View className=" bg-white rounded-xl px-4 h-12 flex-row items-center justify-between space-x-4 my-2 border-gray-200">
          <TextInput
            className="flex-1 text-lg text-gray-600 font-medium -mt-1 h-20"
            placeholder={"Tên nhóm"}
            placeholderTextColor={"#c7c8d4"}
            value={nameChat}
            onChangeText={(text) => setNameChat(text)}
          />
        </View>
      )}
      <Searchbar
        className=" w-full bg-gray-50 h-[52px]"
        iconColor="#22d3ee"
        placeholder="Search"
        placeholderTextColor={"#888888"}
        value={searchQuery}
        onChangeText={(query) => setSearchQuery(query)}
        onFocus={() => setIsSearch(true)}
        onBlur={() => setIsSearch(false)}
      />
      <ScrollView className="w-full mt-4 px-2">
        <View className="flex-row items-center justify-start mb-4">
          <Text className="text-lg font-semibold text-gray-400 ml-2">
            Gợi ý
          </Text>
        </View>
        {searchQuery.length > 0
          ? searchResult?.map((value, index) => (
              <ItemSearch
                key={index}
                value={value}
                isCheck={listSelected.includes(value.id)}
                onPress={handleSelect}
              />
            ))
          : listUser?.map((value, index) => (
              <ItemSearch
                key={index}
                value={value}
                isCheck={listSelected.includes(value.id)}
                onPress={handleSelect}
              />
            ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateGroup;
