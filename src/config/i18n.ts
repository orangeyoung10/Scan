export type SupportedLang = 'en' | 'ja' | 'de' | 'es';

export const SUPPORTED_LANGS: SupportedLang[] = ['en', 'ja', 'de', 'es'];

export const DEFAULT_LANG: SupportedLang = 'en';

export interface LangConfig {
  code: SupportedLang;
  name: string;
  nativeName: string;
  flag: string;
  currency: string;
  marketNote: string;
}

export const LANG_DETAILS: Record<SupportedLang, LangConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    currency: '$',
    marketNote: 'US / UK / CA / AU'
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    currency: '¥',
    marketNote: 'アイロンビーズ発祥・ピクセルアート'
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    currency: '€',
    marketNote: 'Bügelperlen (Hama) / DIY'
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    currency: '€',
    marketNote: 'Hama Beads / Pixel Art'
  }
};

export function isValidLang(lang: string): lang is SupportedLang {
  return SUPPORTED_LANGS.includes(lang as SupportedLang);
}
