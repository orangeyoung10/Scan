import { SupportedLang, DEFAULT_LANG, SUPPORTED_LANGS } from './i18n';
import { PageRoute } from '../types';

export function buildPath(lang: SupportedLang, route: PageRoute): string {
  if (route === 'home') {
    return `/${lang}`;
  }
  if (route === 'generator') {
    return `/${lang}/qr-code-generator`;
  }
  return `/${lang}/how-to-make-a-qr-code-with-perler-beads`;
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
      if (second === 'qr-code-generator') {
        route = 'generator';
      } else if (second === 'how-to-make-a-qr-code-with-perler-beads') {
        route = 'tutorial';
      } else {
        route = 'home';
      }
    } else {
      if (segments[0] === 'qr-code-generator') {
        route = 'generator';
      } else if (segments[0] === 'how-to-make-a-qr-code-with-perler-beads') {
        route = 'tutorial';
      }
    }
  }

  return { lang, route };
}
