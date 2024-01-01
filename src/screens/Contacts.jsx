import { useState } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { Header, ListContact } from "../components";
import { faContactBook } from "@fortawesome/free-solid-svg-icons";
import { Searchbar } from "react-native-paper";

const Contacts = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SafeAreaView className="flex-1 pt-3 justify-center items-center">
      <Header title="Danh bạ" icon={faContactBook} size={28} />
      <Searchbar
        className=" w-11/12 bg-sky-100 mt-2 h-[52px]"
        iconColor="#22d3ee"
        placeholder="Search"
        placeholderTextColor={"#888888"}
        value={searchQuery}
        onChangeText={(query) => setSearchQuery(query)}
      />
      <ScrollView showsVerticalScrollIndicator={false} className="w-full">
        <ListContact />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Contacts;
