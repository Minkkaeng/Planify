// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
   plugins: [react()],
   base: '/Planify/', // ✅ 깃허브 레포 이름 그대로
});
