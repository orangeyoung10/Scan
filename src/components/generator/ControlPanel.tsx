import { useState } from 'react';
import {
  InputMode,
  ErrorCorrectionLevel,
  ColorMode,
  WifiData,
  VCardData,
  QrMatrixResult,
  BeadColorCode,
  BeadSizeSpec
} from '../../types';
import { DARK_BEAD_OPTIONS, STANDARD_WHITE_BEAD } from '../../utils/beadColors';
import { assessBeadContrast } from '../../utils/colorContrast';
import { generateBeadShoppingText } from '../../utils/beadTracker';
import {
  Link as LinkIcon,
  Wifi,
  Contact,
  HelpCircle,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Layers,
  Ruler,
  AlertTriangle,
  CheckCircle2,
  Grid,
  ClipboardCopy,
  Check,
  Bookmark
} from 'lucide-react';

interface ControlPanelProps {
  mode: InputMode;
  onModeChange: (mode: InputMode) => void;
  urlText: string;
  onUrlTextChange: (val: string) => void;
  wifi: WifiData;
  onWifiChange: (val: WifiData) => void;
  vcard: VCardData;
  onVCardChange: (val: VCardData) => void;
  ecl: ErrorCorrectionLevel;
  onEclChange: (val: ErrorCorrectionLevel) => void;
  colorMode: ColorMode;
  onColorModeChange: (val: ColorMode) => void;
  darkBead: BeadColorCode;
  onDarkBeadChange: (bead: BeadColorCode) => void;
  beadSize: BeadSizeSpec;
  onBeadSizeChange: (size: BeadSizeSpec) => void;
  matrixResult: QrMatrixResult;
  onExportPdf: () => void;
  onExportPng: (withCoordinates: boolean) => void;
  onOpenPresets?: () => void;
  onOpenSavedPatterns?: () => void;
  t: any;
}

export function ControlPanel({
  mode,
  onModeChange,
  urlText,
  onUrlTextChange,
  wifi,
  onWifiChange,
  vcard,
  onVCardChange,
  ecl,
  onEclChange,
  colorMode,
  onColorModeChange,
  darkBead,
  onDarkBeadChange,
  beadSize,
  onBeadSizeChange,
  matrixResult,
  onExportPdf,
  onExportPng,
  onOpenPresets,
  onOpenSavedPatterns,
  t
}: ControlPanelProps) {
  const [copiedBOM, setCopiedBOM] = useState(false);

  const handleCopyBOM = () => {
    const text = generateBeadShoppingText(matrixResult, darkBead, STANDARD_WHITE_BEAD, beadSize);
    navigator.clipboard.writeText(text);
    setCopiedBOM(true);
    setTimeout(() => setCopiedBOM(false), 2500);
  };
  const [showEclTooltip, setShowEclTooltip] = useState(false);

  // Compute character length for current tab
  const getCharCount = (): number => {
    if (mode === 'url') return urlText.length;
    if (mode === 'wifi') return (wifi.ssid + wifi.password).length;
    return (vcard.fullName + vcard.phone + vcard.email).length;
  };

  const charCount = getCharCount();
  const isCharWarning = charCount > 100;

  return (
    <div className="flex flex-col gap-6 bg-white border-2 sm:border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black">
      
      {/* 1. Input Mode Tabs */}
      <div>
        <div className="flex items-center justify-between border-b-2 border-gray-200 mb-4 flex-wrap gap-2">
          <div className="flex gap-4">
            <button
              onClick={() => onModeChange('url')}
              className={`pb-2 px-1 text-xs sm:text-sm font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === 'url'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-400 hover:text-black'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5 text-red-500" />
              <span>{t.generator.tab_url}</span>
            </button>

            <button
              onClick={() => onModeChange('wifi')}
              className={`pb-2 px-1 text-xs sm:text-sm font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === 'wifi'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-400 hover:text-black'
              }`}
            >
              <Wifi className="w-3.5 h-3.5 text-red-500" />
              <span>{t.generator.tab_wifi}</span>
            </button>

            <button
              onClick={() => onModeChange('vcard')}
              className={`pb-2 px-1 text-xs sm:text-sm font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === 'vcard'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-400 hover:text-black'
              }`}
            >
              <Contact className="w-3.5 h-3.5 text-red-500" />
              <span>{t.generator.tab_vcard}</span>
            </button>
          </div>

          {/* Quick Presets / Saved Access */}
          <div className="flex items-center gap-1.5 pb-2">
            {onOpenPresets && (
              <button
                type="button"
                onClick={onOpenPresets}
                className="px-2 py-0.5 bg-yellow-300 hover:bg-yellow-400 text-black text-[10px] font-black uppercase tracking-wider border border-black flex items-center gap-1 cursor-pointer shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
                title="Browse preset templates"
              >
                <Sparkles className="w-3 h-3 text-black" />
                <span>Presets</span>
              </button>
            )}
            {onOpenSavedPatterns && (
              <button
                type="button"
                onClick={onOpenSavedPatterns}
                className="px-2 py-0.5 bg-white hover:bg-gray-100 text-black text-[10px] font-black uppercase tracking-wider border border-black flex items-center gap-1 cursor-pointer shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
                title="Pattern Library & Saves"
              >
                <Bookmark className="w-3 h-3 text-red-500" />
                <span>Saved</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab 1: URL/Text Fields */}
        {mode === 'url' && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
              <label htmlFor="url-input">
                {t.generator.input_url_label}
              </label>
              <span className={`font-mono text-xs ${isCharWarning ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                {charCount} / 120 {t.generator.input_char_counter}
              </span>
            </div>
            <input
              id="url-input"
              type="text"
              value={urlText}
              onChange={e => onUrlTextChange(e.target.value)}
              placeholder={t.generator.input_url_placeholder}
              maxLength={150}
              className="w-full border-2 border-black p-3 font-mono text-sm focus:outline-none focus:bg-yellow-50 bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors"
            />
            {isCharWarning && (
              <p className="flex items-center gap-1 text-[11px] font-bold text-red-500 pt-0.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{t.generator.input_char_warning}</span>
              </p>
            )}
          </div>
        )}

        {/* Tab 2: WiFi Setup */}
        {mode === 'wifi' && (
          <div className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="wifi-ssid" className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                {t.generator.wifi_ssid_label}
              </label>
              <input
                id="wifi-ssid"
                type="text"
                value={wifi.ssid}
                onChange={e => onWifiChange({ ...wifi, ssid: e.target.value })}
                placeholder={t.generator.wifi_ssid_placeholder}
                className="w-full border-2 border-black p-2.5 font-mono text-sm focus:outline-none focus:bg-yellow-50 bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="wifi-pass" className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                {t.generator.wifi_password_label}
              </label>
              <input
                id="wifi-pass"
                type="text"
                value={wifi.password}
                onChange={e => onWifiChange({ ...wifi, password: e.target.value })}
                placeholder={t.generator.wifi_password_placeholder}
                className="w-full border-2 border-black p-2.5 font-mono text-sm focus:outline-none focus:bg-yellow-50 bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>

            <div className="flex items-center justify-between pt-1 text-xs font-bold">
              <span className="text-gray-600 uppercase text-[10px] font-black tracking-wider">{t.generator.wifi_encryption_label}:</span>
              <div className="flex items-center gap-1.5">
                {(['WPA', 'WEP', 'nopass'] as const).map(enc => (
                  <button
                    key={enc}
                    type="button"
                    onClick={() => onWifiChange({ ...wifi, encryption: enc })}
                    className={`px-2.5 py-1 text-xs font-black uppercase transition-all cursor-pointer border-2 border-black ${
                      wifi.encryption === enc
                        ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(239,68,68,1)]'
                        : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    {enc === 'nopass' ? 'None' : enc}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: vCard */}
        {mode === 'vcard' && (
          <div className="space-y-2.5">
            <div className="space-y-1">
              <label htmlFor="vcard-name" className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                {t.generator.vcard_name_label}
              </label>
              <input
                id="vcard-name"
                type="text"
                value={vcard.fullName}
                onChange={e => onVCardChange({ ...vcard, fullName: e.target.value })}
                placeholder={t.generator.vcard_name_placeholder}
                className="w-full border-2 border-black p-2 font-mono text-sm bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-yellow-50"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="vcard-phone" className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                {t.generator.vcard_phone_label}
              </label>
              <input
                id="vcard-phone"
                type="text"
                value={vcard.phone}
                onChange={e => onVCardChange({ ...vcard, phone: e.target.value })}
                placeholder={t.generator.vcard_phone_placeholder}
                className="w-full border-2 border-black p-2 font-mono text-sm bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-yellow-50"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="vcard-email" className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                {t.generator.vcard_email_label}
              </label>
              <input
                id="vcard-email"
                type="email"
                value={vcard.email}
                onChange={e => onVCardChange({ ...vcard, email: e.target.value })}
                placeholder={t.generator.vcard_email_placeholder}
                className="w-full border-2 border-black p-2 font-mono text-sm bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-yellow-50"
              />
            </div>
          </div>
        )}

        {/* Real-Time Pegboard Fit & Dimension Advisor */}
        <div className="mt-3 pt-3 border-t border-dashed border-gray-300">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="font-black uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <Grid className="w-3.5 h-3.5 text-red-500" />
              <span>Grid: <strong className="font-mono text-black">{matrixResult.dimension}×{matrixResult.dimension}</strong></span>
            </span>
            <span className="font-mono text-gray-500 text-[10px]">
              Version {matrixResult.version || 1} &bull; {matrixResult.totalBeads} beads
            </span>
          </div>

          {matrixResult.dimension <= 29 ? (
            <div className="bg-emerald-50 border border-emerald-300 p-2 text-[11px] text-emerald-950 flex items-start gap-1.5 font-sans leading-tight">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Single Pegboard Fit:</strong> Fits comfortably on 1 standard 29×29 pegboard ({matrixResult.dimension}×{matrixResult.dimension} beads). Fast to place, easy to iron!
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border-2 border-amber-500 p-2.5 text-[11px] text-amber-950 flex items-start gap-2 font-sans leading-tight shadow-[2px_2px_0px_0px_rgba(245,158,11,1)]">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-black uppercase text-[10px] text-amber-800 tracking-wider">
                  ⚠️ Requires {matrixResult.pegboardsRequired} Interlocking Pegboards
                </div>
                <p>
                  Current text generates a large {matrixResult.dimension}×{matrixResult.dimension} matrix ({matrixResult.totalBeads} beads total).
                </p>
                <p className="text-amber-900 font-bold">
                  💡 Pro-Tip: Shorten your URL (use a bit.ly/tinyurl shortlink) or WiFi password to drop down to a 21×21 or 25×25 single-board size and save 150+ beads!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Crucial Tuning: Error Correction Level (ECL) */}
      <div className="pt-2 border-t-2 border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t.generator.ecl_label}</span>
            <div className="relative">
              <button
                type="button"
                onMouseEnter={() => setShowEclTooltip(true)}
                onMouseLeave={() => setShowEclTooltip(false)}
                onClick={() => setShowEclTooltip(!showEclTooltip)}
                className="text-gray-400 hover:text-black cursor-pointer focus:outline-none"
                aria-label="ECL Info"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>

              {showEclTooltip && (
                <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-white border-2 border-black text-xs text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-30 leading-relaxed font-sans">
                  <div className="font-black text-red-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ironing Fail-Safe</span>
                  </div>
                  {t.generator.ecl_tooltip}
                </div>
              )}
            </div>
          </div>
          <span className="text-[10px] text-red-600 font-black uppercase tracking-wider">
            {ecl === 'H' ? 'Recommended for Keychains' : ecl === 'L' ? 'Recommended for Beginners' : ''}
          </span>
        </div>

        {/* 4 Levels: L, M, Q, H */}
        <div className="grid grid-cols-4 gap-2">
          {(
            [
              { level: 'L', label: '7%', desc: 'Fewest Beads' },
              { level: 'M', label: '15%', desc: 'Balanced' },
              { level: 'Q', label: '25%', desc: 'High Guard' },
              { level: 'H', label: '30%', desc: 'Anti-Damage' }
            ] as const
          ).map(item => {
            const isSelected = ecl === item.level;
            return (
              <button
                key={item.level}
                type="button"
                onClick={() => onEclChange(item.level)}
                className={`py-2 px-1 text-center transition-all cursor-pointer flex flex-col items-center justify-center border-2 border-black ${
                  isSelected
                    ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(239,68,68,1)] scale-[1.02]'
                    : 'bg-white text-black hover:bg-gray-100 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                <span className="text-xs font-black uppercase">Level {item.level}</span>
                <span className={`text-[10px] font-bold ${isSelected ? 'text-yellow-300' : 'text-gray-500'}`}>{item.label}</span>
                <span className={`text-[8px] font-medium leading-none mt-0.5 ${isSelected ? 'text-gray-200' : 'text-gray-500'}`}>{item.desc}</span>
              </button>
            );
          })}
        </div>

        {/* Contextual guidance message based on chosen ECL */}
        <div className="mt-2 p-2 bg-gray-50 border border-gray-200 text-[11px] font-sans leading-tight text-gray-700">
          {ecl === 'L' && (
            <span>
              <strong className="text-black font-bold">Level L (Fewest Beads):</strong> Produces the smallest matrix version. Ideal for quick beading, minimal bead usage, and fitting on a single 14×14cm board!
            </span>
          )}
          {ecl === 'M' && (
            <span>
              <strong className="text-black font-bold">Level M (Standard):</strong> 15% parity correction. A solid balance between compact size and camera scan reliability.
            </span>
          )}
          {ecl === 'Q' && (
            <span>
              <strong className="text-black font-bold">Level Q (High Parity):</strong> 25% error recovery. Withstands slight surface smudges or light wear.
            </span>
          )}
          {ecl === 'H' && (
            <span>
              <strong className="text-red-600 font-bold">Level H (Keychain & Wear Protection):</strong> Up to 30% redundancy. Scans reliably even if beads melt slightly unevenly or the piece gets scratched over time!
            </span>
          )}
        </div>
      </div>

      {/* 3. Color & Brand Mapping */}
      <div className="pt-2 border-t-2 border-gray-200 space-y-3">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
          <span>{t.generator.color_mode_label}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                onColorModeChange('classic');
                onDarkBeadChange(DARK_BEAD_OPTIONS[0]);
              }}
              className={`px-2 py-0.5 text-[10px] font-black uppercase transition-all cursor-pointer border ${
                colorMode === 'classic'
                  ? 'bg-black text-white border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-gray-600 border-gray-300 hover:text-black hover:border-black'
              }`}
            >
              Classic B&W
            </button>
            <button
              onClick={() => onColorModeChange('custom_dark')}
              className={`px-2 py-0.5 text-[10px] font-black uppercase transition-all cursor-pointer border ${
                colorMode === 'custom_dark'
                  ? 'bg-black text-white border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-gray-600 border-gray-300 hover:text-black hover:border-black'
              }`}
            >
              Custom Dark
            </button>
          </div>
        </div>

        {/* Color Palette Buttons */}
        <div className="flex items-center gap-2">
          {DARK_BEAD_OPTIONS.map(b => (
            <button
              key={b.id}
              type="button"
              onClick={() => {
                onDarkBeadChange(b);
                if (b.id !== 'black') onColorModeChange('custom_dark');
              }}
              title={b.name}
              className={`w-7 h-7 rounded-none border-2 border-black transition-all cursor-pointer relative flex items-center justify-center ${
                darkBead.id === b.id
                  ? 'scale-110 shadow-[2px_2px_0px_0px_rgba(239,68,68,1)]'
                  : 'hover:scale-105 opacity-85 hover:opacity-100'
              }`}
              style={{ backgroundColor: b.hex }}
            >
              <span className="w-1.5 h-1.5 bg-white border border-black" />
            </button>
          ))}
        </div>

        {/* Brand Color Code Comparison Card */}
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 p-3.5 rounded-none text-xs space-y-2">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest border-b border-gray-200 pb-1">
            <span className="text-gray-500">Brand Color Codes</span>
            <span className="text-red-500">{darkBead.name}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
            <div className="space-y-0.5">
              <span className="text-gray-500 text-[9px] font-black uppercase tracking-wider block">Perler (US)</span>
              <span className="font-mono font-black text-red-500">{darkBead.perlerCode}</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-gray-500 text-[9px] font-black uppercase tracking-wider block">Artkal (Global)</span>
              <span className="font-mono font-black text-red-500">
                {beadSize === '2.6mm' ? darkBead.artkalCode.replace(/^S/, 'C') : darkBead.artkalCode}
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-gray-500 text-[9px] font-black uppercase tracking-wider block">Hama (EU)</span>
              <span className="font-mono font-black text-red-500">{darkBead.hamaCode}</span>
            </div>
          </div>
          <div className="text-[10px] text-gray-500 font-mono pt-1 border-t border-gray-200">
            White bead code: Perler #5001 / Artkal {beadSize === '2.6mm' ? 'C02' : 'S02'} / Hama 01
          </div>
        </div>

        {/* Optical Contrast Checker (Scan Reliability Assessment) */}
        {(() => {
          const assessment = assessBeadContrast(darkBead.hex, STANDARD_WHITE_BEAD.hex);
          return (
            <div
              className={`p-3 border-2 border-black flex items-start gap-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                assessment.level === 'optimal'
                  ? 'bg-emerald-50 text-emerald-950 border-black'
                  : assessment.level === 'acceptable'
                  ? 'bg-blue-50 text-blue-950 border-black'
                  : 'bg-red-50 text-red-950 border-red-600'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {assessment.isSafe ? (
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      assessment.level === 'optimal' ? 'text-emerald-600' : 'text-blue-600'
                    }`}
                  />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                )}
              </div>
              <div className="space-y-1 text-[11px] font-sans flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-black uppercase tracking-wider text-[10px] text-black">
                    Optical Contrast: <strong className="font-mono">{assessment.ratio}:1</strong>
                  </span>
                  <span
                    className={`text-[9px] font-black uppercase px-1.5 py-0.5 border border-black ${
                      assessment.level === 'optimal'
                        ? 'bg-emerald-300 text-black'
                        : assessment.level === 'acceptable'
                        ? 'bg-blue-200 text-black'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {assessment.level === 'optimal'
                      ? 'Optimal Contrast'
                      : assessment.level === 'acceptable'
                      ? 'Scan-Safe'
                      : 'Low Contrast'}
                  </span>
                </div>
                <p className="leading-tight text-gray-700">{assessment.summary}</p>
              </div>
            </div>
          );
        })()}
      </div>

      {/* 4. Bead Size Specification (Midi 5.0mm vs Mini 2.6mm) */}
      <div className="pt-2 border-t-2 border-gray-200 space-y-2">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
          <span className="flex items-center gap-1.5">
            <Ruler className="w-3.5 h-3.5 text-red-500" />
            <span>Bead Size Specification</span>
          </span>
          <span className="text-black font-mono font-bold text-[10px]">
            {beadSize === '2.6mm' ? 'Miniature (2.6mm)' : 'Standard (5.0mm)'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* 5.0mm Midi Option */}
          <button
            type="button"
            onClick={() => onBeadSizeChange('5.0mm')}
            className={`p-2.5 text-left transition-all cursor-pointer border-2 border-black flex flex-col justify-between ${
              beadSize === '5.0mm'
                ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(239,68,68,1)]'
                : 'bg-white text-black hover:bg-gray-100 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase">5.0mm Midi</span>
              <span
                className={`text-[9px] font-black px-1.5 py-0.5 border ${
                  beadSize === '5.0mm'
                    ? 'bg-yellow-300 text-black border-black'
                    : 'bg-gray-100 text-gray-700 border-gray-300'
                }`}
              >
                Standard
              </span>
            </div>
            <p
              className={`text-[10px] mt-1 leading-tight font-sans ${
                beadSize === '5.0mm' ? 'text-gray-300' : 'text-gray-500'
              }`}
            >
              Perler / Hama Midi. Standard ~14.5cm board.
            </p>
          </button>

          {/* 2.6mm Mini Option */}
          <button
            type="button"
            onClick={() => onBeadSizeChange('2.6mm')}
            className={`p-2.5 text-left transition-all cursor-pointer border-2 border-black flex flex-col justify-between ${
              beadSize === '2.6mm'
                ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(239,68,68,1)]'
                : 'bg-white text-black hover:bg-gray-100 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase">2.6mm Mini</span>
              <span
                className={`text-[9px] font-black px-1.5 py-0.5 border ${
                  beadSize === '2.6mm'
                    ? 'bg-red-500 text-white border-black'
                    : 'bg-gray-100 text-gray-700 border-gray-300'
                }`}
              >
                Keychain / Compact
              </span>
            </div>
            <p
              className={`text-[10px] mt-1 leading-tight font-sans ${
                beadSize === '2.6mm' ? 'text-gray-300' : 'text-gray-500'
              }`}
            >
              Artkal C-2.6 / Perler Mini. ~7.5cm for keychains.
            </p>
          </button>
        </div>
      </div>

      {/* 5. Live Dimension & Material Calculator */}
      <div className="pt-2 border-t-2 border-gray-200 space-y-2">
        <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center justify-between">
          <span>Live Dimension Calculator</span>
          <span className="text-[10px] text-black font-mono font-bold">
            {beadSize === '2.6mm' ? '2.6mm Mini Pitch' : '5.0mm Midi Pitch'}
          </span>
        </div>

        {(() => {
          const currentPhysicalSizeCm = Number(
            (matrixResult.dimension * (beadSize === '2.6mm' ? 0.26 : 0.5)).toFixed(1)
          );
          const currentPhysicalSizeIn = ((currentPhysicalSizeCm * 10) / 25.4).toFixed(1);

          return (
            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* Pegboard count */}
              <div className="p-3 bg-gray-50 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-black uppercase tracking-wider mb-1">
                  <Layers className="w-3.5 h-3.5 text-red-500" />
                  <span>Pegboards</span>
                </div>
                <div className="text-base font-black text-black">
                  {matrixResult.pegboardsRequired} Board{matrixResult.pegboardsRequired > 1 ? 's' : ''}
                </div>
                <div className="text-[10px] text-gray-600 font-mono mt-0.5">
                  {beadSize === '2.6mm' ? 'Mini Pegboard' : '29×29 Square Board'}
                </div>
              </div>

              {/* Physical Size */}
              <div className="p-3 bg-gray-50 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-black uppercase tracking-wider mb-1">
                  <Ruler className="w-3.5 h-3.5 text-red-500" />
                  <span>Finished Size</span>
                </div>
                <div className="text-base font-black text-black">
                  {currentPhysicalSizeCm} × {currentPhysicalSizeCm} cm
                </div>
                <div className="text-[10px] text-gray-600 font-mono mt-0.5">
                  ~{currentPhysicalSizeIn} in ({beadSize})
                </div>
              </div>
            </div>
          );
        })()}

        {/* Beads breakdown */}
        <div className="flex items-center justify-between px-3 py-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 border border-black" style={{ backgroundColor: darkBead.hex }} />
            <span className="text-black font-bold">Dark: {matrixResult.darkCount}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-white border border-black" />
            <span className="text-black font-bold">White: {matrixResult.lightCount}</span>
          </div>
          <div className="font-black text-red-500 font-mono">
            Total: {matrixResult.totalBeads}
          </div>
        </div>

        {/* Copy Bead Shopping List (BOM) */}
        <button
          type="button"
          onClick={handleCopyBOM}
          className={`w-full py-2 px-3 text-xs font-black uppercase tracking-wider border-2 border-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 ${
            copiedBOM
              ? 'bg-emerald-400 text-black'
              : 'bg-white text-black hover:bg-gray-100'
          }`}
        >
          {copiedBOM ? (
            <>
              <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
              <span>BOM Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <ClipboardCopy className="w-3.5 h-3.5 text-red-500" />
              <span>Copy Bead Shopping List (BOM)</span>
            </>
          )}
        </button>
      </div>

      {/* 6. Export Actions */}
      <div className="pt-2 border-t-2 border-gray-200 space-y-2">
        {/* Export 1:1 Printable PDF */}
        <button
          type="button"
          onClick={onExportPdf}
          className="w-full bg-black text-white py-3.5 px-4 font-black uppercase tracking-widest hover:bg-red-500 transition-colors shadow-[4px_4px_0px_0px_rgba(255,107,107,1)] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
        >
          <FileText className="w-4 h-4 text-yellow-300" />
          <span>{t.generator.btn_download_pdf}</span>
        </button>

        {/* PNG Exports */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onExportPng(false)}
            className="py-2.5 px-2.5 bg-white hover:bg-gray-100 border-2 border-black text-black text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5 text-gray-500" />
            <span>High-Res PNG</span>
          </button>

          <button
            type="button"
            onClick={() => onExportPng(true)}
            className="py-2.5 px-2.5 bg-white hover:bg-gray-100 border-2 border-black text-black text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5 text-red-500" />
            <span>PNG + Grid</span>
          </button>
        </div>
      </div>

    </div>
  );
}
