import { useState, useEffect, useRef } from 'react';
import { BeadSizeSpec, IroningStep } from '../../types';
import { playChimeSound } from '../../utils/audioChime';
import {
  X,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  BookOpen,
  Camera,
  Layers,
  Volume2
} from 'lucide-react';

interface IroningAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  beadSize: BeadSizeSpec;
  t: any;
}

export function IroningAssistantModal({
  isOpen,
  onClose,
  beadSize,
  t
}: IroningAssistantModalProps) {
  const [currentStep, setCurrentStep] = useState<IroningStep>('checklist');

  // Checklist items
  const [checks, setChecks] = useState({
    tapeApplied: false,
    holesPoked: false,
    boardRemoved: false,
    parchmentReady: false,
    steamOff: false
  });

  // Active Ironing Timer
  const defaultDuration = beadSize === '2.6mm' ? 15 : 30;
  const [timeLeft, setTimeLeft] = useState<number>(defaultDuration);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  // Cooling timer (in seconds, default 15 mins = 900s, with quick 60s testing mode)
  const [coolingTimeLeft, setCoolingTimeLeft] = useState<number>(900);
  const [coolingRunning, setCoolingRunning] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset timers when modal opens or bead size changes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('checklist');
      setTimeLeft(beadSize === '2.6mm' ? 15 : 30);
      setTimerRunning(false);
      setCoolingTimeLeft(900);
      setCoolingRunning(false);
    }
  }, [isOpen, beadSize]);

  // Ironing timer effect
  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timerRunning && timeLeft === 0) {
      setTimerRunning(false);
      playChimeSound();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timerRunning, timeLeft]);

  // Cooling timer effect
  useEffect(() => {
    let coolingInterval: NodeJS.Timeout | null = null;
    if (coolingRunning && coolingTimeLeft > 0) {
      coolingInterval = setTimeout(() => {
        setCoolingTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (coolingRunning && coolingTimeLeft === 0) {
      setCoolingRunning(false);
      playChimeSound();
    }
    return () => {
      if (coolingInterval) clearTimeout(coolingInterval);
    };
  }, [coolingRunning, coolingTimeLeft]);

  if (!isOpen) return null;

  const allChecked = Object.values(checks).every(Boolean);

  const toggleCheck = (key: keyof typeof checks) => {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const resetIroningTimer = () => {
    setTimerRunning(false);
    setTimeLeft(beadSize === '2.6mm' ? 15 : 30);
  };

  const progressPercent = ((defaultDuration - timeLeft) / defaultDuration) * 100;
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const formatCoolingTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b-3 border-black bg-gradient-to-r from-red-500 to-amber-400 text-white">
          <div className="flex items-center gap-2.5">
            <Flame className="w-6 h-6 text-yellow-300 shrink-0" />
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-white">
                Ironing & Cooling Studio (熨烫与压平向导)
              </h2>
              <p className="text-[11px] text-yellow-100 font-medium font-sans">
                The Flat Melt Method: Single-sided fusion for zero camera reflection
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 bg-black hover:bg-white hover:text-black text-white border-2 border-black transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Step Indicator Tabs */}
        <div className="grid grid-cols-4 border-b-2 border-black bg-gray-100 text-xs font-black uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setCurrentStep('checklist')}
            className={`py-2 px-1 text-center border-r border-black cursor-pointer ${
              currentStep === 'checklist' ? 'bg-black text-white' : 'hover:bg-gray-200 text-gray-700'
            }`}
          >
            1. Prep
          </button>
          <button
            type="button"
            onClick={() => setCurrentStep('ironing')}
            className={`py-2 px-1 text-center border-r border-black cursor-pointer ${
              currentStep === 'ironing' ? 'bg-black text-white' : 'hover:bg-gray-200 text-gray-700'
            }`}
          >
            2. Iron ({beadSize})
          </button>
          <button
            type="button"
            onClick={() => setCurrentStep('cooling')}
            className={`py-2 px-1 text-center border-r border-black cursor-pointer ${
              currentStep === 'cooling' ? 'bg-black text-white' : 'hover:bg-gray-200 text-gray-700'
            }`}
          >
            3. Cool Down
          </button>
          <button
            type="button"
            onClick={() => setCurrentStep('complete')}
            className={`py-2 px-1 text-center cursor-pointer ${
              currentStep === 'complete' ? 'bg-black text-white' : 'hover:bg-gray-200 text-gray-700'
            }`}
          >
            4. Scan
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* STEP 1: PRE-IRONING CHECKLIST */}
          {currentStep === 'checklist' && (
            <div className="space-y-4">
              <div className="p-3 bg-red-50 border-2 border-red-300 text-xs text-red-900 flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5 font-sans">
                  <strong className="font-black uppercase tracking-wider block">Critical Safety Notice</strong>
                  <span>
                    Never iron directly on plastic pegboards! The heat will warp your pegboard pins permanently. Use the Blue Painter's Tape Method to lift the beads first.
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="flex items-start gap-3 p-3 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={checks.tapeApplied}
                    onChange={() => toggleCheck('tapeApplied')}
                    className="w-4 h-4 mt-0.5 accent-red-500 rounded-none cursor-pointer"
                  />
                  <div className="text-xs space-y-0.5">
                    <strong className="text-black uppercase font-black tracking-wider block">
                      1. Blue Painter's Tape Applied
                    </strong>
                    <p className="text-gray-600 font-sans">
                      Tape strips overlap by 3-5mm. Firmly burnished with a plastic card to anchor every bead.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={checks.holesPoked}
                    onChange={() => toggleCheck('holesPoked')}
                    className="w-4 h-4 mt-0.5 accent-red-500 rounded-none cursor-pointer"
                  />
                  <div className="text-xs space-y-0.5">
                    <strong className="text-black uppercase font-black tracking-wider block">
                      2. Air Vent Holes Poked
                    </strong>
                    <p className="text-gray-600 font-sans">
                      Poked through the tape for every bead using a spare pegboard or needle to prevent air blowout blowholes.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={checks.boardRemoved}
                    onChange={() => toggleCheck('boardRemoved')}
                    className="w-4 h-4 mt-0.5 accent-red-500 rounded-none cursor-pointer"
                  />
                  <div className="text-xs space-y-0.5">
                    <strong className="text-black uppercase font-black tracking-wider block">
                      3. Pegboard Safely Removed
                    </strong>
                    <p className="text-gray-600 font-sans">
                      Flipped the taped design over and lifted the plastic board away. The pattern is now resting on an iron-safe surface.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={checks.parchmentReady}
                    onChange={() => toggleCheck('parchmentReady')}
                    className="w-4 h-4 mt-0.5 accent-red-500 rounded-none cursor-pointer"
                  />
                  <div className="text-xs space-y-0.5">
                    <strong className="text-black uppercase font-black tracking-wider block">
                      4. Parchment Paper Placed on Top
                    </strong>
                    <p className="text-gray-600 font-sans">
                      Standard unbleached baker's parchment or Perler reusable ironing sheet placed flat over beads.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={checks.steamOff}
                    onChange={() => toggleCheck('steamOff')}
                    className="w-4 h-4 mt-0.5 accent-red-500 rounded-none cursor-pointer"
                  />
                  <div className="text-xs space-y-0.5">
                    <strong className="text-black uppercase font-black tracking-wider block">
                      5. Iron Steam Turned OFF (Dry Heat Only)
                    </strong>
                    <p className="text-gray-600 font-sans">
                      Iron dial set to MEDIUM (wool/cotton). Steam water reservoir emptied or steam switch strictly off.
                    </p>
                  </div>
                </label>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep('ironing')}
                  className={`px-6 py-3 text-xs font-black uppercase tracking-wider border-2 border-black flex items-center gap-2 cursor-pointer transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 ${
                    allChecked ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  <span>Ready to Iron ➔</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ACTIVE CIRCULAR PACING TIMER */}
          {currentStep === 'ironing' && (
            <div className="space-y-6 text-center">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-50 px-2 py-0.5 border border-red-300 inline-block">
                  {beadSize === '2.6mm' ? '2.6MM MINI SPEC (15 SEC)' : '5.0MM MIDI SPEC (30 SEC)'}
                </span>
                <h3 className="text-lg font-black uppercase text-black">
                  Circular Pacing Ironing Motion
                </h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto font-sans">
                  Move iron in gentle, smooth clockwise circular motions without excessive downward force.
                </p>
              </div>

              {/* Circular Countdown Dial */}
              <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="88"
                    cy="88"
                    r={radius}
                    stroke="#E5E7EB"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="88"
                    cy="88"
                    r={radius}
                    stroke="#EF4444"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="square"
                    className="transition-all duration-300"
                  />
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-black">
                  <span className="text-4xl font-black font-mono tracking-tighter">
                    {timeLeft}s
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 mt-0.5">
                    {timerRunning ? 'Ironing...' : timeLeft === 0 ? 'Done! Chime!' : 'Ready'}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setTimerRunning(!timerRunning)}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-black text-xs uppercase tracking-wider border-2 border-black flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                >
                  {timerRunning ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>{timeLeft === 0 ? 'Start Again' : 'Start Ironing'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={resetIroningTimer}
                  className="p-3 bg-white hover:bg-gray-100 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => playChimeSound()}
                  className="p-3 bg-white hover:bg-gray-100 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                  title="Test Chime Audio"
                >
                  <Volume2 className="w-4 h-4 text-gray-700" />
                </button>
              </div>

              {/* Single-sided reminder */}
              <div className="p-3 bg-yellow-50 border-2 border-black text-xs text-yellow-900 text-left flex items-start gap-2.5 max-w-lg mx-auto shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-sans">
                <Sparkles className="w-4 h-4 text-black shrink-0 mt-0.5" />
                <div>
                  <strong className="font-black uppercase tracking-wide block text-black">
                    Single-Sided Flat Melt Rule:
                  </strong>
                  <span>
                    Melt the BACK side until fully fused. Do NOT iron the front! Keeping front bead holes round and un-melted prevents camera glare, specular reflections, and distortion.
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep('checklist')}
                  className="text-xs font-black uppercase text-gray-600 hover:text-black underline cursor-pointer"
                >
                  Back to Prep
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep('cooling');
                    setCoolingRunning(true);
                  }}
                  className="px-5 py-2.5 bg-black text-white hover:bg-red-500 font-black text-xs uppercase tracking-wider border-2 border-black flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_0px_rgba(239,68,68,1)]"
                >
                  <span>Proceed to Cooling ➔</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PLANAR COOLING */}
          {currentStep === 'cooling' && (
            <div className="space-y-6 text-center">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 border border-blue-300 inline-block">
                  WEIGHTED PLANAR COOLING
                </span>
                <h3 className="text-lg font-black uppercase text-black">
                  Cooling Under Heavy Books
                </h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto font-sans">
                  Plastic shrinks as it cools. Keeping it weighted prevents upward curling and warping.
                </p>
              </div>

              {/* Cooling Countdown */}
              <div className="bg-gray-50 border-2 border-black p-6 max-w-sm mx-auto space-y-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-4xl font-black font-mono tracking-tighter text-black">
                  {formatCoolingTime(coolingTimeLeft)}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCoolingRunning(!coolingRunning)}
                    className="px-4 py-1.5 bg-black text-white text-xs font-black uppercase tracking-wider border border-black hover:bg-gray-800 cursor-pointer"
                  >
                    {coolingRunning ? 'Pause' : 'Start Cooling Timer'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoolingTimeLeft(60)}
                    className="px-2.5 py-1.5 bg-white text-gray-700 text-[10px] font-mono border border-black hover:bg-gray-100 cursor-pointer"
                    title="Quick 60s Test"
                  >
                    1 min test
                  </button>
                </div>
              </div>

              {/* Diagram / Instruction Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-lg mx-auto">
                <div className="p-3 bg-white border-2 border-black space-y-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs">
                  <div className="flex items-center gap-1.5 font-black uppercase text-black">
                    <BookOpen className="w-4 h-4 text-red-500" />
                    <span>Heavy Press (2-5 kg)</span>
                  </div>
                  <p className="text-gray-600 font-sans text-[11px]">
                    Place a marble board, heavy dictionary, or encyclopedia directly over the warm parchment.
                  </p>
                </div>

                <div className="p-3 bg-white border-2 border-black space-y-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs">
                  <div className="flex items-center gap-1.5 font-black uppercase text-black">
                    <Layers className="w-4 h-4 text-blue-500" />
                    <span>Peel When Cold</span>
                  </div>
                  <p className="text-gray-600 font-sans text-[11px]">
                    Do not peel the blue painter's tape while warm. Wait until fully cooled to room temperature.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep('ironing')}
                  className="text-xs font-black uppercase text-gray-600 hover:text-black underline cursor-pointer"
                >
                  Back to Ironing
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep('complete')}
                  className="px-5 py-2.5 bg-emerald-500 text-black hover:bg-emerald-400 font-black text-xs uppercase tracking-wider border-2 border-black flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                >
                  <span>Ready to Scan! ➔</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SCAN & CELEBRATION */}
          {currentStep === 'complete' && (
            <div className="space-y-5 text-center">
              <div className="w-16 h-16 bg-yellow-300 border-3 border-black mx-auto flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Camera className="w-8 h-8 text-black" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black uppercase text-black">
                  Craft Complete! Ready for Scanning
                </h3>
                <p className="text-xs text-gray-700 max-w-md mx-auto font-sans">
                  Peel the blue tape gently at a 45-degree angle. Your physical fuse bead QR code is complete!
                </p>
              </div>

              <div className="bg-gray-50 border-2 border-black p-4 text-left space-y-2 max-w-md mx-auto shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-xs font-sans">
                <strong className="font-black uppercase tracking-wider block text-black">
                  Instant Scanning Quick Tips:
                </strong>
                <ul className="list-disc pl-4 space-y-1 text-gray-700">
                  <li>Hold phone camera 20-30 cm directly above the bead art.</li>
                  <li>Avoid direct overhead flashlight or spotlight glare.</li>
                  <li>Scan the front face (the side with open round holes).</li>
                </ul>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3 bg-black text-white hover:bg-red-500 font-black text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] cursor-pointer"
                >
                  Finish & Return to Canvas
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
