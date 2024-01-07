import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Avatar } from "react-native-paper";
import { useSelector } from "react-redux";
import { get, ref, update, remove } from "firebase/database";
import { Modal, Button, useToast } from "native-base";
import Toast from "./Toast";
import { fireStoreDB } from "../../config/firebase";

const ItemBlock = ({ data }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector((state) => state.user.user);

  const toast = useToast();

  const showToast = (title, status, variant) => {
    toast.show({
      render: () => <Toast title={title} status={status} variant={variant} />,
      duration: 1000,
      placement: "bottom",
    });
  };

  const handleUnBlock = async () => {
    const roomId =
      user?.id > data?.id ? user?.id + data?.id : data?.id + user?.id;
    try {
      setIsLoading(true);

      await remove(ref(fireStoreDB, "middleware/blocks/" + roomId));

      const userRef = ref(fireStoreDB, `users/${data?.id}`);
      const userSnapshot = await get(userRef);
      const listBlockUsers = userSnapshot.val().listBlocks || [];

      const updatedListBlockUsers = listBlockUsers.filter(
        (item) => item !== user?.id
      );
      await update(userRef, {
        listBlocks: updatedListBlockUsers,
      });

      const currentUserRef = ref(fireStoreDB, `users/${user?.id}`);
      const currentUserSnapshot = await get(currentUserRef);
      const listBlockCurrentUser = currentUserSnapshot.val().listBlocks || [];

      const updatedListBlockCurrentUser = listBlockCurrentUser.filter(
        (item) => item !== data?.id
      );
      await update(currentUserRef, {
        listBlocks: updatedListBlockCurrentUser,
      });

      setIsLoading(false);
      setModalVisible(false);

      showToast(
        `Bỏ chặn ${data?.fullName} thành công`,
        "success",
        "left-accent"
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="w-full">
      <TouchableOpacity
        onLongPress={() => setModalVisible(true)}
        className="flex-row items-center justify-between "
      >
        <View className="flex-row items-center">
          <Avatar.Image size={55} source={{ uri: data.avatar }} />
          <Text className="text-lg font-semibold ml-3 capitalize">
            {data.fullName}
          </Text>
        </View>
        <View className="absolute -right-1 top-[52px] w-10/12 border-b border-gray-200"></View>
      </TouchableOpacity>
      <Modal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        avoidKeyboard
        bottom="4"
        size="xl"
      >
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>
            <Text className="text-base text-gray-600 font-semibold">
              Bạn có muốn bỏ chặn {data.fullName} ?
            </Text>
          </Modal.Header>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                Cancel
              </Button>
              <Button isLoading={isLoading} onPress={handleUnBlock}>
                Save
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </View>
  );
};

export default ItemBlock;
