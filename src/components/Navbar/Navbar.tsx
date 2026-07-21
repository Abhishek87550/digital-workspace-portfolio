/**
 * Navbar.tsx
 * =====================================================================
 * Floating glassmorphism navigation bar — fixed, horizontally centered,
 * with a premium "smart scroll" behavior:
 *
 *  - At the top of the page   → full size, full blur, resting position.
 *  - Scrolling down           → recedes: shifts up slightly, scales
 *                                down a touch, gets a little more
 *                                transparent (feels like it's stepping
 *                                out of the way).
 *  - Scrolling up             → smoothly restores original size, blur
 *                                and opacity (still slightly raised
 *                                until the very top is reached again).
 *
 * Lives outside the app's monochrome-filter wrapper (see App.tsx) so
 * its accent color, active pill, and glow stay alive even when the
 * rest of the page is in Monochrome mode, per spec ("active
 * navigation... may retain a subtle warm orange accent").
 *
 * Breakpoints:
 *  - lg and up  → full desktop layout: logo, centered pill nav, toggle.
 *  - below lg   → glass hamburger + animated dropdown (covers tablet
 *                 and mobile; the bar itself narrows via the `md:w-[86%]`
 *                 step so tablet still reads as "reduced width/spacing"
 *                 before the hamburger takes over the nav items).
 * =====================================================================
 */

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

  const isTop = navState === "top";
  const isDown = navState === "down";

  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="fixed inset-x-0 z-50 flex justify-center px-4 sm:px-6"
      style={{
        top: isTop ? "28px" : "14px",
        transition: "top 500ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <motion.nav
        aria-label="Primary"
        animate={{
          scale: isDown ? 0.97 : 1,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className={`relative flex w-full max-w-1350px items-center justify-between gap-6 overflow-hidden rounded-full border border-white/10 px-5 shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_20px_60px_-15px_rgba(0,0,0,0.55),0_8px_24px_-8px_rgba(0,0,0,0.35)] transition-[padding,background-color,backdrop-filter,box-shadow] duration-500 ease-out sm:px-7 md:w-[86%] lg:w-[82%] ${
          isTop
            ? "py-4 bg-[#0A0E17]/60 backdrop-blur-2xl"
            : isDown
              ? "py-3 bg-[#0A0E17]/45 backdrop-blur-lg"
              : "py-3 bg-[#0A0E17]/78 backdrop-blur-3xl"
        }`}
      >
        {/* Faint noise texture for a premium frosted-glass feel */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 rounded-full opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Subtle animated diagonal glass reflection — sweeps across the
            bar every ~9s, very faint, purely decorative. */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-1/3 -z-10 w-1/3 -skew-x-12"
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
