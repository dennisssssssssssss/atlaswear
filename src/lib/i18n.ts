export type Lang = 'en' | 'ro';

export interface LocalizedText {
  en: string;
  ro: string;
}

export const localize = (en: string, ro: string): LocalizedText => ({
  en,
  ro,
});

export const getLocalizedText = (
  value: LocalizedText | string,
  lang: Lang,
) => {
  if (typeof value === 'string') {
    return value;
  }

  return value[lang];
};
