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
import SelectDropdown from "react-native-select-dropdown";

import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import axios from "axios";
import Endpoint from "../../tools/endpoint";

const { width, height } = Dimensions.get("window");

export default function VerifyScreen({ navigation }) {
  // Doğrulama kodu state'leri
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [sendLoading,setSendLoading] = useState(false);

  // Her input için ref oluştur
  const inputRefs = useRef([]);

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
    resendMail()

    // İlk input'a otomatik odaklan
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 500);
  }, []);

  // Doğrulama kodu değişiklik handler'ı
  const handleCodeChange = (text, index) => {
    // Sadece rakam girişine izin ver
    if (!/^\d*$/.test(text)) return;

    const newCode = [...verificationCode];
    newCode[index] = text;
    setVerificationCode(newCode);

    // Eğer bir rakam girildiyse bir sonraki input'a geç
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Backspace tuşu handler'ı
  const handleKeyPress = (e, index) => {
    if (
      e.nativeEvent.key === "Backspace" &&
      !verificationCode[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Doğrulama fonksiyonu
  const handleVerification = async () => {
    const code = verificationCode.join("");

    if (code.length !== 6) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Uyarı",
        textBody: "Lütfen 6 haneli doğrulama kodunu tam olarak giriniz.",
      });
      return;
    }

    try {
      setIsLoading(true);

      const email = await AsyncStorage.getItem("login_email");
      const { data } = await axios.post(Endpoint.Verify, {
        code: verificationCode,
        email: email,
      });
      setIsLoading(false);

      if (data && data.status) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Başarılı",
          textBody: "Doğrulama başarılı! Giriş sayfasına yönlendiriliyorsunuz.",
        });
        setTimeout(() => {
          navigation.replace("Login");
            
        }, 3000);
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Hata",
          textBody: "Doğrulama kodu hatalı. Lütfen tekrar deneyiniz.",
        });
      }

    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Hata",
        textBody: "Doğrulama kodu hatalı. Lütfen tekrar deneyiniz.",
      });
    }
  };

  const resendMail = async () => {
    const email = await AsyncStorage.getItem("login_email");
    setSendLoading(true);
    const {data} = await axios.post(Endpoint.ReplyVerify,{email:email});
    setSendLoading(false);

    if (data && data.status) {
        clearCode();
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Başarılı",
          textBody: data.message,
        });
       
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Hata",
          textBody: data.message,
        });
      }
  };

  // Kodu temizle
  const clearCode = () => {
    setVerificationCode(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
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
              <Text style={styles.appTitle}>Doğrulama Kodu</Text>
              <Text style={styles.appSubtitle}>
                E-Posta adresinize gönderilen doğrulama kodunu giriniz.
              </Text>
            </Animated.View>

            {/* Form Alanları */}
            <View style={styles.formContainer}>
              {/* Doğrulama Kodu Girişi */}
              <View style={styles.codeContainer}>
                {verificationCode.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    style={[
                      styles.codeInput,
                      digit ? styles.codeInputFilled : null,
                    ]}
                    value={digit}
                    onChangeText={(text) => handleCodeChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="numeric"
                    maxLength={1}
                    textAlign="center"
                    selectionColor="#667eea"
                  />
                ))}
              </View>

              {/* Temizle Butonu */}
              <TouchableOpacity onPress={clearCode} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>Temizle</Text>
              </TouchableOpacity>

              {/* Doğrula Butonu */}
              <AnimatedTouchableOpacity
                style={[
                  styles.verifyButton,
                  isLoading ? styles.verifyButtonDisabled : null,
                ]}
                onPress={handleVerification}
                disabled={isLoading}
              >
                <View style={styles.verifyButtonGradient}>
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <Animated.View style={styles.loadingDot} />
                      <Text style={styles.verifyButtonText}>
                        Doğrulanıyor...
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.verifyButtonText}>Doğrula</Text>
                  )}
                </View>
              </AnimatedTouchableOpacity>

              {/* Yeniden Gönder */}
              <TouchableOpacity style={styles.resendContainer} onPress={resendMail} disabled={sendLoading}>
                <Text style={styles.resendText}>
                  Kod gelmedi mi?{" "}
                  <Text style={styles.resendLink}>{(sendLoading ? 'Gönderiliyor...' : 'Gönder')}</Text>
                </Text>
              </TouchableOpacity>
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
  },
  backgroundCircle1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(118, 75, 162, 0.3)",
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
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
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
    lineHeight: 22,
  },
  formContainer: {
    width: "100%",
    maxWidth: 350,
    alignItems: "center",
  },
  // Doğrulama kodu stilleri
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    width: "100%",
    paddingHorizontal: 10,
  },
  codeInput: {
    width: 45,
    height: 55,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 2,
    borderColor: "transparent",
  },
  codeInputFilled: {
    borderColor: "#667eea",
    backgroundColor: "rgba(102, 126, 234, 0.1)",
  },
  clearButton: {
    marginBottom: 20,
  },
  clearButtonText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  verifyButton: {
    width: "100%",
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
  verifyButtonDisabled: {
    opacity: 0.7,
  },
  verifyButtonGradient: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 15,
  },
  verifyButtonText: {
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
  resendContainer: {
    alignItems: "center",
  },
  resendText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    textAlign: "center",
  },
  resendLink: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
