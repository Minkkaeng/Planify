// src/context/ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

const COLOR_MODE_KEY = "planify_color_mode";
const JELLY_KEY = "planify_jelly";

export function ThemeProvider({ children }) {
  const [colorMode, setColorModeState] = useState("light");
  const [jelly, setJellyState] = useState("yellow");

  useEffect(() => {
    try {
      const savedMode = localStorage.getItem(COLOR_MODE_KEY);
      const savedJelly = localStorage.getItem(JELLY_KEY);

      if (savedMode === "light" || savedMode === "dark") {
        setColorModeState(savedMode);
      } else {
        const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
        setColorModeState(prefersDark ? "dark" : "light");
      }

      if (savedJelly === "yellow" || savedJelly === "purple" || savedJelly === "pink") {
        setJellyState(savedJelly);
      } else {
        setJellyState("yellow");
      }
    } catch {
      setColorModeState("light");
      setJellyState("yellow");
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = colorMode;
    try {
      localStorage.setItem(COLOR_MODE_KEY, colorMode);
    } catch {}
  }, [colorMode]);

  useEffect(() => {
    try {
      localStorage.setItem(JELLY_KEY, jelly);
    } catch {}
  }, [jelly]);

  const setColorMode = (mode) => {
    setColorModeState(mode === "dark" ? "dark" : "light");
  };

  const setJelly = (theme) => {
    if (theme === "purple" || theme === "pink" || theme === "yellow") {
      setJellyState(theme);
    } else {
      setJellyState("yellow");
    }
  };

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
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
