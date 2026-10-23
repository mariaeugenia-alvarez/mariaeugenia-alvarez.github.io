import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://mariaeugenia-alvarez.github.io',
  integrations: [mdx()],
  redirects: {
    '/transversales/de-la-idea-al-aprendizaje/': '/transversales/marco-mental-de-decisiones-segun-problemas/',
  },
});
