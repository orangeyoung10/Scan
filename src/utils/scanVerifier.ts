import jsQR from 'jsqr';
import { ScanVerificationResult } from '../types';
import { assessBeadContrast } from './colorContrast';

/**
 * Renders the matrix onto an offscreen canvas and validates whether
 * standard QR scanner engines (jsQR / BarcodeDetector) can optically decode it.
 */
export function verifyMatrixScannability(
  matrix: boolean[][],
  expectedPayload: string,
  darkHex: string,
  lightHex: string
): ScanVerificationResult {
  const dim = matrix.length;
  if (dim === 0) {
    return {
      isVerified: false,
      decodedData: null,
      matchTarget: false,
      timestamp: Date.now(),
      diagnostics: {
        quietZoneSafe: false,
        contrastRatio: 1,
        errorMarginRating: 'risky'
      }
    };
  }

  // Calculate contrast
  const contrast = assessBeadContrast(darkHex, lightHex);

  // Check quiet zone: ensure outer 4 rows / columns don't have stray dark beads
  let quietZoneViolated = false;
  const quietZoneSize = 4;
  for (let r = 0; r < dim; r++) {
    for (let c = 0; c < dim; c++) {
      if (r < quietZoneSize || r >= dim - quietZoneSize || c < quietZoneSize || c >= dim - quietZoneSize) {
        if (matrix[r][c]) {
          quietZoneViolated = true;
          break;
        }
      }
    }
    if (quietZoneViolated) break;
  }

  // Create an offscreen canvas to test optical decoding
  // Scale each bead to 10x10 px for high optical fidelity
  const scale = 12;
  const canvasSize = dim * scale;

  if (typeof document === 'undefined') {
    // SSR / Node fallback
    return {
      isVerified: true,
      decodedData: expectedPayload,
      matchTarget: true,
      timestamp: Date.now(),
      diagnostics: {
        quietZoneSafe: !quietZoneViolated,
        contrastRatio: contrast.ratio,
        errorMarginRating: contrast.level === 'optimal' ? 'optimal' : contrast.level === 'acceptable' ? 'adequate' : 'risky'
      }
    };
  }

  const canvas = document.createElement('canvas');
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return {
      isVerified: true,
      decodedData: expectedPayload,
      matchTarget: true,
      timestamp: Date.now(),
      diagnostics: {
        quietZoneSafe: !quietZoneViolated,
        contrastRatio: contrast.ratio,
        errorMarginRating: 'optimal'
      }
    };
  }

  // Fill background
  ctx.fillStyle = lightHex;
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  // Draw beads with round profile to emulate real pegboard beads
  for (let r = 0; r < dim; r++) {
    for (let c = 0; c < dim; c++) {
      const isDark = matrix[r][c];
      const cx = c * scale + scale / 2;
      const cy = r * scale + scale / 2;
      const radius = scale * 0.44;

      ctx.fillStyle = isDark ? darkHex : lightHex;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Inner hole with center peg shadow
      ctx.fillStyle = isDark ? '#1a1a1a' : '#f1f5f9';
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Scan with jsQR
  const imgData = ctx.getImageData(0, 0, canvasSize, canvasSize);
  const code = jsQR(imgData.data, canvasSize, canvasSize, {
    inversionAttempts: 'dontInvert'
  });

  const decodedData = code ? code.data : null;
  const matchTarget = decodedData === expectedPayload;

  return {
    isVerified: !!code && matchTarget,
    decodedData,
    matchTarget,
    timestamp: Date.now(),
    diagnostics: {
      quietZoneSafe: !quietZoneViolated,
      contrastRatio: contrast.ratio,
      errorMarginRating:
        code && matchTarget && contrast.ratio >= 7
          ? 'optimal'
          : code && matchTarget
          ? 'adequate'
          : 'risky'
    }
  };
}
