import { SupportedLang } from './config/i18n';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type BeadSizeSpec = '5.0mm' | '2.6mm';

export type InputMode = 'url' | 'wifi' | 'vcard';

export type ColorMode = 'classic' | 'custom_dark';

export interface WifiData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
}

export interface VCardData {
  fullName: string;
  phone: string;
  email: string;
}

export interface GeneratorState {
  mode: InputMode;
  urlText: string;
  wifi: WifiData;
  vcard: VCardData;
  ecl: ErrorCorrectionLevel;
  colorMode: ColorMode;
  customDarkColor: string;
  showGrid: boolean;
  isMirrored?: boolean;
  beadSize?: BeadSizeSpec;
  quietZoneSize: number; // typically 4 rows
}

export interface QrMatrixResult {
  matrix: boolean[][]; // true = dark bead, false = white bead
  dimension: number; // e.g. 29
  rawDimension: number; // inner QR code size before quiet zone
  version: number;
  darkCount: number;
  lightCount: number;
  totalBeads: number;
  pegboardsRequired: number;
  physicalSizeCm: number;
  error?: string;
}

export interface BeadColorCode {
  id: string;
  name: string;
  hex: string;
  perlerCode: string;
  artkalCode: string;
  hamaCode: string;
  isHighContrast: boolean;
}

export type PageRoute = 'home' | 'generator' | 'tutorial';

export type MeltSimulationMode = 'hollow' | 'melted';

export interface BeadRun {
  color: 'dark' | 'light';
  count: number;
  startIndex: number;
  endIndex: number;
}

export interface RowAnalysis {
  rowIndex: number;
  runs: BeadRun[];
  darkCount: number;
  lightCount: number;
  total: number;
}

export interface ScanVerificationResult {
  isVerified: boolean;
  decodedData: string | null;
  matchTarget: boolean;
  timestamp: number;
  diagnostics: {
    quietZoneSafe: boolean;
    contrastRatio: number;
    errorMarginRating: 'optimal' | 'adequate' | 'risky';
  };
}

export interface SavedPattern {
  id: string;
  title: string;
  createdAt: number;
  mode: InputMode;
  urlText?: string;
  wifi?: WifiData;
  vcard?: VCardData;
  ecl: ErrorCorrectionLevel;
  darkBeadId: string;
  beadSize: BeadSizeSpec;
  isMirrored?: boolean;
  dimension: number;
  totalBeads: number;
  darkCount: number;
}

export interface PresetTemplate {
  id: string;
  title: string;
  description: string;
  category: 'wifi' | 'social' | 'music' | 'emergency' | 'crypto' | 'secret';
  mode: InputMode;
  urlText?: string;
  wifi?: WifiData;
  vcard?: VCardData;
  recommendedEcl: ErrorCorrectionLevel;
  recommendedDarkColorId: string;
  recommendedBeadSize: BeadSizeSpec;
  badge: string;
}

export type IroningStep = 'checklist' | 'ironing' | 'cooling' | 'complete';
