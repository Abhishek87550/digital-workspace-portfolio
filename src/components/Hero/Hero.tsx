/**
 * Hero.tsx
 * =====================================================================
 * Landing section — the "Home" anchor the navbar's logo and first nav
 * item scroll to. Kept intentionally light (no new 3D/animation work):
 * this pass's brief is the navbar + theme system, not a full hero
 * redesign, so this is a clean, on-brand placeholder matching the
 * palette already established in About.tsx, ready to be built out
 * further in a dedicated pass.
 * =====================================================================
 */

const Hero = () => {
  return (
    <section
      id="home"
      aria-label="Home"
      className="relative isolate flex min-h-screen w-full items-center overflow-hidden bg-[#0A0E17] px-5 pt-32 sm:px-8 md:px-14 lg:px-20 xl:px-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-[#7DC9F0]/10 blur-[110px] sm:h-96 sm:w-96" />
        <div className="absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-[#D9694F]/15 blur-[100px]" />
      </div>

      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#E8916F]">
          Digital Workspace
        </p>
        <h1 className="mt-5 bg-linear-to-b from-[#FFF3E6] via-[#F6C89F] to-[#D97B66] bg-clip-text text-[clamp(2.25rem,7vw,5rem)] font-extrabold leading-[1.05] text-transparent">
          Building considered, high-craft web experiences.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-[#F4F1DE]/70 sm:text-lg">
          Scroll to explore the work — from interactive 3D to production
          engineering.
        </p>
      </div>
    </section>
  );
};

export default Hero;
