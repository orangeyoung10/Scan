import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App, { getMergedLocale } from '../src/App.tsx';
import { SupportedLang } from '../src/config/i18n.ts';
import { PageRoute } from '../src/types.ts';

const BASE_URL = 'https://scanbeads.com';
const OG_IMAGE_URL = 'https://scanbeads.com/og-image.png';

interface TargetPage {
  lang: SupportedLang;
  route: PageRoute;
  outputPath: string;
  isRootRedirect?: boolean;
  isAliasRedirect?: boolean;
  canonicalUrl: string;
}

function getPagesToRender(): TargetPage[] {
  return [
    // 1. Primary Authoritative English Home + Tool Landing
    {
      lang: 'en',
      route: 'home',
      outputPath: 'en/index.html',
      canonicalUrl: `${BASE_URL}/en`
    },

    // 2. Comprehensive Illustrated Ironing Tutorial Guide
    {
      lang: 'en',
      route: 'tutorial',
      outputPath: 'en/how-to-make-a-qr-code-with-perler-beads/index.html',
      canonicalUrl: `${BASE_URL}/en/how-to-make-a-qr-code-with-perler-beads`
    },

    // 3. Root index.html: 301/client redirect shell to /en, with canonical /en
    {
      lang: 'en',
      route: 'home',
      outputPath: 'index.html',
      isRootRedirect: true,
      canonicalUrl: `${BASE_URL}/en`
    },

    // 4. Legacy alias /en/qr-code-generator: redirect shell to /en, canonical /en
    {
      lang: 'en',
      route: 'home',
      outputPath: 'en/qr-code-generator/index.html',
      isAliasRedirect: true,
      canonicalUrl: `${BASE_URL}/en`
    }
  ];
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

  console.log(`[SSG] Starting Static Site Pre-rendering for ${pages.length} target files...`);

  for (const page of pages) {
    const { lang, route, outputPath, isRootRedirect, isAliasRedirect, canonicalUrl } = page;
    const t = getMergedLocale(lang);

    // 1. Determine Title and Description
    let pageTitle = t.site.title;
    let pageDesc = t.site.description;

    if (route === 'tutorial') {
      pageTitle = `${t.tutorial.title} - ScanBeads`;
      pageDesc = t.tutorial.subtitle;
    }

    // 2. Render React Component to HTML
    const renderedApp = renderToString(
      React.createElement(App, {
        initialLang: lang,
        initialRoute: route
      })
    );

    // 3. Build Hreflang Tags (en and x-default both pointing to canonical)
    const hreflangTags = [
      `    <link rel="alternate" hreflang="en" href="${canonicalUrl}" />`,
      `    <link rel="alternate" hreflang="x-default" href="${canonicalUrl}" />`
    ];

    // 4. Build JSON-LD Schema
    let jsonLdString = '';
    if (route === 'tutorial') {
      const guideSchema = {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        'headline': pageTitle,
        'description': pageDesc,
        'url': canonicalUrl,
        'inLanguage': 'en',
        'image': OG_IMAGE_URL,
        'publisher': {
          '@type': 'Organization',
          'name': 'ScanBeads',
          'url': BASE_URL
        }
      };
      jsonLdString = `\n    <script type="application/ld+json">\n${JSON.stringify(guideSchema, null, 2)}\n    </script>`;
    } else {
      // Home WebApplication & FAQPage schema
      const faqEntities = [
        { q: t.faq?.q1, a: t.faq?.a1 },
        { q: t.faq?.q2, a: t.faq?.a2 },
        { q: t.faq?.q3, a: t.faq?.a3 },
        { q: t.faq?.q4, a: t.faq?.a4 },
        { q: t.faq?.q5, a: t.faq?.a5 },
        { q: t.faq?.q6, a: t.faq?.a6 },
        { q: t.faq?.q7, a: t.faq?.a7 }
      ].filter(f => f.q && f.a).map(f => ({
        '@type': 'Question',
        'name': f.q,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': f.a
        }
      }));

      const schemas: any[] = [
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          'name': 'ScanBeads - Perler Bead QR Code Generator',
          'url': canonicalUrl,
          'image': OG_IMAGE_URL,
          'applicationCategory': 'DesignApplication',
          'operatingSystem': 'All',
          'browserRequirements': 'Requires HTML5 Canvas and JavaScript',
          'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD'
          },
          'description': pageDesc
        }
      ];

      if (faqEntities.length > 0) {
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': faqEntities
        });
      }

      jsonLdString = schemas.map(s => `\n    <script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n    </script>`).join('');
    }

    // 5. Inject into template
    let finalHtml = template;

    // Update <html lang="en">
    finalHtml = finalHtml.replace(/<html[^>]*>/i, `<html lang="en">`);

    // Update <title>
    finalHtml = finalHtml.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(pageTitle)}</title>`);

    // Update or insert meta description
    const descTag = `<meta name="description" content="${escapeHtml(pageDesc)}" />`;
    if (/<meta\s+name=["']description["'][^>]*>/i.test(finalHtml)) {
      finalHtml = finalHtml.replace(/<meta\s+name=["']description["'][^>]*>/i, descTag);
    } else {
      finalHtml = finalHtml.replace('</head>', `  ${descTag}\n</head>`);
    }

    // Update OpenGraph & Twitter
    finalHtml = finalHtml.replace(/<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${escapeHtml(pageTitle)}" />`);
    finalHtml = finalHtml.replace(/<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${escapeHtml(pageDesc)}" />`);
    finalHtml = finalHtml.replace(/<meta\s+property=["']og:image["'][^>]*>/i, `<meta property="og:image" content="${OG_IMAGE_URL}" />`);
    finalHtml = finalHtml.replace(/<meta\s+name=["']twitter:title["'][^>]*>/i, `<meta name="twitter:title" content="${escapeHtml(pageTitle)}" />`);
    finalHtml = finalHtml.replace(/<meta\s+name=["']twitter:description["'][^>]*>/i, `<meta name="twitter:description" content="${escapeHtml(pageDesc)}" />`);
    finalHtml = finalHtml.replace(/<meta\s+name=["']twitter:image["'][^>]*>/i, `<meta name="twitter:image" content="${OG_IMAGE_URL}" />`);

    // Canonical & Hreflang & Schema block
    const redirectTags = (isRootRedirect || isAliasRedirect)
      ? `    <meta http-equiv="refresh" content="0;url=/en" />\n    <script>window.location.replace('/en');</script>`
      : '';

    const seoBlock = [
      redirectTags,
      `    <link rel="canonical" href="${canonicalUrl}" />`,
      ...hreflangTags,
      jsonLdString
    ].filter(Boolean).join('\n');

    finalHtml = finalHtml.replace('</head>', `${seoBlock}\n  </head>`);

    // Inject rendered React HTML into root
    finalHtml = finalHtml.replace(
      /<div id="root"><\/div>/,
      `<div id="root">${renderedApp}</div>`
    );

    // 6. Write to destination file
    const targetFilePath = path.join(distDir, outputPath);
    const targetDir = path.dirname(targetFilePath);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.writeFileSync(targetFilePath, finalHtml, 'utf-8');
    console.log(`[SSG] Generated: ${outputPath} (${(finalHtml.length / 1024).toFixed(1)} KB)`);
  }

  console.log(`[SSG] Successfully pre-rendered all ${pages.length} physical files with single /en authority!`);
}

prerender().catch(err => {
  console.error('[SSG] Build failed:', err);
  process.exit(1);
});
