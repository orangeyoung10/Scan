import QRCode from 'qrcode';
import { ErrorCorrectionLevel, QrMatrixResult, WifiData, VCardData } from '../types';

/**
 * Format WiFi string adhering to the standard MeCard / ZXing Wi-Fi format:
 * WIFI:S:MySSID;T:WPA;P:MyPassword;;
 */
export function formatWifiPayload(data: WifiData): string {
  const escapeWifi = (str: string) => str.replace(/([\\;,:"])/g, '\\$1');
  const enc = data.encryption === 'nopass' ? 'nopass' : data.encryption;
  const passField = enc === 'nopass' ? '' : `P:${escapeWifi(data.password)};`;
  return `WIFI:S:${escapeWifi(data.ssid)};T:${enc};${passField};`;
}

/**
 * Format vCard 3.0 string
 */
export function formatVCardPayload(data: VCardData): string {
  const lines = ['BEGIN:VCARD', 'VERSION:3.0'];
  if (data.fullName.trim()) {
    lines.push(`FN:${data.fullName.trim()}`);
    lines.push(`N:;${data.fullName.trim()};;;`);
  }
  if (data.phone.trim()) {
    lines.push(`TEL;TYPE=CELL:${data.phone.trim()}`);
  }
  if (data.email.trim()) {
    lines.push(`EMAIL:${data.email.trim()}`);
  }
  lines.push('END:VCARD');
  return lines.join('\n');
}

/**
 * Generates a 2D boolean array representing fuse beads on a pegboard
 * true = dark bead
 * false = white bead
 */
export function generateBeadMatrix(
  rawText: string,
  ecl: ErrorCorrectionLevel = 'H',
  quietZone: number = 4
): QrMatrixResult {
  const content = rawText.trim() || 'https://scanbeads.com';

  try {
    const qr = QRCode.create(content, {
      errorCorrectionLevel: ecl
    });

    const qrSize = qr.modules.size;
    const totalDim = qrSize + quietZone * 2;
    const matrix: boolean[][] = [];

    let darkCount = 0;
    let lightCount = 0;

    for (let r = 0; r < totalDim; r++) {
      const row: boolean[] = [];
      for (let c = 0; c < totalDim; c++) {
        const qrRow = r - quietZone;
        const qrCol = c - quietZone;

        let isDark = false;
        if (qrRow >= 0 && qrRow < qrSize && qrCol >= 0 && qrCol < qrSize) {
          // Inside QR code active region
          isDark = Boolean(qr.modules.get(qrRow, qrCol));
        } else {
          // Inside Quiet Zone (all white beads)
          isDark = false;
        }

        row.push(isDark);
        if (isDark) {
          darkCount++;
        } else {
          lightCount++;
        }
      }
      matrix.push(row);
    }

    // A standard square pegboard is 29x29 pegs
    // If dimension <= 29, 1 board is needed.
    // If dimension <= 58, 4 boards (2x2) are needed.
    // If dimension <= 87, 9 boards (3x3) are needed.
    const boardsPerSide = Math.ceil(totalDim / 29);
    const pegboardsRequired = boardsPerSide * boardsPerSide;

    // Standard 5mm midi bead pitch:
    // 1 bead = 5mm = 0.5 cm
    const physicalSizeCm = parseFloat(((totalDim * 5) / 10).toFixed(1));

    return {
      matrix,
      dimension: totalDim,
      rawDimension: qrSize,
      version: qr.version,
      darkCount,
      lightCount,
      totalBeads: darkCount + lightCount,
      pegboardsRequired,
      physicalSizeCm
    };
  } catch (err: any) {
    console.error('QR Matrix Generation Error:', err);
    // Return safe fallback 29x29 matrix
    const fallbackDim = 29;
    const matrix: boolean[][] = Array.from({ length: fallbackDim }, () =>
      Array.from({ length: fallbackDim }, () => false)
    );
    return {
      matrix,
      dimension: fallbackDim,
      rawDimension: 21,
      version: 1,
      darkCount: 0,
      lightCount: fallbackDim * fallbackDim,
      totalBeads: fallbackDim * fallbackDim,
      pegboardsRequired: 1,
      physicalSizeCm: 14.5,
      error: err?.message || 'Text is too long or invalid for this QR configuration.'
    };
  }
}
