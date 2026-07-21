/**
 * NavLinks.tsx
 * =====================================================================
 * Desktop nav item list. Each link has three coordinated interaction
 * layers, all Framer Motion driven:
 *
 *  - Magnetic hover  — the whole link nudges 2–4px toward the cursor
 *                      as it approaches, then springs back on leave.
 *  - Circular fill   — a soft radial surface expands from the center
 *                      on hover, alongside a small lift + glow.
 *  - Active state    — a filled pill (shared layoutId, so it glides
 *                      between items) plus an animated underline and
 *                      glow that update automatically as the
 *                      scrollspy (`activeId`) changes.
 * =====================================================================
 */

import { useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { NAV_ITEMS } from "./navConfig";
import { getLenis } from "@/lib/lenisInstance";

interface NavLinksProps {
  activeId: string;
  className?: string;
  onNavigate?: () => void;
}

const MAGNETIC_STRENGTH = 0.35; // fraction of cursor offset applied
const MAGNETIC_MAX = 4; // px, clamps the pull so it stays subtle

interface NavItemProps {
  id: string;
  label: string;
  isActive: boolean;
  onClick: (e: MouseEvent, id: string) => void;
}

const NavItem = ({ id, label, isActive, onClick }: NavItemProps) => {
  const itemRef = useRef<HTMLAnchorElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.4 });

  const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = itemRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const offsetX = e.clientX - (rect.left + rect.width / 2);
    const offsetY = e.clientY - (rect.top + rect.height / 2);

    const pullX = Math.max(
      -MAGNETIC_MAX,
      Math.min(MAGNETIC_MAX, offsetX * MAGNETIC_STRENGTH)
    );
    const pullY = Math.max(
      -MAGNETIC_MAX,
      Math.min(MAGNETIC_MAX, offsetY * MAGNETIC_STRENGTH)
    );

    x.set(pullX);
    y.set(pullY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <li className="relative">
      <motion.a
        ref={itemRef}
        href={`#${id}`}
        onClick={(e) => onClick(e, id)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        aria-current={isActive ? "true" : undefined}
        style={{ x: springX, y: springY }}
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 400, damping: 24 }}
        className={`group relative block overflow-hidden rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D97B66] ${
          isActive
            ? "text-[#0A0E17]"
            : "text-[#F4F1DE]/70 hover:text-[#F4F1DE]"
        }`}
      >
        {/* Circular fill — expands from center on hover, non-active items only */}
        {!isActive && (
          <motion.span
            aria-hidden="true"
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 -z-10 rounded-full bg-white/10 shadow-[0_0_16px_-2px_rgba(244,241,222,0.35)]"
            style={{ transformOrigin: "center" }}
          />
        )}

        {/* Active filled pill — glides between items via layoutId, with a
            playful overshoot pop whenever it becomes active. */}
        {isActive && (
          <motion.span
            layoutId="nav-active-pill"
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 -z-10 overflow-hidden rounded-full bg-linear-to-r from-[#F0A583] to-[#D9694F] shadow-[0_0_22px_-4px_rgba(217,105,79,0.75)]"
            transition={{ type: "spring", stiffness: 420, damping: 22, mass: 0.7 }}
          >
            {/* Diagonal shine sweeping across the active pill on a loop */}
            <motion.span
              aria-hidden="true"
              className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ["-20%", "220%"] }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                repeatDelay: 2.2,
                ease: "easeInOut",
              }}
            />
          </motion.span>
        )}

        <span className="relative inline-block">{label}</span>

        {/* Animated glow dot — replaces the static underline, gently
            pulses to draw the eye to the current section. */}
        {isActive && (
          <motion.span
            layoutId="nav-active-underline"
            aria-hidden="true"
            className="absolute bottom-0.5 left-1/2 -translate-x-1/2"
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
          >
            <motion.span
              className="block h-4px w-4px rounded-full bg-[#0A0E17]/80 shadow-[0_0_10px_2px_rgba(217,105,79,0.7)]"
              animate={{ scale: [1, 1.6, 1], opacity: [0.9, 0.5, 0.9] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.span>
        )}
      </motion.a>
    </li>
  );
};

const NavLinks = ({ activeId, className = "", onNavigate }: NavLinksProps) => {
  const handleClick = (e: MouseEvent, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;

    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { duration: 1.2, offset: -90 });
    else target.scrollIntoView({ behavior: "smooth" });

    onNavigate?.();
  };

  return (
    <ul
      role="list"
      className={`flex items-center gap-2 rounded-full ${className}`}
    >
      {NAV_ITEMS.map((item) => (
        <NavItem
          key={item.id}
          id={item.id}
          label={item.label}
          isActive={item.id === activeId}
          onClick={handleClick}
        />
      ))}
    </ul>
  );
};

export default NavLinks;
