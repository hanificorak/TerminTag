import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/auth/LoginScreen";
import RegisterScreen from "./screens/auth/RegisterScreen";
import AppMenu from "./screens/AppMenu";
import AsyncStorage from "@react-native-async-storage/async-storage";
import VerifyScreen from "./screens/auth/VerifyScreen";
import { PaperProvider } from "react-native-paper";

import "./src/i18n";
import DetailAppointmentsScreen from "./screens/app/DetailAppointmentsScreen";
const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);


  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        setIsLoggedIn(!!token);

    
      } catch (error) {
        console.error("Token kontrol hatası:", error);
        setIsLoggedIn(false);
      }
    };
    checkToken();
  }, []);

  if (isLoggedIn === null) return null; // yüklenirken boş dön

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName={isLoggedIn ? "AppMenu" : "Login"}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Verify" component={VerifyScreen} />
          <Stack.Screen name="AppMenu" component={AppMenu} />
          <Stack.Screen
            name="DetailAppointmentsScreen"
            component={DetailAppointmentsScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
