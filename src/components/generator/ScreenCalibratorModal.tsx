import { useState, useEffect, ChangeEvent } from 'react';
import { CreditCard, Ruler, X, Check, RotateCcw, Sparkles } from 'lucide-react';
import { BeadSizeSpec } from '../../types';

interface ScreenCalibratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  beadSize: BeadSizeSpec;
  currentScaleFactor: number;
  onUpdateScaleFactor: (factor: number) => void;
  t: any;
}

export function ScreenCalibratorModal({
  isOpen,
  onClose,
  beadSize,
  currentScaleFactor,
  onUpdateScaleFactor,
  t
}: ScreenCalibratorModalProps) {
  // Base visual width in pixels for the card outline (approx 320px on standard 96dpi screen)
  const baseCardWidthPx = 324;
  const [scale, setScale] = useState<number>(currentScaleFactor || 1.0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setScale(currentScaleFactor || 1.0);
    }
  }, [isOpen, currentScaleFactor]);

  if (!isOpen) return null;

  const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setScale(val);
  };

  const handleSave = () => {
    onUpdateScaleFactor(scale);
    try {
      localStorage.setItem('scanbeads_screen_scale_factor', scale.toString());
    } catch {
      // ignore
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const handleReset = () => {
    setScale(1.0);
    onUpdateScaleFactor(1.0);
    try {
      localStorage.removeItem('scanbeads_screen_scale_factor');
    } catch {
      // ignore
    }
  };

  const cardWidth = Math.round(baseCardWidthPx * scale);
  const cardHeight = Math.round(cardWidth * (53.98 / 85.6));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b-3 border-black bg-yellow-300">
          <div className="flex items-center gap-2.5">
            <Ruler className="w-5 h-5 text-black" />
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-black">
                Screen-to-Pegboard Calibrator (屏幕 1:1 垫板校准)
              </h2>
              <p className="text-[11px] text-gray-800 font-medium">
                Calibrate iPad or monitor display so clear pegboards match 100% on screen
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 bg-white hover:bg-red-500 hover:text-white border-2 border-black transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6 text-center">
          
          <div className="p-3 bg-gray-50 border-2 border-black text-left text-xs font-sans space-y-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <strong className="font-black uppercase tracking-wider text-black block">
              Instructions:
            </strong>
            <p className="text-gray-700">
              Hold a standard plastic credit card or ID card directly against the screen. Drag the slider until the black card frame below matches the exact size of your physical card.
            </p>
          </div>

          {/* Interactive Credit Card Outline */}
          <div className="py-2 flex items-center justify-center">
            <div
              style={{ width: `${cardWidth}px`, height: `${cardHeight}px` }}
              className="border-3 border-dashed border-red-500 rounded-xl bg-red-50/50 flex flex-col items-center justify-center relative shadow-md transition-all select-none"
            >
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black">
                <CreditCard className="w-5 h-5 text-red-600" />
                <span>Standard Credit Card (85.6 mm)</span>
              </div>
              <span className="text-[10px] font-mono text-gray-500 mt-1">
                Width: {cardWidth}px &bull; Scale: {Math.round(scale * 100)}%
              </span>
              <span className="absolute bottom-2 text-[9px] font-sans text-red-700 font-bold">
                Place physical card over this frame
              </span>
            </div>
          </div>

          {/* Scale Slider */}
          <div className="space-y-2 max-w-md mx-auto">
            <div className="flex items-center justify-between text-xs font-black uppercase text-gray-700">
              <span>Smaller (70%)</span>
              <span className="text-black font-mono text-sm bg-yellow-300 px-2 py-0.5 border border-black">
                {Math.round(scale * 100)}%
              </span>
              <span>Larger (140%)</span>
            </div>
            <input
              type="range"
              min="0.70"
              max="1.40"
              step="0.01"
              value={scale}
              onChange={handleSliderChange}
              className="w-full accent-red-500 cursor-pointer h-2 bg-gray-200 rounded-lg appearance-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleSave}
              className={`px-6 py-3 text-xs font-black uppercase tracking-wider border-2 border-black flex items-center gap-2 transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 ${
                savedSuccess ? 'bg-emerald-400 text-black' : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Calibrated & Saved!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>Save Calibration</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-3 bg-white hover:bg-gray-100 text-black text-xs font-black uppercase tracking-wider border-2 border-black flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
              title="Reset scale"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-100 border-t-2 border-black text-[11px] text-gray-700 flex items-center justify-between font-sans">
          <span>Targeting {beadSize} ({beadSize === '2.6mm' ? 'Artkal/Perler Mini' : 'Standard Midi'}) pegboard spacing.</span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-black uppercase tracking-wider text-black underline hover:text-red-500 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
