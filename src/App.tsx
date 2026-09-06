import { useState, useEffect, useMemo } from 'react';
import { SupportedLang, SUPPORTED_LANGS, DEFAULT_LANG, isValidLang } from './config/i18n';
import { PageRoute } from './types';

// Import local dictionary trees
import enLocale from './locales/en.json';
import jaLocale from './locales/ja.json';
import deLocale from './locales/de.json';
import esLocale from './locales/es.json';

// Components
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HomePage } from './components/home/HomePage';
import { GeneratorPage } from './components/generator/GeneratorPage';
import { StepByStepGuide } from './components/tutorial/StepByStepGuide';
import { HeadMeta } from './components/seo/HeadMeta';

const LOCALE_MAP: Record<SupportedLang, any> = {
  en: enLocale,
  ja: jaLocale,
  de: deLocale,
  es: esLocale
};

export function getMergedLocale(lang: SupportedLang) {
  const current = LOCALE_MAP[lang] || enLocale;
  if (lang === 'en') return current;
  return {
    ...enLocale,
    ...current,
    site: { ...enLocale.site, ...(current.site || {}) },
    hero: { ...enLocale.hero, ...(current.hero || {}) },
    generator: { ...enLocale.generator, ...(current.generator || {}) },
    tool_guide: { ...enLocale.tool_guide, ...(current.tool_guide || {}) },
    matrix_guide: { ...enLocale.matrix_guide, ...(current.matrix_guide || {}) },
    brand_guide: { ...enLocale.brand_guide, ...(current.brand_guide || {}) },
    optical_guide: { ...enLocale.optical_guide, ...(current.optical_guide || {}) },
    practical_uses: { ...enLocale.practical_uses, ...(current.practical_uses || {}) },
    tutorial: { ...enLocale.tutorial, ...(current.tutorial || {}) },
    faq: { ...enLocale.faq, ...(current.faq || {}) },
    how_it_works: { ...enLocale.how_it_works, ...(current.how_it_works || {}) },
    materials: { ...enLocale.materials, ...(current.materials || {}) },
    showcase: { ...enLocale.showcase, ...(current.showcase || {}) },
    affiliate: { ...enLocale.affiliate, ...(current.affiliate || {}) },
    export_modal: { ...enLocale.export_modal, ...(current.export_modal || {}) },
    footer: { ...enLocale.footer, ...(current.footer || {}) }
  };
}

export { buildPath, parsePath } from './config/routes';
import { buildPath, parsePath } from './config/routes';

export interface AppProps {
  initialLang?: SupportedLang;
  initialRoute?: PageRoute;
}

export default function App({ initialLang, initialRoute }: AppProps = {}) {
  // Initialize from browser URL or props
  const initial = useMemo(() => {
    if (initialLang && initialRoute) {
      return { lang: initialLang, route: initialRoute };
    }
    if (typeof window !== 'undefined') {
      return parsePath(window.location.pathname);
    }
    return { lang: initialLang || DEFAULT_LANG, route: initialRoute || ('home' as PageRoute) };
  }, [initialLang, initialRoute]);

  const [lang, setLang] = useState<SupportedLang>(initial.lang);
  const [route, setRoute] = useState<PageRoute>(initial.route);

  // Sync state on browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parsePath(window.location.pathname);
      setLang(parsed.lang);
      setRoute(parsed.route);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigation handler
  const handleNavigate = (nextRoute: PageRoute, nextLang?: SupportedLang) => {
    const targetLang = nextLang || lang;
    setRoute(nextRoute);
    if (nextLang) setLang(nextLang);

    const newUrl = buildPath(targetLang, nextRoute);
    if (window.location.pathname !== newUrl) {
      window.history.pushState(null, '', newUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Active dictionary tree with deep fallback
  const t = getMergedLocale(lang);

  // Title and description based on current page
  const pageTitle = route === 'generator'
    ? `${t.generator.title} - ScanBeads`
    : route === 'tutorial'
    ? `${t.tutorial.title} - ScanBeads`
    : t.site.title;

  const pageDesc = route === 'generator'
    ? t.generator.subtitle
    : route === 'tutorial'
    ? t.tutorial.subtitle
    : t.site.description;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#1A1A1B] selection:bg-red-500 selection:text-white">
      {/* Dynamic SEO Tags (Canonical, Hreflang, WebApplication Schema, Title) */}
      <HeadMeta
        lang={lang}
        route={route}
        title={pageTitle}
        description={pageDesc}
      />

      {/* Global Header */}
      <Header
        lang={lang}
        route={route}
        t={t}
        onNavigate={handleNavigate}
      />

      {/* Main Content View Container */}
      <main className="flex-1">
        {route === 'generator' && (
          <GeneratorPage
            lang={lang}
            t={t}
            onNavigate={handleNavigate}
          />
        )}

        {route === 'home' && (
          <HomePage
            lang={lang}
            t={t}
            onNavigate={handleNavigate}
          />
        )}

        {route === 'tutorial' && (
          <StepByStepGuide
            lang={lang}
            t={t}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        lang={lang}
        t={t}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
