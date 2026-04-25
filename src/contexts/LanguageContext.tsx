import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  LOCALE_STORAGE_KEY,
  type Lang,
  type TranslationKey,
  detectInitialLanguage,
  messages,
  translate,
} from "@/lib/i18n";

interface LanguageContextType {
  lang: Lang;
  setLang: (nextLanguage: Lang) => void;
  t: (
    keyOrEnglish: TranslationKey | string,
    valuesOrRomanian?: Record<string, string | number> | string,
    maybeValues?: Record<string, string | number>,
  ) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lang, setLangState] = useState<Lang>(detectInitialLanguage);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = useCallback((nextLanguage: Lang) => {
    setLangState(nextLanguage);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLanguage);
      document.documentElement.lang = nextLanguage;
    }
  }, []);

  const t = useCallback(
    (
      keyOrEnglish: TranslationKey | string,
      valuesOrRomanian?: Record<string, string | number> | string,
      maybeValues?: Record<string, string | number>,
    ) => {
      if (typeof valuesOrRomanian === "string") {
        return lang === "ro" ? valuesOrRomanian : keyOrEnglish;
      }

      if (keyOrEnglish in messages.en) {
        return translate(
          lang,
          keyOrEnglish as TranslationKey,
          valuesOrRomanian ?? maybeValues,
        );
      }

      return keyOrEnglish;
    },
    [lang],
  );

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t,
    }),
    [lang, setLang, t],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
};
