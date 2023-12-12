import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Header, ListContact } from "../components";
import { faContactBook } from "@fortawesome/free-solid-svg-icons";
import { List } from "react-native-paper";

const Contacts = () => {
  return (
    <SafeAreaView className="flex-1 mt-3">
      <Header title="Contacts" icon={faContactBook} size={28} />
      <ScrollView bouncesZoom={false}>
        <List.Section className="mx-1">
          <List.Subheader className="text-xl text-gray-500">
            Suggest (6)
          </List.Subheader>
          <ListContact />
          <ListContact />
          <ListContact />
          <ListContact />
        </List.Section>
        <List.Section className="mx-1">
          <List.Subheader className="text-xl text-gray-500">
            Online (8)
          </List.Subheader>
          <ListContact />
          <ListContact />
          <ListContact />
        </List.Section>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Contacts;
