/**
 * AboutContent.tsx
 * =====================================================================
 * Left column of the About section — the text/CTA side.
 *
 * Content only: this file fills in the previously-empty placeholders
 * (greeting, name, rotating designation, description, CTAs). The
 * surrounding layout (`About.tsx` grid, column widths, breakpoints)
 * is untouched — every element here still lives inside the same
 * `data-about-*` tagged containers, sized with the same responsive
 * Tailwind scale already established by the layout pass.
 *
 * Visual style (gradient/glow name, accent line, per-role rotating
 * color, glowing pill CTAs) matches the approved design reference.
 *
 * CTA buttons are wired up structurally (semantic <a> elements with
 * accessible labels) but their actual actions (resume file, contact
 * scroll/link target) are placeholders, per spec.
 * =====================================================================
 */

import { FiArrowRight, FiDownload } from "react-icons/fi";
import RotatingDesignation from "./RotatingDesignation";

const NAME = "Abhishek Sharma";
const GREETING = "Hello, I'm";
const DESCRIPTION =
  "I build fast, accessible, and visually considered web experiences — blending clean engineering with interactive 3D and motion design to create digital solutions that make an impact.";

const AboutContent = () => {
  return (
    <div className="flex w-full flex-col justify-center gap-6 text-[#F4F1DE] sm:gap-7 md:gap-8">
      {/* Greeting — short intro line above the name (e.g. "Hello, I'm"). */}
      <p
        data-about-greeting
        className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#E8916F] sm:text-base"
      >
        {GREETING}
        <span
          aria-hidden="true"
          className="h-px w-10 flex-none bg-linear-to-r from-[#E8916F] to-transparent sm:w-14"
        />
      </p>

      {/* Name — gradient fill with a soft glow, matching the design reference. */}
      <h2
        data-about-name
        className="whitespace-nowrap bg-linear-to-b from-[#FFF3E6] via-[#F6C89F] to-[#D97B66] bg-clip-text text-[clamp(1.65rem,6.2vw,4.75rem)] font-extrabold leading-[1.05] text-transparent drop-shadow-[0_0_35px_rgba(217,123,102,0.35)]"
      >
        {NAME}
      </h2>

      {/* Rotating designation — cycling role/title text, one per accent color.
          Fixed min-height (via clamp) reserves space for the tallest
          line across breakpoints so cycling never causes layout shift. */}
      <RotatingDesignation className="flex min-h-[clamp(1.75rem,5vw,2.75rem)] items-center gap-3 text-lg font-medium sm:text-xl md:text-2xl" />

      {/* Professional description */}
      <p
        data-about-description
        className="max-w-prose text-sm leading-relaxed text-[#F4F1DE]/70 sm:text-base md:text-lg"
      >
        {DESCRIPTION}
      </p>

      {/* CTA buttons */}
      <div
        data-about-cta
        role="group"
        aria-label="Call to action"
        className="flex flex-col gap-4 pt-2 sm:flex-row sm:flex-wrap sm:items-center"
      >
        <a
          href="#"
          download
          aria-label="Download resume (PDF)"
          className="group inline-flex items-center justify-center gap-3 rounded-full bg-linear-to-r from-[#F0A583] to-[#D9694F] px-6 py-3 text-sm font-semibold tracking-wide text-[#0A0E17] shadow-[0_0_30px_-6px_rgba(217,123,102,0.65)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_40px_-4px_rgba(217,123,102,0.85)]  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D97B66] sm:px-7 sm:py-3.5 sm:text-base"
        >
          <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full border border-[#0A0E17]/35">
            <FiDownload className="text-sm" aria-hidden="true" />
          </span>
          Download Resume
        </a>

        <a
          href="#contact"
          aria-label="Let's connect — go to contact section"
          className="group inline-flex items-center justify-center gap-3 rounded-full border border-[#7DC9F0]/50 bg-transparent px-6 py-3 text-sm font-semibold tracking-wide text-[#F4F1DE] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#7DC9F0] hover:shadow-[0_0_30px_-8px_rgba(125,201,240,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7DC9F0] sm:px-7 sm:py-3.5 sm:text-base"
        >
          Let&apos;s Connect
          <FiArrowRight
            className="text-base text-[#7DC9F0] transition-transform duration-300 group-hover:translate-x-1 sm:text-lg"
            aria-hidden="true"
          />
        </a>
      </div>
    </div>
  );
};

export default AboutContent;
