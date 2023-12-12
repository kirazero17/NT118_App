import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Login,
  Register,
  ForgotPassword,
  Loading,
  Chat,
  SettingChat,
  SettingCall,
} from "./src/screens";
import { Provider } from "react-redux";
import Store from "./src/context/store";
import Profile from "./src/screens/Profile";
import BottomTab from "./src/utils/BottomTab";
import { NativeBaseProvider } from "native-base";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <Provider store={Store}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="Loading" component={Loading} />
            <Stack.Screen name="Home" component={BottomTab} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="SettingChat" component={SettingChat} />
            <Stack.Screen name="SettingCall" component={SettingCall} />
          </Stack.Navigator>
        </Provider>
      </NativeBaseProvider>
    </NavigationContainer>
  );
}
