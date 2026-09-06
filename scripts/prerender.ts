import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App, { parsePath, buildPath, getMergedLocale } from '../src/App.tsx';
import { SupportedLang, SUPPORTED_LANGS, DEFAULT_LANG } from '../src/config/i18n.ts';
import { PageRoute } from '../src/types.ts';

import enLocale from '../src/locales/en.json';
import jaLocale from '../src/locales/ja.json';
import deLocale from '../src/locales/de.json';
import esLocale from '../src/locales/es.json';

const LOCALE_MAP: Record<SupportedLang, any> = {
  en: enLocale,
  ja: jaLocale,
  de: deLocale,
  es: esLocale
};

const BASE_URL = 'https://scanbeads.com';

interface TargetPage {
  lang: SupportedLang;
  route: PageRoute;
  outputPath: string;
  isRoot?: boolean;
}

function getPagesToRender(): TargetPage[] {
  const pages: TargetPage[] = [];

  // Root index.html (Default to English Home)
  pages.push({
    lang: 'en',
    route: 'home',
    outputPath: 'index.html',
    isRoot: true
  });

  // Multilingual matrix
  for (const lang of SUPPORTED_LANGS) {
    // Home
    pages.push({
      lang,
      route: 'home',
      outputPath: path.join(lang, 'index.html')
    });

    // Tool Page
    pages.push({
      lang,
      route: 'generator',
      outputPath: path.join(lang, 'qr-code-generator', 'index.html')
    });

    // Tutorial Guide Page
    pages.push({
      lang,
      route: 'tutorial',
      outputPath: path.join(lang, 'how-to-make-a-qr-code-with-perler-beads', 'index.html')
    });
  }

  return pages;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function prerender() {
  const distDir = path.resolve(process.cwd(), 'dist');
  const templatePath = path.join(distDir, 'index.html');

  if (!fs.existsSync(templatePath)) {
    console.error(`[SSG] Error: Template file not found at ${templatePath}. Run 'vite build' first.`);
    process.exit(1);
  }

  const template = fs.readFileSync(templatePath, 'utf-8');
  const pages = getPagesToRender();

  console.log(`[SSG] Starting Static Site Pre-rendering for ${pages.length} pages...`);

  for (const page of pages) {
    const { lang, route, outputPath, isRoot } = page;
    const t = getMergedLocale(lang);

    // 1. Determine Title and Description
    let pageTitle = t.site.title;
    let pageDesc = t.site.description;

    if (route === 'generator') {
      pageTitle = `${t.generator.title} - ScanBeads`;
      pageDesc = t.generator.subtitle;
    } else if (route === 'tutorial') {
      pageTitle = `${t.tutorial.title} - ScanBeads`;
      pageDesc = t.tutorial.subtitle;
    }

    // 2. Determine Canonical and URLs
    const subpath = route === 'home'
      ? ''
      : route === 'generator'
      ? 'qr-code-generator'
      : 'how-to-make-a-qr-code-with-perler-beads';

    const currentCanonicalUrl = isRoot
      ? `${BASE_URL}/`
      : subpath
      ? `${BASE_URL}/${lang}/${subpath}`
      : `${BASE_URL}/${lang}`;

    // 3. Render React Component to HTML
    const renderedApp = renderToString(
      React.createElement(App, {
        initialLang: lang,
        initialRoute: route
      })
    );

    // 4. Build Hreflang Tags
    const hreflangTags = SUPPORTED_LANGS.map(l => {
      const href = subpath ? `${BASE_URL}/${l}/${subpath}` : `${BASE_URL}/${l}`;
      return `    <link rel="alternate" hreflang="${l}" href="${href}" />`;
    });
    hreflangTags.push(`    <link rel="alternate" hreflang="x-default" href="${subpath ? `${BASE_URL}/en/${subpath}` : `${BASE_URL}/en`}" />`);

    // 5. Build JSON-LD Schema
    let jsonLdString = '';
    if (route === 'home') {
      const faqEntities = [
        { q: t.faq.q1, a: t.faq.a1 },
        { q: t.faq.q2, a: t.faq.a2 },
        { q: t.faq.q3, a: t.faq.a3 },
        { q: t.faq.q4, a: t.faq.a4 },
        { q: t.faq.q5, a: t.faq.a5 },
        { q: t.faq.q6, a: t.faq.a6 },
        { q: t.faq.q7, a: t.faq.a7 }
      ].filter(f => f.q && f.a).map(f => ({
        '@type': 'Question',
        'name': f.q,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': f.a
        }
      }));

      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faqEntities
      };
      jsonLdString = `\n    <script type="application/ld+json">\n${JSON.stringify(faqSchema, null, 2)}\n    </script>`;
    } else if (route === 'generator') {
      const appSchema = {
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
        'description': pageDesc
      };
      jsonLdString = `\n    <script type="application/ld+json">\n${JSON.stringify(appSchema, null, 2)}\n    </script>`;
    } else if (route === 'tutorial') {
      const guideSchema = {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        'headline': pageTitle,
        'description': pageDesc,
        'url': currentCanonicalUrl,
        'inLanguage': lang,
        'publisher': {
          '@type': 'Organization',
          'name': 'ScanBeads',
          'url': BASE_URL
        }
      };
      jsonLdString = `\n    <script type="application/ld+json">\n${JSON.stringify(guideSchema, null, 2)}\n    </script>`;
    }

    // 6. Inject into template
    let finalHtml = template;

    // Update <html lang="...">
    finalHtml = finalHtml.replace(/<html[^>]*>/i, `<html lang="${lang}">`);

    // Update <title>
    finalHtml = finalHtml.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(pageTitle)}</title>`);

    // Update or insert meta description
    const descTag = `<meta name="description" content="${escapeHtml(pageDesc)}" />`;
    if (/<meta\s+name=["']description["'][^>]*>/i.test(finalHtml)) {
      finalHtml = finalHtml.replace(/<meta\s+name=["']description["'][^>]*>/i, descTag);
    } else {
      finalHtml = finalHtml.replace('</head>', `  ${descTag}\n</head>`);
    }

    // Update OpenGraph
    finalHtml = finalHtml.replace(/<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${escapeHtml(pageTitle)}" />`);
    finalHtml = finalHtml.replace(/<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${escapeHtml(pageDesc)}" />`);

    // Canonical & Hreflang & Schema block
    const seoBlock = [
      `    <link rel="canonical" href="${currentCanonicalUrl}" />`,
      ...hreflangTags,
      jsonLdString
    ].filter(Boolean).join('\n');

    finalHtml = finalHtml.replace('</head>', `${seoBlock}\n  </head>`);

    // Inject rendered React HTML into root
    finalHtml = finalHtml.replace(
      /<div id="root"><\/div>/,
      `<div id="root">${renderedApp}</div>`
    );

    // 7. Write to destination file
    const targetFilePath = path.join(distDir, outputPath);
    const targetDir = path.dirname(targetFilePath);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.writeFileSync(targetFilePath, finalHtml, 'utf-8');
    console.log(`[SSG] Generated: ${outputPath} (${(finalHtml.length / 1024).toFixed(1)} KB)`);
  }

  console.log(`[SSG] Successfully pre-rendered all ${pages.length} physical pages!`);
}

prerender().catch(err => {
  console.error('[SSG] Build failed:', err);
  process.exit(1);
});
