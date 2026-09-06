import { useEffect } from 'react';
import { SupportedLang, SUPPORTED_LANGS } from '../../config/i18n';
import { PageRoute } from '../../types';

interface HeadMetaProps {
  lang: SupportedLang;
  route: PageRoute;
  title: string;
  description: string;
}

export function HeadMeta({ lang, route, title, description }: HeadMetaProps) {
  useEffect(() => {
    // 1. Set document title and HTML lang attribute
    document.title = title;
    document.documentElement.lang = lang;

    // 2. Set Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // 3. Open Graph meta
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    // Build URL subpath
    const subpath = route === 'home' 
      ? '' 
      : route === 'generator' 
      ? 'qr-code-generator' 
      : 'how-to-make-a-qr-code-with-perler-beads';

    const baseUrl = 'https://scanbeads.com';
    const currentCanonicalUrl = subpath ? `${baseUrl}/${lang}/${subpath}` : `${baseUrl}/${lang}`;

    // 4. Canonical Tag
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentCanonicalUrl);

    // 5. Hreflang Tags (en, ja, de, es, and x-default)
    // Remove existing hreflang tags first
    const existingHreflangs = document.querySelectorAll('link[rel="alternate"][hreflang]');
    existingHreflangs.forEach(el => el.remove());

    SUPPORTED_LANGS.forEach(l => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', l);
      link.setAttribute('href', subpath ? `${baseUrl}/${l}/${subpath}` : `${baseUrl}/${l}`);
      document.head.appendChild(link);
    });

    // x-default points to /en
    const xDefault = document.createElement('link');
    xDefault.setAttribute('rel', 'alternate');
    xDefault.setAttribute('hreflang', 'x-default');
    xDefault.setAttribute('href', subpath ? `${baseUrl}/en/${subpath}` : `${baseUrl}/en`);
    document.head.appendChild(xDefault);

    // 6. JSON-LD Structured Data
    // Requirement 2.3: WebApplication Schema on tool page
    // Requirement 2.3: STRICTLY PROHIBIT FAQPage Schema
    const existingScript = document.getElementById('json-ld-schema');
    if (existingScript) {
      existingScript.remove();
    }

    if (route === 'generator') {
      const schemaScript = document.createElement('script');
      schemaScript.id = 'json-ld-schema';
      schemaScript.type = 'application/ld+json';
      const schemaData = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'ScanBeads QR Code Generator',
        'url': currentCanonicalUrl,
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
      schemaScript.text = JSON.stringify(schemaData);
      document.head.appendChild(schemaScript);
    }
  }, [lang, route, title, description]);

  return null;
}
