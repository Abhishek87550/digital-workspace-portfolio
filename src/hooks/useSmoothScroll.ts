import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis } from "@/lib/lenisInstance";

gsap.registerPlugin(ScrollTrigger);

/**
 * Sets up Lenis smooth scrolling for the whole app and keeps it perfectly
 * in sync with GSAP / ScrollTrigger.
 *
 * Why this is needed: Lenis intercepts the real scroll and replaces it with
 * its own eased virtual scroll position. If GSAP's ScrollTrigger isn't told
 * about that virtual position on every update, any ScrollTrigger-based
 * animation (including anything driven by scroll in the 3D canvas later)
 * will drift out of sync with what the user actually sees scrolling.
 *
 * The fix is to drive Lenis from GSAP's own ticker instead of letting Lenis
 * run its own requestAnimationFrame loop — that way Lenis, GSAP tweens, and
 * ScrollTrigger all advance on the exact same clock, every frame.
 *
 * Call this once, near the root of the app (see App.tsx), after the loading
 * screen has finished and the real page content is mounted.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1, // higher = slower/floatier settle after a scroll flick
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    const onLenisScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onLenisScroll);

    const tickerCallback = (time: number) => {
      // GSAP's ticker time is in seconds; Lenis expects milliseconds.
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);

    // Prevents GSAP from trying to "catch up" with a burst of large steps
    // after the tab was backgrounded/throttled — with Lenis driving the
    // scroll, that catch-up jump looks like a stutter/jump-cut.
    gsap.ticker.lagSmoothing(0);

    setLenis(lenis);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.off("scroll", onLenisScroll);
      lenis.destroy();
      setLenis(null);
    };
  }, []);
}
