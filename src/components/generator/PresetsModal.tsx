import { useState } from 'react';
import { PresetTemplate, InputMode, ErrorCorrectionLevel, BeadSizeSpec } from '../../types';
import { PRESET_TEMPLATES } from '../../data/presets';
import { DARK_BEAD_OPTIONS } from '../../utils/beadColors';
import {
  X,
  Sparkles,
  Wifi,
  Share2,
  Music,
  HeartHandshake,
  Coffee,
  Heart,
  ArrowRight,
  Check
} from 'lucide-react';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: PresetTemplate) => void;
  t: any;
}

export function PresetsModal({
  isOpen,
  onClose,
  onSelectPreset,
  t
}: PresetsModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [appliedId, setAppliedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Presets' },
    { id: 'wifi', label: 'Guest Wi-Fi' },
    { id: 'social', label: 'Social & Bio' },
    { id: 'music', label: 'Music & Song' },
    { id: 'emergency', label: 'Pet & ICE' },
    { id: 'crypto', label: 'Tip & Pay' },
    { id: 'secret', label: 'Secret Note' }
  ];

  const filtered = selectedCategory === 'all'
    ? PRESET_TEMPLATES
    : PRESET_TEMPLATES.filter(p => p.category === selectedCategory);

  const handleApply = (preset: PresetTemplate) => {
    setAppliedId(preset.id);
    onSelectPreset(preset);
    setTimeout(() => {
      setAppliedId(null);
      onClose();
    }, 600);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'wifi':
        return <Wifi className="w-4 h-4 text-blue-600" />;
      case 'social':
        return <Share2 className="w-4 h-4 text-purple-600" />;
      case 'music':
        return <Music className="w-4 h-4 text-emerald-600" />;
      case 'emergency':
        return <HeartHandshake className="w-4 h-4 text-red-600" />;
      case 'crypto':
        return <Coffee className="w-4 h-4 text-amber-600" />;
      case 'secret':
        return <Heart className="w-4 h-4 text-pink-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-yellow-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b-3 border-black bg-yellow-300">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-red-600" />
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-black">
                Preset Inspiration Library (模板灵感库)
              </h2>
              <p className="text-[11px] text-gray-800 font-medium">
                Tested real-world QR payloads pre-tuned for 29×29 pegboards
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

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 p-3 border-b-2 border-black bg-gray-50 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 text-xs font-black uppercase tracking-wider border-2 border-black whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(239,68,68,1)]'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Template Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(preset => {
            const isJustApplied = appliedId === preset.id;
            const darkColor = DARK_BEAD_OPTIONS.find(c => c.id === preset.recommendedDarkColorId) || DARK_BEAD_OPTIONS[0];

            return (
              <div
                key={preset.id}
                className="bg-white border-2 border-black p-4 flex flex-col justify-between space-y-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 pb-1.5">
                    <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black">
                      {getCategoryIcon(preset.category)}
                      <span>{preset.title}</span>
                    </span>
                    <span className="text-[9px] font-black uppercase bg-red-50 text-red-700 px-2 py-0.5 border border-red-200">
                      {preset.badge}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 font-sans leading-relaxed">
                    {preset.description}
                  </p>
                </div>

                {/* Preset Specs Summary */}
                <div className="flex items-center gap-2 text-[10px] font-mono text-gray-600 bg-gray-50 p-2 border border-gray-300">
                  <span className="flex items-center gap-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black"
                      style={{ backgroundColor: darkColor.hex }}
                    />
                    <span>{darkColor.name}</span>
                  </span>
                  <span>&bull;</span>
                  <span>ECC {preset.recommendedEcl}</span>
                  <span>&bull;</span>
                  <span>{preset.recommendedBeadSize}</span>
                </div>

                {/* Apply Button */}
                <button
                  type="button"
                  onClick={() => handleApply(preset)}
                  className={`w-full py-2 px-3 text-xs font-black uppercase tracking-wider border-2 border-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 ${
                    isJustApplied
                      ? 'bg-emerald-400 text-black'
                      : 'bg-black text-white hover:bg-red-500'
                  }`}
                >
                  {isJustApplied ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Loaded into Generator!</span>
                    </>
                  ) : (
                    <>
                      <span>Apply Preset</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Modal Footer Tip */}
        <div className="p-3 bg-gray-100 border-t-2 border-black text-[11px] text-gray-700 flex items-center justify-between font-sans">
          <span>All presets automatically fit standard 29×29 interlocking pegboards.</span>
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
