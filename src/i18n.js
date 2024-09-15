import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "appTitle": "Fariha Telecom Sales Tracker",
      "Welcome": "Welcome",
      "Login": "Login",
      "Username": "Username",
      "Password": "Password",
      // Add more English translations here
    }
  },
  bn: {
    translation: {
      "appTitle": "ফরিহা টেলিকম বিক্রয় ট্র্যাকার",
      "Welcome": "স্বাগতম",
      "Login": "প্রবেশ করুন",
      "Username": "ব্যবহারকারীর নাম",
      "Password": "পাসওয়ার্ড",
      // Add more Bengali translations here
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // Default language
    interpolation: {
      escapeValue: false // React already safes from xss
    }
  });

export default i18n;