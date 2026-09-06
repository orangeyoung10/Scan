import { useState } from 'react';
import { SupportedLang, SUPPORTED_LANGS, LANG_DETAILS } from '../../config/i18n';
import { buildPath } from '../../config/routes';
import { PageRoute } from '../../types';
import { ShieldCheck, Menu, X, Sparkles, Grid3X3, BookOpen } from 'lucide-react';

interface HeaderProps {
  lang: SupportedLang;
  route: PageRoute;
  t: any;
  onNavigate: (route: PageRoute, lang?: SupportedLang) => void;
}

export function Header({ lang, route, t, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLangChange = (newLang: SupportedLang) => {
    onNavigate(route, newLang);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Tag */}
        <div className="flex items-center gap-3">
          <a
            href={buildPath(lang, 'home')}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home');
            }}
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
            aria-label="ScanBeads Home"
          >
            {/* Neo-brutalist 3x3 Bead Matrix Icon */}
            <div className="w-10 h-10 bg-black flex flex-wrap p-1 gap-0.5 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[2px_2px_0px_0px_rgba(239,68,68,1)] transition-shadow shrink-0">
              <div className="w-2 h-2 bg-white"></div><div className="w-2 h-2 bg-white"></div><div className="w-2 h-2 bg-black"></div>
              <div className="w-2 h-2 bg-white"></div><div className="w-2 h-2 bg-black"></div><div className="w-2 h-2 bg-white"></div>
              <div className="w-2 h-2 bg-white"></div><div className="w-2 h-2 bg-white"></div><div className="w-2 h-2 bg-black"></div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tighter uppercase italic text-black group-hover:text-neutral-800 transition-colors">
                ScanBeads<span className="text-red-500">.</span>com
              </span>
              <span className="hidden sm:inline text-[9px] font-black uppercase px-1.5 py-0.5 bg-yellow-300 text-black border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                5mm
              </span>
            </div>
          </a>

          {/* Privacy Pill Badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-white border border-black text-black text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span>{t.site.badge_privacy}</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-5">
          <a
            href={buildPath(lang, 'generator')}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('generator');
            }}
            className={`text-xs font-black uppercase tracking-wider py-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              route === 'generator'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-black hover:border-black'
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5 text-red-500" />
            {t.nav.tool}
          </a>

          <a
            href={buildPath(lang, 'tutorial')}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('tutorial');
            }}
            className={`text-xs font-black uppercase tracking-wider py-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              route === 'tutorial'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-black hover:border-black'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-red-500" />
            {t.nav.tutorial}
          </a>

          <a
            href={route === 'home' ? '#showcase-section' : `${buildPath(lang, 'home')}#showcase-section`}
            onClick={(e) => {
              if (route !== 'home') {
                e.preventDefault();
                onNavigate('home');
                setTimeout(() => {
                  const el = document.getElementById('showcase-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="text-xs font-black uppercase tracking-wider py-1 border-b-2 border-transparent text-gray-500 hover:text-black hover:border-black transition-colors cursor-pointer"
          >
            {t.nav.showcase}
          </a>

          <a
            href={route === 'home' ? '#faq-section' : `${buildPath(lang, 'home')}#faq-section`}
            onClick={(e) => {
              if (route !== 'home') {
                e.preventDefault();
                onNavigate('home');
                setTimeout(() => {
                  const el = document.getElementById('faq-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="text-xs font-black uppercase tracking-wider py-1 border-b-2 border-transparent text-gray-500 hover:text-black hover:border-black transition-colors cursor-pointer"
          >
            {t.nav.faq}
          </a>
        </nav>

        {/* Language Selector & CTA */}
        <div className="flex items-center gap-3">
          {/* Neo-brutalist Language Selector Tabs */}
          <div className="flex bg-gray-100 p-0.5 rounded-sm border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
            {SUPPORTED_LANGS.map(l => {
              const isSelected = l === lang;
              return (
                <a
                  key={l}
                  href={buildPath(l, route)}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLangChange(l);
                  }}
                  className={`px-2.5 py-1 text-xs font-black uppercase transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-black border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'text-gray-500 hover:text-black opacity-60 hover:opacity-100'
                  }`}
                  title={LANG_DETAILS[l].name}
                >
                  {l.toUpperCase()}
                </a>
              );
            })}
          </div>

          {/* Primary Action Button */}
          {route !== 'generator' && (
            <a
              href={buildPath(lang, 'generator')}
              onClick={(e) => {
                e.preventDefault();
                onNavigate('generator');
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-red-500 transition-colors shadow-[3px_3px_0px_0px_rgba(255,107,107,1)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>{t.nav.create_button}</span>
            </a>
          )}

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 border-2 border-black bg-white text-black hover:bg-gray-100 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-black bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 border border-black text-black text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-red-500 shrink-0" />
            <span>{t.site.badge_privacy}</span>
          </div>

          <a
            href={buildPath(lang, 'generator')}
            onClick={(e) => {
              e.preventDefault();
              setMobileMenuOpen(false);
              onNavigate('generator');
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-black uppercase tracking-wider bg-black text-white shadow-[3px_3px_0px_0px_rgba(255,107,107,1)] cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Grid3X3 className="w-4 h-4 text-yellow-300" />
              {t.nav.tool}
            </span>
            <span className="text-[10px] text-red-400">OPEN &rarr;</span>
          </a>

          <a
            href={buildPath(lang, 'tutorial')}
            onClick={(e) => {
              e.preventDefault();
              setMobileMenuOpen(false);
              onNavigate('tutorial');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-black uppercase tracking-wider border-2 border-black bg-white text-black hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-red-500" />
            {t.nav.tutorial}
          </a>

          <a
            href={route === 'home' ? '#showcase-section' : `${buildPath(lang, 'home')}#showcase-section`}
            onClick={(e) => {
              setMobileMenuOpen(false);
              if (route !== 'home') {
                e.preventDefault();
                onNavigate('home');
                setTimeout(() => {
                  const el = document.getElementById('showcase-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="w-full block text-left px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-black cursor-pointer"
          >
            {t.nav.showcase}
          </a>

          <a
            href={route === 'home' ? '#faq-section' : `${buildPath(lang, 'home')}#faq-section`}
            onClick={(e) => {
              setMobileMenuOpen(false);
              if (route !== 'home') {
                e.preventDefault();
                onNavigate('home');
                setTimeout(() => {
                  const el = document.getElementById('faq-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="w-full block text-left px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-black cursor-pointer"
          >
            {t.nav.faq}
          </a>
        </div>
      )}
    </header>
  );
}
