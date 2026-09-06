import { QrMatrixResult, BeadColorCode } from '../types';

export function downloadBeadPng(
  result: QrMatrixResult,
  darkBead: BeadColorCode,
  lightBead: BeadColorCode,
  withCoordinates: boolean = false,
  isMirrored: boolean = false
): void {
  const matrix = result.matrix;
  const dim = result.dimension;
  if (dim === 0) return;

  const baseCellSize = 32; // Crisp resolution
  const padding = withCoordinates ? 48 : 24;
  const totalSize = dim * baseCellSize + padding * 2;

  const canvas = document.createElement('canvas');
  canvas.width = totalSize;
  canvas.height = totalSize;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(0, 0, totalSize, totalSize);

  // Pegboard acrylic backplate
  ctx.fillStyle = '#1E293B';
  ctx.fillRect(padding - 4, padding - 4, dim * baseCellSize + 8, dim * baseCellSize + 8);

  // Coordinates if enabled
  if (withCoordinates) {
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < dim; i++) {
      const coord = i + 1;
      const pos = padding + i * baseCellSize + baseCellSize / 2;
      if (coord % 5 === 0 || coord === 1 || coord === dim) {
        ctx.fillText(`${coord}`, pos, padding / 2);
        ctx.textAlign = 'right';
        ctx.fillText(`${coord}`, padding - 10, pos);
        ctx.textAlign = 'center';
      }
    }
  }

  // Draw beads (with horizontal mirroring if tape method mode is enabled)
  const outerRadius = (baseCellSize / 2) * 0.92;
  const innerHoleRadius = outerRadius * 0.42;

  for (let r = 0; r < dim; r++) {
    for (let c = 0; c < dim; c++) {
      const sourceCol = isMirrored ? dim - 1 - c : c;
      const isDark = matrix[r][sourceCol];
      const cx = padding + c * baseCellSize + baseCellSize / 2;
      const cy = padding + r * baseCellSize + baseCellSize / 2;

      // Bead gradient
      const grad = ctx.createRadialGradient(
        cx - outerRadius * 0.35,
        cy - outerRadius * 0.35,
        outerRadius * 0.1,
        cx,
        cy,
        outerRadius
      );

      if (isDark) {
        grad.addColorStop(0, '#475569');
        grad.addColorStop(0.3, '#1e293b');
        grad.addColorStop(0.85, darkBead.hex);
        grad.addColorStop(1, '#000000');
      } else {
        grad.addColorStop(0, '#FFFFFF');
        grad.addColorStop(0.3, '#F8FAFC');
        grad.addColorStop(0.8, '#E2E8F0');
        grad.addColorStop(1, '#CBD5E1');
      }

      ctx.beginPath();
      ctx.arc(cx, cy, outerRadius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Bead rim
      ctx.strokeStyle = isDark ? '#000000' : '#94A3B8';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Specular highlight
      ctx.beginPath();
      ctx.arc(cx, cy, outerRadius * 0.78, Math.PI * 1.1, Math.PI * 1.6);
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Center hole
      ctx.beginPath();
      ctx.arc(cx, cy, innerHoleRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#0F172A';
      ctx.fill();
    }
  }

  // Draw grid lines if coordinates requested
  if (withCoordinates) {
    for (let i = 0; i <= dim; i++) {
      const isMajor = i % 5 === 0;
      const lineOffset = padding + i * baseCellSize;

      ctx.beginPath();
      ctx.strokeStyle = isMajor ? 'rgba(251, 191, 36, 0.7)' : 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = isMajor ? 2 : 0.8;

      ctx.moveTo(lineOffset, padding);
      ctx.lineTo(lineOffset, padding + dim * baseCellSize);
      ctx.stroke();

      ctx.moveTo(padding, lineOffset);
      ctx.lineTo(padding + dim * baseCellSize, lineOffset);
      ctx.stroke();
    }
  }

  // Convert to download link
  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `ScanBeads_${dim}x${dim}${isMirrored ? '_mirrored_tape_method' : ''}${withCoordinates ? '_grid' : ''}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
