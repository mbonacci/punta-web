import sitemap from '@astrojs/sitemap';
import { siteUrl } from './site.settings.mjs';

export default {
  site: siteUrl,
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
  vite: {
    server: {
      host: true
    }
  }
};
