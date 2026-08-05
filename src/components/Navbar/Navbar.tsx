/**
 * Navbar.tsx
 * =====================================================================
 * Floating glassmorphism navigation bar — docked at the bottom middle,
 * with a premium "smart scroll" behavior:
 *
 *  - At the top or scrolling up → fully visible, resting position.
 *  - Scrolling down             → hides below the screen, leaving only
 *                                 a small clickable sliver visible.
 *  - Click when hidden          → pops back up fully.
 *
 * Breakpoints:
 *  - lg and up  → full desktop layout: logo, centered pill nav, toggle.
 *  - below lg   → glass hamburger + animated dropdown.
 * =====================================================================
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { NAV_SECTION_IDS } from "./navConfig";
import NavLogo from "./NavLogo";
import NavLinks from "./NavLinks";
import ThemeToggle from "./ThemeToggle";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  const activeId = useActiveSection(NAV_SECTION_IDS);
  const navState = useScrollDirection();
  
  const [isRevealed, setIsRevealed] = useState(false);

  // Reset the manual reveal state whenever scroll direction changes
  useEffect(() => {
    setIsRevealed(false);
  }, [navState]);

  const isTop = navState === "top";
  const isUp = navState === "up";
  
  // It is visible if we are at the top, scrolling up, or if manually clicked
  const isVisible = isTop || isUp || isRevealed;

  return (
    <motion.header
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: isVisible ? 0 : "calc(100% + 24px - 14px)" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 sm:px-6 cursor-pointer"
      onClick={() => {
        if (!isVisible) setIsRevealed(true);
      }}
    >
      <motion.nav
        aria-label="Primary"
        animate={{
          scale: !isVisible ? 0.95 : 1,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className={`relative flex w-full max-w-1350px items-center justify-between gap-6 rounded-full border border-[var(--nav-border)] px-3 shadow-[0_8px_32px_0_var(--nav-shadow)] transition-[padding,background-color,backdrop-filter,box-shadow,border-color] duration-300 ease-in-out sm:px-4 md:w-[86%] lg:w-[82%] ${
          isVisible
            ? "py-2.5 bg-[var(--nav-bg)] backdrop-blur-2xl"
            : "py-2 bg-[var(--nav-bg)] backdrop-blur-3xl"
        }`}
      >
        {/* Wrap background effects in an overflow-hidden container */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-full">
          {/* Faint noise texture */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />

          {/* Subtle animated diagonal glass reflection */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12"
            style={{
              background:
                "linear-gradient(115deg, transparent, rgba(255,255,255,0.10) 45%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.10) 55%, transparent)",
            }}
            animate={{ x: ["0%", "420%"] }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              repeatDelay: 7,
              ease: "easeInOut",
            }}
          />
        </div>

        <NavLogo />

        <div className="hidden lg:flex">
          <NavLinks activeId={activeId} />
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex">
            <ThemeToggle />
          </div>
          <MobileMenu activeId={activeId} />
        </div>
      </motion.nav>
    </motion.header>
  );
};

export default Navbar;
