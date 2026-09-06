/**
 * WCAG 2.1 Relative Luminance & Contrast Calculation Utility
 * Essential for verifying that fuse bead QR codes have sufficient optical contrast
 * to be detected by smartphone cameras under varying ambient lighting.
 */

function parseHex(hex: string): [number, number, number] {
  const cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return [r, g, b];
  }
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return [r, g, b];
  }
  return [0, 0, 0];
}

function getChannelLuminance(channelVal: number): number {
  const srgb = channelVal / 255;
  return srgb <= 0.04045 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
}

export function getRelativeLuminance(hex: string): number {
  const [r, g, b] = parseHex(hex);
  const lr = getChannelLuminance(r);
  const lg = getChannelLuminance(g);
  const lb = getChannelLuminance(b);
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

export function calculateContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getRelativeLuminance(hex1);
  const lum2 = getRelativeLuminance(hex2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 10) / 10;
}

export interface ContrastAssessment {
  ratio: number;
  isSafe: boolean;
  level: 'optimal' | 'acceptable' | 'unsafe';
  badgeLabel: string;
  summary: string;
}

export function assessBeadContrast(darkHex: string, lightHex: string): ContrastAssessment {
  const ratio = calculateContrastRatio(darkHex, lightHex);

  if (ratio >= 7.0) {
    return {
      ratio,
      isSafe: true,
      level: 'optimal',
      badgeLabel: `${ratio}:1 • Optimal`,
      summary: 'Excellent optical contrast. Instant scanning across all smartphone cameras.'
    };
  }

  if (ratio >= 4.0) {
    return {
      ratio,
      isSafe: true,
      level: 'acceptable',
      badgeLabel: `${ratio}:1 • Good`,
      summary: 'Sufficient contrast for standard phone camera recognition in normal lighting.'
    };
  }

  return {
    ratio,
    isSafe: false,
    level: 'unsafe',
    badgeLabel: `${ratio}:1 • Low Contrast`,
    summary: 'Caution: Contrast ratio is low. Phone cameras may struggle or fail to read the code.'
  };
}
