import { useState, useLayoutEffect } from "react";
import { ref, onValue } from "firebase/database";
import { fireStoreDB } from "../../config/firebase";
import { useSelector } from "react-redux";
import { ActivityIndicator, View, Platform } from "react-native";
import { List } from "react-native-paper";
import ItemContact from "./ItemContact";
import SkeletonContact from "./SkeletonContact";

const ListContact = () => {
  const [suggest, setSuggest] = useState([]);
  const [friend, setFriend] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector((state) => state.user.user);

  useLayoutEffect(() => {
    const userRef = ref(fireStoreDB, "users/");

    setIsLoading(true);
    const handleData = (snapshot) => {
      const listSuggest = [];
      const listFriend = [];

      snapshot.forEach((childSnapshot) => {
        const userData = childSnapshot.val();
        if (userData.id !== user?.id) {
          if (userData.listFriends?.includes(user?.id)) {
            listFriend.push(userData);
          } else if (userData?.status === "online") {
            // } else {
            listSuggest.push(userData);
          }
        }
      });

      setFriend(listFriend);
      setSuggest(listSuggest);
      setIsLoading(false);
    };

    const unsubscribe = onValue(userRef, handleData);

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <List.Section className="mx-1">
      {isLoading ? (
        <>
          {Platform.OS === "ios" ? (
            <View className="w-full mt-12">
              <SkeletonContact />
              <SkeletonContact />
              <SkeletonContact />
              <SkeletonContact />
            </View>
          ) : (
            <View className="w-full flex items-center justify-center mt-8">
              <ActivityIndicator size={"large"} color={"#13ceeb"} />
            </View>
          )}
        </>
      ) : (
        <>
          <List.Subheader className="text-base text-gray-500">
            Suggests ({suggest.length})
          </List.Subheader>

          {suggest && suggest.length > 0 && (
            <>
              {suggest.map((item) => (
                <ItemContact value={item} key={item.id} />
              ))}
            </>
          )}
          <List.Subheader className="text-base text-gray-500">
            Friends ({friend.length})
          </List.Subheader>

          {friend && friend.length > 0 && (
            <>
              {friend.map((item) => (
                <ItemContact value={item} key={item.id} />
              ))}
            </>
          )}
        </>
      )}
    </List.Section>
  );
};

export default ListContact;
