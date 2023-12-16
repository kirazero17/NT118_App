import { useState, useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  RefreshControl,
  FlatList,
} from "react-native";
import { ContentCard, Header } from "../components";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const Discovery = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView className="flex-1 mt-3">
      <Header title="Discovery" icon={faPlus} size={24} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ContentCard
          name="Hoang Long"
          url="https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg?auto=compress&cs=tinysrgb&w=600"
        />
        <ContentCard
          name="Thanh Nhan"
          url="https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=600"
        />
        <ContentCard
          name="Van Tuyen"
          url="https://images.pexels.com/photos/45853/grey-crowned-crane-bird-crane-animal-45853.jpeg?auto=compress&cs=tinysrgb&w=600"
        />
        <ContentCard
          name="Khoi Nguyen"
          url="https://images.pexels.com/photos/414144/pexels-photo-414144.jpeg?auto=compress&cs=tinysrgb&w=600"
        />
        <ContentCard
          name="Thanh Dat"
          url="https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=600"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Discovery;
