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
  faTriangleExclamation,
  faCircleMinus,
  faCircleQuestion,
  faFaceSmile,
  faFont,
  faCommentSlash,
  faUsers,
  faMagnifyingGlass,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

const SettingButton = ({
  label,
  isFirst,
  isLast,
  status,
  color,
  onPress,
  checked,
}) => {
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
        return setIcon(faCircleQuestion);
      case "Xem file phương tiện":
        return setIcon(faImage);
      case "Status":
        return setIcon(faFire);
      case "Avatar":
        return setIcon(faUser);
      case "Thông báo & Âm Thanh":
        return setIcon(faBell);
      case "Báo cáo":
        return setIcon(faTriangleExclamation);
      case "Chặn":
        return setIcon(faCircleMinus);
      case "Thông tin tài khoản":
        return setIcon(faCircleInfo);
      case "Emoji":
        return setIcon(faFaceSmile);
      case "Nickname":
        return setIcon(faFont);
      case "Hạn chế":
        return setIcon(faCommentSlash);
      case "Thành viên":
        return setIcon(faUsers);
      case "Tìm kiếm trong cuộc trò chuyện":
        return setIcon(faMagnifyingGlass);
      case "Rời khỏi nhóm":
        return setIcon(faRightFromBracket);
    }
  }, [label]);

  useLayoutEffect(() => {
    if (isFirst && !isLast) {
      setRounded("rounded-t-2xl");
    } else if (isLast && !isFirst) {
      setRounded("rounded-b-2xl");
    } else if (isFirst && isLast) {
      setRounded("rounded-2xl");
    }
  }, [isFirst, isLast]);

  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        className={`w-11/12 px-3 py-4 flex-row items-center ${rounded} justify-between bg-gray-100`}
      >
        <View className="flex-row items-center">
          <FontAwesomeIcon icon={icon} size={22} color={color} />
          <Text
            className={`text-base font-semibold ${
              checked ? "text-red-500" : "text-gray-700"
            } mx-3`}
          >
            {label}
          </Text>
        </View>
        <View className="flex-row items-center">
          {status && (
            <Text className="text-base font-semibold text-gray-500 mx-3">
              {status}
            </Text>
          )}
          {!checked && (
            <FontAwesomeIcon icon={faChevronRight} size={16} color="#666" />
          )}
        </View>
      </TouchableOpacity>
      <Divider bold={true} />
    </>
  );
};

export default SettingButton;
