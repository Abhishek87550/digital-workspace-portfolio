/**
 * RotatingDesignation.tsx
 * =====================================================================
 * Isolated, infinitely-looping "role title" cycler used inside the
 * About section's left column (see `data-about-designation` in
 * `AboutContent.tsx`).
 *
 * - Cycles through a fixed list of designations, one at a time.
 * - Each designation carries its own accent color (matching the
 *   palette used elsewhere in the design), so the cycling text also
 *   shifts color in sync — echoing a multi-color "tag list" look
 *   without needing to render all four at once.
 * - Uses framer-motion (already a project dependency) for a smooth
 *   fade + vertical-slide crossfade between words.
 * - The wrapper height is fixed via a shared `min-h` class passed in
 *   from the parent, so swapping words never shifts surrounding
 *   layout (no CLS), on desktop or mobile.
 * - `aria-live="polite"` + `aria-atomic` announce the change to
 *   screen readers without spamming them on every tick, and the
 *   underlying text remains real, selectable DOM text.
 * =====================================================================
 */

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const DESIGNATIONS = [
  { text: "Full Stack Developer", color: "#E8916F" },
  { text: "UI/UX Designer", color: "#9CA3AF" },
  { text: "AI Enthusiast", color: "#B79CF2" },
  { text: "Problem Solver", color: "#7DC9F0" },
] as const;

const ROTATE_INTERVAL_MS = 2400;

interface RotatingDesignationProps {
  className?: string;
}

const RotatingDesignation = ({ className }: RotatingDesignationProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % DESIGNATIONS.length);
    }, ROTATE_INTERVAL_MS);

    return () => window.clearInterval(id);
  }, []);

  const current = DESIGNATIONS[index];

  return (
    <p
      data-about-designation
      className={className}
      aria-live="polite"
      aria-atomic="true"
    >
      <span aria-hidden="true" className="text-[#F4F1DE]/25">
        |
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={current.text}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          style={{ color: current.color }}
          className="inline-block font-semibold"
        >
          {current.text}
        </motion.span>
      </AnimatePresence>
      <span aria-hidden="true" className="text-[#F4F1DE]/25">
        |
      </span>
    </p>
  );
};

export default RotatingDesignation;
