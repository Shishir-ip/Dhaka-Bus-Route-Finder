import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { AppContent } from './App';
import { buildHead } from './utils/seo';
import type { GraphData } from './contexts/DataContext';

export { findRoutes } from './utils/routeFinder';
export { buildSlugMaps, slugify } from './utils/slugs';

/** Pre-render one URL to static HTML + SEO head tags. Used by scripts/prerender.mjs at build time. */
export function render(url: string, data: GraphData): { html: string; head: string } {
  const html = renderToString(
    <StaticRouter location={url}>
      <AppContent initialData={data} />
    </StaticRouter>
  );
  const head = buildHead(url, data);
  return { html, head };
}