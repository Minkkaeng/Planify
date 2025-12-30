import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

const COLOR_KEY = 'planify_colorMode'; // light | dark
const JELLY_KEY = 'planify_jelly'; // yellow | purple | pink

export function ThemeProvider({ children }) {
   const [colorMode, setColorMode] = useState('light');
   const [jelly, setJelly] = useState('yellow');

   // 초기 로드
   useEffect(() => {
      const savedMode = localStorage.getItem(COLOR_KEY);
      const savedJelly = localStorage.getItem(JELLY_KEY);

      const initialMode = savedMode === 'dark' || savedMode === 'light' ? savedMode : 'light';
      const initialJelly = savedJelly === 'purple' || savedJelly === 'pink' ? savedJelly : 'yellow';

      setColorMode(initialMode);
      setJelly(initialJelly);

      document.documentElement.dataset.theme = initialMode;
      document.documentElement.dataset.jelly = initialJelly;
   }, []);

   useEffect(() => {
      document.documentElement.dataset.theme = colorMode;
      localStorage.setItem(COLOR_KEY, colorMode);
   }, [colorMode]);

   useEffect(() => {
      document.documentElement.dataset.jelly = jelly;
      localStorage.setItem(JELLY_KEY, jelly);
   }, [jelly]);

   const value = {
      colorMode,
      setColorMode,
      jelly,
      setJelly,
   };

   return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
   const ctx = useContext(ThemeContext);
   if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
   return ctx;
}
