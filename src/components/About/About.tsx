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
      className="relative isolate grid w-full grid-cols-1 gap-12 overflow-hidden bg-transparent px-5 py-16 sm:gap-14 sm:px-8 sm:py-20 md:h-screen md:grid-cols-[45%_55%] md:items-center md:gap-10 md:px-14 md:py-0 lg:gap-16 lg:px-20 xl:px-28 transition-colors duration-300"
    >
      {/* Modern fluid background design (Made static for performance) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[var(--about-blob-1)] blur-[120px] md:h-[32rem] md:w-[32rem] opacity-70" />
        <div className="absolute top-1/2 -right-32 h-[30rem] w-[30rem] -translate-y-1/2 rounded-full bg-[var(--about-blob-2)] blur-[140px] opacity-70" />
        <div className="absolute -bottom-16 left-1/4 h-80 w-80 rounded-full bg-[var(--about-blob-1)] blur-[120px] opacity-70" />
      </div>

      <AboutContent />
      <AboutVisual />
    </section>
  );
};

export default About;