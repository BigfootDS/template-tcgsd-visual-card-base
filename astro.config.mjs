// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react({
      experimentalReactChildren: true,
    })
  ],
  build: {
    inlineStylesheets: "always"
  },
  base: "/tcgsd-template-assets",
});
