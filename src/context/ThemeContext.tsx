/**
 * ThemeContext.tsx
 * =====================================================================
 * Global Color / Monochrome theme system.
 *
 * Deliberately tiny: a single `theme` value ("color" | "mono") stored
 * in React state, mirrored onto `document.documentElement` as
 * `data-theme="mono"` and persisted to localStorage. All the actual
 * visual work happens in CSS (see the `--color-bg` / `--color-text`
 * variables and the `html[data-theme="mono"]` override in
 * `index.css`) — this file only owns the *state*, so it can't cause
 * re-renders of the rest of the tree; consumers that don't call
 * `useTheme()` are unaffected by a theme switch.
 *
 * The context object itself lives in `theme-context-object.ts` and the
 * consumer hook in `hooks/useTheme.ts` — split out so this file only
 * exports the `ThemeProvider` component (keeps React Fast Refresh happy).
 * =====================================================================
 */

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { ThemeContext, type Theme } from "./theme-context-object";

const STORAGE_KEY = "portfolio-theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "color";

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "color" || stored === "mono") return stored;

  return "color";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => setThemeState(next), []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "color" ? "mono" : "color"));
  }, []);

  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme }),
    [theme, toggleTheme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
