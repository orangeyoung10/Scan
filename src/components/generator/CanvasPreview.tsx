import { useEffect, useRef, useState, useMemo, MouseEvent } from 'react';
import { QrMatrixResult, BeadColorCode, BeadSizeSpec, MeltSimulationMode } from '../../types';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Eye,
  EyeOff,
  Sparkles,
  FlipHorizontal,
  Flame,
  CheckCircle2,
  AlertTriangle,
  ListOrdered,
  Layers,
  Info,
  Ruler
} from 'lucide-react';
import { BeadTrackerBar } from './BeadTrackerBar';
import { verifyMatrixScannability } from '../../utils/scanVerifier';

interface CanvasPreviewProps {
  matrixResult: QrMatrixResult;
  darkBead: BeadColorCode;
  lightBead: BeadColorCode;
  showGrid: boolean;
  onToggleGrid: () => void;
  isMirrored: boolean;
  onToggleMirror: () => void;
  beadSize?: BeadSizeSpec;
  rawPayload?: string;
  onOpenIroningAssistant?: () => void;
  onOpenCalibrator?: () => void;
  screenScaleFactor?: number;
  t: any;
}

export function CanvasPreview({
  matrixResult,
  darkBead,
  lightBead,
  showGrid,
  onToggleGrid,
  isMirrored,
  onToggleMirror,
  beadSize = '5.0mm',
  rawPayload = '',
  onOpenIroningAssistant,
  onOpenCalibrator,
  screenScaleFactor = 1.0,
  t
}: CanvasPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [zoom, setZoom] = useState<number>(1);
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number; isDark: boolean } | null>(null);

  // Phase 3: Interactive Beading Tracker State
  const [trackerActive, setTrackerActive] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<number>(0);
  const [completedRows, setCompletedRows] = useState<boolean[]>([]);

  // Phase 3: Surface Melt Simulation State
  const [meltMode, setMeltMode] = useState<MeltSimulationMode>('hollow');

  // Phase 3: Scan Verification Diagnostic Modal
  const [showScanDetails, setShowScanDetails] = useState<boolean>(false);

  const matrix = matrixResult.matrix;
  const dim = matrixResult.dimension;

  // Reset tracker when dimension changes
  useEffect(() => {
    setCurrentRow(0);
    setCompletedRows(new Array(dim).fill(false));
  }, [dim]);

  // Optical scan verification using jsQR
  const scanStatus = useMemo(() => {
    return verifyMatrixScannability(
      matrix,
      rawPayload,
      darkBead.hex,
      lightBead.hex
    );
  }, [matrix, rawPayload, darkBead.hex, lightBead.hex]);

  const handleToggleRowComplete = (rowIndex: number) => {
    setCompletedRows(prev => {
      const next = [...prev];
      next[rowIndex] = !next[rowIndex];
      return next;
    });
  };

  const handleResetProgress = () => {
    setCompletedRows(new Array(dim).fill(false));
    setCurrentRow(0);
  };

  // Render bead simulation on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dim === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Base size per bead in pixels
    const baseCellSize = 22;
    const padding = 30; // coordinate margin
    const totalLogicalSize = dim * baseCellSize + padding * 2;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = totalLogicalSize * dpr;
    canvas.height = totalLogicalSize * dpr;
    canvas.style.width = `${totalLogicalSize * zoom}px`;
    canvas.style.height = `${totalLogicalSize * zoom}px`;

    ctx.save();
    ctx.scale(dpr, dpr);

    // 1. Draw Pegboard Backing (simulating clear acrylic pegboard)
    ctx.fillStyle = '#131822';
    ctx.fillRect(0, 0, totalLogicalSize, totalLogicalSize);

    // Subtle pegboard border
    ctx.strokeStyle = '#2d3748';
    ctx.lineWidth = 1;
    ctx.strokeRect(padding - 2, padding - 2, dim * baseCellSize + 4, dim * baseCellSize + 4);

    // 2. Draw Coordinates
    ctx.font = '10px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < dim; i++) {
      const coord = i + 1;
      const pos = padding + i * baseCellSize + baseCellSize / 2;
      const isThisRowDone = trackerActive && completedRows[i];
      const isThisActive = trackerActive && i === currentRow;

      // Show every 5th or edge numbers
      if (coord % 5 === 0 || coord === 1 || coord === dim || isThisActive) {
        // Top column label
        ctx.fillStyle = '#64748b';
        ctx.fillText(`${coord}`, pos, padding / 2);

        // Left row label
        ctx.textAlign = 'right';
        if (isThisActive) {
          ctx.fillStyle = '#F59E0B';
          ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
          ctx.fillText(`▶ ${coord}`, padding - 5, pos);
          ctx.font = '10px "Plus Jakarta Sans", sans-serif';
        } else if (isThisRowDone) {
          ctx.fillStyle = '#10B981';
          ctx.fillText(`✓ ${coord}`, padding - 5, pos);
        } else {
          ctx.fillStyle = '#64748b';
          ctx.fillText(`${coord}`, padding - 6, pos);
        }
        ctx.textAlign = 'center';
      }
    }

    // 3. Draw Pegboard Peg Holes under beads
    for (let r = 0; r < dim; r++) {
      for (let c = 0; c < dim; c++) {
        const cx = padding + c * baseCellSize + baseCellSize / 2;
        const cy = padding + r * baseCellSize + baseCellSize / 2;

        ctx.beginPath();
        ctx.arc(cx, cy, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#0a0d14';
        ctx.fill();
      }
    }

    // 4. Draw 3D Simulated Fuse Beads
    const isMelted = meltMode === 'melted';
    const outerRadius = (baseCellSize / 2) * (isMelted ? 0.98 : 0.92);
    const innerHoleRadius = isMelted ? outerRadius * 0.14 : outerRadius * 0.42;

    for (let r = 0; r < dim; r++) {
      for (let c = 0; c < dim; c++) {
        const sourceCol = isMirrored ? dim - 1 - c : c;
        const isDark = matrix[r]?.[sourceCol] ?? false;
        const cx = padding + c * baseCellSize + baseCellSize / 2;
        const cy = padding + r * baseCellSize + baseCellSize / 2;

        // Bead Drop Shadow
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx + 1, cy + 1.5, outerRadius, 0, Math.PI * 2);
        ctx.fillStyle = isMelted ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.4)';
        ctx.fill();
        ctx.restore();

        // Bead Body with 3D gradient
        const grad = ctx.createRadialGradient(
          cx - outerRadius * 0.35,
          cy - outerRadius * 0.35,
          outerRadius * 0.1,
          cx,
          cy,
          outerRadius
        );

        if (isDark) {
          // Dark bead simulation
          const baseColor = darkBead.hex;
          if (isMelted) {
            grad.addColorStop(0, lightenColor(baseColor, 20));
            grad.addColorStop(0.5, baseColor);
            grad.addColorStop(1, darkenColor(baseColor, 25));
          } else {
            grad.addColorStop(0, lightenColor(baseColor, 40));
            grad.addColorStop(0.3, lightenColor(baseColor, 15));
            grad.addColorStop(0.85, baseColor);
            grad.addColorStop(1, darkenColor(baseColor, 40));
          }
        } else {
          // White bead simulation
          if (isMelted) {
            grad.addColorStop(0, '#FFFFFF');
            grad.addColorStop(0.5, '#F1F5F9');
            grad.addColorStop(1, '#CBD5E1');
          } else {
            grad.addColorStop(0, '#FFFFFF');
            grad.addColorStop(0.3, '#F8FAFC');
            grad.addColorStop(0.8, '#E2E8F0');
            grad.addColorStop(1, '#CBD5E1');
          }
        }

        ctx.beginPath();
        ctx.arc(cx, cy, outerRadius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Rim stroke
        ctx.strokeStyle = isDark ? darkenColor(darkBead.hex, 50) : '#94A3B8';
        ctx.lineWidth = isMelted ? 0.3 : 0.6;
        ctx.stroke();

        // Specular highlight arc on upper rim (subtle when melted)
        if (!isMelted) {
          ctx.beginPath();
          ctx.arc(cx, cy, outerRadius * 0.78, Math.PI * 1.1, Math.PI * 1.6);
          ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.8)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        // Center Peg Hole
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, innerHoleRadius, 0, Math.PI * 2);
        ctx.fillStyle = isMelted ? (isDark ? '#05070a' : '#94a3b8') : '#0b0f19';
        ctx.fill();

        // Inner shadow on the hole
        if (!isMelted) {
          ctx.strokeStyle = isDark ? '#000000' : '#64748b';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    // 5. Draw Optional Grid Lines with 5-Row Accenting
    if (showGrid) {
      for (let i = 0; i <= dim; i++) {
        const isMajor = i % 5 === 0;
        const lineOffset = padding + i * baseCellSize;

        ctx.beginPath();
        ctx.strokeStyle = isMajor ? 'rgba(251, 191, 36, 0.75)' : 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = isMajor ? 1.5 : 0.6;

        // Vertical Line
        ctx.moveTo(lineOffset, padding);
        ctx.lineTo(lineOffset, padding + dim * baseCellSize);
        ctx.stroke();

        // Horizontal Line
        ctx.moveTo(padding, lineOffset);
        ctx.lineTo(padding + dim * baseCellSize, lineOffset);
        ctx.stroke();
      }
    }

    // 6. Draw Multi-Pegboard Seam Lines (When dim > 29 pins)
    if (dim > 29) {
      const seamOffset = padding + 29 * baseCellSize;

      ctx.save();
      ctx.setLineDash([6, 4]);
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 2.5;

      // Vertical Seam between Board A/B and C/D
      ctx.beginPath();
      ctx.moveTo(seamOffset, padding);
      ctx.lineTo(seamOffset, padding + dim * baseCellSize);
      ctx.stroke();

      // Horizontal Seam between Board A/C and B/D
      ctx.beginPath();
      ctx.moveTo(padding, seamOffset);
      ctx.lineTo(padding + dim * baseCellSize, seamOffset);
      ctx.stroke();

      // Board quadrant badges
      ctx.setLineDash([]);
      ctx.font = 'bold 9px monospace';
      ctx.fillStyle = '#EF4444';
      ctx.fillText('BOARD 1 (TL)', padding + 35, padding + 12);
      ctx.fillText('BOARD 2 (TR)', seamOffset + 35, padding + 12);
      ctx.fillText('BOARD 3 (BL)', padding + 35, seamOffset + 14);
      ctx.fillText('BOARD 4 (BR)', seamOffset + 35, seamOffset + 14);
      ctx.restore();
    }

    // 7. Interactive Beading Tracker Highlighting
    if (trackerActive) {
      // Dim non-active rows so user focuses exclusively on the active row
      for (let r = 0; r < dim; r++) {
        if (r !== currentRow) {
          ctx.fillStyle = 'rgba(10, 15, 25, 0.55)';
          ctx.fillRect(padding, padding + r * baseCellSize, dim * baseCellSize, baseCellSize);
        }
      }

      // Highlight active row with glowing golden box
      const rowY = padding + currentRow * baseCellSize;
      ctx.save();
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 3;
      ctx.strokeRect(padding - 2, rowY, dim * baseCellSize + 4, baseCellSize);

      // Arrow indicator on left
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.moveTo(padding - 8, rowY + baseCellSize / 2);
      ctx.lineTo(padding - 18, rowY + 3);
      ctx.lineTo(padding - 18, rowY + baseCellSize - 3);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // 8. Highlight Hovered Bead
    if (hoverCoord && hoverCoord.x >= 0 && hoverCoord.x < dim && hoverCoord.y >= 0 && hoverCoord.y < dim) {
      const hcx = padding + hoverCoord.x * baseCellSize + baseCellSize / 2;
      const hcy = padding + hoverCoord.y * baseCellSize + baseCellSize / 2;

      ctx.beginPath();
      ctx.arc(hcx, hcy, outerRadius + 2.5, 0, Math.PI * 2);
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.restore();
  }, [
    matrix,
    dim,
    darkBead,
    lightBead,
    showGrid,
    zoom,
    hoverCoord,
    isMirrored,
    trackerActive,
    currentRow,
    completedRows,
    meltMode
  ]);

  // Handle canvas click to jump row when tracker is active
  const handleCanvasClick = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !trackerActive) return;

    const rect = canvas.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const baseCellSize = 22 * zoom;
    const padding = 30 * zoom;

    const clickedRow = Math.floor((clickY - padding) / baseCellSize);
    if (clickedRow >= 0 && clickedRow < dim) {
      setCurrentRow(clickedRow);
    }
  };

  // Handle canvas mouse move for interactive inspection
  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const baseCellSize = 22 * zoom;
    const padding = 30 * zoom;

    const col = Math.floor((clickX - padding) / baseCellSize);
    const row = Math.floor((clickY - padding) / baseCellSize);

    if (col >= 0 && col < dim && row >= 0 && row < dim) {
      const sourceCol = isMirrored ? dim - 1 - col : col;
      const isDark = matrix[row]?.[sourceCol] ?? false;
      setHoverCoord({ x: col, y: row, isDark });
    } else {
      setHoverCoord(null);
    }
  };

  const handleMouseLeave = () => {
    setHoverCoord(null);
  };

  return (
    <div className="bg-[#E5E7EB] p-4 sm:p-6 border-2 sm:border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.12)] flex flex-col gap-4">
      
      {/* Canvas Card */}
      <div className="bg-white border-2 border-black flex flex-col shadow-[4px_4px_0px_0px_rgba(0,0,0,0.06)]">
        {/* Top Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b-2 border-black bg-gray-50">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Retro Window Dots */}
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 border border-black/30"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-black/30"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 border border-black/30"></div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-widest text-black">
                Pegboard
              </span>
              <span className="text-[10px] font-mono font-bold text-gray-600 bg-gray-200 px-1.5 py-0.5 border border-black/20">
                {dim}×{dim}
              </span>
              <span className="text-[10px] font-mono font-bold text-gray-800 bg-gray-100 px-1.5 py-0.5 border border-black/20">
                {beadSize === '2.6mm' ? '2.6mm Mini' : '5.0mm Midi'}
              </span>

              {/* Machine Scan-Verification Badge */}
              <button
                type="button"
                onClick={() => setShowScanDetails(!showScanDetails)}
                className={`text-[9px] font-black uppercase px-2 py-0.5 border border-black flex items-center gap-1 cursor-pointer transition-transform hover:scale-105 ${
                  scanStatus.isVerified
                    ? 'bg-emerald-300 text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-red-400 text-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                }`}
                title="Click to view optical camera verification details"
              >
                {scanStatus.isVerified ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-900" />
                    <span>Scannable OK</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3 text-white" />
                    <span>Check Scan</span>
                  </>
                )}
              </button>

              {isMirrored ? (
                <span className="text-[9px] font-black uppercase tracking-wider text-white bg-red-600 px-1.5 py-0.5 border border-black flex items-center gap-1 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  🪞 TAPE MIRRORED
                </span>
              ) : null}
            </div>
          </div>

          {/* Action Control Toggles */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {/* Beading Tracker Toggle */}
            <button
              onClick={() => setTrackerActive(!trackerActive)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-2 border-black ${
                trackerActive
                  ? 'bg-yellow-300 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-black hover:bg-gray-100 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
              }`}
              title="Interactive row-by-row beading companion mode"
            >
              <ListOrdered className="w-3.5 h-3.5 text-black" />
              <span>{trackerActive ? 'Tracking ON' : 'Craft Mode'}</span>
            </button>

            {/* Melt Surface Simulation Toggle */}
            <button
              onClick={() => setMeltMode(m => (m === 'hollow' ? 'melted' : 'hollow'))}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-black uppercase tracking-wider transition-all cursor-pointer border border-black ${
                meltMode === 'melted'
                  ? 'bg-amber-500 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-black hover:bg-gray-100 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
              }`}
              title="Toggle preview between raw unmelted beads and flat-iron fused look"
            >
              <Flame className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{meltMode === 'melted' ? 'Flat Melted' : 'Unmelted'}</span>
            </button>

            {/* Ironing Studio Modal Trigger */}
            {onOpenIroningAssistant && (
              <button
                type="button"
                onClick={onOpenIroningAssistant}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-black uppercase tracking-wider transition-all cursor-pointer border border-black bg-gradient-to-r from-red-500 to-amber-500 text-white hover:from-red-600 hover:to-amber-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                title="Open interactive Ironing & Cooling Assistant"
              >
                <Flame className="w-3.5 h-3.5 text-yellow-300" />
                <span>Ironing</span>
              </button>
            )}

            {/* Mirror Toggle Button (Tape Method Craft Protection) */}
            <button
              onClick={onToggleMirror}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-black uppercase tracking-wider transition-all cursor-pointer border border-black ${
                isMirrored
                  ? 'bg-red-500 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-black hover:bg-gray-100 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
              }`}
              title="Flip horizontally for painter tape method (ironing back side)"
            >
              <FlipHorizontal className="w-3.5 h-3.5" />
              <span>{isMirrored ? 'Mirrored' : 'Tape Flip'}</span>
            </button>

            {/* Screen 1:1 Calibrator Trigger */}
            {onOpenCalibrator && (
              <button
                type="button"
                onClick={onOpenCalibrator}
                className="flex items-center gap-1 px-2 py-1 text-xs font-black uppercase tracking-wider transition-all cursor-pointer border border-black bg-white hover:bg-gray-100 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                title="Calibrate screen so transparent pegboard placed on tablet matches 1:1"
              >
                <Ruler className="w-3.5 h-3.5 text-black" />
                <span className="hidden sm:inline">1:1 Screen</span>
              </button>
            )}

            {/* Grid Toggle */}
            <button
              onClick={onToggleGrid}
              className={`flex items-center gap-1.5 px-2 py-1 text-xs font-black uppercase tracking-wider transition-all cursor-pointer border border-black ${
                showGrid
                  ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(239,68,68,1)]'
                  : 'bg-white text-black hover:bg-gray-100 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
              }`}
              title={t.generator.grid_accent}
            >
              {showGrid ? <Eye className="w-3.5 h-3.5 text-yellow-300" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>

            {/* Zoom Controls */}
            <div className="flex items-center bg-white border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
              <button
                onClick={() => setZoom(z => Math.max(0.7, z - 0.15))}
                className="p-1 text-black hover:bg-gray-100 transition-colors cursor-pointer border-r border-black"
                title={t.generator.zoom_out}
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="p-1 text-black hover:bg-gray-100 transition-colors cursor-pointer border-r border-black"
                title={t.generator.reset_zoom}
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(z => Math.min(1.8, z + 0.15))}
                className="p-1 text-black hover:bg-gray-100 transition-colors cursor-pointer"
                title={t.generator.zoom_in}
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Diagnostic Popover Card */}
        {showScanDetails && (
          <div className="p-3 bg-white border-b-2 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans shadow-inner">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-black uppercase tracking-wider text-black">
                  Camera Engine Verification:
                </span>
                <span
                  className={`px-1.5 py-0.5 text-[9px] font-black uppercase ${
                    scanStatus.isVerified ? 'bg-emerald-200 text-emerald-950' : 'bg-red-200 text-red-950'
                  }`}
                >
                  {scanStatus.isVerified ? 'Optical Pass' : 'Optical Warning'}
                </span>
              </div>
              <p className="text-gray-600 text-[11px] leading-tight">
                Decoded payload:{' '}
                <strong className="font-mono text-black">
                  {scanStatus.decodedData ? `${scanStatus.decodedData.slice(0, 50)}...` : 'Decoding failed'}
                </strong>{' '}
                &bull; Quiet Zone: {scanStatus.diagnostics.quietZoneSafe ? 'Safe (4-Row)' : 'Violated'} &bull; Contrast: {scanStatus.diagnostics.contrastRatio}:1
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowScanDetails(false)}
              className="text-[10px] font-black uppercase tracking-wider text-gray-500 hover:text-black underline cursor-pointer shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Canvas Scrollable Stage */}
        <div
          ref={containerRef}
          className="w-full min-h-[360px] sm:min-h-[440px] max-h-[540px] overflow-auto flex items-center justify-center p-4 bg-[#F8F9FA] relative"
        >
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] border-2 border-black transition-all max-w-none ${
              trackerActive ? 'cursor-pointer' : 'cursor-crosshair'
            }`}
          />

          {/* Hover Coordinate Floating Tooltip */}
          {hoverCoord && (
            <div className="absolute bottom-4 left-4 z-10 px-3 py-1.5 bg-white border-2 border-black text-xs text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-none border border-black"
                style={{ backgroundColor: hoverCoord.isDark ? darkBead.hex : lightBead.hex }}
              />
              <span className="font-bold">
                X: <strong className="text-red-500 font-mono">{hoverCoord.x + 1}</strong>, Y:{' '}
                <strong className="text-red-500 font-mono">{hoverCoord.y + 1}</strong>
              </span>
              <span className="text-[10px] uppercase font-black tracking-wider text-gray-500 border-l border-gray-300 pl-2">
                {hoverCoord.isDark ? darkBead.name : lightBead.name}
              </span>
              {isMirrored && (
                <span className="text-[9px] font-black uppercase text-red-500 bg-red-50 px-1 border border-red-200">
                  Mirrored
                </span>
              )}
            </div>
          )}
        </div>

        {/* Multi-Pegboard Interlocking Reminder Strip (when dim > 29) */}
        {dim > 29 && (
          <div className="px-4 py-2 bg-yellow-50 border-t-2 border-black flex items-center justify-between text-xs text-black font-sans">
            <span className="flex items-center gap-1.5 font-bold">
              <Layers className="w-4 h-4 text-red-600 shrink-0" />
              <span>
                <strong>4 Pegboards Interlocking Required:</strong> Red dashed lines mark pin 29 seams where Boards 1, 2, 3, and 4 snap together.
              </span>
            </span>
            <span className="text-[10px] font-mono text-gray-600 hidden sm:inline">
              58×58 Total Pin Workspace
            </span>
          </div>
        )}

        {/* Dynamic Craft Mode Helper Strip */}
        {isMirrored ? (
          <div className="px-4 py-2 bg-red-50 border-t-2 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-red-950 font-sans">
            <span className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span><strong>Tape Method Active:</strong> Pattern is flipped. Place beads, lift with painter tape, flip over and iron the back!</span>
            </span>
            <button
              type="button"
              onClick={onToggleMirror}
              className="text-[10px] uppercase font-black tracking-wider text-red-700 hover:text-black underline cursor-pointer self-start sm:self-auto shrink-0"
            >
              Direct View
            </button>
          </div>
        ) : (
          <div className="px-4 py-2 bg-gray-50 border-t border-black flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-gray-700 font-sans">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 border border-black shrink-0" />
              <span>{t.generator.canvas_help}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 hidden md:inline">Need step-by-step bead stringing guidance?</span>
              <button
                type="button"
                onClick={() => setTrackerActive(true)}
                className="text-[10px] font-black uppercase tracking-wider text-red-600 hover:text-red-800 underline cursor-pointer"
              >
                Turn On Craft Tracker ➔
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Beading Tracker Companion Component */}
      {trackerActive && (
        <BeadTrackerBar
          matrix={matrix}
          dimension={dim}
          currentRow={currentRow}
          onRowChange={setCurrentRow}
          completedRows={completedRows}
          onToggleRowComplete={handleToggleRowComplete}
          onResetProgress={handleResetProgress}
          darkBead={darkBead}
          lightBead={lightBead}
          isMirrored={isMirrored}
          beadSize={beadSize}
        />
      )}

      {/* Metric 3-Block Row (Artistic Flair Neo-Brutalist Layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Metric 1: Pegboards */}
        <div className="bg-white border-2 border-black p-3.5 flex items-center gap-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-3xl font-black text-red-500 font-mono">
            {matrixResult.pegboardsRequired.toString().padStart(2, '0')}
          </span>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-black">Pegboards Needed</h4>
            <p className="text-[10px] text-gray-600 font-sans">
              {dim > 29 ? '4 Boards (2×2 Grid)' : '1 Single 29×29 Board'}
            </p>
          </div>
        </div>

        {/* Metric 2: Total Beads */}
        <div className="bg-white border-2 border-black p-3.5 flex items-center gap-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-3xl font-black text-black font-mono">
            {matrixResult.totalBeads}
          </span>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-black">Total Beads</h4>
            <p className="text-[10px] text-gray-600 font-sans">{matrixResult.darkCount} dark &bull; {matrixResult.lightCount} white</p>
          </div>
        </div>

        {/* Metric 3: Instant Export Card */}
        <div className="bg-black text-white border-2 border-black p-3.5 flex items-center gap-3.5 shadow-[3px_3px_0px_0px_rgba(239,68,68,1)]">
          <div className="w-8 h-8 bg-red-500 flex items-center justify-center shrink-0 border border-black">
            <Sparkles className="w-4 h-4 text-yellow-300" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-yellow-300">Instant Export</h4>
            <p className="text-[10px] text-gray-300 font-sans">100% Client-Side PDF/PNG</p>
          </div>
        </div>
      </div>

    </div>
  );
}

// Helpers for bead 3D specular gradient
function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
  const B = Math.min(255, (num & 0x0000ff) + amt);
  return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
}

function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00ff) - amt);
  const B = Math.max(0, (num & 0x0000ff) - amt);
  return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
}

