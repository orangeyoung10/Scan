import { BeadColorCode } from '../types';

export const STANDARD_WHITE_BEAD: BeadColorCode = {
  id: 'white',
  name: 'Solid White',
  hex: '#F8FAFC',
  perlerCode: '#5001 White',
  artkalCode: 'S02 White',
  hamaCode: '01 White',
  isHighContrast: true
};

export const DARK_BEAD_OPTIONS: BeadColorCode[] = [
  {
    id: 'black',
    name: 'Solid Black (Recommended)',
    hex: '#0F172A',
    perlerCode: '#5018 Black',
    artkalCode: 'S01 Black',
    hamaCode: '18 Black',
    isHighContrast: true
  },
  {
    id: 'dark-grey',
    name: 'Dark Grey',
    hex: '#334155',
    perlerCode: '#5092 Dark Grey',
    artkalCode: 'S67 Charcoal',
    hamaCode: '71 Dark Grey',
    isHighContrast: true
  },
  {
    id: 'midnight-blue',
    name: 'Midnight Navy Blue',
    hex: '#1E3A8A',
    perlerCode: '#5008 Dark Blue',
    artkalCode: 'S35 Navy',
    hamaCode: '08 Blue',
    isHighContrast: true
  },
  {
    id: 'forest-green',
    name: 'Forest Dark Green',
    hex: '#14532D',
    perlerCode: '#5010 Dark Green',
    artkalCode: 'S28 Hunter',
    hamaCode: '10 Dark Green',
    isHighContrast: true
  },
  {
    id: 'cranberry',
    name: 'Cranberry / Dark Red',
    hex: '#881337',
    perlerCode: '#5038 Cranberry',
    artkalCode: 'S17 Crimson',
    hamaCode: '22 Dark Red',
    isHighContrast: true
  }
];

export function getBeadByHex(hex: string): BeadColorCode {
  return DARK_BEAD_OPTIONS.find(b => b.hex.toLowerCase() === hex.toLowerCase()) || DARK_BEAD_OPTIONS[0];
}
