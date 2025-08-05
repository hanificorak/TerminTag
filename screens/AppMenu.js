// Önce gerekli paketi yükleyin:
// npm install @react-navigation/bottom-tabs

import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import HomeScreen from "./app/HomeScreen";
import AppointmentsScreen from "./app/AppointmentsScreen";
import SettingsScreen from "./app/SettingsScreen";
import ProfileScreen from "./app/ProfileScreen";
const Tab = createBottomTabNavigator();



// Bildirimler Sayfası
function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bildirimler</Text>
      <Text>Bildirimleriniz burada görünecek</Text>
    </View>
  );
}

// Ana Bottom Tab Navigator
export default function AppMenu({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case "Ana Sayfa":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Profilim":
              iconName = focused ? "person" : "person-outline";
              break;
            case "Sosyal":
              iconName = focused ? "share-social" : "share-social-outline";
              break;
            case "Randevularım":
              iconName = focused ? "calendar" : "calendar-outline";
              break;
            case "Ayarlar":
              iconName = focused ? "settings" : "settings-outline";
              break;
            default:
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#2196F3",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: "#2196F3",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      })}
    >
      <Tab.Screen
        name="Ana Sayfa"
        component={HomeScreen}
        initialParams={{ navigation }}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Randevularım" component={AppointmentsScreen}  options={{ headerShown: false }}/>
      {/* <Tab.Screen name="Sosyal" component={NotificationsScreen} /> */}
      <Tab.Screen name="Ayarlar" component={SettingsScreen}  options={{ headerShown: false }}/>
      <Tab.Screen name="Profilim" component={ProfileScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});   
