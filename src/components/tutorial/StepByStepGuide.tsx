import { SupportedLang } from '../../config/i18n';
import { buildPath } from '../../config/routes';
import { PageRoute } from '../../types';
import { AffiliateCard } from '../common/AffiliateCard';
import {
  Sparkles,
  ArrowRight,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Flame,
  Grid,
  Camera,
  Layers
} from 'lucide-react';

interface StepByStepGuideProps {
  lang: SupportedLang;
  t: any;
  onNavigate: (route: PageRoute) => void;
}

export function StepByStepGuide({ lang, t, onNavigate }: StepByStepGuideProps) {
  const tut = t.tutorial;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 text-black">
      
      {/* Visual Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black">
        <a
          href={buildPath(lang, 'home')}
          onClick={(e) => {
            e.preventDefault();
            onNavigate('home');
          }}
          className="hover:text-red-500 underline underline-offset-4 decoration-2 cursor-pointer"
        >
          Home
        </a>
        <span className="text-gray-400 font-normal">/</span>
        <span className="bg-yellow-300 px-2.5 py-0.5 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
          {tut.title || 'How to Make a Perler Bead QR Code'}
        </span>
      </nav>

      {/* Article Header */}
      <header className="space-y-4 border-b-2 sm:border-b-4 border-black pb-8 text-center sm:text-left bg-white border-2 sm:border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-black uppercase tracking-wider text-gray-700">
          <span className="flex items-center gap-1.5 text-black bg-yellow-300 px-2.5 py-1 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Sparkles className="w-3.5 h-3.5 text-red-500" />
            <span>Mastercraft Workshop</span>
          </span>
          <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 border border-gray-300">
            <Clock className="w-3.5 h-3.5 text-gray-600" />
            <span>{tut.meta_read_time}</span>
          </span>
          <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 border border-red-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Scan Tested</span>
          </span>
        </div>

        {/* H1 Coaxial with Title */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight leading-tight uppercase">
          {tut.title}
        </h1>

        <p className="text-base sm:text-lg text-gray-800 leading-relaxed font-medium">
          {tut.subtitle}
        </p>

        {/* Quick Launch Callout with Descriptive Anchor Text */}
        <div className="pt-2 flex flex-wrap gap-4">
          <a
            href={buildPath(lang, 'generator')}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('generator');
            }}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-black text-white font-black text-xs uppercase tracking-wider hover:bg-red-500 transition-colors shadow-[4px_4px_0px_0px_rgba(255,107,107,1)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>{tut.banner_btn}</span>
          </a>

          <a
            href={buildPath(lang, 'home')}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home');
            }}
            className="inline-flex items-center gap-2 px-5 py-3.5 bg-white text-black border-2 border-black font-black text-xs uppercase tracking-wider hover:bg-gray-100 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          >
            <span>Back to ScanBeads Overview</span>
          </a>
        </div>
      </header>

      {/* Stage 1: Payload & Matrix Sizing */}
      <section className="space-y-4 bg-white border-2 sm:border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-2 text-red-500">
          <Grid className="w-6 h-6 text-black" />
          <h2 className="text-xl sm:text-2xl font-black text-black uppercase tracking-wider">
            {tut.sec1_title}
          </h2>
        </div>

        <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
          {tut.sec1_p1}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {tut.sec1_point1 && (
            <div className="p-5 bg-gray-50 border-2 border-black space-y-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 text-black font-black text-sm uppercase tracking-wider">
                <span className="w-6 h-6 bg-red-500 text-white flex items-center justify-center text-xs font-mono">
                  1
                </span>
                <span>The 29×29 Pegboard Sweet Spot</span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed font-sans">
                {tut.sec1_point1}
              </p>
            </div>
          )}

          {tut.sec1_point2 && (
            <div className="p-5 bg-gray-50 border-2 border-black space-y-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 text-black font-black text-sm uppercase tracking-wider">
                <span className="w-6 h-6 bg-black text-yellow-300 flex items-center justify-center text-xs font-mono">
                  2
                </span>
                <span>Single Board Payload Limits</span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed font-sans">
                {tut.sec1_point2}
              </p>
            </div>
          )}
        </div>

        {tut.sec1_point3 && (
          <div className="p-4 bg-yellow-50 border-2 border-black flex items-start gap-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Layers className="w-5 h-5 text-black shrink-0 mt-0.5" />
            <p className="text-xs text-gray-800 font-medium leading-relaxed">
              {tut.sec1_point3}
            </p>
          </div>
        )}
      </section>

      {/* Stage 2: Precision Placement & Tape Method */}
      <section className="space-y-4 bg-white border-2 sm:border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-2 text-black">
          <CheckCircle2 className="w-6 h-6 text-red-500" />
          <h2 className="text-xl sm:text-2xl font-black text-black uppercase tracking-wider">
            {tut.sec2_title}
          </h2>
        </div>

        <p className="text-sm sm:text-base text-gray-800 leading-relaxed font-medium">
          {tut.sec2_p1}
        </p>

        {/* 4 Precision Steps */}
        <div className="space-y-3 pt-2">
          {tut.sec2_step1 && (
            <div className="p-4 bg-gray-50 border-2 border-black flex items-start gap-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="w-7 h-7 bg-black text-white flex items-center justify-center font-mono font-black text-xs shrink-0 mt-0.5">
                2.1
              </span>
              <div className="space-y-1 text-xs">
                <strong className="text-black uppercase tracking-wide block text-sm">1:1 Transparent Pegboard Overlay</strong>
                <p className="text-gray-700 leading-relaxed font-sans">{tut.sec2_step1}</p>
              </div>
            </div>
          )}

          {tut.sec2_step2 && (
            <div className="p-4 bg-gray-50 border-2 border-black flex items-start gap-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="w-7 h-7 bg-black text-white flex items-center justify-center font-mono font-black text-xs shrink-0 mt-0.5">
                2.2
              </span>
              <div className="space-y-1 text-xs">
                <strong className="text-black uppercase tracking-wide block text-sm">Precision Corner Anchors</strong>
                <p className="text-gray-700 leading-relaxed font-sans">{tut.sec2_step2}</p>
              </div>
            </div>
          )}

          {tut.sec2_step3 && (
            <div className="p-4 bg-gray-50 border-2 border-black flex items-start gap-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="w-7 h-7 bg-red-500 text-white flex items-center justify-center font-mono font-black text-xs shrink-0 mt-0.5">
                2.3
              </span>
              <div className="space-y-1 text-xs">
                <strong className="text-black uppercase tracking-wide block text-sm">The Blue Painter's Tape Method</strong>
                <p className="text-gray-700 leading-relaxed font-sans">{tut.sec2_step3}</p>
              </div>
            </div>
          )}

          {tut.sec2_step4 && (
            <div className="p-4 bg-gray-50 border-2 border-black flex items-start gap-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="w-7 h-7 bg-black text-yellow-300 flex items-center justify-center font-mono font-black text-xs shrink-0 mt-0.5">
                2.4
              </span>
              <div className="space-y-1 text-xs">
                <strong className="text-black uppercase tracking-wide block text-sm">Poking Vent Air Holes</strong>
                <p className="text-gray-700 leading-relaxed font-sans">{tut.sec2_step4}</p>
              </div>
            </div>
          )}
        </div>

        {/* Recommended Supplies */}
        <div className="pt-4 space-y-3">
          <h3 className="text-xs font-black uppercase tracking-widest text-red-500 pb-1">
            Recommended High-Contrast Fuse Beads & Supplies
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AffiliateCard
              title="Perler Solid Black 1,000 / 6,000 Jar (#5018)"
              description="True opaque jet black. The essential bead for sharp contrast and instant scanning."
              productKey="blackBeadsJar"
              t={t}
            />
            <AffiliateCard
              title="Perler Solid White 1,000 / 6,000 Jar (#5001)"
              description="Pure solid white for background matrix and the mandatory 4-bead quiet zone."
              productKey="whiteBeadsJar"
              t={t}
            />
            <AffiliateCard
              title="Standard 29×29 Interlocking Pegboards (4-Pack)"
              description="Clear interlocking pegboards designed for 1:1 underlying template alignment."
              productKey="pegboardsPack"
              t={t}
            />
            <AffiliateCard
              title="Perler Reusable Ironing Paper Sheets (6-Pack)"
              description="Silicon-coated craft paper providing smooth heat distribution without tearing."
              productKey="ironingPaper"
              t={t}
            />
          </div>
        </div>
      </section>

      {/* Stage 3: The Single-Sided Flat Ironing Technique */}
      <section className="space-y-4 bg-white border-2 sm:border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-2 text-red-500">
          <Flame className="w-6 h-6" />
          <h2 className="text-xl sm:text-2xl font-black text-black uppercase tracking-wider">
            {tut.sec3_title}
          </h2>
        </div>

        <p className="text-sm sm:text-base text-gray-800 leading-relaxed font-medium">
          {tut.sec3_p1}
        </p>

        {/* 4 Ironing Steps */}
        <div className="space-y-3 pt-2">
          {tut.sec3_step1 && (
            <div className="p-4 bg-gray-50 border-2 border-black flex items-start gap-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="w-7 h-7 bg-black text-white flex items-center justify-center font-mono font-black text-xs shrink-0 mt-0.5">
                3.1
              </span>
              <div className="space-y-1 text-xs">
                <strong className="text-black uppercase tracking-wide block text-sm">Iron Temperature Calibration</strong>
                <p className="text-gray-700 leading-relaxed font-sans">{tut.sec3_step1}</p>
              </div>
            </div>
          )}

          {tut.sec3_step2 && (
            <div className="p-4 bg-gray-50 border-2 border-black flex items-start gap-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="w-7 h-7 bg-black text-white flex items-center justify-center font-mono font-black text-xs shrink-0 mt-0.5">
                3.2
              </span>
              <div className="space-y-1 text-xs">
                <strong className="text-black uppercase tracking-wide block text-sm">Unbleached Baker's Parchment Paper</strong>
                <p className="text-gray-700 leading-relaxed font-sans">{tut.sec3_step2}</p>
              </div>
            </div>
          )}

          {tut.sec3_step3 && (
            <div className="p-4 bg-gray-50 border-2 border-black flex items-start gap-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="w-7 h-7 bg-black text-white flex items-center justify-center font-mono font-black text-xs shrink-0 mt-0.5">
                3.3
              </span>
              <div className="space-y-1 text-xs">
                <strong className="text-black uppercase tracking-wide block text-sm">Gentle Circular Motion (25-35s)</strong>
                <p className="text-gray-700 leading-relaxed font-sans">{tut.sec3_step3}</p>
              </div>
            </div>
          )}

          {tut.sec3_step4 && (
            <div className="p-4 bg-gray-50 border-2 border-black flex items-start gap-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="w-7 h-7 bg-red-500 text-white flex items-center justify-center font-mono font-black text-xs shrink-0 mt-0.5">
                3.4
              </span>
              <div className="space-y-1 text-xs">
                <strong className="text-black uppercase tracking-wide block text-sm">Single-Sided Fusion (Keep Front Holes Open!)</strong>
                <p className="text-gray-700 leading-relaxed font-sans">{tut.sec3_step4}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stage 4: Weighted Planar Cooling */}
      {tut.sec4_title && (
        <section className="space-y-4 bg-white border-2 sm:border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2 text-black">
            <Layers className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl sm:text-2xl font-black text-black uppercase tracking-wider">
              {tut.sec4_title}
            </h2>
          </div>

          <p className="text-sm sm:text-base text-gray-800 leading-relaxed font-medium">
            {tut.sec4_p1}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {tut.sec4_tip1 && (
              <div className="p-4 bg-gray-50 border-2 border-black space-y-1.5 text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-1.5 text-red-600 font-black uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Immediate Transfer</span>
                </div>
                <p className="text-gray-700 leading-relaxed font-sans">{tut.sec4_tip1}</p>
              </div>
            )}

            {tut.sec4_tip2 && (
              <div className="p-4 bg-gray-50 border-2 border-black space-y-1.5 text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-1.5 text-black font-black uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Weighted Pressure (15+ Mins)</span>
                </div>
                <p className="text-gray-700 leading-relaxed font-sans">{tut.sec4_tip2}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Stage 5: Camera Diagnostic & Troubleshooting */}
      {tut.sec5_title && (
        <section className="space-y-4 bg-white border-2 sm:border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2 text-black">
            <Camera className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl sm:text-2xl font-black text-black uppercase tracking-wider">
              {tut.sec5_title}
            </h2>
          </div>

          <p className="text-sm text-gray-800 font-medium">
            {tut.sec5_p1}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {tut.sec5_diag1 && (
              <div className="p-4 bg-gray-50 border-2 border-black space-y-1.5 text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <strong className="text-black uppercase tracking-wider block">1. Check Overhead Lighting Angle</strong>
                <p className="text-gray-700 leading-relaxed font-sans">{tut.sec5_diag1}</p>
              </div>
            )}

            {tut.sec5_diag2 && (
              <div className="p-4 bg-gray-50 border-2 border-black space-y-1.5 text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <strong className="text-black uppercase tracking-wider block">2. Confirm White Quiet Zone Margin</strong>
                <p className="text-gray-700 leading-relaxed font-sans">{tut.sec5_diag2}</p>
              </div>
            )}

            {tut.sec5_diag3 && (
              <div className="p-4 bg-gray-50 border-2 border-black space-y-1.5 text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <strong className="text-black uppercase tracking-wider block">3. Clean Smartphone Camera Lens</strong>
                <p className="text-gray-700 leading-relaxed font-sans">{tut.sec5_diag3}</p>
              </div>
            )}

            {tut.sec5_diag4 && (
              <div className="p-4 bg-gray-50 border-2 border-black space-y-1.5 text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <strong className="text-black uppercase tracking-wider block">4. Verify Bead Opaque Color Purity</strong>
                <p className="text-gray-700 leading-relaxed font-sans">{tut.sec5_diag4}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Bottom Sticky CTA Banner */}
      <div className="bg-black text-white border-4 border-black p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[8px_8px_0px_0px_rgba(255,107,107,1)]">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-black uppercase text-yellow-300">{tut.banner_cta}</h3>
          <p className="text-xs text-gray-300 font-sans">
            Jump straight into the in-browser pegboard pattern maker with 1:1 PDF printing.
          </p>
        </div>

        <a
          href={buildPath(lang, 'generator')}
          onClick={(e) => {
            e.preventDefault();
            onNavigate('generator');
          }}
          className="shrink-0 px-6 py-3.5 bg-red-500 hover:bg-red-400 text-white font-black text-xs uppercase tracking-wider transition-colors shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-2 cursor-pointer"
        >
          <span>{tut.banner_btn}</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

    </article>
  );
}
