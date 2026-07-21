/**
 * useScrollDirection.ts
 * =====================================================================
 * Feeds the navbar's "smart scroll" behavior: reports whether the page
 * is at the top, and — once past the top threshold — whether the user
 * is currently scrolling down (navbar recedes: smaller, more
 * transparent) or up (navbar returns to its resting appearance).
 *
 * Direction is only flipped once the pointer has moved more than a
 * small pixel delta since the last sample, so a few px of scroll jitter
 * (trackpads, Lenis momentum) doesn't cause the navbar to flicker
 * between states.
 * =====================================================================
 */

import { useEffect, useRef, useState } from "react";

export type NavScrollState = "top" | "down" | "up";

const TOP_THRESHOLD = 24;
const DIRECTION_DELTA = 6;

export function useScrollDirection(): NavScrollState {
  const [state, setState] = useState<NavScrollState>("top");
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY;

    const evaluate = () => {
      ticking.current = false;
      const y = window.scrollY;

      if (y <= TOP_THRESHOLD) {
        setState("top");
        lastY.current = y;
        return;
      }

      const delta = y - lastY.current;
      if (Math.abs(delta) < DIRECTION_DELTA) return;

      setState(delta > 0 ? "down" : "up");
      lastY.current = y;
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(evaluate);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return state;
}
