import React from "react";
import { View, Text, SafeAreaView } from "react-native";
import { Header } from "../components";

const Notification = () => {
  return (
    <SafeAreaView className="flex-1 mt-3">
      <Header title="Notifications" />
    </SafeAreaView>
  );
};

export default Notification;
