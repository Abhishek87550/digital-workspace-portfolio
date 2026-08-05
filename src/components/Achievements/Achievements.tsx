import { FaTrophy, FaMedal, FaStar, FaAward } from "react-icons/fa";
import ShootingStars from "../ShootingStars";

const DUMMY_ACHIEVEMENTS = [
  {
    title: "Site of the Day",
    organization: "Awwwards",
    year: "2023",
    description: "Awarded for exceptional design, creativity, and technical execution on the Nexus 3D WebGL experience.",
    icon: FaTrophy
  },
  {
    title: "Best UX/UI",
    organization: "CSS Design Awards",
    year: "2022",
    description: "Recognized for innovative user interface patterns and seamless micro-interactions on the FinTech Dashboard project.",
    icon: FaMedal
  },
  {
    title: "Top 10 Developer",
    organization: "Frontend Masters",
    year: "2021",
    description: "Voted by the community as one of the top contributing developers in the open-source React ecosystem.",
    icon: FaStar
  },
  {
    title: "Innovation Award",
    organization: "Webby Awards",
    year: "2020",
    description: "Honored for creating an accessible, high-performance web application that pushed the boundaries of modern web standards.",
    icon: FaAward
  }
];

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

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {DUMMY_ACHIEVEMENTS.map((award, index) => (
            <div 
              key={index}
              className={`reveal reveal-delay-${(index % 4 + 2) * 100} group relative overflow-hidden rounded-3xl border border-[var(--nav-border)] bg-[var(--card-bg)] p-8 backdrop-blur-xl shadow-lg transition-all duration-500 hover:-translate-y-2 hover:border-[var(--nav-border)] hover:shadow-[0_20px_40px_var(--nav-shadow),inset_0_0_30px_var(--nav-shadow)] ${index % 2 !== 0 ? 'md:mt-12' : ''}`}
            >
              <div className="absolute inset-0 opacity-0 bg-[radial-gradient(ellipse_at_top_right,var(--nav-shadow)_0%,transparent_70%)] transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--nav-border)] bg-black/50 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:scale-110 group-hover:border-[var(--text-highlight)] group-hover:bg-[#E19553]/20 group-hover:shadow-[0_0_20px_var(--nav-shadow),inset_0_2px_10px_rgba(255,255,255,0.2)]">
                    <award.icon className="text-2xl text-[var(--text-highlight)] transition-colors duration-500 group-hover:text-[var(--text-highlight)] group-hover:drop-shadow-[0_0_8px_var(--nav-shadow)]" />
                  </div>
                  
                  <h3 className="mb-2 font-serif text-2xl font-bold text-[var(--text-heading)] drop-shadow-[0_2px_5px_var(--nav-shadow)]">
                    {award.title}
                  </h3>
                  <div className="mb-6 flex items-center gap-3">
                    <span className="text-sm font-semibold tracking-wider text-[var(--text-secondary-heading)]">
                      {award.organization}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-[#8C4F2B]"></span>
                    <span className="text-xs font-bold tracking-widest text-[var(--text-muted)]">
                      {award.year}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm leading-relaxed text-[var(--text-muted)] group-hover:text-[var(--text-body)] transition-colors duration-300">
                  {award.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
