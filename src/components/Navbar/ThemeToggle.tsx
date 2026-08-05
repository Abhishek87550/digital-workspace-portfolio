import { motion, AnimatePresence } from "framer-motion";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "@/hooks/useTheme";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  // `data-theme="mono"` is the Light mode theme.
  const isLight = theme === "mono";

  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label={`Switch to ${isLight ? "Dark" : "Light"} mode`}
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex h-8 w-16 flex-none items-center rounded-full px-1 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--toggle-border)] border border-[var(--toggle-border)] bg-[var(--toggle-bg)] shadow-[0_0_15px_var(--toggle-glow)]"
    >
      <span className="sr-only">Toggle theme</span>

      {/* Track Background Icons */}
      <span className={`absolute left-2 text-[10px] transition-opacity duration-300 ${isLight ? "opacity-0" : "opacity-100 text-[var(--text-muted)]"}`}>
        <FiMoon aria-hidden="true" />
      </span>
      <span className={`absolute right-2 text-[10px] transition-opacity duration-300 ${isLight ? "opacity-100 text-[var(--text-muted)]" : "opacity-0"}`}>
        <FiSun aria-hidden="true" />
      </span>

      {/* Sliding Thumb */}
      <motion.span
        className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full shadow-md bg-[var(--toggle-thumb)] text-[var(--toggle-bg)]"
        animate={{ x: isLight ? 32 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isLight ? (
            <motion.span
              key="sun"
              initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center text-xs"
            >
              <FiSun />
            </motion.span>
          ) : (
            <motion.span
              key="moon"
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center text-xs"
            >
              <FiMoon />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
    </motion.button>
  );
};

export default ThemeToggle;
