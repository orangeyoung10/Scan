import React, { useState, useEffect } from 'react';
import { RowAnalysis, BeadColorCode, BeadSizeSpec } from '../../types';
import { analyzeRow, computeProgressStats } from '../../utils/beadTracker';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  ListOrdered,
  Eye,
  Check
} from 'lucide-react';

interface BeadTrackerBarProps {
  matrix: boolean[][];
  dimension: number;
  currentRow: number;
  onRowChange: (row: number) => void;
  completedRows: boolean[];
  onToggleRowComplete: (row: number) => void;
  onResetProgress: () => void;
  darkBead: BeadColorCode;
  lightBead: BeadColorCode;
  isMirrored?: boolean;
  beadSize?: BeadSizeSpec;
}

export function BeadTrackerBar({
  matrix,
  dimension,
  currentRow,
  onRowChange,
  completedRows,
  onToggleRowComplete,
  onResetProgress,
  darkBead,
  lightBead,
  isMirrored = false,
  beadSize = '5.0mm'
}: BeadTrackerBarProps) {
  const [copiedNotification, setCopiedNotification] = useState(false);

  // If matrix is empty, return null
  if (dimension === 0 || !matrix[currentRow]) return null;

  // If mirrored, the row in physical craft matches display
  // We mirror the row sequence so what crafters read from left to right matches the flipped canvas!
  const effectiveMatrix = isMirrored
    ? matrix.map(row => [...row].reverse())
    : matrix;

  const analysis: RowAnalysis = analyzeRow(effectiveMatrix, currentRow);
  const stats = computeProgressStats(matrix, completedRows);
  const isCurrentDone = !!completedRows[currentRow];

  // Handle keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentRow < dimension - 1) {
          onRowChange(currentRow + 1);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentRow > 0) {
          onRowChange(currentRow - 1);
        }
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        onToggleRowComplete(currentRow);
        if (!isCurrentDone && currentRow < dimension - 1) {
          onRowChange(currentRow + 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentRow, dimension, isCurrentDone, onRowChange, onToggleRowComplete]);

  return (
    <div className="bg-white border-2 border-black p-3.5 sm:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3 font-sans">
      
      {/* Header: Title & Progress Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-yellow-300 border border-black text-black">
            <ListOrdered className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-black">
                Live Beading Companion (逐行穿豆助手)
              </h3>
              {isMirrored && (
                <span className="text-[9px] font-black uppercase bg-red-100 text-red-700 px-1.5 py-0.5 border border-red-400">
                  Mirrored L➔R
                </span>
              )}
            </div>
            <p className="text-[10px] text-gray-500 font-medium">
              Keyboard: <kbd className="px-1 py-0.5 bg-gray-100 border border-black/20 text-[9px]">↑ / ↓</kbd> switch row,{' '}
              <kbd className="px-1 py-0.5 bg-gray-100 border border-black/20 text-[9px]">Space</kbd> mark done
            </p>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="text-right">
            <div className="text-xs font-black text-black font-mono">
              {stats.completedRowCount} / {stats.totalRows} Rows ({stats.percent}%)
            </div>
            <div className="text-[10px] text-gray-500 font-mono">
              {stats.completedBeads} / {stats.totalBeads} beads placed
            </div>
          </div>
          <button
            type="button"
            onClick={onResetProgress}
            className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 border border-gray-300 transition-colors cursor-pointer"
            title="Reset Beading Progress"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Bar Line */}
      <div className="w-full bg-gray-100 h-2 border border-black overflow-hidden relative">
        <div
          className="bg-red-500 h-full transition-all duration-300 ease-out"
          style={{ width: `${stats.percent}%` }}
        />
      </div>

      {/* Row Stepper Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-gray-50 p-2.5 border border-black">
        <div className="flex items-center gap-2">
          {/* Previous Row */}
          <button
            type="button"
            disabled={currentRow === 0}
            onClick={() => onRowChange(Math.max(0, currentRow - 1))}
            className="px-2.5 py-1.5 bg-white border border-black text-xs font-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition-all flex items-center gap-1 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Prev Row</span>
          </button>

          {/* Current Row Badge */}
          <div className="px-3 py-1 bg-black text-white font-mono font-black text-xs border border-black flex items-center gap-1.5">
            <span>ROW</span>
            <span className="text-yellow-300 text-sm">{(currentRow + 1).toString().padStart(2, '0')}</span>
            <span className="text-gray-400">/ {dimension}</span>
          </div>

          {/* Next Row */}
          <button
            type="button"
            disabled={currentRow === dimension - 1}
            onClick={() => onRowChange(Math.min(dimension - 1, currentRow + 1))}
            className="px-2.5 py-1.5 bg-white border border-black text-xs font-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition-all flex items-center gap-1 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
          >
            <span className="hidden sm:inline">Next Row</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mark Row Complete Button */}
        <button
          type="button"
          onClick={() => {
            onToggleRowComplete(currentRow);
            if (!isCurrentDone && currentRow < dimension - 1) {
              onRowChange(currentRow + 1);
            }
          }}
          className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider transition-all border-2 border-black flex items-center gap-1.5 cursor-pointer ${
            isCurrentDone
              ? 'bg-emerald-500 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              : 'bg-yellow-300 text-black hover:bg-yellow-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
          }`}
        >
          {isCurrentDone ? (
            <>
              <Check className="w-4 h-4 text-white stroke-[3]" />
              <span>Row Completed</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Done & Advance</span>
            </>
          )}
        </button>
      </div>

      {/* Bead Run Sequence (Run-Length Beads Callout) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-gray-600">
          <span>
            Beads Sequence for Row {currentRow + 1} ({isMirrored ? 'Left ➔ Right' : 'Left ➔ Right'}):
          </span>
          <span className="font-mono font-bold text-black">
            {analysis.darkCount} Dark &bull; {analysis.lightCount} White (Total {analysis.total})
          </span>
        </div>

        {/* Sequence Pills */}
        <div className="flex flex-wrap gap-1.5 items-center p-2.5 bg-gray-50 border border-black min-h-[48px]">
          {analysis.runs.map((run, idx) => {
            const isDark = run.color === 'dark';
            return (
              <div
                key={idx}
                className={`flex items-center gap-1.5 px-2.5 py-1 border-2 border-black font-mono text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform hover:scale-105 ${
                  isDark
                    ? 'bg-black text-white'
                    : 'bg-white text-black'
                }`}
                title={`Beads ${run.startIndex + 1} to ${run.endIndex + 1}`}
              >
                {/* Bead Color Indicator Dot */}
                <span
                  className="w-3 h-3 rounded-full border border-black shrink-0 inline-block shadow-inner"
                  style={{ backgroundColor: isDark ? darkBead.hex : lightBead.hex }}
                />
                <span className="text-sm">{run.count}</span>
                <span className="text-[10px] font-sans font-normal opacity-75">
                  {isDark ? 'Dark' : 'White'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row Quick Selector Grid (Mini bar at bottom to quickly jump to any row) */}
      <div className="pt-1 border-t border-gray-200">
        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-wider text-gray-500 mb-1">
          <span>Jump to Row (Click cell):</span>
          <span>{stats.completedRowCount} of {dimension} Finished</span>
        </div>
        <div className="grid grid-cols-29 gap-0.5 overflow-x-auto pb-1">
          {Array.from({ length: dimension }).map((_, r) => {
            const isSelected = r === currentRow;
            const isDone = !!completedRows[r];
            return (
              <button
                key={r}
                type="button"
                onClick={() => onRowChange(r)}
                className={`h-5 min-w-[14px] text-[8px] font-mono font-bold flex items-center justify-center transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-red-500 text-white border-black z-10 scale-110 font-black'
                    : isDone
                    ? 'bg-emerald-200 text-emerald-950 border-emerald-500'
                    : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                }`}
                title={`Row ${r + 1} ${isDone ? '(Done)' : ''}`}
              >
                {r + 1}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
