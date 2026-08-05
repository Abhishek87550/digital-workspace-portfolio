import ShootingStars from "../ShootingStars";

const DUMMY_EXPERIENCE = [
  {
    role: "Senior Frontend Engineer",
    company: "TechNova Solutions",
    period: "2023 - Present",
    description: "Lead architect for the core enterprise dashboard. Improved render performance by 40% and mentored a team of 5 developers.",
  },
  {
    role: "Full-Stack Developer",
    company: "Creative Cloud Inc.",
    period: "2021 - 2023",
    description: "Built scalable microservices using Node.js and transitioned legacy React components to a modern Next.js ecosystem.",
  },
  {
    role: "UI/UX Developer",
    company: "Digital Edge Agency",
    period: "2019 - 2021",
    description: "Created award-winning landing pages and interactive 3D web experiences for high-profile clients using Three.js and GSAP.",
  }
];

const Experience = () => {
  return (
    <section
      id="experience"
      aria-label="Experience"
      className="relative flex min-h-screen w-full flex-col items-center justify-center bg-transparent px-5 py-24 sm:px-8 md:px-14 lg:px-20"
    >
      <ShootingStars />
      <div className="z-10 w-full max-w-4xl">
        {/* Header */}
        <div className="mb-20 text-center">
          <p className="reveal text-sm font-semibold uppercase tracking-[0.25em] text-[var(--text-highlight)] drop-shadow-[0_0_8px_var(--nav-shadow)]">
            Career Path
          </p>
          <h2 className="reveal reveal-delay-200 mt-4 font-serif text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-[var(--accent-gradient-from)] via-[var(--accent-gradient-via)] to-[var(--accent-gradient-to)] drop-shadow-[0_12px_25px_var(--nav-shadow)]">
            Experience
          </h2>
          <div className="reveal reveal-delay-300 mx-auto mt-6 h-[1px] w-24 bg-gradient-to-r from-transparent via-[#FAD961] to-transparent opacity-60 shadow-[0_0_15px_#FAD961]"></div>
        </div>

        {/* Vertical Timeline */}
        <div className="relative">
          {/* Central Line */}
          <div className="absolute left-4 top-4 bottom-4 w-px bg-gradient-to-b from-[#8C4F2B] via-[#E19553] to-transparent md:left-1/2 md:-translate-x-1/2" />

          <div className="flex flex-col gap-12">
            {DUMMY_EXPERIENCE.map((exp, index) => (
              <div 
                key={index}
                className={`reveal reveal-delay-${(index % 3 + 2) * 100} group relative flex flex-col gap-8 md:flex-row md:items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Timeline Node */}
                <div className="absolute left-[11px] top-0 h-4 w-4 rounded-full border-2 border-[var(--text-highlight)] bg-[var(--bg-primary)] shadow-[0_0_15px_#FAD961] transition-all duration-500 group-hover:scale-150 group-hover:bg-[#FAD961] md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2" />

                {/* Content Card */}
                <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pl-16' : 'md:pr-16 text-left md:text-right'}`}>
                  <div className="relative overflow-hidden rounded-3xl border border-[var(--nav-border)] bg-[var(--card-bg)] p-8 backdrop-blur-xl shadow-lg transition-all duration-500 hover:-translate-y-2 hover:border-[var(--nav-border)] hover:shadow-[0_20px_40px_var(--nav-shadow),inset_0_0_30px_var(--nav-shadow)]">
                    <div className="absolute inset-0 opacity-0 bg-[radial-gradient(ellipse_at_top_right,var(--nav-shadow)_0%,transparent_70%)] transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
                    
                    <span className="mb-2 block text-xs font-bold tracking-[0.2em] text-[var(--text-highlight)]">
                      {exp.period}
                    </span>
                    <h3 className="mb-1 font-serif text-2xl font-bold text-[var(--text-heading)] drop-shadow-[0_2px_5px_var(--nav-shadow)]">
                      {exp.role}
                    </h3>
                    <h4 className="mb-4 text-sm font-semibold tracking-wide text-[var(--text-secondary-heading)]">
                      {exp.company}
                    </h4>
                    <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                      {exp.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
