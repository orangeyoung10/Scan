import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function ssgDevPlugin(): Plugin {
  return {
    name: 'vite-plugin-ssg-dev',
    apply: 'serve',
    transformIndexHtml: {
      order: 'pre',
      async handler(html: string, ctx) {
        if (ctx.server) {
          try {
            const { parsePath } = await ctx.server.ssrLoadModule('/src/App.tsx');
            const { default: App } = await ctx.server.ssrLoadModule('/src/App.tsx');
            const { renderToString } = await import('react-dom/server');
            const React = await import('react');

            const url = ctx.originalUrl || (ctx as any).url || '/';
            const { lang, route } = parsePath(url);

            const rendered = renderToString(
              React.createElement(App, { initialLang: lang, initialRoute: route })
            );

            return html.replace('<div id="root"></div>', `<div id="root">${rendered}</div>`);
          } catch (err) {
            console.error('[SSG Dev Error]:', err);
          }
        }
        return html;
      }
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [ssgDevPlugin(), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
