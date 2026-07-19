/**
 * About.tsx
 * =====================================================================
 * The portfolio's second section — a full-viewport, two-column layout:
 * text/CTA content on the left, a reserved frame for a future 3D
 * canvas on the right.
 *
 * Structure is unchanged from the original layout pass (same grid,
 * columns, gaps, breakpoints). The only addition is a purely
 * decorative background-glow layer — absolutely positioned, negative
 * z-index, `pointer-events-none`, `aria-hidden` — matching the ambient
 * warm/cool radial glow from the design reference. It sits behind the
 * grid content and never participates in layout or interaction.
 * =====================================================================
 */

import AboutContent from "./AboutContent";
import AboutVisual from "./AboutVisual";

const About = () => {
  return (
    <section
      id="about"
      aria-label="About"
      className="relative isolate grid w-full grid-cols-1 gap-12 overflow-hidden bg-[#0A0E17] px-5 py-16 sm:gap-14 sm:px-8 sm:py-20 md:h-screen md:grid-cols-[45%_55%] md:items-center md:gap-10 md:px-14 md:py-0 lg:gap-16 lg:px-20 xl:px-28"
    >
      {/* Decorative ambient background glow — purely visual, no layout impact.
          Confined to the left side only; nothing is rendered on the right. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#D9694F]/25 blur-110px sm:h-96 sm:w-96 md:h-28rem md:w-28rem" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-[#D9694F]/10 blur-[90px] sm:h-72 sm:w-72" />
      </div>

      <AboutContent />
      <AboutVisual />
    </section>
  );
};

export default About;