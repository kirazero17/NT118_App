import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { Header, ItemContact, ListContact } from "../components";
import { faContactBook } from "@fortawesome/free-solid-svg-icons";
import { Searchbar } from "react-native-paper";
import { onValue, ref } from "firebase/database";
import { fireStoreDB } from "../config/firebase";
import { useSelector } from "react-redux";

const Contacts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const userRef = ref(fireStoreDB, "users/");
    const listUser = [];

    const handleData = (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const userData = childSnapshot.val();
        if (userData?.id !== user?.id) {
          listUser.push(userData);
        }
      });

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

  return (
    <SafeAreaView className="flex-1 pt-3 justify-center items-center">
      <Header title="Danh bạ" icon={faContactBook} size={28} />
      <Searchbar
        className=" w-11/12 bg-sky-100 my-2 h-[52px]"
        iconColor="#22d3ee"
        placeholder="Search"
        placeholderTextColor={"#888888"}
        value={searchQuery}
        onChangeText={(query) => setSearchQuery(query)}
      />
      <ScrollView showsVerticalScrollIndicator={false} className="w-full">
        {searchQuery.length > 0 ? (
          searchResult?.map((value, index) => (
            <ItemContact key={index} value={value} />
          ))
        ) : (
          <ListContact />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Contacts;
