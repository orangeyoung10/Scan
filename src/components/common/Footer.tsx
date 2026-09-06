import { SupportedLang, SUPPORTED_LANGS, LANG_DETAILS } from '../../config/i18n';
import { buildPath } from '../../config/routes';
import { PageRoute } from '../../types';
import { AFFILIATE_CONFIG } from '../../config/affiliates';
import { Coffee, Shield, Heart } from 'lucide-react';

interface FooterProps {
  lang: SupportedLang;
  t: any;
  onNavigate: (route: PageRoute, lang?: SupportedLang) => void;
}

export function Footer({ lang, t, onNavigate }: FooterProps) {
  return (
    <footer className="border-t-4 border-black bg-black text-gray-300 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white flex flex-wrap p-0.5 gap-0.5 shrink-0">
                <div className="w-1.5 h-1.5 bg-black"></div><div className="w-1.5 h-1.5 bg-black"></div><div className="w-1.5 h-1.5 bg-white"></div>
                <div className="w-1.5 h-1.5 bg-black"></div><div className="w-1.5 h-1.5 bg-white"></div><div className="w-1.5 h-1.5 bg-black"></div>
                <div className="w-1.5 h-1.5 bg-black"></div><div className="w-1.5 h-1.5 bg-black"></div><div className="w-1.5 h-1.5 bg-white"></div>
              </div>
              <a
                href={buildPath(lang, 'home')}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('home');
                }}
                className="text-lg font-black tracking-tighter uppercase italic text-white hover:text-red-400 transition-colors"
              >
                ScanBeads<span className="text-red-500">.</span>com
              </a>
              <span className="text-[9px] uppercase font-black px-1.5 py-0.5 bg-red-500 text-white">
                5mm Fuse Beads
              </span>
            </div>
            <p className="text-gray-400 text-sm max-w-md leading-relaxed font-sans">
              {t.footer.tagline}
            </p>
            <div className="flex items-center gap-2 text-white font-bold text-xs pt-1">
              <Shield className="w-4 h-4 text-red-500 shrink-0" />
              <span className="uppercase tracking-wider">{t.footer.privacy_note}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-black text-xs tracking-widest uppercase border-b border-gray-800 pb-1">
              {t.footer.quick_links}
            </h4>
            <ul className="space-y-2 font-bold uppercase text-[11px] tracking-wider">
              <li>
                <a
                  href={buildPath(lang, 'generator')}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('generator');
                  }}
                  className="hover:text-red-400 transition-colors text-left inline-block cursor-pointer"
                >
                  &rarr; {t.nav.tool}
                </a>
              </li>
              <li>
                <a
                  href={buildPath(lang, 'tutorial')}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('tutorial');
                  }}
                  className="hover:text-red-400 transition-colors text-left inline-block cursor-pointer"
                >
                  &rarr; {t.nav.tutorial}
                </a>
              </li>
              <li>
                <a
                  href={`${buildPath(lang, 'home')}#showcase-section`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('home');
                    setTimeout(() => {
                      document.getElementById('showcase-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-red-400 transition-colors text-left inline-block cursor-pointer"
                >
                  &rarr; {t.nav.showcase}
                </a>
              </li>
              <li>
                <a
                  href={`${buildPath(lang, 'home')}#faq-section`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('home');
                    setTimeout(() => {
                      document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-red-400 transition-colors text-left inline-block cursor-pointer"
                >
                  &rarr; {t.nav.faq}
                </a>
              </li>
            </ul>
          </div>

          {/* Languages & Support */}
          <div className="space-y-3">
            <h4 className="text-white font-black text-xs tracking-widest uppercase border-b border-gray-800 pb-1">
              Languages
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {SUPPORTED_LANGS.map(l => (
                <a
                  key={l}
                  href={buildPath(l, 'home')}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('home', l);
                  }}
                  className={`px-2 py-1 text-xs font-bold uppercase transition-all cursor-pointer border ${
                    l === lang
                      ? 'bg-red-500 text-white border-red-500 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.4)]'
                      : 'bg-neutral-900 text-gray-400 border-neutral-800 hover:text-white hover:border-gray-600'
                  }`}
                >
                  {LANG_DETAILS[l].flag} {LANG_DETAILS[l].name}
                </a>
              ))}
            </div>

            {/* Buy Me a Coffee pixel badge */}
            <div className="pt-2">
              <a
                href={AFFILIATE_CONFIG.buyMeACoffeeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-yellow-400 hover:bg-yellow-300 text-black border-2 border-white transition-all text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer"
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>Buy Me a Coffee</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Disclaimer */}
        <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-gray-400 font-mono">
          <p>{t.footer.legal_disclaimer}</p>
          <p className="flex items-center gap-1.5">
            <span>{t.footer.built_with}</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
}
