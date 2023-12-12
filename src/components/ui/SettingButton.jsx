import { useLayoutEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Divider } from "react-native-paper";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import {
  faShieldHalved,
  faChevronRight,
  faUser,
  faCircleHalfStroke,
  faCircleInfo,
  faImage,
  faCircleUser,
  faFire,
  faBell,
} from "@fortawesome/free-solid-svg-icons";

const SettingButton = ({ label, isFirst, isLast, status, color }) => {
  const [icon, setIcon] = useState(faChevronRight);
  const [rounded, setRounded] = useState("rounded-none");

  useLayoutEffect(() => {
    switch (label) {
      case "Theme":
        return setIcon(faCircleHalfStroke);
      case "Privacy & Security":
        return setIcon(faShieldHalved);
      case "Account":
        return setIcon(faCircleUser);
      case "Support":
        return setIcon(faCircleInfo);
      case "File & Images":
        return setIcon(faImage);
      case "Status":
        return setIcon(faFire);
      case "Avatar":
        return setIcon(faUser);
      case "Notification & Sound":
        return setIcon(faBell);
    }
  }, []);

  useLayoutEffect(() => {
    if (isFirst && !isLast) {
      setRounded("rounded-t-2xl");
    } else if (isLast && !isFirst) {
      setRounded("rounded-b-2xl");
    } else if (isFirst && isLast) {
      setRounded("rounded-2xl");
    }
  }, []);

  return (
    <>
      <TouchableOpacity
        className={`w-11/12 px-3 py-4 flex-row items-center ${rounded} justify-between bg-gray-50`}
      >
        <View className="flex-row items-center">
          <FontAwesomeIcon icon={icon} size={22} color={color} />
          <Text className="text-base font-semibold text-gray-700 mx-3">
            {label}
          </Text>
        </View>
        <View className="flex-row items-center">
          {status && (
            <Text className="text-base font-semibold text-gray-500 mx-3">
              {status}
            </Text>
          )}
          <FontAwesomeIcon icon={faChevronRight} size={16} color="#666" />
        </View>
      </TouchableOpacity>
      <Divider bold={true} />
    </>
  );
};

export default SettingButton;
