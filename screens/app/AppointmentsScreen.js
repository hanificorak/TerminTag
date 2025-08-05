import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/Ionicons";
import Status from "../../tools/status_arr";

import {
  Dialog,
  Portal,
  Modal,
  Button,
  Provider as PaperProvider,
} from "react-native-paper";
import Endpoint from "../../tools/endpoint";
import api from "../../tools/api";
import { useFocusEffect } from "@react-navigation/native";
import { Alert } from "react-native";

export default function AppointmentsScreen({ navigation }) {
  const [filterDlg, setFilterDlg] = useState(false);
  const [date, setDate] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [category_lists, setCategory_lists] = useState([]);
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [visible, setVisible] = React.useState(false);
  const [activeData, setActiveData] = useState("");
  const [status, setStatus] = useState(-1);

  const status_list = [
    { id: -1, title: 'Tümü' },

    { id: 1, title: 'Aktif' },
    { id: 2, title: 'Gidildi' },
    { id: 3, title: 'İptal Edildi' },
    { id: 0, title: 'Pasif' },
  ]

  useFocusEffect(
    useCallback(() => {
      getParam();
      getData();
    }, [])
  );

  const getData = async () => {
    try {
 
      const { data } = await api.post(Endpoint.AppointmentData, {
        category: category,
        date: date,
        location: location,
        status:(status == -1 ? null : status)
      });

      if (data.status) {
        setFilterDlg(false);
        setAppointments(data.obj);
      }
    } catch (error) { }
  };

  const getParam = async () => {
    const { data } = await api.post(Endpoint.AppointmentParam);
    if (data && data.status) {
      setCategory_lists(data.category_lists);
    }
  };

  function filteropen() {
    setFilterDlg(true);
  }

  const formatTarih = (text) => {
    const numbersOnly = text.replace(/[^\d]/g, "");
    let formatted = "";
    if (numbersOnly.length <= 2) {
      formatted = numbersOnly;
    } else if (numbersOnly.length <= 4) {
      formatted = `${numbersOnly.slice(0, 2)}.${numbersOnly.slice(2)}`;
    } else {
      formatted = `${numbersOnly.slice(0, 2)}.${numbersOnly.slice(
        2,
        4
      )}.${numbersOnly.slice(4, 8)}`;
    }

    setDate(formatted);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Aylar 0'dan başlar
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const formatTime = (timeString) => {
    const date = new Date(`1970-01-01T${timeString}Z`);
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };


  const getStatus = (status) => {
    console.log(status)
    switch (status) {
      case 1:
        return 'Aktif'
      case 2:
        return 'Gidildi'
      case 3:
        return 'İptal Edildi'
      case 0:
        return 'Pasif'
      default:
        break;
    }
  };

  const getDetail = () => {
    setVisible(false);
    navigation.navigate("DetailAppointmentsScreen", { data: activeData });
  };

  const deleteRec = () => {
    Alert.alert(
      "Emin misiniz?",
      "Silmek istediğinize emin misiniz?",
      [
        {
          text: "Hayır",
          onPress: () => console.log("Silme iptal edildi"),
          style: "cancel"
        },
        {
          text: "Evet",
          onPress: async () => {
            const { data } = await api.post(Endpoint.AppointmentDelete, { id: activeData.id });
            if (data && data.status) {
              setVisible(false);
              getData();
              Alert.alert('Bilgi', 'Kayıt başarıyla silindi.')
            }
          }
        }
      ],
      { cancelable: false }
    );
  };
  const showModal = (appointmentData) => {
    setActiveData(appointmentData);
    setVisible(true);
  };

  const hideModal = () => setVisible(false);

  const renderAppointmentCard = (appointment) => {
    return (
      <TouchableOpacity
        key={appointment.id}
        onPress={() => showModal(appointment)}
        style={[
          styles.appointmentCard,
          {
            backgroundColor: "#EFF6FF",
            borderColor: "#DBEAFE",
          },
        ]}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          <View style={styles.leftContent}>
            <View style={styles.typeContainer}>
              <View
                style={[
                  styles.typeDot,
                  { backgroundColor: appointment.color_code },
                ]}
              />
              <Text style={styles.typeLabel}>{appointment.category_name}</Text>
            </View>

            <Text style={styles.appointmentTitle}>{appointment.title}</Text>

            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                <Text style={styles.infoText}>
                  {formatDate(appointment.date)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={16} color="#6B7280" />
                <Text style={styles.infoText}>{appointment.location}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="checkmark-circle-outline" size={16} color="#6B7280" />
                <Text style={styles.infoText}>{getStatus(appointment.status)}</Text>
              </View>
            </View>
          </View>

          {/* Right Content - Time */}
          <View style={styles.rightContent}>
            <View style={styles.timeContainer}>
              <Ionicons name="time-outline" size={18} color="#6B7280" />
            </View>
            <Text style={styles.timeText}>{formatTime(appointment.time)}</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.title}>Randevularım</Text>
            <Text style={{ fontSize: 12, color: "gray" }}>
              Aktif Randevularınız
            </Text>
          </View>
          <View style={{}}>
            <TouchableOpacity style={styles.button_filter} onPress={filteropen}>
              <Text style={styles.filterbuttonText}>Filtreleme</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
        >
          {appointments.map(renderAppointmentCard)}
        </ScrollView>

        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("DetailAppointmentsScreen")}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.containerStyle}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 20,
              marginBottom: 30,
              fontWeight: "bold",
            }}
          >
            Yapmak istediğiniz işlemi seçin
          </Text>


          <View >
            <Button
              mode="contained"
              onPress={() => getDetail()}
            >
              Düzenle
            </Button>
            <Button
              mode="contained"
              onPress={() => deleteRec()}
              style={{ marginTop: 10 }}
              buttonColor="#e53935"
            >
              Sil
            </Button>
          </View>
        </Modal>
      </Portal>
      <Portal>
        <Dialog visible={filterDlg} onDismiss={() => setFilterDlg(false)}>
          <Dialog.Title>Filtreleme İşlemleri</Dialog.Title>
          <Dialog.Content>
            <View>
              <Text>Durum Seçin</Text>
              <SelectDropdown
                search={true}
                data={status_list}
                defaultValue={status_list.find(item => item.id === status)} // Seçili item

                onSelect={(selectedItem, index) => {
                  setStatus(selectedItem.id)
                }}
                renderButton={(selectedItem, isOpened) => {
                  return (
                    <View style={styles.dropdownButtonStyle}>
                      <Text style={styles.dropdownButtonTxtStyle}>
                        {(selectedItem && selectedItem.title) ||
                          "Durum seçin"}
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
            <View>
              <Text>Kategori Seçin</Text>
              <SelectDropdown
                search={true}
                data={category_lists}
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
                      <Icon
                        name={isOpened ? "chevron-up" : "chevron-down"}
                        style={styles.dropdownButtonArrowStyle}
                      />
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
            <View style={styles.container_date}>
              <Text>Tarih Yazın</Text>
              <TextInput
                style={styles.input_date}
                placeholder="gg.aa.yyyy"
                keyboardType="number-pad"
                value={date}
                maxLength={10}
                onChangeText={formatTarih}
              />
            </View>
            <View style={{ marginTop: 20 }}>
              <Text>Konum</Text>
              <TextInput
                style={styles.input_date}
                value={location}
                onChangeText={setLocation}
                placeholder="Konum giriniz."
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setFilterDlg(false)}>İptal</Button>
            <Button onPress={() => getData()}>Uygula</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between", // EKLENDİ
    alignItems: "center", // Daha iyi hizalama için
    marginBottom: 12, // Alt boşluk (isteğe bağlı)
  },
  headerTitleContainer: {
    paddingBottom: 8,
    flex: 1, // Genişliği butona göre ayarlanabilir hale getir
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  scrollView: {
    flex: 1,
    marginTop: 20,
  },
  appointmentCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  leftContent: {
    flex: 1,
  },
  typeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  typeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  typeLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#6B7280",
    letterSpacing: 0.5,
  },
  appointmentTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  infoContainer: {
    gap: 6,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 8,
  },
  rightContent: {
    alignItems: "center",
    paddingLeft: 16,
    minWidth: 80,
  },
  timeContainer: {
    marginBottom: 4,
    alignItems: "center",
  },
  timeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },

  button_filter: {
    backgroundColor: "#4CAF50", // yeşil ton
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // Android için gölge
    alignSelf: "flex-start", // içeriğe göre genişlik
  },
  filterbuttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  dropdownButtonStyle: {
    height: 50,
    backgroundColor: "white",
    marginTop: 10,
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
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },

  label_date: {
    fontSize: 16,
    fontWeight: "500",
    color: "#151E26",
  },
  input_date: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 12,
    marginTop: 6,
  },
  containerStyle: { backgroundColor: "white", padding: 20 },
  containerStyle: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: '#e53935',
  },
});
