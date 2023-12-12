import React from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { Header, ListCall } from "../components";
import { faVideo } from "@fortawesome/free-solid-svg-icons";
import { List } from "react-native-paper";

const Calls = () => {
  return (
    <SafeAreaView className="flex-1 mt-3">
      <Header title="Calls" icon={faVideo} size={28} />
      <ScrollView>
        <List.Section className="mx-1">
          <ListCall
            typeIcon={"phone-incoming"}
            typeCall={"Incoming"}
            day={"Monday"}
          />
          <ListCall
            typeIcon={"phone-outgoing"}
            typeCall={"Outgoing"}
            day={"Tuesday"}
          />
          <ListCall
            typeIcon={"phone-remove"}
            typeCall={"Missing"}
            day={"Wednesday"}
          />
        </List.Section>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Calls;
