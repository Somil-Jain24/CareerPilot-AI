import { useCallback, useEffect, useState } from "react";

export type ThemeMode = "light";

export function useTheme() {
  const [themeMode] = useState<ThemeMode>("light");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("light");
    root.classList.remove("dark");
  }, []);

  const setTheme = useCallback((mode: ThemeMode) => {
    // No-op since we only support light theme
  }, []);

  return { themeMode, setTheme };
}

