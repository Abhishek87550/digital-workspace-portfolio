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
    <div className="flex w-full flex-col justify-center gap-6 text-[var(--text-body)] sm:gap-7 md:gap-8">
      {/* Greeting */}
      <p
        data-about-greeting
        className="reveal flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-[var(--text-highlight)] drop-shadow-[0_0_8px_var(--nav-shadow)] sm:text-base"
      >
        {GREETING}
        <span
          aria-hidden="true"
          className="h-px w-10 flex-none bg-gradient-to-r from-[#FAD961] to-transparent sm:w-14"
        />
      </p>

      {/* Name */}
      <h2
        data-about-name
        className="reveal reveal-delay-200 font-serif bg-gradient-to-b from-[var(--accent-gradient-from)] via-[var(--accent-gradient-via)] to-[var(--accent-gradient-to)] bg-clip-text text-[clamp(1.55rem,6.2vw,4.75rem)] font-extrabold leading-[1.05] text-transparent drop-shadow-[0_12px_25px_var(--nav-shadow)]"
      >
        {NAME}
      </h2>

      {/* Rotating designation */}
      <div className="reveal reveal-delay-300">
        <RotatingDesignation className="flex min-h-[clamp(1.75rem,5vw,2.75rem)] items-center gap-3 text-lg font-medium text-[var(--text-secondary-heading)] drop-shadow-[0_0_5px_rgba(242,179,126,0.5)] sm:text-xl md:text-2xl" />
      </div>

      {/* Professional description */}
      <p
        data-about-description
        className="reveal reveal-delay-400 max-w-prose text-sm leading-relaxed text-[var(--text-body)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] sm:text-base md:text-lg"
      >
        {DESCRIPTION}
      </p>

      {/* CTA buttons */}
      <div
        data-about-cta
        role="group"
        aria-label="Call to action"
        className="reveal reveal-delay-500 flex flex-col gap-4 pt-2 sm:flex-row sm:flex-wrap sm:items-center"
      >
        <a
          href="/assets/Resume.pdf"
          download="Abhishek_Sharma_Resume.pdf"
          aria-label="Download resume (PDF)"
          className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#8C4F2B] via-[#E19553] to-[#8C4F2B] bg-[length:200%_auto] px-6 py-3 text-sm font-bold tracking-widest text-white shadow-[0_5px_15px_var(--nav-shadow),inset_0_2px_5px_rgba(255,255,255,0.3)] transition-all duration-500 hover:-translate-y-1 hover:bg-[position:right_center] hover:shadow-[0_10px_35px_var(--nav-shadow),inset_0_2px_8px_rgba(255,255,255,0.5)] sm:px-7 sm:py-3.5 sm:text-base"
        >
          <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-white/20">
            <FiDownload className="text-sm drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" aria-hidden="true" />
          </span>
          <span className="relative z-10 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">Download Resume</span>
        </a>

        <a
          href="#contact"
          aria-label="Let's connect — go to contact section"
          className="group relative inline-flex items-center justify-center gap-3 rounded-full border border-[var(--nav-border)] bg-black/40 backdrop-blur-md px-6 py-3 text-sm font-bold tracking-widest text-[var(--text-highlight)] shadow-[0_0_15px_var(--nav-shadow),inset_0_0_10px_var(--nav-shadow)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--text-highlight)] hover:bg-[#E19553]/10 hover:shadow-[0_10px_25px_var(--nav-shadow),inset_0_0_15px_var(--nav-shadow)] sm:px-7 sm:py-3.5 sm:text-base"
        >
          Let&apos;s Connect
          <FiArrowRight
            className="text-base transition-transform duration-300 group-hover:translate-x-1 sm:text-lg drop-shadow-[0_0_8px_var(--nav-shadow)]"
            aria-hidden="true"
          />
        </a>
      </div>
    </div>
  );
};

export default AboutContent;
