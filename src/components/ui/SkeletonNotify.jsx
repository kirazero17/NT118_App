import { View } from "react-native";
import { Skeleton } from "native-base";

const SkeletonNotify = () => {
  return (
    <View className="flex justify-center mx-5 mb-5 mt-14">
      <View className="flex-row items-center">
        <Skeleton
          borderWidth={1}
          borderColor="coolGray.200"
          endColor="warmGray.50"
          size="16"
          rounded="full"
          mt="-70"
          startColor={"#d1d5db"}
        />

        <Skeleton
          h="3"
          width={32}
          className="absolute left-20 -top-[44px]"
          rounded="full"
          startColor={"#d1d5db"}
        />
        <Skeleton
          h="0.5"
          className="w-9/12 ml-4"
          rounded="full"
          startColor={"#d1d5db"}
        />
      </View>
      <View className="absolute -top-12 right-2 flex-row items-center justify-evenly gap-1">
        <Skeleton size="1.5" rounded="full" startColor={"#d1d5db"} />
        <Skeleton size="1.5" rounded="full" startColor={"#d1d5db"} />
        <Skeleton size="1.5" rounded="full" startColor={"#d1d5db"} />
      </View>
    </View>
  );
};

export default SkeletonNotify;
