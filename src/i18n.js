import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Çeviri dosyaları
import en from "./locales/en.json";
import tr from "./locales/tr.json";

const LANGUAGE_PREFERENCE_KEY = "user-language";

const languageDetector = {
  type: "languageDetector",
  async: true,
  detect: async (callback) => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_PREFERENCE_KEY);
      if (savedLanguage) {
        callback(savedLanguage);
      } else {
        callback("tr"); // Varsayılan dil
      }
    } catch (e) {
      console.error("Dil algılanırken hata oluştu:", e);
      callback("tr");
    }
  },
  init: () => {},
  cacheUserLanguage: async (lang) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_PREFERENCE_KEY, lang);
    } catch (e) {
      console.error("Dil kaydedilemedi:", e);
    }
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v3",
    fallbackLng: "tr",
    resources: {
      en: { translation: en },
      tr: { translation: tr },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
