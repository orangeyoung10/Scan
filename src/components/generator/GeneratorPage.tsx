import { useState, useMemo, useEffect } from 'react';
import { SupportedLang } from '../../config/i18n';
import { buildPath } from '../../config/routes';
import {
  InputMode,
  ErrorCorrectionLevel,
  ColorMode,
  WifiData,
  VCardData,
  BeadColorCode,
  QrMatrixResult,
  PageRoute,
  BeadSizeSpec,
  PresetTemplate,
  SavedPattern
} from '../../types';
import { DARK_BEAD_OPTIONS, STANDARD_WHITE_BEAD } from '../../utils/beadColors';
import {
  generateBeadMatrix,
  formatWifiPayload,
  formatVCardPayload
} from '../../utils/qrEngine';
import { generatePrintablePdf } from '../../utils/pdfBuilder';
import { downloadBeadPng } from '../../utils/pngExporter';
import { parseShareUrl } from '../../utils/storage';
import { CanvasPreview } from './CanvasPreview';
import { ControlPanel } from './ControlPanel';
import { ExportModal } from './ExportModal';
import { PresetsModal } from './PresetsModal';
import { SavedPatternsModal } from './SavedPatternsModal';
import { IroningAssistantModal } from './IroningAssistantModal';
import { ScreenCalibratorModal } from './ScreenCalibratorModal';
import { AffiliateCard } from '../common/AffiliateCard';
import { ShieldCheck, Info, Sparkles, Bookmark, Flame, Ruler } from 'lucide-react';

interface GeneratorPageProps {
  lang: SupportedLang;
  t: any;
  onNavigate?: (route: PageRoute) => void;
}

export function GeneratorPage({ lang, t, onNavigate }: GeneratorPageProps) {
  // Input controller states
  const [mode, setMode] = useState<InputMode>('url');
  const [urlText, setUrlText] = useState<string>('https://scanbeads.com');
  const [wifi, setWifi] = useState<WifiData>({
    ssid: 'Guest_WiFi',
    password: 'SafePassword123',
    encryption: 'WPA'
  });
  const [vcard, setVCard] = useState<VCardData>({
    fullName: 'Jane Doe',
    phone: '+1 555-0199',
    email: 'jane@scanbeads.com'
  });

  // Tuning options
  const [ecl, setEcl] = useState<ErrorCorrectionLevel>('H'); // Default preset Level H as required
  const [colorMode, setColorMode] = useState<ColorMode>('classic');
  const [darkBead, setDarkBead] = useState<BeadColorCode>(DARK_BEAD_OPTIONS[0]); // Black #5018
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [isMirrored, setIsMirrored] = useState<boolean>(false);
  const [beadSize, setBeadSize] = useState<BeadSizeSpec>('5.0mm');

  // Modal states
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalExportType, setModalExportType] = useState<'pdf' | 'png' | null>(null);
  const [presetsOpen, setPresetsOpen] = useState<boolean>(false);
  const [savedPatternsOpen, setSavedPatternsOpen] = useState<boolean>(false);
  const [ironingModalOpen, setIroningModalOpen] = useState<boolean>(false);
  const [calibratorModalOpen, setCalibratorModalOpen] = useState<boolean>(false);
  const [screenScaleFactor, setScreenScaleFactor] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('scanbeads_screen_scale_factor');
      if (saved) {
        const num = parseFloat(saved);
        if (!isNaN(num) && num > 0.5 && num < 2.0) return num;
      }
    }
    return 1.0;
  });

  // Check URL query parameters for shared designs
  useEffect(() => {
    const shared = parseShareUrl();
    if (shared) {
      if (shared.mode) setMode(shared.mode);
      if (shared.urlText) setUrlText(shared.urlText);
      if (shared.ecl) setEcl(shared.ecl);
      if (shared.beadSize) setBeadSize(shared.beadSize);
      if (shared.isMirrored !== undefined) setIsMirrored(shared.isMirrored);
      if (shared.darkBeadId) {
        const found = DARK_BEAD_OPTIONS.find(c => c.id === shared.darkBeadId);
        if (found) setDarkBead(found);
      }
    }
  }, []);

  const handleSelectPreset = (preset: PresetTemplate) => {
    setMode(preset.mode);
    if (preset.mode === 'url' && preset.urlText) {
      setUrlText(preset.urlText);
    } else if (preset.mode === 'wifi' && preset.wifi) {
      setWifi(preset.wifi);
    } else if (preset.mode === 'vcard' && preset.vcard) {
      setVCard(preset.vcard);
    }
    setEcl(preset.recommendedEcl);
    setBeadSize(preset.recommendedBeadSize);
    const foundColor = DARK_BEAD_OPTIONS.find(c => c.id === preset.recommendedDarkColorId);
    if (foundColor) setDarkBead(foundColor);
  };

  const handleLoadPattern = (pattern: SavedPattern) => {
    setMode(pattern.mode);
    if (pattern.urlText) setUrlText(pattern.urlText);
    if (pattern.wifi) setWifi(pattern.wifi);
    if (pattern.vcard) setVCard(pattern.vcard);
    setEcl(pattern.ecl);
    setBeadSize(pattern.beadSize);
    if (pattern.isMirrored !== undefined) setIsMirrored(pattern.isMirrored);
    const foundColor = DARK_BEAD_OPTIONS.find(c => c.id === pattern.darkBeadId);
    if (foundColor) setDarkBead(foundColor);
  };

  // Compute QR raw payload
  const currentPayload = useMemo(() => {
    if (mode === 'url') {
      return urlText.trim() || 'https://scanbeads.com';
    }
    if (mode === 'wifi') {
      return formatWifiPayload(wifi);
    }
    return formatVCardPayload(vcard);
  }, [mode, urlText, wifi, vcard]);

  // Compute bead matrix
  const matrixResult: QrMatrixResult = useMemo(() => {
    return generateBeadMatrix(currentPayload, ecl, 4);
  }, [currentPayload, ecl]);

  // Export handlers
  const handleExportPdf = () => {
    generatePrintablePdf(matrixResult, {
      title: 'ScanBeads 1:1 Pegboard Pattern',
      lang,
      darkBead,
      lightBead: STANDARD_WHITE_BEAD,
      ecl,
      rawInput: currentPayload,
      isMirrored,
      beadSize
    });
    setModalExportType('pdf');
    setModalOpen(true);
  };

  const handleExportPng = (withCoordinates: boolean) => {
    downloadBeadPng(matrixResult, darkBead, STANDARD_WHITE_BEAD, withCoordinates, isMirrored);
    setModalExportType('png');
    setModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      
      {/* Visual Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black">
        <a
          href={buildPath(lang, 'home')}
          onClick={(e) => {
            e.preventDefault();
            onNavigate?.('home');
          }}
          className="hover:text-red-500 underline underline-offset-4 decoration-2 cursor-pointer"
        >
          Home
        </a>
        <span className="text-gray-400 font-normal">/</span>
        <span className="bg-yellow-300 px-2.5 py-0.5 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
          {t.nav?.tool || 'Perler Bead QR Generator'}
        </span>
      </nav>

      {/* Top Direct Utility Heading with Artistic Flair styling */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-4 border-black pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-50 px-2 py-0.5 border border-red-500">
              V1.0 CLIENT-ENGINE
            </span>
            <span className="text-black font-black">&bull;</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">
              5MM MIDI PEGBOARD SPEC
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mt-1">
            {t.generator.title}
          </h1>
          <p className="text-xs text-gray-600 mt-1 font-sans max-w-2xl">
            {t.generator.subtitle}
          </p>
        </div>

        {/* Local privacy assurance badge */}
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black bg-white border-2 border-black px-3 py-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] w-fit">
          <ShieldCheck className="w-4 h-4 text-red-500" />
          <span>{t.site.badge_privacy}</span>
        </div>
      </div>

      {/* Phase 4 Quick Action Bar: Presets, Saves, Ironing Studio, 1:1 Screen Ruler */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border-2 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setPresetsOpen(true)}
            className="px-3 py-1.5 bg-yellow-300 hover:bg-yellow-400 text-black text-xs font-black uppercase tracking-wider border-2 border-black flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>Preset Templates (模板灵感)</span>
          </button>

          <button
            type="button"
            onClick={() => setSavedPatternsOpen(true)}
            className="px-3 py-1.5 bg-white hover:bg-gray-100 text-black text-xs font-black uppercase tracking-wider border-2 border-black flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 text-red-500" />
            <span>Saved Patterns (我的图纸)</span>
          </button>

          <button
            type="button"
            onClick={() => setIroningModalOpen(true)}
            className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white text-xs font-black uppercase tracking-wider border-2 border-black flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-yellow-300" />
            <span>Ironing Studio (熨烫向导)</span>
          </button>

          <button
            type="button"
            onClick={() => setCalibratorModalOpen(true)}
            className="px-3 py-1.5 bg-white hover:bg-gray-100 text-black text-xs font-black uppercase tracking-wider border-2 border-black flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          >
            <Ruler className="w-3.5 h-3.5 text-black" />
            <span>Screen 1:1 Calibrator (屏幕校准)</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-gray-500 hidden xl:block">
          Auto-saved locally &bull; 100% Offline
        </div>
      </div>

      {/* Main 2-Column Tool Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Input Controller & Settings (5 cols) */}
        <div className="lg:col-span-5 order-2 lg:order-1">
          <ControlPanel
            mode={mode}
            onModeChange={setMode}
            urlText={urlText}
            onUrlTextChange={setUrlText}
            wifi={wifi}
            onWifiChange={setWifi}
            vcard={vcard}
            onVCardChange={setVCard}
            ecl={ecl}
            onEclChange={setEcl}
            colorMode={colorMode}
            onColorModeChange={setColorMode}
            darkBead={darkBead}
            onDarkBeadChange={setDarkBead}
            beadSize={beadSize}
            onBeadSizeChange={setBeadSize}
            matrixResult={matrixResult}
            onExportPdf={handleExportPdf}
            onExportPng={handleExportPng}
            onOpenPresets={() => setPresetsOpen(true)}
            onOpenSavedPatterns={() => setSavedPatternsOpen(true)}
            t={t}
          />
        </div>

        {/* Right: Live Canvas & Pegboard Visualizer (7 cols) */}
        <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
          <CanvasPreview
            matrixResult={matrixResult}
            darkBead={darkBead}
            lightBead={STANDARD_WHITE_BEAD}
            showGrid={showGrid}
            onToggleGrid={() => setShowGrid(!showGrid)}
            isMirrored={isMirrored}
            onToggleMirror={() => setIsMirrored(!isMirrored)}
            beadSize={beadSize}
            rawPayload={currentPayload}
            onOpenIroningAssistant={() => setIroningModalOpen(true)}
            onOpenCalibrator={() => setCalibratorModalOpen(true)}
            screenScaleFactor={screenScaleFactor}
            t={t}
          />

          {/* Contextual Affiliate Recommendation beneath visualizer */}
          <AffiliateCard
            title={t.export_modal.amazon_recommendation_title}
            description={t.export_modal.amazon_recommendation_desc}
            productKey="bundlePack"
            t={t}
          />
        </div>

      </div>

      {/* Material Guidance Card below tool */}
      <div className="bg-white border-2 border-black p-5 text-xs text-black space-y-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-2 font-black uppercase tracking-wider text-black">
          <Info className="w-4 h-4 text-red-500 shrink-0" />
          <span>{t.materials.title}</span>
        </div>
        <p className="text-gray-700 leading-relaxed font-sans">
          {t.materials.warning_contrast}
        </p>
      </div>

      {/* Rich Technical Craft & Math Deep Dive Section */}
      {t.tool_guide && (
        <section className="bg-white border-2 sm:border-4 border-black p-6 sm:p-8 space-y-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-100 border border-red-300 px-3 py-1 inline-block">
              {t.tool_guide.badge}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-black uppercase tracking-wider">
              {t.tool_guide.title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
              {t.tool_guide.lead}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-4 bg-gray-50 border-2 border-black space-y-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="font-black text-xs sm:text-sm uppercase text-black">{t.tool_guide.sec1_title}</h3>
              <p className="text-xs text-gray-700 leading-relaxed font-sans">{t.tool_guide.sec1_desc}</p>
            </div>

            <div className="p-4 bg-gray-50 border-2 border-black space-y-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="font-black text-xs sm:text-sm uppercase text-black">{t.tool_guide.sec2_title}</h3>
              <p className="text-xs text-gray-700 leading-relaxed font-sans">{t.tool_guide.sec2_desc}</p>
            </div>

            <div className="p-4 bg-gray-50 border-2 border-black space-y-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="font-black text-xs sm:text-sm uppercase text-black">{t.tool_guide.sec3_title}</h3>
              <p className="text-xs text-gray-700 leading-relaxed font-sans">{t.tool_guide.sec3_desc}</p>
            </div>

            <div className="p-4 bg-gray-50 border-2 border-black space-y-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="font-black text-xs sm:text-sm uppercase text-black">{t.tool_guide.sec4_title}</h3>
              <p className="text-xs text-gray-700 leading-relaxed font-sans">{t.tool_guide.sec4_desc}</p>
            </div>

            <div className="p-4 bg-gray-50 border-2 border-black space-y-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="font-black text-xs sm:text-sm uppercase text-black">{t.tool_guide.sec5_title}</h3>
              <p className="text-xs text-gray-700 leading-relaxed font-sans">{t.tool_guide.sec5_desc}</p>
            </div>

            <div className="p-4 bg-gray-50 border-2 border-black space-y-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="font-black text-xs sm:text-sm uppercase text-black">{t.tool_guide.sec6_title}</h3>
              <p className="text-xs text-gray-700 leading-relaxed font-sans">{t.tool_guide.sec6_desc}</p>
            </div>

            {t.tool_guide.sec7_title && (
              <div className="p-4 bg-gray-50 border-2 border-black space-y-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="font-black text-xs sm:text-sm uppercase text-black">{t.tool_guide.sec7_title}</h3>
                <p className="text-xs text-gray-700 leading-relaxed font-sans">{t.tool_guide.sec7_desc}</p>
              </div>
            )}

            {t.tool_guide.sec8_title && (
              <div className="p-4 bg-gray-50 border-2 border-black space-y-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="font-black text-xs sm:text-sm uppercase text-black">{t.tool_guide.sec8_title}</h3>
                <p className="text-xs text-gray-700 leading-relaxed font-sans">{t.tool_guide.sec8_desc}</p>
              </div>
            )}

            {t.tool_guide.sec9_title && (
              <div className="p-4 bg-gray-50 border-2 border-black space-y-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="font-black text-xs sm:text-sm uppercase text-black">{t.tool_guide.sec9_title}</h3>
                <p className="text-xs text-gray-700 leading-relaxed font-sans">{t.tool_guide.sec9_desc}</p>
              </div>
            )}

            {t.tool_guide.sec10_title && (
              <div className="p-4 bg-gray-50 border-2 border-black space-y-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="font-black text-xs sm:text-sm uppercase text-black">{t.tool_guide.sec10_title}</h3>
                <p className="text-xs text-gray-700 leading-relaxed font-sans">{t.tool_guide.sec10_desc}</p>
              </div>
            )}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-black">
            <span className="text-xs text-gray-700 font-medium">
              Want to make sure your piece melts evenly and scans on the first try?
            </span>
            <a
              href={buildPath(lang, 'tutorial')}
              onClick={(e) => {
                e.preventDefault();
                onNavigate?.('tutorial');
              }}
              className="px-5 py-2.5 bg-black text-white hover:bg-red-500 font-black text-xs uppercase tracking-wider transition-colors shadow-[2px_2px_0px_0px_rgba(255,107,107,1)] shrink-0 cursor-pointer"
            >
              Read Step-by-Step Ironing Tutorial →
            </a>
          </div>
        </section>
      )}

      {/* Export Success Modal */}
      <ExportModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        exportType={modalExportType}
        isMirrored={isMirrored}
        beadSize={beadSize}
        t={t}
      />

      {/* Preset Inspiration Templates Modal */}
      <PresetsModal
        isOpen={presetsOpen}
        onClose={() => setPresetsOpen(false)}
        onSelectPreset={handleSelectPreset}
        t={t}
      />

      {/* Saved Patterns Library Modal */}
      <SavedPatternsModal
        isOpen={savedPatternsOpen}
        onClose={() => setSavedPatternsOpen(false)}
        currentConfig={{
          mode,
          urlText,
          wifi,
          vcard,
          ecl,
          darkBead,
          beadSize,
          isMirrored,
          dimension: matrixResult.dimension,
          totalBeads: matrixResult.dimension * matrixResult.dimension,
          darkCount: matrixResult.darkCount
        }}
        onLoadPattern={handleLoadPattern}
        t={t}
      />

      {/* Interactive Ironing & Cooling Studio Modal */}
      <IroningAssistantModal
        isOpen={ironingModalOpen}
        onClose={() => setIroningModalOpen(false)}
        beadSize={beadSize}
        t={t}
      />

      {/* Physical 1:1 Screen Calibrator Modal */}
      <ScreenCalibratorModal
        isOpen={calibratorModalOpen}
        onClose={() => setCalibratorModalOpen(false)}
        beadSize={beadSize}
        currentScaleFactor={screenScaleFactor}
        onUpdateScaleFactor={setScreenScaleFactor}
        t={t}
      />

    </div>
  );
}
