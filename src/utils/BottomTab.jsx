import { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomNavigation } from "react-native-paper";
import { Calls, Contacts, Home, Notification } from "../screens";

const Tabs = createBottomTabNavigator();

const BottomTab = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: "Home",
      title: "Đoạn chat",
      focusedIcon: "chat",
      unfocusedIcon: "chat-outline",
    },
    {
      key: "Calls",
      title: "Cuộc gọi",
      focusedIcon: "video",
      unfocusedIcon: "video-outline",
    },
    {
      key: "Notification",
      title: "Thông báo",
      focusedIcon: "bell",
      unfocusedIcon: "bell-outline",
    },
    {
      key: "Contacts",
      title: "Danh bạ",
      focusedIcon: "account-group",
      unfocusedIcon: "account-group-outline",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    Home: () => <Home />,
    Calls: () => <Calls />,
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
