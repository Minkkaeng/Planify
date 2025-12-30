// src/context/ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const COLOR_KEY = 'planify_colorMode'; // light | dark
const JELLY_KEY = 'planify_jelly'; // yellow | purple | pink

const ThemeContext = createContext({
   colorMode: 'light',
   setColorMode: () => {},
   jelly: 'yellow',
   setJelly: () => {},
});

const normalizeMode = (v) => (v === 'dark' || v === 'light' ? v : 'light');

const normalizeJelly = (v) => (v === 'purple' || v === 'pink' ? v : 'yellow');

export function ThemeProvider({ children }) {
   const [colorMode, setColorMode] = useState(() => normalizeMode(localStorage.getItem(COLOR_KEY)));

   const [jelly, setJelly] = useState(() => normalizeJelly(localStorage.getItem(JELLY_KEY)));

   useEffect(() => {
      document.documentElement.dataset.theme = colorMode;
      localStorage.setItem(COLOR_KEY, colorMode);
   }, [colorMode]);

   useEffect(() => {
      document.documentElement.dataset.jelly = jelly;
      localStorage.setItem(JELLY_KEY, jelly);
   }, [jelly]);

   const value = { colorMode, setColorMode, jelly, setJelly };

   return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
   return useContext(ThemeContext);
}
