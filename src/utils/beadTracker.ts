import { BeadRun, RowAnalysis, QrMatrixResult, BeadColorCode, BeadSizeSpec } from '../types';

/**
 * Analyzes a single row of the QR matrix into run-length encoded beads
 * e.g., "4 White, 7 Black, 1 White, 7 Black, 4 White"
 */
export function analyzeRow(matrix: boolean[][], rowIndex: number): RowAnalysis {
  const row = matrix[rowIndex];
  if (!row || row.length === 0) {
    return { rowIndex, runs: [], darkCount: 0, lightCount: 0, total: 0 };
  }

  const runs: BeadRun[] = [];
  let currentColor: 'dark' | 'light' = row[0] ? 'dark' : 'light';
  let currentCount = 1;
  let startIndex = 0;

  let darkCount = row[0] ? 1 : 0;
  let lightCount = row[0] ? 0 : 1;

  for (let c = 1; c < row.length; c++) {
    const isDark = row[c];
    if (isDark) darkCount++;
    else lightCount++;

    const color: 'dark' | 'light' = isDark ? 'dark' : 'light';
    if (color === currentColor) {
      currentCount++;
    } else {
      runs.push({
        color: currentColor,
        count: currentCount,
        startIndex,
        endIndex: c - 1
      });
      currentColor = color;
      currentCount = 1;
      startIndex = c;
    }
  }

  runs.push({
    color: currentColor,
    count: currentCount,
    startIndex,
    endIndex: row.length - 1
  });

  return {
    rowIndex,
    runs,
    darkCount,
    lightCount,
    total: row.length
  };
}

/**
 * Computes overall completion statistics
 */
export function computeProgressStats(matrix: boolean[][], completedRows: boolean[]) {
  const totalRows = matrix.length;
  let completedRowCount = 0;
  let completedBeads = 0;
  const totalBeads = totalRows * totalRows;

  for (let r = 0; r < totalRows; r++) {
    if (completedRows[r]) {
      completedRowCount++;
      completedBeads += totalRows;
    }
  }

  const percent = totalRows > 0 ? Math.round((completedRowCount / totalRows) * 100) : 0;

  return {
    completedRowCount,
    totalRows,
    completedBeads,
    totalBeads,
    percent
  };
}

/**
 * Formats a clean, readable shopping / inventory list to copy to clipboard
 */
export function generateBeadShoppingText(
  result: QrMatrixResult,
  darkBead: BeadColorCode,
  lightBead: BeadColorCode,
  beadSize: BeadSizeSpec
): string {
  const isMini = beadSize === '2.6mm';
  const sizeLabel = isMini ? '2.6mm Mini Fuse Beads' : '5.0mm Standard Midi Beads';
  const finishedCm = (result.dimension * (isMini ? 0.26 : 0.5)).toFixed(1);

  const darkBuffer = Math.ceil(result.darkCount * 1.1); // +10% safety buffer
  const lightBuffer = Math.ceil(result.lightCount * 1.1); // +10% safety buffer

  const darkArtkal = isMini ? darkBead.artkalCode.replace(/^S/, 'C') : darkBead.artkalCode;
  const lightArtkal = isMini ? lightBead.artkalCode.replace(/^S/, 'C') : lightBead.artkalCode;

  return `========================================
SCANBEADS - CRAFT BILL OF MATERIALS (BOM)
========================================
Project: ${result.dimension}×${result.dimension} Scannable QR Matrix (${sizeLabel})
Physical Size: ${finishedCm} cm × ${finishedCm} cm (~${((Number(finishedCm) * 10) / 25.4).toFixed(1)} inches)
Pegboards: ${result.pegboardsRequired} board(s) (${isMini ? 'Mini Pegboard' : '29×29 Square Pin Board'})

BEAD COUNTS (Exact + 10% Safety Buffer):
----------------------------------------
1. DARK MODULE BEADS (Pattern & Finder Squares):
   - Color: ${darkBead.name}
   - Exact Needed: ${result.darkCount} beads
   - Recommended Order (+10% buffer): ${darkBuffer} beads (~${Math.ceil(darkBuffer / 1000)} × 1,000-count pack)
   - Brand Codes:
     * Perler (USA): ${darkBead.perlerCode}
     * Artkal: ${darkArtkal}
     * Hama (EU): ${darkBead.hamaCode}

2. LIGHT MODULE BEADS (Background & 4-Row Quiet Zone):
   - Color: ${lightBead.name}
   - Exact Needed: ${result.lightCount} beads
   - Recommended Order (+10% buffer): ${lightBuffer} beads (~${Math.ceil(lightBuffer / 1000)} × 1,000-count pack)
   - Brand Codes:
     * Perler (USA): ${lightBead.perlerCode}
     * Artkal: ${lightArtkal}
     * Hama (EU): ${lightBead.hamaCode}

TOTAL BEADS: ${result.totalBeads} (Recommended buffer: ${darkBuffer + lightBuffer})

RECOMMENDED TOOLS:
-------------------
- 1× Roll of Unbleached Baker's Parchment Paper (Never use wax paper)
- 1× Blue Painter's Tape (Masking tape method to preserve pegboards)
- 1× Flat Heavy Weight (Books or marble board for cooling under pressure)
- 1× Precision Tweezers

Created with ScanBeads (https://scanbeads.org)
========================================`;
}
