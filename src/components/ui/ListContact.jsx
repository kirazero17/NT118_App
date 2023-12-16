import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { fireStoreDB } from "../../config/firebase";
import { useSelector } from "react-redux";
import { ActivityIndicator, View } from "react-native";
import { List } from "react-native-paper";
import ItemContact from "./ItemContact";

const ListContact = ({ title }) => {
  const [suggest, setSuggest] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const userRef = ref(fireStoreDB, "users/");
    setIsLoading(true);

    const handleData = (snapshot) => {
      const listSuggest = [];

      snapshot.forEach((childSnapshot) => {
        const userData = childSnapshot.val();
        if (userData.id !== user?.id) {
          listSuggest.push(userData);
        }
      });

      setSuggest(listSuggest);
      setIsLoading(false);
    };

    const unsubscribe = onValue(userRef, handleData);

    return () => {
      unsubscribe();
    };
  }, [user?.id]);
  return (
    <List.Section className="mx-1">
      <List.Subheader className="text-base text-gray-500">
        {title} ({suggest.length})
      </List.Subheader>

      {isLoading ? (
        <>
          <View className="w-full flex items-center justify-center mt-8">
            <ActivityIndicator size={"large"} color={"#13ceeb"} />
          </View>
        </>
      ) : (
        <>
          {suggest && suggest.length > 0 ? (
            <>
              {suggest.map((item) => (
                <ItemContact
                  value={item}
                  key={item.id}
                  url={item.profilePic}
                  name={item.fullName}
                />
              ))}
            </>
          ) : (
            <></>
          )}
        </>
      )}
    </List.Section>
  );
};

export default ListContact;
