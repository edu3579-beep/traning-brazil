import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Load API key from .env at config time (works even with Unicode path issues)
const __configDir = dirname(fileURLToPath(import.meta.url));
let _anthropicKey = '';
try {
  const envRaw = readFileSync(resolve(__configDir, '.env'), 'utf-8');
  for (const line of envRaw.split('\n')) {
    const m = line.match(/^ANTHROPIC_API_KEY\s*=\s*(.+)$/);
    if (m) { _anthropicKey = m[1].trim(); break; }
  }
} catch (_) {}

export default defineConfig({
  output: 'static',
  adapter: vercel(),
  integrations: [tailwind()],
  vite: {
    define: {
      '__ANTHROPIC_KEY__': JSON.stringify(_anthropicKey),
    },
  },
});