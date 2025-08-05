import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Endpoint from '../../tools/endpoint';
import api from '../../tools/api';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
  const [userInfo, setUserInfo] = useState({
    fullName: 'Ahmet Yılmaz',
    profileImage: null,
    email: null
  });

  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  const getData = async () => {
    try {
      const { data } = await api.post(Endpoint.ProfileData);
      console.log(data);
      if (data.status) {
        setUserInfo({ fullName: data.obj[0].name, profileImage: null, email: data.obj[0].email })

      }
    } catch (error) {
      console.log(error)
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('token');
            navigation.replace('Login');
          },
        },
      ]
    );
  };


  const handlePasswordUpdate = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Hata', 'Yeni şifreler eşleşmiyor.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      Alert.alert('Hata', 'Yeni şifre en az 6 karakter olmalıdır.');
      return;
    }

    const { data } = await api.post(Endpoint.UpdatePassword, { current: passwordData.currentPassword, ne_pas: passwordData.newPassword });
    console.log(data)
    if (data && data.status) {
      Alert.alert('Başarılı', 'Şifreniz başarıyla güncellendi.');
      setIsEditingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      if (data.type == 'last_error') {
        Alert.alert('Uyarı', 'Mevcut şifrenizi yanlış girdiniz.');
      } else {
        Alert.alert('Uyarı', 'İşlem başarısız.');

      }

    }

  };

  const handleUpdateProfile = async () => {
    if (userInfo.fullName == null || userInfo.fullName == '') {
      Alert.alert('Uyarı', 'Ad soyad alanı boş geçilemez.');
      return;
    }

    const { data } = await api.post(Endpoint.UpdateProfile, { name: userInfo.fullName });
    if (data && data.status) {
      Alert.alert('Bilgi', 'Profil bilgileri başarıyla güncellendi.');
    } else {
      Alert.alert('Uyarı', 'İşlem başarısız.');

    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <TouchableOpacity >
            {userInfo.profileImage ? (
              <Image source={{ uri: userInfo.profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.defaultProfileImage}>
                <Text style={styles.defaultProfileText}>
                  {userInfo.fullName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            {/* <View style={styles.cameraIcon}>
              <Text style={styles.cameraIconText}>📷</Text>
            </View> */}
          </TouchableOpacity>
        </View>

        <Text style={styles.welcomeText}>Hoş geldin,</Text>
        <Text style={styles.fullNameText}>{userInfo.fullName}</Text>
      </View>

      <View style={styles.formContainer}>


        <View style={styles.inputContainer}>
          <Text style={styles.label}>Ad Soyad</Text>
          <TextInput
            style={styles.input}
            value={userInfo.fullName}
            onChangeText={(text) => setUserInfo({ ...userInfo, fullName: text })}
            placeholder="Ad ve soyadınızı girin"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>E-Posta</Text>
          <TextInput
            style={styles.input}
            placeholder=""
            value={userInfo.email}
            editable={false} selectTextOnFocus={false}
          />
          <Text style={{ fontSize: 10, marginTop: 10 }}>E-Posta adresiniz değiştirilemez.</Text>
        </View>


        <TouchableOpacity
          style={styles.passwordButton}
          onPress={() => setIsEditingPassword(true)}
        >
          <Text style={styles.passwordButtonText}>🔒 Şifre Güncelle</Text>
          <Text style={styles.passwordButtonArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
          <Text style={styles.updateButtonText}>Profili Güncelle</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>

      {/* Şifre Güncelleme Modal */}
      <Modal
        visible={isEditingPassword}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsEditingPassword(false)}>
              <Text style={styles.modalCancelText}>İptal</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Şifre Güncelle</Text>
            <TouchableOpacity onPress={handlePasswordUpdate}>
              <Text style={styles.modalSaveText}>Kaydet</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mevcut Şifre</Text>
              <TextInput
                style={styles.input}
                value={passwordData.currentPassword}
                onChangeText={(text) => setPasswordData({ ...passwordData, currentPassword: text })}
                placeholder="Mevcut şifrenizi girin"
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Yeni Şifre</Text>
              <TextInput
                style={styles.input}
                value={passwordData.newPassword}
                onChangeText={(text) => setPasswordData({ ...passwordData, newPassword: text })}
                placeholder="Yeni şifrenizi girin"
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Yeni Şifre Tekrar</Text>
              <TextInput
                style={styles.input}
                value={passwordData.confirmPassword}
                onChangeText={(text) => setPasswordData({ ...passwordData, confirmPassword: text })}
                placeholder="Yeni şifrenizi tekrar girin"
                secureTextEntry
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#6366f1',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  defaultProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  defaultProfileText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#ffffff',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cameraIconText: {
    fontSize: 16,
  },
  welcomeText: {
    color: '#e0e7ff',
    fontSize: 16,
    marginBottom: 5,
  },
  fullNameText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 20,
    marginTop: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  passwordButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  passwordButtonText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  passwordButtonArrow: {
    fontSize: 20,
    color: '#9ca3af',
  },
  updateButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  updateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  logoutButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#6b7280',
  },
  modalSaveText: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '600',
  },
  modalContent: {
    padding: 20,
    paddingTop: 30,
  },
});