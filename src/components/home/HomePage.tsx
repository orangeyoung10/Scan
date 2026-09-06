import { SupportedLang } from '../../config/i18n';
import { buildPath } from '../../config/routes';
import { PageRoute } from '../../types';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  Wifi,
  Contact,
  Music,
  ChevronDown,
  Layers,
  Flame,
  Eye,
  Table2,
  Info,
  AlertTriangle
} from 'lucide-react';
import { useState } from 'react';

interface HomePageProps {
  lang: SupportedLang;
  t: any;
  onNavigate: (route: PageRoute) => void;
}

export function HomePage({ lang, t, onNavigate }: HomePageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Safe accessor with fallback to en if needed
  const mg = t.matrix_guide || {};
  const bg = t.brand_guide || {};
  const og = t.optical_guide || {};
  const pu = t.practical_uses || {};

  return (
    <div className="space-y-20 sm:space-y-28 text-black pb-12">
      
      {/* 1. Hero Section */}
      <section className="relative pt-6 sm:pt-12 pb-4">
        <div className="max-w-4xl mx-auto text-center space-y-6 px-4">
          
          {/* Badge Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border-2 border-black text-black text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span>{t.hero.pill}</span>
          </div>

          {/* H1 Main Heading: Coaxial with Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-black leading-tight">
            <span>{t.hero.title_main}</span>{' '}
            <span className="bg-yellow-300 px-3 py-1 border-2 sm:border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] block sm:inline mt-2 sm:mt-0">
              {t.hero.title_highlight}
            </span>
          </h1>

          {/* Subtitle / Dense Opening Paragraph for Craft Intent */}
          <p className="text-base sm:text-lg text-gray-800 max-w-3xl mx-auto leading-relaxed font-medium">
            {t.hero.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href={buildPath(lang, 'generator')}
              onClick={(e) => {
                e.preventDefault();
                onNavigate('generator');
              }}
              className="w-full sm:w-auto px-8 py-4 bg-black text-white font-black text-sm uppercase tracking-wider hover:bg-red-500 transition-colors shadow-[5px_5px_0px_0px_rgba(255,107,107,1)] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>{t.hero.cta_primary}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href={buildPath(lang, 'tutorial')}
              onClick={(e) => {
                e.preventDefault();
                onNavigate('tutorial');
              }}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-100 text-black border-2 border-black font-black text-sm uppercase tracking-wider transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-red-500" />
              <span>{t.hero.cta_secondary}</span>
            </a>
          </div>

          {/* 3 Quick Value Props */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-black uppercase tracking-wider text-gray-700">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-red-500" />
              <span>{t.hero.stat_free}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-black" />
              <span>{t.hero.stat_privacy}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>{t.hero.stat_scale}</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. How It Works (3-Step Diagram) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-100 border border-red-300 px-3 py-1">
            {t.how_it_works.badge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight uppercase">
            {t.how_it_works.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Step 1 */}
          <div className="bg-white border-2 sm:border-4 border-black p-6 space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-3xl font-black text-red-500">
                {t.how_it_works.step1_num}
              </span>
              <span className="w-10 h-10 border-2 border-black bg-yellow-300 flex items-center justify-center text-black">
                <Sparkles className="w-5 h-5" />
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-black">{t.how_it_works.step1_title}</h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">{t.how_it_works.step1_desc}</p>
          </div>

          {/* Step 2 */}
          <div className="bg-white border-2 sm:border-4 border-black p-6 space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-3xl font-black text-red-500">
                {t.how_it_works.step2_num}
              </span>
              <span className="w-10 h-10 border-2 border-black bg-white flex items-center justify-center text-black">
                <BookOpen className="w-5 h-5 text-red-500" />
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-black">{t.how_it_works.step2_title}</h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">{t.how_it_works.step2_desc}</p>
          </div>

          {/* Step 3 */}
          <div className="bg-white border-2 sm:border-4 border-black p-6 space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-3xl font-black text-red-500">
                {t.how_it_works.step3_num}
              </span>
              <span className="w-10 h-10 border-2 border-black bg-black flex items-center justify-center text-yellow-300">
                <Zap className="w-5 h-5" />
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-black">{t.how_it_works.step3_title}</h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">{t.how_it_works.step3_desc}</p>
          </div>

        </div>
      </section>

      {/* 3. Pegboard Anatomy & Matrix Sizing Table */}
      {mg.title && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border-2 sm:border-4 border-black p-6 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-8">
            
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-100 border border-red-300 px-3 py-1 inline-block">
                {mg.badge}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight uppercase">
                {mg.title}
              </h2>
              <p className="text-sm sm:text-base text-gray-700 font-sans leading-relaxed">
                {mg.lead}
              </p>
              {mg.p1 && (
                <p className="text-xs sm:text-sm text-gray-600 font-sans leading-relaxed">
                  {mg.p1}
                </p>
              )}
            </div>

            {/* Matrix Specifications Table */}
            <div className="overflow-x-auto border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <table className="w-full text-left text-xs sm:text-sm font-sans">
                <thead className="bg-black text-white font-black uppercase text-[11px] tracking-wider border-b-2 border-black">
                  <tr>
                    <th className="p-3 sm:p-4">{mg.table_h_version}</th>
                    <th className="p-3 sm:p-4">{mg.table_h_matrix}</th>
                    <th className="p-3 sm:p-4">{mg.table_h_total}</th>
                    <th className="p-3 sm:p-4">{mg.table_h_boards}</th>
                    <th className="p-3 sm:p-4">{mg.table_h_capacity}</th>
                    <th className="p-3 sm:p-4">{mg.table_h_dim_midi}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 bg-white">
                  <tr className="hover:bg-yellow-50 transition-colors font-medium">
                    <td className="p-3 sm:p-4 font-black text-red-600">{mg.row1_v}</td>
                    <td className="p-3 sm:p-4 font-mono">{mg.row1_matrix}</td>
                    <td className="p-3 sm:p-4 font-mono font-bold bg-yellow-100">{mg.row1_total}</td>
                    <td className="p-3 sm:p-4">{mg.row1_boards}</td>
                    <td className="p-3 sm:p-4 text-gray-700">{mg.row1_capacity}</td>
                    <td className="p-3 sm:p-4 font-mono">{mg.row1_dim}</td>
                  </tr>
                  <tr className="hover:bg-yellow-50 transition-colors font-medium">
                    <td className="p-3 sm:p-4 font-black">{mg.row2_v}</td>
                    <td className="p-3 sm:p-4 font-mono">{mg.row2_matrix}</td>
                    <td className="p-3 sm:p-4 font-mono">{mg.row2_total}</td>
                    <td className="p-3 sm:p-4">{mg.row2_boards}</td>
                    <td className="p-3 sm:p-4 text-gray-700">{mg.row2_capacity}</td>
                    <td className="p-3 sm:p-4 font-mono">{mg.row2_dim}</td>
                  </tr>
                  <tr className="hover:bg-yellow-50 transition-colors font-medium">
                    <td className="p-3 sm:p-4 font-black">{mg.row3_v}</td>
                    <td className="p-3 sm:p-4 font-mono">{mg.row3_matrix}</td>
                    <td className="p-3 sm:p-4 font-mono">{mg.row3_total}</td>
                    <td className="p-3 sm:p-4">{mg.row3_boards}</td>
                    <td className="p-3 sm:p-4 text-gray-700">{mg.row3_capacity}</td>
                    <td className="p-3 sm:p-4 font-mono">{mg.row3_dim}</td>
                  </tr>
                  <tr className="hover:bg-yellow-50 transition-colors font-medium">
                    <td className="p-3 sm:p-4 font-black">{mg.row4_v}</td>
                    <td className="p-3 sm:p-4 font-mono">{mg.row4_matrix}</td>
                    <td className="p-3 sm:p-4 font-mono">{mg.row4_total}</td>
                    <td className="p-3 sm:p-4">{mg.row4_boards}</td>
                    <td className="p-3 sm:p-4 text-gray-700">{mg.row4_capacity}</td>
                    <td className="p-3 sm:p-4 font-mono">{mg.row4_dim}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pro-Tip Box */}
            <div className="bg-yellow-100 border-2 border-black p-4 sm:p-5 flex items-start gap-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Info className="w-5 h-5 text-black shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-black font-medium leading-relaxed">
                {mg.pro_tip}
              </p>
            </div>

          </div>
        </section>
      )}

      {/* 4. Fuse Bead Brand Comparison & Material Science */}
      {bg.title && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-100 border border-red-300 px-3 py-1">
              {bg.badge}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight uppercase">
              {bg.title}
            </h2>
            <p className="text-sm text-gray-700 max-w-2xl mx-auto font-medium">
              {bg.lead}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Perler */}
            <div className="bg-white border-2 sm:border-4 border-black p-6 space-y-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-black uppercase bg-gray-100 border border-black px-2 py-0.5">
                    {bg.card1_material}
                  </span>
                  <Flame className="w-4 h-4 text-red-500" />
                </div>
                <h3 className="text-lg font-black uppercase text-black">{bg.card1_brand}</h3>
                <p className="text-xs font-bold text-red-600 font-mono">{bg.card1_temp}</p>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans pt-1">
                  {bg.card1_desc}
                </p>
              </div>
            </div>

            {/* Card 2: Artkal */}
            <div className="bg-white border-2 sm:border-4 border-black p-6 space-y-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-black uppercase bg-gray-100 border border-black px-2 py-0.5">
                    {bg.card2_material}
                  </span>
                  <Flame className="w-4 h-4 text-yellow-500" />
                </div>
                <h3 className="text-lg font-black uppercase text-black">{bg.card2_brand}</h3>
                <p className="text-xs font-bold text-red-600 font-mono">{bg.card2_temp}</p>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans pt-1">
                  {bg.card2_desc}
                </p>
              </div>
            </div>

            {/* Card 3: Hama */}
            <div className="bg-white border-2 sm:border-4 border-black p-6 space-y-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-black uppercase bg-gray-100 border border-black px-2 py-0.5">
                    {bg.card3_material}
                  </span>
                  <Flame className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="text-lg font-black uppercase text-black">{bg.card3_brand}</h3>
                <p className="text-xs font-bold text-red-600 font-mono">{bg.card3_temp}</p>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans pt-1">
                  {bg.card3_desc}
                </p>
              </div>
            </div>

          </div>

          {/* Mixing Warning Banner */}
          {bg.warning_mixing && (
            <div className="mt-6 bg-red-50 border-2 sm:border-3 border-red-500 p-4 sm:p-5 flex items-start gap-3 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)]">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-red-950 font-bold leading-relaxed">
                {bg.warning_mixing}
              </p>
            </div>
          )}
        </section>
      )}

      {/* 5. Optical Contrast & Single-Sided Flat Melt Technique */}
      {og.title && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border-2 sm:border-4 border-black p-6 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-100 border border-red-300 px-3 py-1 inline-block">
                {og.badge}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight uppercase">
                {og.title}
              </h2>
              <p className="text-sm text-gray-700 font-sans leading-relaxed">
                {og.lead}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-5 border-2 border-black bg-gray-50 space-y-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-red-500" />
                  <h3 className="font-black text-sm uppercase text-black">{og.factor1_title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">{og.factor1_desc}</p>
              </div>

              <div className="p-5 border-2 border-black bg-gray-50 space-y-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <h3 className="font-black text-sm uppercase text-black">{og.factor2_title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">{og.factor2_desc}</p>
              </div>

              <div className="p-5 border-2 border-black bg-gray-50 space-y-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-500" />
                  <h3 className="font-black text-sm uppercase text-black">{og.factor3_title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">{og.factor3_desc}</p>
              </div>
            </div>

            {/* Internal Anchor Link to Step-by-Step Guide */}
            <div className="pt-4 text-right">
              <a
                href={`/${lang}/how-to-make-a-qr-code-with-perler-beads`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('tutorial');
                }}
                className="inline-flex items-center gap-2 font-black text-xs sm:text-sm text-black hover:text-red-500 uppercase tracking-wider underline underline-offset-4 decoration-2 cursor-pointer"
              >
                <span>Read the Complete 4-Step Flat Ironing Workshop Guide</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* 6. Four Practical Real-World Applications */}
      {pu.title && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-100 border border-red-300 px-3 py-1">
              {pu.badge}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight uppercase">
              {pu.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border-2 sm:border-3 border-black p-5 space-y-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-9 h-9 border-2 border-black bg-yellow-300 flex items-center justify-center">
                <Wifi className="w-4 h-4 text-black" />
              </div>
              <h3 className="font-black text-sm uppercase text-black pt-1">{pu.item1_title}</h3>
              <p className="text-xs text-gray-700 leading-relaxed font-sans">{pu.item1_desc}</p>
            </div>

            <div className="bg-white border-2 sm:border-3 border-black p-5 space-y-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-9 h-9 border-2 border-black bg-red-400 flex items-center justify-center text-white">
                <Contact className="w-4 h-4 text-black" />
              </div>
              <h3 className="font-black text-sm uppercase text-black pt-1">{pu.item2_title}</h3>
              <p className="text-xs text-gray-700 leading-relaxed font-sans">{pu.item2_desc}</p>
            </div>

            <div className="bg-white border-2 sm:border-3 border-black p-5 space-y-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-9 h-9 border-2 border-black bg-green-300 flex items-center justify-center">
                <Music className="w-4 h-4 text-black" />
              </div>
              <h3 className="font-black text-sm uppercase text-black pt-1">{pu.item3_title}</h3>
              <p className="text-xs text-gray-700 leading-relaxed font-sans">{pu.item3_desc}</p>
            </div>

            <div className="bg-white border-2 sm:border-3 border-black p-5 space-y-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-9 h-9 border-2 border-black bg-blue-300 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-black" />
              </div>
              <h3 className="font-black text-sm uppercase text-black pt-1">{pu.item4_title}</h3>
              <p className="text-xs text-gray-700 leading-relaxed font-sans">{pu.item4_desc}</p>
            </div>
          </div>
        </section>
      )}

      {/* 7. Real-World Showcase (Visual Scenarios) */}
      <section id="showcase-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="text-center space-y-2 mb-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-100 border border-red-300 px-3 py-1">
            {t.showcase.badge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight uppercase">
            {t.showcase.title}
          </h2>
          <p className="text-sm text-gray-600 max-w-xl mx-auto font-medium">
            {t.showcase.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Showcase 1: Tabletop WiFi Stand */}
          <div className="bg-white border-2 sm:border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
            <div className="h-48 bg-gray-100 p-6 flex flex-col items-center justify-center relative border-b-2 border-black">
              <div className="w-24 h-24 bg-white border-2 border-black p-2 flex flex-col items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] relative">
                <div className="grid grid-cols-5 gap-1 w-full h-full p-1 bg-white">
                  <div className="bg-black" /><div className="bg-black" /><div className="bg-black" /><div className="bg-white" /><div className="bg-black" />
                  <div className="bg-black" /><div className="bg-white" /><div className="bg-black" /><div className="bg-black" /><div className="bg-white" />
                  <div className="bg-black" /><div className="bg-black" /><div className="bg-black" /><div className="bg-black" /><div className="bg-black" />
                  <div className="bg-white" /><div className="bg-black" /><div className="bg-white" /><div className="bg-black" /><div className="bg-black" />
                  <div className="bg-black" /><div className="bg-black" /><div className="bg-black" /><div className="bg-white" /><div className="bg-black" />
                </div>
              </div>
              <div className="w-16 h-3 bg-amber-800 border-2 border-black mt-2 shadow" />
              <div className="absolute bottom-2 right-3 flex items-center gap-1 text-[10px] font-mono font-black uppercase text-black bg-white border border-black px-2 py-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                <Wifi className="w-3 h-3 text-red-500" />
                <span>Instant Connect</span>
              </div>
            </div>

            <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-red-500">{t.showcase.item1_scene}</span>
                <h3 className="text-base font-black text-black uppercase mt-1">{t.showcase.item1_title}</h3>
                <p className="text-xs text-gray-700 mt-2 leading-relaxed font-sans">{t.showcase.item1_desc}</p>
              </div>
            </div>
          </div>

          {/* Showcase 2: Pixel Keychain vCard */}
          <div className="bg-white border-2 sm:border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
            <div className="h-48 bg-gray-100 p-6 flex flex-col items-center justify-center relative border-b-2 border-black">
              <div className="w-8 h-8 rounded-full border-2 border-black -mb-2 z-10 bg-white" />
              <div className="w-20 h-20 bg-white border-2 border-black p-1.5 flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="grid grid-cols-4 gap-1 w-full h-full p-1 bg-white">
                  <div className="bg-black" /><div className="bg-black" /><div className="bg-black" /><div className="bg-white" />
                  <div className="bg-black" /><div className="bg-white" /><div className="bg-black" /><div className="bg-black" />
                  <div className="bg-black" /><div className="bg-black" /><div className="bg-black" /><div className="bg-black" />
                  <div className="bg-white" /><div className="bg-black" /><div className="bg-white" /><div className="bg-black" />
                </div>
              </div>
              <div className="absolute bottom-2 right-3 flex items-center gap-1 text-[10px] font-mono font-black uppercase text-black bg-white border border-black px-2 py-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                <Contact className="w-3 h-3 text-red-500" />
                <span>vCard Ready</span>
              </div>
            </div>

            <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-red-500">{t.showcase.item2_scene}</span>
                <h3 className="text-base font-black text-black uppercase mt-1">{t.showcase.item2_title}</h3>
                <p className="text-xs text-gray-700 mt-2 leading-relaxed font-sans">{t.showcase.item2_desc}</p>
              </div>
            </div>
          </div>

          {/* Showcase 3: Music Coaster */}
          <div className="bg-white border-2 sm:border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
            <div className="h-48 bg-gray-100 p-6 flex flex-col items-center justify-center relative border-b-2 border-black">
              <div className="w-24 h-24 bg-white border-2 border-black p-2 flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="w-full h-full border border-black bg-neutral-900 p-1 flex flex-col items-center justify-center">
                  <div className="w-6 h-6 rounded-full border border-white bg-red-500 flex items-center justify-center">
                    <Music className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
              <div className="absolute bottom-2 right-3 flex items-center gap-1 text-[10px] font-mono font-black uppercase text-black bg-white border border-black px-2 py-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                <Music className="w-3 h-3 text-red-500" />
                <span>Retro Coaster</span>
              </div>
            </div>

            <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-red-500">{t.showcase.item3_scene}</span>
                <h3 className="text-base font-black text-black uppercase mt-1">{t.showcase.item3_title}</h3>
                <p className="text-xs text-gray-700 mt-2 leading-relaxed font-sans">{t.showcase.item3_desc}</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 8. Frequently Asked Questions (Full Visible HTML for Crawlers) */}
      <section id="faq-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-100 border border-red-300 px-3 py-1">
            {t.faq.badge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight uppercase">
            {t.faq.title}
          </h2>
        </div>

        <div className="space-y-4">
          {[
            { q: t.faq.q1, a: t.faq.a1 },
            { q: t.faq.q2, a: t.faq.a2 },
            { q: t.faq.q3, a: t.faq.a3 },
            { q: t.faq.q4, a: t.faq.a4 },
            { q: t.faq.q5, a: t.faq.a5 },
            { q: t.faq.q6, a: t.faq.a6 },
            { q: t.faq.q7, a: t.faq.a7 }
          ].filter(item => item.q && item.a).map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-black text-sm text-black hover:bg-gray-50 transition-colors cursor-pointer uppercase tracking-wider"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{item.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-black shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-red-500' : ''
                    }`}
                  />
                </button>
                {/* Always rendered in the DOM for search engines; visibility toggled via class */}
                <div
                  className={`px-5 pb-4 pt-2 text-xs sm:text-sm text-gray-700 leading-relaxed border-t-2 border-black bg-gray-50 font-sans ${
                    isOpen ? 'block' : 'hidden'
                  }`}
                >
                  {item.a}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. Bottom Conversion Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-black text-white border-4 border-black p-8 sm:p-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[8px_8px_0px_0px_rgba(255,107,107,1)]">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-3xl font-black uppercase text-yellow-300">
              {t.tutorial.banner_cta}
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-md font-sans">
              Free 1:1 scale printable PDF patterns, exact bead counts, and color codes for Perler, Artkal, and Hama.
            </p>
          </div>
          <a
            href={buildPath(lang, 'generator')}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('generator');
            }}
            className="shrink-0 px-8 py-4 bg-red-500 hover:bg-red-400 text-white font-black text-sm uppercase tracking-wider transition-colors shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>{t.tutorial.banner_btn}</span>
          </a>
        </div>
      </section>

    </div>
  );
}
