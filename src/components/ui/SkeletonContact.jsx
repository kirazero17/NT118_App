import { View } from "react-native";
import { Skeleton } from "native-base";

const SkeletonContact = () => {
  return (
    <View className="flex justify-center mx-5 mb-5 mt-14">
      <View className="flex-row items-center">
        <Skeleton
          borderWidth={1}
          borderColor="coolGray.200"
          endColor="warmGray.50"
          size="12"
          rounded="full"
          mt="-70"
          startColor={"#d1d5db"}
        />

        <Skeleton
          h="3"
          width={32}
          className="absolute left-14 -top-[44px]"
          rounded="full"
          startColor={"#d1d5db"}
        />
        <Skeleton h="0.5" flex="2" rounded="full" startColor={"#d1d5db"} />
      </View>
      <Skeleton
        size="4"
        rounded="full"
        className="absolute -right-1 -top-12"
        startColor={"#d1d5db"}
      />
    </View>
  );
};

export default SkeletonContact;
