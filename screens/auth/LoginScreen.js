import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import axios from "axios";
import Endpoint from "../../tools/endpoint";
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get("window");

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { t } = useTranslation();
  // Animasyon değerleri
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Giriş animasyonları
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Uyarı",
        textBody: "E-Mail adresinizi lütfen yazınız.",
        button: "Kapat",
      });
      return;
    }

    if (!password) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Uyarı",
        textBody: "Şifrenizi lütfen yazınız.",
        button: "Kapat",
      });
      return;
    }
    try {
      setIsLoading(true);
      const { data } = await axios.post(Endpoint.Login, {
        email: email,
        password: password,
      });

      setIsLoading(false);

      if (data.user != null && data.user.verify == 0) {
        await AsyncStorage.setItem("login_email", email);

        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: "Uyarı",
          textBody:
            "E-Posta adresiniz doğrulanmamış. Doğrulama sayfasına yönlendiriliyorsunuz.",
        });
        
        setTimeout(() => {
          navigation.replace("Verify");
        }, 4000);
        return;
      }
      if (data.status) {
        await AsyncStorage.setItem("token", data.token);
        Animated.sequence([
          Animated.timing(logoScale, {
            toValue: 1.1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(logoScale, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          navigation.replace("AppMenu");
        });
      } else {
        Dialog.show({
          type: ALERT_TYPE.WARNING,
          title: "Uyarı",
          textBody: data.error,
          button: "Kapat",
        });
      }
    } catch (error) {
      console.log(error)
    }
  };

  const RegisterPage = async () => {
    navigation.replace("Register");
  };

  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <AlertNotificationRoot>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        <View style={styles.gradient}>
          {/* Arka plan dekoratif elementler */}
          <View style={styles.backgroundCircle1} />
          <View style={styles.backgroundCircle2} />

          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Logo ve Başlık */}
            <Animated.View
              style={[
                styles.logoContainer,
                { transform: [{ scale: logoScale }] },
              ]}
            >
              <View style={styles.logoCircle}>
                <Icon name="person" size={40} color="#fff" />
              </View>
              <Text style={styles.appTitle}>Hoş Geldiniz</Text>
              <Text style={styles.appSubtitle}>Hesabınıza giriş yapın</Text>
            </Animated.View>

            {/* Form Alanları */}
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Icon
                  name="mail-outline"
                  size={20}
                  color="#667eea"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="E-posta adresiniz"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>


              <View style={styles.inputContainer}>
                <Icon
                  name="lock-closed-outline"
                  size={20}
                  color="#667eea"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Şifreniz"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Icon
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>

              {/* Şifremi Unuttum */}
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
              </TouchableOpacity>

              {/* Giriş Butonu */}
              <AnimatedTouchableOpacity
                style={[
                  styles.loginButton,
                  isLoading && styles.loginButtonDisabled,
                ]}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.loginButtonGradient,
                    { backgroundColor: isLoading ? "#999" : "#ff6b6b" },
                  ]}
                >
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <Animated.View style={styles.loadingDot} />
                      <Text style={styles.loginButtonText}>
                        Giriş Yapılıyor...
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.loginButtonText}>Giriş Yap</Text>
                  )}
                </View>
              </AnimatedTouchableOpacity>

              {/* Sosyal Medya Giri */}
              <View style={styles.socialContainer}>
                <Text style={styles.orText}>veya</Text>

                <View style={styles.socialButtons}>
                  <TouchableOpacity style={styles.socialButton}>
                    <Icon name="logo-google" size={24} color="#db4437" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.socialButton}>
                    <Icon name="logo-facebook" size={24} color="#4267B2" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.socialButton}>
                    <Icon name="logo-apple" size={24} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Kayıt Ol */}
              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Hesabınız yok mu? </Text>
                <TouchableOpacity onPress={RegisterPage}>
                  <Text style={styles.signupLink}>Kayıt Olun</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </AlertNotificationRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    position: "relative",
    backgroundColor: "#667eea",
    // Gradient efekti için ek katmanlar
  },
  backgroundCircle1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(118, 75, 162, 0.3)", // Mor tonları
    top: -50,
    right: -50,
  },
  backgroundCircle2: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    bottom: -30,
    left: -30,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: StatusBar.currentHeight || 0,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 50,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  appSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
    maxWidth: 350,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 15,
    marginBottom: 20,
    paddingHorizontal: 20,
    height: 55,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    height: "100%",
  },
  eyeIcon: {
    padding: 5,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
  },
  loginButton: {
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonGradient: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
    marginRight: 10,
  },
  socialContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  orText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    marginBottom: 20,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
  },
  signupLink: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
