import { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomNavigation } from "react-native-paper";
import { Calls, Contacts, Discovery, Home, Notification } from "../screens";

const Tabs = createBottomTabNavigator();

const BottomTab = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: "Home",
      title: "Chats",
      focusedIcon: "chat",
      unfocusedIcon: "chat-outline",
    },
    {
      key: "Calls",
      title: "Calls",
      focusedIcon: "video",
      unfocusedIcon: "video-outline",
    },
    {
      key: "Discovery",
      title: "Discovery",
      focusedIcon: "compass",
      unfocusedIcon: "compass-outline",
    },
    {
      key: "Notification",
      title: "Notification",
      focusedIcon: "bell",
      unfocusedIcon: "bell-outline",
    },
    {
      key: "Contacts",
      title: "Contacts",
      focusedIcon: "account-group",
      unfocusedIcon: "account-group-outline",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    Home: () => <Home />,
    Calls: () => <Calls />,
    Discovery: () => <Discovery />,
    Notification: () => <Notification />,
    Contacts: () => <Contacts />,
  });
  return (
    <BottomNavigation
      theme={{ colors: { secondaryContainer: "#dbeafe" } }}
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      sceneAnimationEnabled={true}
      barStyle={{ backgroundColor: "#f1f5f9", height: 90 }}
      activeColor="#38bdf8"
    />
  );
};

export default BottomTab;
