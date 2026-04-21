import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const base = env.GITHUB_PAGES_BASE || '/';

  return {
    base,
    plugins: [react()],
    define: {
      __APP_NAME__: JSON.stringify(env.VITE_APP_NAME || 'E-Commerce Store Pro')
    }
  };
});
