import type Lenis from "lenis";

/**
 * lenisInstance.ts
 * =====================================================================
 * Tiny shared reference to the single Lenis instance created in
 * `useSmoothScroll`. Anything that needs to trigger a *smooth* scroll
 * programmatically (e.g. the navbar's anchor links) should go through
 * `getLenis()?.scrollTo(...)` instead of `element.scrollIntoView()` —
 * Lenis owns the virtual scroll position, so a native scroll call
 * would fight it and produce a jump/stutter instead of an eased glide.
 *
 * `useSmoothScroll` is the only writer (`setLenis`). Everything else
 * only reads.
 * =====================================================================
 */

let lenisInstance: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenisInstance = instance;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}
