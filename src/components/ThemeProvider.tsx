"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Theme auto-switching disabled as per request
  useEffect(() => {
    // const saved = localStorage.getItem("theme") as Theme | null;
    // const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    // const initial = saved ?? (prefersDark ? "dark" : "light");
    const initial = "light";
    setTheme(initial);
    applyTheme(initial);
    setMounted(true);
  }, []);

  function applyTheme(t: Theme) {
    const html = document.documentElement;
    // Dark theme classes commented out
    // if (t === "dark") {
    //   html.classList.add("dark");
    // } else {
    //   html.classList.remove("dark");
    // }
    html.classList.remove("dark");
  }

  function toggleTheme() {
    // Theme toggling disabled
    // const next: Theme = theme === "light" ? "dark" : "light";
    // setTheme(next);
    // applyTheme(next);
    // localStorage.setItem("theme", next);
  }

  // Prevent flash: hide until mounted
  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
