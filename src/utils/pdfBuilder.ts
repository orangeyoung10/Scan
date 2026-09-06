import { jsPDF } from 'jspdf';
import { QrMatrixResult, BeadColorCode, BeadSizeSpec } from '../types';

interface PdfOptions {
  title: string;
  lang: string;
  darkBead: BeadColorCode;
  lightBead: BeadColorCode;
  ecl: string;
  rawInput: string;
  isMirrored?: boolean;
  beadSize?: BeadSizeSpec;
}

export function generatePrintablePdf(result: QrMatrixResult, options: PdfOptions): void {
  // A4 dimensions in mm: 210 x 297
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const matrix = result.matrix;
  const dim = result.dimension;
  const isMirrored = !!options.isMirrored;
  const isMini = options.beadSize === '2.6mm';
  
  // Physical pitch: 2.6mm for mini beads, 5.0mm for standard midi
  const beadPitchMm = isMini ? 2.6 : 5.0;
  const patternWidthMm = dim * beadPitchMm;
  const patternHeightMm = dim * beadPitchMm;
  const finishedCm = (dim * (isMini ? 0.26 : 0.50)).toFixed(1);

  // ==========================================
  // PAGE 1: 1:1 TRUE PHYSICAL SCALE PATTERN
  // ==========================================

  // Header Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(20, 24, 33);
  doc.text('ScanBeads.com — 1:1 Scale Pegboard Pattern', 20, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Grid: ${dim}×${dim} Beads (${isMini ? '2.6mm Mini' : '5.0mm Midi'}) | ECL: Level ${options.ecl} | Finished Size: ${finishedCm}×${finishedCm} cm`,
    20,
    22
  );

  // Craft Mode Badge & Bead Spec Badge
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  if (isMirrored) {
    doc.setTextColor(220, 38, 38); // Red
    doc.text(`[ 🪞 TAPE METHOD (MIRRORED) — ${isMini ? '2.6mm MINI SPEC' : '5.0mm MIDI SPEC'} ] Pre-flipped horizontally so the front scans after ironing back.`, 20, 28);
  } else {
    doc.setTextColor(15, 23, 42); // Dark slate
    doc.text(`[ STANDARD DIRECT VIEW — ${isMini ? '2.6mm MINI SPEC' : '5.0mm MIDI SPEC'} ] Direct placement or lay transparent pegboard directly on sheet.`, 20, 28);
  }

  // 1:1 Scale High-Precision 50mm Verification Ruler (Millimeter ticks)
  const rulerX = 136;
  const rulerY = 8;
  doc.setDrawColor(71, 85, 105);
  doc.setLineWidth(0.3);
  doc.setFillColor(255, 255, 255);
  doc.rect(rulerX - 3, rulerY, 56, 25, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(15, 23, 42);
  doc.text('50mm CALIBRATION RULER', rulerX - 1, rulerY + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Verify with physical ruler (Must be 5.0cm)', rulerX - 1, rulerY + 8);

  const baselineY = rulerY + 16.5;
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.3);
  doc.line(rulerX, baselineY, rulerX + 50, baselineY);

  // 0 to 50mm Ticks
  for (let mm = 0; mm <= 50; mm++) {
    const tx = rulerX + mm;
    let tickHeight = 1.2;
    if (mm % 10 === 0) {
      tickHeight = 4.0;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(5.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`${mm / 10}`, tx, baselineY + 3.0, { align: 'center' });
    } else if (mm % 5 === 0) {
      tickHeight = 2.5;
    }
    doc.setLineWidth(0.2);
    doc.line(tx, baselineY, tx, baselineY - tickHeight);
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(4.8);
  doc.setTextColor(220, 38, 38);
  doc.text('If not exactly 50mm, reprint at "100% / Actual Size"', rulerX - 1, rulerY + 23);

  // Position pattern centered horizontally on A4
  // Page width 210mm
  const startX = Math.max(10, (210 - patternWidthMm) / 2);
  const startY = 37;

  // Draw coordinate labels and pattern
  doc.setFontSize(isMini ? 5.5 : 6.5);
  doc.setTextColor(148, 163, 184);

  // Background subtle pegboard outline
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.rect(startX, startY, patternWidthMm, patternHeightMm);

  // Draw beads row by row
  const radius = isMini ? 1.15 : 2.2;
  const innerHoleRadius = isMini ? 0.42 : 0.8;
  const pegDotRadius = isMini ? 0.22 : 0.4;

  for (let r = 0; r < dim; r++) {
    // Left row numbers every 5 rows
    if ((r + 1) % 5 === 0 || r === 0 || r === dim - 1) {
      doc.text(`${r + 1}`, startX - (isMini ? 3.5 : 4.5), startY + r * beadPitchMm + beadPitchMm * 0.7, { align: 'right' });
    }

    for (let c = 0; c < dim; c++) {
      // Top column numbers every 5 cols
      if (r === 0 && ((c + 1) % 5 === 0 || c === 0 || c === dim - 1)) {
        doc.text(`${c + 1}`, startX + c * beadPitchMm + beadPitchMm / 2, startY - 1.8, { align: 'center' });
      }

      const centerX = startX + c * beadPitchMm + beadPitchMm / 2;
      const centerY = startY + r * beadPitchMm + beadPitchMm / 2;
      const sourceCol = isMirrored ? dim - 1 - c : c;
      const isDark = matrix[r][sourceCol];

      if (isDark) {
        // Dark bead: filled circle with white inner hole
        doc.setFillColor(15, 23, 42); // deep slate/black
        doc.circle(centerX, centerY, radius, 'F');

        // Center hole
        doc.setFillColor(255, 255, 255);
        doc.circle(centerX, centerY, innerHoleRadius, 'F');
      } else {
        // White bead: light stroke circle with subtle center peg mark
        doc.setDrawColor(180, 195, 210);
        doc.setLineWidth(0.2);
        doc.circle(centerX, centerY, radius, 'D');

        // Center peg dot
        doc.setFillColor(203, 213, 225);
        doc.circle(centerX, centerY, pegDotRadius, 'F');
      }
    }
  }

  // Draw 5-bead major grid lines over the pattern
  for (let i = 0; i <= dim; i += 5) {
    const lineX = startX + i * beadPitchMm;
    const lineY = startY + i * beadPitchMm;

    doc.setDrawColor(100, 116, 139);
    doc.setLineWidth(0.3);
    // Vertical line
    if (i <= dim) {
      doc.line(lineX, startY - 1, lineX, startY + patternHeightMm + 1);
    }
    // Horizontal line
    if (i <= dim) {
      doc.line(startX - 1, lineY, startX + patternWidthMm + 1, lineY);
    }
  }

  // Draw 4-Pegboard interlocking seam boundaries if dimension exceeds 29
  if (dim > 29) {
    const seamX = startX + 29 * beadPitchMm;
    const seamY = startY + 29 * beadPitchMm;

    doc.setDrawColor(220, 38, 38); // Bold red seam
    doc.setLineWidth(0.6);
    // Vertical 29-bead seam
    doc.line(seamX, startY - 2.5, seamX, startY + patternHeightMm + 2.5);
    // Horizontal 29-bead seam
    doc.line(startX - 2.5, seamY, startX + patternWidthMm + 2.5, seamY);

    // Subtle Board Quadrant Labels
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(220, 38, 38);
    doc.text('Board 1 (Top-Left 29x29)', startX + 1.5, startY + 4.5);
    doc.text('Board 2 (Top-Right)', seamX + 1.5, startY + 4.5);
    doc.text('Board 3 (Bottom-Left)', startX + 1.5, seamY + 4.5);
    doc.text('Board 4 (Bottom-Right)', seamX + 1.5, seamY + 4.5);
  }

  // Footer instruction
  const footerY = startY + patternHeightMm + 8;
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `PRINT INSTRUCTION: Print at 100% scale (Do NOT fit to page). Lay your transparent ${isMini ? '2.6mm Mini' : '5.0mm Midi'} pegboard directly over this grid.`,
    20,
    Math.min(footerY, 282)
  );
  doc.text(
    `Compatible with ${isMini ? 'Perler Mini, Hama Mini, Artkal C/A-2.6mm' : 'Perler 5mm, Hama Midi, Artkal S-5mm'}. See Page 2 for bead counts and ironing instructions.`,
    20,
    Math.min(footerY + 4.5, 287)
  );

  // ==========================================
  // PAGE 2: MATERIAL CHECKLIST & IRONING GUIDE
  // ==========================================
  doc.addPage('a4', 'portrait');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(20, 24, 33);
  doc.text('ScanBeads — Material Checklist & Craft Guide', 20, 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('Everything needed to successfully assemble and iron your scannable QR code.', 20, 29);

  // Table 1: Matrix & Bead Counts
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text('1. Bead & Board Requirements', 20, 42);

  // Table header
  doc.setFillColor(241, 245, 249);
  doc.rect(20, 46, 170, 8, 'F');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text('Item', 24, 51.5);
  doc.text('Specification', 85, 51.5);
  doc.text('Quantity', 150, 51.5);

  // Rows
  const statsRows = [
    ['Matrix Dimensions', `${dim} × ${dim} Grid`, `${dim * dim} positions`],
    ['Pegboards Needed', isMini ? 'Mini Transparent Pegboard' : '29 × 29 Standard Transparent Board', `${result.pegboardsRequired} board(s)`],
    ['Dark Beads (Pattern)', options.darkBead.name, `${result.darkCount} beads`],
    ['White Beads (Background & Quiet Zone)', options.lightBead.name, `${result.lightCount} beads`],
    ['Total Beads Required', isMini ? '2.6mm Mini Fuse Beads' : '5.0mm Standard Midi Beads', `${result.totalBeads} beads`],
    ['Finished Size (approx.)', `${isMini ? '2.6mm' : '5.0mm'} pitch`, `${finishedCm} cm × ${finishedCm} cm`]
  ];

  let currentY = 54;
  statsRows.forEach(([item, spec, qty], idx) => {
    currentY += 7.5;
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(20, currentY - 5, 170, 7.5, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    doc.text(item, 24, currentY);
    doc.setTextColor(71, 85, 105);
    doc.text(spec, 85, currentY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(qty, 150, currentY);
  });

  // Table 2: Brand Color Cross-Reference
  currentY += 16;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text('2. Brand Color Codes Equivalents', 20, currentY);

  currentY += 4;
  doc.setFillColor(241, 245, 249);
  doc.rect(20, currentY, 170, 8, 'F');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text('Brand', 24, currentY + 5.5);
  doc.text('Dark Bead Code', 85, currentY + 5.5);
  doc.text('White Bead Code', 145, currentY + 5.5);

  const brandRows = [
    ['Perler Beads (USA)', options.darkBead.perlerCode, options.lightBead.perlerCode],
    ['Artkal Beads (Global)', options.darkBead.artkalCode, options.lightBead.artkalCode],
    ['Hama Beads (Europe)', options.darkBead.hamaCode, options.lightBead.hamaCode]
  ];

  brandRows.forEach(([brand, dark, light], idx) => {
    currentY += 8;
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(20, currentY - 5, 170, 8, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    doc.text(brand, 24, currentY);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(dark, 85, currentY);
    doc.text(light, 145, currentY);
  });

  // Section 3: Ironing Technique & Success Rules
  currentY += 16;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text('3. Essential Ironing Rules (Flat Melt Method)', 20, currentY);

  currentY += 7;
  const guidePoints: [string, string][] = [
    ...(dim > 29
      ? ([
          [
            '4-Pegboard Assembly:',
            'Interlock 4 standard 29x29 boards in a 2x2 grid. Lay tape across the board joints underneath to keep them locked flat during bead placement.'
          ]
        ] as [string, string][])
      : []),
    ['Iron Temperature:', 'Set iron to MEDIUM (wool/cotton setting). NO STEAM! Steam causes uneven moisture warping.'],
    ['Single-Sided Flat Melt:', 'Melt the BACK side until fully fused for strength. KEEP THE FRONT side lightly melted with round holes open. This completely avoids camera glare and reflection!'],
    ['Parchment Paper:', 'Always place heat-resistant ironing paper between the iron and beads. Use smooth, light circular motions for 20-30 seconds.'],
    ['Tape Method Recommended:', 'Use painter tape on top of the beads to lift the project off your plastic pegboard before ironing. This preserves your pegboards from warping.'],
    ['Cool Under Heavy Books:', 'Immediately place the hot piece under heavy flat books for at least 15 minutes. This prevents curling and ensures a dead-flat surface.']
  ];

  guidePoints.forEach(([headline, desc]) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`• ${headline}`, 24, currentY);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const splitDesc = doc.splitTextToSize(desc, 120);
    doc.text(splitDesc, 68, currentY);
    currentY += splitDesc.length * 4.5 + 2;
  });

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Generated 100% locally by ScanBeads.com — No data was uploaded to any server.', 20, 285);
  doc.text('Free for personal and educational use.', 190, 285, { align: 'right' });

  // Download trigger
  const filename = `ScanBeads_${dim}x${dim}_${isMini ? 'Mini-2.6mm' : 'Midi-5.0mm'}${isMirrored ? '_Mirrored_TapeMethod' : ''}_ECL-${options.ecl}.pdf`;
  doc.save(filename);
}
