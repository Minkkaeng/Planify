// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
   plugins: [react()],
   base: '/Planify/', // 깃허브 레포 이름이랑 맞춰야 함
   build: {
      outDir: 'docs', // dist 대신 docs로 빌드 → GitHub Pages(main/docs)랑 맞춤
   },
});
