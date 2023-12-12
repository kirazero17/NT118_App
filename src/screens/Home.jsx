import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { Header, MessageCard } from "../components";
import { faComments } from "@fortawesome/free-regular-svg-icons";
import { Searchbar } from "react-native-paper";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const user = useSelector((state) => state.user.user);
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 mt-3 justify-center items-center">
      <Header title="Message" icon={faComments} size={34} />
      <Searchbar
        className=" w-11/12 bg-sky-100 mt-2 h-[52px]"
        iconColor="#22d3ee"
        placeholder="Search"
        placeholderTextColor={"#888888"}
        value={searchQuery}
        onChangeText={(query) => setSearchQuery(query)}
      />
      <ScrollView className="w-full px-4 py-4">
        <View className="w-full">
          {isLoading ? (
            <>
              <View className="w-full flex items-center justify-center mt-8">
                <ActivityIndicator size={"large"} color={"#13ceeb"} />
              </View>
            </>
          ) : (
            <>
              <MessageCard />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default Home;
