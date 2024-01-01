import { Alert, HStack, Text } from "native-base";
import React from "react";

const Toast = ({ title, status, variant }) => {
  return (
    <Alert
      maxWidth="90%"
      alignSelf="center"
      flexDirection="row"
      status={status ? status : "info"}
      variant={variant}
    >
      <HStack space={2} flexShrink={1} w="100%" alignItems="center">
        <Alert.Icon />
        <Text
          fontSize="sm"
          fontWeight="medium"
          flexShrink={1}
          color={
            variant === "solid"
              ? "lightText"
              : variant !== "outline"
              ? "darkText"
              : null
          }
        >
          {title}
        </Text>
      </HStack>
    </Alert>
  );
};

export default Toast;
