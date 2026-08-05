/**
 * useActiveSection.ts
 * =====================================================================
 * Scrollspy: watches a list of section ids and reports which one is
 * currently "in focus" so the navbar can highlight the matching link.
 *
 * Uses a thin "sliver" IntersectionObserver band located at 20% from 
 * the top of the viewport. Whichever section intersects this 1% tall 
 * band is considered the active section. This guarantees that only one
 * section is active at a time and fixes bugs with varying screen heights.
 * =====================================================================
 */

import { useEffect, useState } from "react";

export function useActiveSection(sectionIds: string[]): string {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? "");

  useEffect(() => {
    let elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    // If some elements are missing (e.g., async mounting), try again after a short delay
    if (elements.length < sectionIds.length) {
      setTimeout(() => {
        elements = sectionIds
          .map((id) => document.getElementById(id))
          .filter((el): el is HTMLElement => el !== null);
        elements.forEach((el) => observer.observe(el));
      }, 500);
    }

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        // A thin 1% horizontal band positioned at 20% from the top of the screen.
        // This acts as the "sensor" line.
        rootMargin: "-20% 0px -79% 0px",
        threshold: 0,
      }
    );

    elements.forEach((el) => observer.observe(el));

    // Fallback: If we scroll to the absolute top, force 'home' to be active
    const handleScroll = () => {
      if (window.scrollY < 50) {
        setActiveId(sectionIds[0]);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sectionIds]);

  return activeId;
}
