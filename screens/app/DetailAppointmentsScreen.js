// Yukarıdaki kod InputField componentini kullanıyordu, şimdi onu kaldırıp doğrudan TextInput'larla her alanı yeniden tanımlayacağız.

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  Animated,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SelectDropdown from "react-native-select-dropdown";
import { Provider as PaperProvider } from "react-native-paper";
import axios from "axios";
import Endpoint from "../../tools/endpoint";
import api from "../../tools/api";

export default function DetailAppointmentsScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [priority_item, setPriority_item] = useState("");
  const [color_item, setColor_item] = useState("");


  const [categories,setCategories] = useState([]);
  const [prioritys,setPrioritys]  =useState([]);
  const [colors,setColors]  =useState([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    getParam();
  }, []);

  const formatDate = (text) => {
    // Sadece rakam al
    const cleaned = text.replace(/\D/g, "").slice(0, 8);
    let formatted = "";

    if (cleaned.length >= 2) {
      formatted = cleaned.slice(0, 2);
      if (cleaned.length >= 4) {
        formatted += "." + cleaned.slice(2, 4);
        if (cleaned.length > 4) {
          formatted += "." + cleaned.slice(4, 8);
        }
      } else {
        formatted += "." + cleaned.slice(2);
      }
    } else {
      formatted = cleaned;
    }

    setDate(formatted);
  };

  const formatTime = (text) => {
    const cleaned = text.replace(/\D/g, "").slice(0, 4);
    let formatted = "";

    if (cleaned.length >= 2) {
      formatted = cleaned.slice(0, 2);
      if (cleaned.length > 2) {
        formatted += ":" + cleaned.slice(2, 4);
      }
    } else {
      formatted = cleaned;
    }

    setTime(formatted);
  };

  const getParam = async () => {
    const {data} = await api.post(Endpoint.AppointmentParam);
    if(data && data.status){
      setCategories(data.category_lists);
      setPrioritys(data.priots_lists);
      setColors(data.color_lists);
    }
  };
  

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("⚠️ Uyarı", "Lütfen başlık alanını doldurun.");
      return;
    }
    if (category == null || category == "") {
      Alert.alert("⚠️ Uyarı", "Lütfen kategori seçimini yapınız.");
      return;
    }
    if (priority_item == null || priority_item == "") {
      Alert.alert("⚠️ Uyarı", "Lütfen öncelik seçiminizi yapınız.");
      return;
    }
    if (color_item == null || color_item == "") {
      Alert.alert("⚠️ Uyarı", "Lütfen renk seçiminizi yapınız.");
      return;
    }
    if (date == null || date == "") {
      Alert.alert("⚠️ Uyarı", "Lütfen tarihi giriniz.");
      return;
    }
    if (time == null || time == "") {
      Alert.alert("⚠️ Uyarı", "Lütfen saat giriniz.");
      return;
    }
    if (location == null || location == "") {
      Alert.alert("⚠️ Uyarı", "Lütfen konum giriniz.");
      return;
    }

    const {data} = await axios.post(Endpoint.AppointmentSave,{})

    Alert.alert("✅ Başarılı", "Randevu bilgileri kaydedildi!", [
      { text: "Tamam", onPress: () => navigation.goBack() },
    ]);
  };

  const handleGoBack = () => navigation.goBack();

  return (
    <PaperProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.modernBackButton}
              onPress={handleGoBack}
            >
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
              <Text style={styles.backButtonText}>Geri</Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Randevu Detayları</Text>

            <TouchableOpacity
              style={styles.modernSaveButton}
              onPress={handleSave}
            >
              <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <ScrollView
              style={styles.container}
              contentContainerStyle={styles.scrollContent}
            >
              <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
                {/* Başlık */}
                <Animated.View
                  style={[styles.inputContainer, { opacity: fadeAnim }]}
                >
                  <View style={styles.labelContainer}>
                    <Ionicons name="create-outline" size={20} color="#6366F1" />
                    <Text style={styles.label}>Başlık</Text>
                  </View>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      value={title}
                      onChangeText={setTitle}
                      placeholder="Randevu başlığını girin..."
                      placeholderTextColor="#9CA3AF"
                      style={styles.textInput}
                    />
                  </View>
                </Animated.View>

                {/* Kategori */}
                <Animated.View
                  style={[styles.inputContainer, { opacity: fadeAnim }]}
                >
                  <View style={styles.labelContainer}>
                    <Ionicons name="apps-outline" size={20} color="#6366F1" />
                    <Text style={styles.label}>Kategori</Text>
                  </View>
                  <View style={styles.inputWrapper}>
                    <SelectDropdown
                      search={true}
                      data={categories}
                      onSelect={(selectedItem, index) => {
                        setCategory(selectedItem.id);
                      }}
                      renderButton={(selectedItem, isOpened) => {
                        return (
                          <View style={styles.dropdownButtonStyle}>
                            <Text style={styles.dropdownButtonTxtStyle}>
                              {(selectedItem && selectedItem.title) ||
                                "Kategori seçiniz"}
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
                </Animated.View>
                <Animated.View
                  style={[styles.inputContainer, { opacity: fadeAnim }]}
                >
                  <View style={styles.labelContainer}>
                    <Ionicons name="apps-outline" size={20} color="#6366F1" />
                    <Text style={styles.label}>Öncelik</Text>
                  </View>
                  <View style={styles.inputWrapper}>
                    <SelectDropdown
                      search={true}
                      data={prioritys}
                      onSelect={(selectedItem, index) => {
                        setPriority_item(selectedItem.id);
                      }}
                      renderButton={(selectedItem, isOpened) => {
                        return (
                          <View style={styles.dropdownButtonStyle}>
                            <Text style={styles.dropdownButtonTxtStyle}>
                              {(selectedItem && selectedItem.title) ||
                                "Öncelik seçiniz"}
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
                </Animated.View>

                <Animated.View
                  style={[styles.inputContainer, { opacity: fadeAnim }]}
                >
                  <View style={styles.labelContainer}>
                    <Ionicons name="apps-outline" size={20} color="#6366F1" />
                    <Text style={styles.label}>Renk</Text>
                  </View>
                  <View style={styles.inputWrapper}>
                    <SelectDropdown
                      search={true}
                      data={colors}
                      onSelect={(selectedItem, index) => {
                        setColor_item(selectedItem.id);
                      }}
                      renderButton={(selectedItem, isOpened) => {
                        return (
                          <View style={styles.dropdownButtonStyle}>
                            <Text style={styles.dropdownButtonTxtStyle}>
                              {(selectedItem && selectedItem.title) ||
                                "Renk seçiniz"}
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
                </Animated.View>
                {/* Tarih ve Saat */}
                <View style={styles.rowContainer}>
                  <View style={styles.halfWidth}>
                    <Animated.View
                      style={[styles.inputContainer, { opacity: fadeAnim }]}
                    >
                      <View style={styles.labelContainer}>
                        <Ionicons
                          name="calendar-outline"
                          size={20}
                          color="#6366F1"
                        />
                        <Text style={styles.label}>Tarih</Text>
                      </View>
                      <View style={styles.inputWrapper}>
                        <TextInput
                          style={styles.textInput}
                          value={date}
                          onChangeText={formatDate}
                          keyboardType="numeric"
                          placeholder="gg.aa.yyyy"
                          maxLength={10}
                        />
                      </View>
                    </Animated.View>
                  </View>
                  <View style={styles.halfWidth}>
                    <Animated.View
                      style={[styles.inputContainer, { opacity: fadeAnim }]}
                    >
                      <View style={styles.labelContainer}>
                        <Ionicons
                          name="time-outline"
                          size={20}
                          color="#6366F1"
                        />
                        <Text style={styles.label}>Saat</Text>
                      </View>
                      <View style={styles.inputWrapper}>
                        <TextInput
                          style={styles.textInput}
                          value={time}
                          onChangeText={formatTime}
                          keyboardType="numeric"
                          placeholder="ss:dd"
                          maxLength={5}
                        />
                      </View>
                    </Animated.View>
                  </View>
                </View>

                {/* Konum */}
                <Animated.View
                  style={[styles.inputContainer, { opacity: fadeAnim }]}
                >
                  <View style={styles.labelContainer}>
                    <Ionicons
                      name="location-outline"
                      size={20}
                      color="#6366F1"
                    />
                    <Text style={styles.label}>Konum</Text>
                  </View>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      value={location}
                      onChangeText={setLocation}
                      placeholder="Randevu konumunu girin..."
                      placeholderTextColor="#9CA3AF"
                      style={[styles.textInput, styles.multilineInput]}
                      multiline
                    />
                  </View>
                </Animated.View>

                {/* Butonlar */}
                <Animated.View
                  style={[styles.actionButtons, { opacity: fadeAnim }]}
                >
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleGoBack}
                  >
                    <Text style={styles.cancelButtonText}>İptal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleSave}
                  >
                    <View style={styles.primaryButtonContent}>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#FFFFFF"
                      />
                      <Text style={styles.primaryButtonText}>Kaydet</Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              </Animated.View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </PaperProvider>
  );
}

// styles kısmı kodda zaten tam olarak tanımlı, tekrar edilmesine gerek yok

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  headerContainer: {
    backgroundColor: "#6366F1",
    paddingTop: 10,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  modernBackButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    minWidth: 85,
    justifyContent: "center",
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
  },
  modernSaveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    minWidth: 95,
    justifyContent: "center",
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
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 12,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "#FFFFFF",
    margin: 20,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  inputContainer: {
    marginBottom: 10,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginLeft: 8,
  },
  inputWrapper: {
    position: "relative",
  },
  textInput: {
    backgroundColor: "#F9FAFB",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
  focusedInput: {
    borderColor: "#6366F1",
    backgroundColor: "#FFFFFF",
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },
  dropdownButton: {
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    width: "100%",
    height: 56,
    paddingHorizontal: 0,
  },
  dropdownButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,

    flex: 1,
  },
  dropdownPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  selectedCategoryText: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
    marginLeft: 12,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  dropdown: {
    backgroundColor: "red",
    borderRadius: 16,
    borderWidth: 0,
    elevation: 8,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  dropdownRow: {
    backgroundColor: "red",
    borderBottomColor: "#F3F4F6",
    borderBottomWidth: 1,
    paddingVertical: 16,
    marginHorizontal: 12,
  },
  dropdownRowContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  dropdownRowText: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
    marginLeft: 12,
  },
  actionButtons: {
    flexDirection: "row",
    marginTop: 32,
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#6366F1",
    borderRadius: 16,
    overflow: "hidden",
  },
  primaryButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
