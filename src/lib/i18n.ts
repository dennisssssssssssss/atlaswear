import enMessages from "@/locales/en.json";
import roMessages from "@/locales/ro.json";

export type Lang = "en" | "ro";

export interface LocalizedText {
  en: string;
  ro: string;
}

export const LOCALE_STORAGE_KEY = "atlas-lang";

export const messages = {
  en: enMessages,
  ro: roMessages,
} as const;

export type TranslationKey = keyof typeof enMessages;

export const localize = (en: string, ro: string): LocalizedText => ({
  en,
  ro,
});

export const getLocalizedText = (
  value: LocalizedText | string,
  lang: Lang,
) => {
  if (typeof value === "string") {
    return value;
  }

  return value[lang];
};

export const detectInitialLanguage = (): Lang => {
  if (typeof window === "undefined") {
    return "ro";
  }

  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored === "en" || stored === "ro") {
    return stored;
  }

  return "ro";
};

export const translate = (
  lang: Lang,
  key: TranslationKey,
  values?: Record<string, string | number>,
) => {
  const template = messages[lang][key] ?? messages.en[key] ?? key;

  if (!values) {
    return template;
  }

  return Object.entries(values).reduce((result, [token, value]) => {
    return result.replaceAll(`{{${token}}}`, String(value));
  }, template);
};
