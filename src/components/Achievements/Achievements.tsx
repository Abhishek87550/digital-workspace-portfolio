import ShootingStars from "../ShootingStars";
const Achievements = () => {
  return (
    <section
      id="achievements"
      aria-label="Achievements"
      className="relative flex min-h-screen w-full flex-col items-center justify-center bg-transparent px-5 py-24 sm:px-8 md:px-14 lg:px-20"
    >
      <ShootingStars />
      <div className="z-10 w-full max-w-6xl">
        {/* Header */}
        <div className="mb-20 text-center">
          <p className="reveal text-sm font-semibold uppercase tracking-[0.25em] text-[var(--text-highlight)] drop-shadow-[0_0_8px_var(--nav-shadow)]">
            Recognition
          </p>
          <h2 className="reveal reveal-delay-200 mt-4 font-serif text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-[var(--accent-gradient-from)] via-[var(--accent-gradient-via)] to-[var(--accent-gradient-to)] drop-shadow-[0_12px_25px_var(--nav-shadow)]">
            Achievements
          </h2>
          <div className="reveal reveal-delay-300 mx-auto mt-6 h-[1px] w-24 bg-gradient-to-r from-transparent via-[#FAD961] to-transparent opacity-60 shadow-[0_0_15px_#FAD961]"></div>
        </div>

        {/* Placeholder */}
        <div className="flex justify-center items-center py-20">
          <p className="reveal text-xl md:text-2xl font-serif italic text-[var(--text-muted)] text-center tracking-wide">
            Yet to be built...
          </p>
        </div>
      </div>
    </section>
  );
};

export default Achievements;
