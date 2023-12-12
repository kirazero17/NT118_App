import React from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { Header } from "../components";
import { Card, Button } from "react-native-paper";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const Discovery = () => {
  return (
    <SafeAreaView className="flex-1 mt-3">
      <Header title="Discovery" icon={faPlus} size={24} />
      <ScrollView>
        <Card>
          <Card.Content>
            <View className="flex-row items-center">
              <Text className="text-lg font-semibold">Discovery</Text>
            </View>
          </Card.Content>
          <Card.Actions>
            <Button>Cancel</Button>
            <Button>Ok</Button>
          </Card.Actions>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Discovery;
