import { useCallback, useEffect, useState } from "react";

export type ThemeMode = "dark" | "light" | "system";

export function useTheme() {
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");

  useEffect(() => {
    const stored = (localStorage.getItem("cp-theme") as ThemeMode | null) ?? "system";
    setThemeMode(stored);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    
    const applyTheme = () => {
      const isDark = 
        themeMode === "dark" || 
        (themeMode === "system" && media.matches);
      
      root.classList.toggle("light", !isDark);
      root.classList.toggle("dark", isDark);
    };

    applyTheme();

    if (themeMode === "system") {
      media.addEventListener("change", applyTheme);
      return () => media.removeEventListener("change", applyTheme);
    }
  }, [themeMode]);

  useEffect(() => {
    if (themeMode) {
      localStorage.setItem("cp-theme", themeMode);
    }
  }, [themeMode]);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeMode(mode);
  }, []);

  return { themeMode, setTheme };
}
