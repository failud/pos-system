import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Translation resources (you can also load these from separate files)
const resources = {
  en: {
    translation: {
      welcome: "Welcome",
      hello: "Hello {{name}}",
      description: "This is a React TypeScript Vite app with i18n support",
      buttons: {
        switchLanguage: "Switch Language",
        english: "English",
        spanish: "Spanish",
        french: "French"
      },
      navigation: {
        home: "Home",
        about: "About",
        contact: "Contact"
      }
    }
  },
  es: {
    translation: {
      welcome: "Bienvenido",
      hello: "Hola {{name}}",
      description: "Esta es una aplicación React TypeScript Vite con soporte i18n",
      buttons: {
        switchLanguage: "Cambiar Idioma",
        english: "Inglés",
        spanish: "Español",
        french: "Francés"
      },
      navigation: {
        home: "Inicio",
        about: "Acerca de",
        contact: "Contacto"
      }
    }
  },
  fr: {
    translation: {
      welcome: "Bienvenue",
      hello: "Bonjour {{name}}",
      description: "Ceci est une application React TypeScript Vite avec support i18n",
      buttons: {
        switchLanguage: "Changer de Langue",
        english: "Anglais",
        spanish: "Espagnol",
        french: "Français"
      },
      navigation: {
        home: "Accueil",
        about: "À propos",
        contact: "Contact"
      }
    }
  }
};

i18n
  // Load translations using http backend (optional)
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    // If you're using Backend, you don't need to define resources here
    resources,
    
    // Language to use if translations in user language are not available
    fallbackLng: 'en',
    
    // Default language
    lng: 'en',
    
    // Enable debug mode in development
    debug: import.meta.env.DEV,
    
    // Interpolation options
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    // Backend options (if using http backend)
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18n;