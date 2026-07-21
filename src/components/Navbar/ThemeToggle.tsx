import { motion, AnimatePresence } from "framer-motion";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "@/hooks/useTheme";

// Small fixed positions for the "night sky" stars sprinkled across the
// track when monochrome (night) mode is active.
const STARS = [
  { top: "20%", left: "58%", size: 2.5, delay: 0 },
  { top: "62%", left: "68%", size: 1.6, delay: 0.4 },
  { top: "35%", left: "78%", size: 2, delay: 0.8 },
];

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isMono = theme === "mono";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isMono}
      aria-label={`Switch to ${isMono ? "Color" : "Monochrome"} mode`}
      onClick={toggleTheme}
      className={`relative flex h-9 w-72px flex-none items-center rounded-full border px-1 backdrop-blur-sm transition-colors duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D97B66] ${
        isMono
          ? "border-white/20 bg-linear-to-r from-[#0B1026] to-[#1B2340]"
          : "border-[#F0A583]/40 bg-linear-to-r from-[#8FD3F4] to-[#FFB199]"
      }`}
    >
      <span className="sr-only">Toggle day / night mode</span>

      {/* Twinkling stars — only visible in night (monochrome) mode */}
      {STARS.map((star, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="absolute rounded-full bg-white"
          style={{ top: star.top, left: star.left, width: star.size, height: star.size }}
          animate={{ opacity: isMono ? [0.2, 1, 0.2] : 0 }}
          transition={{
            duration: 2,
            repeat: isMono ? Infinity : 0,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Sun rays — only visible in day (color) mode */}
      <motion.span
        aria-hidden="true"
        className="absolute left-9px text-[13px]"
        animate={{
          opacity: isMono ? 0 : 1,
          rotate: isMono ? -90 : 0,
          scale: isMono ? 0.6 : 1,
        }}
        transition={{ duration: 0.4 }}
      >
        <FiSun className="text-[#FFF3E0] drop-shadow-[0_0_4px_rgba(255,200,120,0.9)]" />
      </motion.span>

      {/* Moon — only visible in night (monochrome) mode */}
      <motion.span
        aria-hidden="true"
        className="absolute right-9px text-[13px]"
        animate={{
          opacity: isMono ? 1 : 0,
          rotate: isMono ? 0 : 90,
          scale: isMono ? 1 : 0.6,
        }}
        transition={{ duration: 0.4 }}
      >
        <FiMoon className="text-[#F4F1DE] drop-shadow-[0_0_4px_rgba(200,200,255,0.6)]" />
      </motion.span>

      {/* Sliding thumb — carries whichever icon is currently active, so
          the toggle itself reads instantly as "sun" or "moon". */}
      <motion.span
        className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
        style={{
          background: isMono
            ? "linear-gradient(135deg, #F4F1DE, #B9B6A8)"
            : "linear-gradient(135deg, #FFD98E, #F0A583)",
        }}
        animate={{ x: isMono ? 36 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 34 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isMono ? (
            <motion.span
              key="moon"
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center text-[13px] text-[#2B2A3D]"
            >
              <FiMoon />
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center text-[13px] text-[#8A3E22]"
            >
              <FiSun />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
    </button>
  );
};

export default ThemeToggle;
