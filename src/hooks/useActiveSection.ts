/**
 * useActiveSection.ts
 * =====================================================================
 * Scrollspy: watches a list of section ids and reports which one is
 * currently "in focus" so the navbar can highlight the matching link
 * and animate the underline to it as the user scrolls.
 *
 * Uses IntersectionObserver (not scroll-position math) so it stays
 * cheap and accurate regardless of section height, and works fine
 * alongside Lenis's virtual scroll since it only cares about actual
 * element visibility, not scroll offsets.
 *
 * A section counts as "active" once its top has crossed a line a
 * little below the fixed navbar — the rootMargin below pulls the
 * effective viewport up so the switch feels like it happens right as
 * a section arrives under the navbar, not once it's fully in frame.
 * =====================================================================
 */

import { useEffect, useState } from "react";

export function useActiveSection(sectionIds: string[]): string {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? "");

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    // Track intersection ratios so, if multiple sections are partly
    // visible at once (short sections, fast scroll), we can pick the
    // one most in view rather than whichever fired last.
    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        let bestId = activeId;
        let bestRatio = 0;
        for (const [id, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestRatio > 0) setActiveId(bestId);
      },
      {
        // Shrinks the effective viewport to a band just under where
        // the floating navbar sits, so activation lines up with what
        // the user perceives as "now scrolled into this section".
        rootMargin: "-110px 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIds.join(",")]);

  return activeId;
}
