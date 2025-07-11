import React, { createContext, useContext, useState, useCallback } from 'react';

export const LANGUAGES = {
  LA: 'la',
  EN: 'en',
} as const;

export type LanguageType = typeof LANGUAGES[keyof typeof LANGUAGES];

export interface Translations {
  [key: string]: string;
}


interface LanguageContextType {
  currentLanguage: LanguageType;
  setLanguage: (language: LanguageType) => void;
  t: (key: string) => string;
  translations: Record<LanguageType, Translations>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);


import en from './en.json';
import la from './la.json';



interface LanguageProviderProps {
  children: React.ReactNode;
  defaultLanguage?: LanguageType;
}
       
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ 
  children, 
  defaultLanguage = LANGUAGES.EN 
}) => {

  const [currentLanguage, setCurrentLanguage] = useState<LanguageType>(() => {
    const stored = localStorage.getItem('language');
    return (stored as LanguageType) || defaultLanguage;
  });


  const translations: Record<LanguageType, Translations> = {
    en,
    la,

  };


  const t = useCallback((key: string): string => {
    return translations[currentLanguage]?.[key] || key;
  }, [currentLanguage]);


  const setLanguage = useCallback((language: LanguageType) => {
    setCurrentLanguage(language);
    localStorage.setItem('language', language);
  }, []);

  const value = {
    currentLanguage,
    setLanguage,
    t,
    translations
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};


export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};