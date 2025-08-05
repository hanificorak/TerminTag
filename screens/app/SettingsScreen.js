import React, { useCallback, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import SelectDropdown from "react-native-select-dropdown";
import { Switch } from "react-native-paper";
import api from "../../tools/api";
import Endpoint from "../../tools/endpoint";

const Tab = createMaterialTopTabNavigator();

export default function SettingsScreen() {
  const [reminderStatus, setReminderStatus] = useState(null);
  const [allowPastAppointments, setAllowPastAppointments] = useState(false);
  const [passwordUpdateInterval, setPasswordUpdateInterval] = useState(null);

  const reminderOptions = [
    { id: 1, title: "Aktif" },
    { id: 0, title: "Pasif" },
  ];
  const passwordOptions = [
    { id: 1, title: "1 Ay" },
    { id: 2, title: "2 Ay" },
    { id: 3, title: "3 Ay" },
    { id: 6, title: "6 Ay" },
  ];

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  const getData = async () => {
    try {
      const { data } = await api.post(Endpoint.SettingsData);
      if (data && data.status) {
        const item = data.obj[0];
        setAllowPastAppointments(item.last_date_app == 1 ? true : false);
        setReminderStatus(item.reminder_status);
        setPasswordUpdateInterval(item.password_int_status);
      } else {
        Alert.alert("Uyarı", "İşlem başarısız!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async () => {
    const { data } = await api.post(Endpoint.SettingsSave, {
      reminder_status: reminderStatus,
      last_date_app: allowPastAppointments,
      password_int_status: passwordUpdateInterval,
    });
    if (data && data.status) {
      Alert.alert("Bilgi", "Bilgiler başarıyla güncellendi");
    } else {
      Alert.alert("Uyarı", "İşlem başarısız!");
    }
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.titleHeader}>Ayarlar</Text>
            <Text style={{ fontSize: 12, color: "gray" }}>
              Uygulama Ayarları
            </Text>
          </View>
          {/* Hatırlatma Durumu Dropdown */}
          <View style={styles.card}>
            <Text style={styles.title}>Hatırlatma Durumu</Text>
            <Text style={styles.description}>
              Hatırlatma aktif/pasif durumu
            </Text>
            <SelectDropdown
              search={true}
              data={reminderOptions}
              defaultValue={reminderOptions.find(
                (item) => item.id === reminderStatus
              )} // Seçili item
              onSelect={(selectedItem, index) => {
                setReminderStatus(selectedItem.id);
              }}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <View style={styles.dropdownButtonStyle}>
                    <Text style={styles.dropdownButtonTxtStyle}>
                      {(selectedItem && selectedItem.title) ||
                        "Hatırlatma durumu seçin"}
                    </Text>
                  </View>
                );
              }}
              renderItem={(item, index, isSelected) => {
                return (
                  <View
                    style={{
                      ...styles.dropdownItemStyle,
                      ...(isSelected && { backgroundColor: "#D2D9DF" }),
                    }}
                  >
                    <Text style={styles.dropdownItemTxtStyle}>
                      {item.title}
                    </Text>
                  </View>
                );
              }}
              showsVerticalScrollIndicator={false}
              dropdownStyle={styles.dropdownMenuStyle}
            />
          </View>

          {/* Geçmiş Tarihe Randevu Switch */}
          <View style={styles.card}>
            <Text style={styles.title}>Geçmiş Tarihe Randevu</Text>
            <Text style={styles.description}>
              Kullanıcı geçmiş tarihlere randevu ekleyebilsin mi?
            </Text>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>
                {allowPastAppointments ? "Aktif" : "Pasif"}
              </Text>
              <Switch
                value={allowPastAppointments}
                onValueChange={setAllowPastAppointments}
                trackColor={{ false: "#d1d5db", true: "#3b82f6" }}
                thumbColor={Platform.OS === "android" ? "#fff" : undefined}
              />
            </View>
          </View>

          {/* Şifre Güncelleme Sıklığı Dropdown */}
          <View style={styles.card}>
            <Text style={styles.title}>Şifre Güncelleme Sıklığı</Text>
            <Text style={styles.description}>
              Kaç ayda bir şifre güncellensin?
            </Text>
            <SelectDropdown
              search={true}
              data={passwordOptions}
              defaultValue={passwordOptions.find(
                (item) => item.id === passwordUpdateInterval
              )} // Seçili item
              onSelect={(selectedItem, index) => {
                setPasswordUpdateInterval(selectedItem.id);
              }}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <View style={styles.dropdownButtonStyle}>
                    <Text style={styles.dropdownButtonTxtStyle}>
                      {(selectedItem && selectedItem.title) ||
                        "Şifre güncelleme sıklık durumu seçin"}
                    </Text>
                  </View>
                );
              }}
              renderItem={(item, index, isSelected) => {
                return (
                  <View
                    style={{
                      ...styles.dropdownItemStyle,
                      ...(isSelected && { backgroundColor: "#D2D9DF" }),
                    }}
                  >
                    <Text style={styles.dropdownItemTxtStyle}>
                      {item.title}
                    </Text>
                  </View>
                );
              }}
              showsVerticalScrollIndicator={false}
              dropdownStyle={styles.dropdownMenuStyle}
            />
          </View>

          {/* Kaydet Butonu */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Kaydet</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Buton altına boşluk
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  headerTitleContainer: {
    paddingBottom: 8,
    marginBottom: 10,
    flex: 1, // Genişliği butona göre ayarlanabilir hale getir
  },
  titleHeader: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  switchLabel: {
    fontSize: 15,
    color: "#374151",
  },
  saveButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  dropdownButtonStyle: {
    width: "100%",
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    color: "#111827",
    fontSize: 16,
    textAlign: "left",
  },
  dropdownMenuStyle: {
    borderRadius: 8,
  },
  dropdownButtonStyle: {
    height: 50,
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
});
