import { useEffect } from 'react';
import { SupportedLang } from '../../config/i18n';
import { PageRoute } from '../../types';

interface HeadMetaProps {
  lang: SupportedLang;
  route: PageRoute;
  title: string;
  description: string;
}

const BASE_URL = 'https://scanbeads.com';
const OG_IMAGE_URL = 'https://scanbeads.com/og-image.png';

export function HeadMeta({ lang, route, title, description }: HeadMetaProps) {
  useEffect(() => {
    // 1. Set document title and HTML lang attribute
    document.title = title;
    document.documentElement.lang = lang;

    // Helper: update or insert meta tag
    const setMeta = (attrName: string, attrVal: string, content: string) => {
      let el = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 2. Standard Meta Description
    setMeta('name', 'description', description);

    // 3. OpenGraph meta
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:image', OG_IMAGE_URL);
    setMeta('property', 'og:image:width', '1200');
    setMeta('property', 'og:image:height', '630');
    setMeta('property', 'og:image:alt', 'Perler Bead QR Code Generator - ScanBeads');

    // 4. Twitter Card meta
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', OG_IMAGE_URL);

    // 5. Canonical Tag
    // Single source of truth: English homepage is always /en
    const currentCanonicalUrl = route === 'tutorial'
      ? `${BASE_URL}/en/how-to-make-a-qr-code-with-perler-beads`
      : `${BASE_URL}/en`;

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentCanonicalUrl);

    // 6. Hreflang Tags (en and x-default)
    const existingHreflangs = document.querySelectorAll('link[rel="alternate"][hreflang]');
    existingHreflangs.forEach(el => el.remove());

    const enLink = document.createElement('link');
    enLink.setAttribute('rel', 'alternate');
    enLink.setAttribute('hreflang', 'en');
    enLink.setAttribute('href', currentCanonicalUrl);
    document.head.appendChild(enLink);

    const xDefault = document.createElement('link');
    xDefault.setAttribute('rel', 'alternate');
    xDefault.setAttribute('hreflang', 'x-default');
    xDefault.setAttribute('href', currentCanonicalUrl);
    document.head.appendChild(xDefault);

    // 7. JSON-LD Structured Data
    const existingScript = document.getElementById('json-ld-schema');
    if (existingScript) {
      existingScript.remove();
    }

    const schemaScript = document.createElement('script');
    schemaScript.id = 'json-ld-schema';
    schemaScript.type = 'application/ld+json';

    if (route === 'tutorial') {
      const guideSchema = {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        'headline': title,
        'description': description,
        'url': currentCanonicalUrl,
        'inLanguage': 'en',
        'image': OG_IMAGE_URL,
        'publisher': {
          '@type': 'Organization',
          'name': 'ScanBeads',
          'url': BASE_URL
        }
      };
      schemaScript.text = JSON.stringify(guideSchema);
    } else {
      // Home / Generator WebApplication schema
      const appSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'ScanBeads - Perler Bead QR Code Generator',
        'url': currentCanonicalUrl,
        'image': OG_IMAGE_URL,
        'applicationCategory': 'DesignApplication',
        'operatingSystem': 'All',
        'browserRequirements': 'Requires HTML5 Canvas and JavaScript',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD'
        },
        'description': description
      };
      schemaScript.text = JSON.stringify(appSchema);
    }

    document.head.appendChild(schemaScript);
  }, [lang, route, title, description]);

  return null;
}
