import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Animated,
  Image,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import { Logo } from "../../../assets";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { TabView, SceneMap } from "react-native-tab-view";
import { ref, onValue } from "firebase/database";
import { fireStoreDB } from "../../config/firebase";
import { ItemBlock, ItemContact } from "../../components";

const friendRoute = () => {
  const user = useSelector((state) => state.user.user);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const userRef = ref(fireStoreDB, "users/");
    const handleData = (snapshot) => {
      const listFriends = [];
      snapshot.forEach((childSnapshot) => {
        const userData = childSnapshot.val();
        if (
          userData.id !== user?.id &&
          userData?.listFriends?.includes(user?.id) &&
          !userData?.listBlocks?.includes(user?.id)
        ) {
          listFriends.push(userData);
        }
      });
      setFriends(listFriends);
    };

    const unsubscribe = onValue(userRef, handleData);

    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <ScrollView className="w-full mt-5">
      {friends.map((item, index) => (
        <ItemContact key={index} value={item} />
      ))}
    </ScrollView>
  );
};

const BlockRoute = () => {
  const user = useSelector((state) => state.user.user);

  const [blocks, setBlocks] = useState([]);
  const [blockUsers, setBlockUsers] = useState({});

  useEffect(() => {
    const userRef = ref(fireStoreDB, "users/");
    const handleData = (snapshot) => {
      const listBlocks = [];
      snapshot.forEach((childSnapshot) => {
        const userData = childSnapshot.val();
        if (
          userData.id !== user?.id &&
          userData?.listBlocks?.includes(user?.id)
        ) {
          listBlocks.push(userData);
        }
      });
      setBlocks(listBlocks);
    };

    const unsubscribe = onValue(userRef, handleData);

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const getBlockUsers = async () => {
      const blockRef = ref(fireStoreDB, "middleware/blocks/");
      const listUser = {};
      onValue(blockRef, (snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            if (childSnapshot.val().blockId === user?.id) {
              listUser[childSnapshot.val().blockedId] = childSnapshot.val();
            }
          });
          setBlockUsers(listUser);
        }
      });
    };

    getBlockUsers();
  }, []);

  return (
    <ScrollView className="w-full mt-5 px-5">
      {blocks.map(
        (item, index) =>
          item?.id === blockUsers[item?.id]?.blockedId && (
            <ItemBlock key={index} data={item} />
          )
      )}
    </ScrollView>
  );
};

const ShowContacts = () => {
  const navigation = useNavigation();

  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "friend", title: "Bạn bè" },
    { key: "block", title: "Chặn" },
  ]);

  const renderScene = SceneMap({
    friend: friendRoute,
    block: BlockRoute,
  });

  const renderTabBar = (props) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);
    return (
      <SafeAreaView>
        <View className="flex-row justify-center items-center">
          {props.navigationState.routes.map((route, i) => {
            const opacity = props.position.interpolate({
              inputRange,
              outputRange: inputRange.map((inputIndex) =>
                inputIndex === i ? 1 : 0.4
              ),
            });
            return (
              <TouchableOpacity
                className={`flex-1 justify-center items-center border-b-[3px] py-2 ${
                  i === index ? "border-cyan-400" : "border-transparent"
                }`}
                key={i}
                onPress={() => setIndex(i)}
              >
                <Animated.Text
                  className="text-lg font-semibold"
                  style={{ opacity }}
                >
                  {route.title}
                </Animated.Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    );
  };
  return (
    <>
      <StatusBar backgroundColor="#9ca3af" barStyle="default" />
      <View className="w-full px-4 my-3 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} size={24} color="#555" />
        </TouchableOpacity>
        <Text className="text-2xl font-medium">Danh bạ</Text>
        <Image source={Logo} className="w-10 h-10" resizeMode="contain" />
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
        initialLayout={{ width: layout.width }}
      />
    </>
  );
};

export default ShowContacts;
