/**
 * Achievements.tsx
 * =====================================================================
 * Placeholder section — see Projects.tsx for the rationale. Gives the
 * navbar's "Achievements" link a real anchor.
 * =====================================================================
 */

const Achievements = () => {
  return (
    <section
      id="achievements"
      aria-label="Achievements"
      className="relative isolate flex min-h-[70vh] w-full flex-col items-center justify-center overflow-hidden bg-[#0A0E17] px-5 py-24 text-center sm:px-8 md:px-14"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D9694F]/10 blur-[120px]" />
      </div>

      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#E8916F]">
        Recognition
      </p>
      <h2 className="mt-4 bg-linear-to-b from-[#FFF3E6] via-[#F6C89F] to-[#D97B66] bg-clip-text text-[clamp(1.75rem,5vw,3.25rem)] font-extrabold leading-tight text-transparent">
        Achievements
      </h2>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-[#F4F1DE]/60 sm:text-base">
        Awards and milestones are coming soon — this section is wired
        up and ready for content.
      </p>
    </section>
  );
};

export default Achievements;
