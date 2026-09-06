import { SupportedLang, DEFAULT_LANG, SUPPORTED_LANGS } from './i18n';
import { PageRoute } from '../types';

export function buildPath(lang: SupportedLang, route: PageRoute): string {
  if (route === 'tutorial') {
    return `/${lang}/how-to-make-a-qr-code-with-perler-beads`;
  }
  // For both 'home' and 'generator', the canonical landing page is the unified root /en
  return `/${lang}`;
}

export function parsePath(pathname: string): { lang: SupportedLang; route: PageRoute } {
  const clean = pathname.replace(/^\/+|\/+$/g, '');
  const segments = clean.split('/').filter(Boolean);

  let lang: SupportedLang = DEFAULT_LANG;
  let route: PageRoute = 'home';

  if (segments.length > 0) {
    if (SUPPORTED_LANGS.includes(segments[0] as SupportedLang)) {
      lang = segments[0] as SupportedLang;
      const second = segments[1];
      if (second === 'how-to-make-a-qr-code-with-perler-beads') {
        route = 'tutorial';
      } else {
        route = 'home';
      }
    } else {
      if (segments[0] === 'how-to-make-a-qr-code-with-perler-beads') {
        route = 'tutorial';
      } else {
        route = 'home';
      }
    }
  }

  return { lang, route };
}
