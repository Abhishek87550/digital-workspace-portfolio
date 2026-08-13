import { FiExternalLink, FiGithub } from "react-icons/fi";
import ShootingStars from "../ShootingStars";

const DUMMY_PROJECTS = [
  {
    title: "Campus Companion",
    type: "UI/UX Case Study",
    description: "A comprehensive UI/UX case study and design solution aimed at helping new and existing students navigate and engage with their campus more effectively.",
    tech: ["Figma", "UI/UX", "Prototyping", "User Research"],
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
    link: "https://github.com/Abhishek87550/Campus-Companion-",
    github: "https://github.com/Abhishek87550/Campus-Companion-"
  },
  {
    title: "CareConnect",
    type: "UI/UX Design",
    description: "A detailed UI/UX report and design for an intuitive appointment booking application tailored for healthcare professionals and patients.",
    tech: ["Figma", "Healthcare", "Wireframing", "UI Design"],
    image: "https://images.unsplash.com/photo-1576091160550-2173ff9e5ee5?auto=format&fit=crop&q=80&w=800",
    link: "https://github.com/Abhishek87550/CareConnect",
    github: "https://github.com/Abhishek87550/CareConnect"
  },
  {
    title: "Network Routing Simulator",
    type: "Algorithm Visualizer",
    description: "An interactive digital platform designed to visualize and demonstrate the 4 core fundamental routing algorithms in Data Structures and Algorithms (DSA).",
    tech: ["JavaScript", "Algorithms", "DSA", "Visualization"],
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800",
    link: "https://github.com/Abhishek87550/Network_Routing_Simulator",
    github: "https://github.com/Abhishek87550/Network_Routing_Simulator"
  },
  {
    title: "Midas",
    type: "2D Platformer Game",
    description: "An engaging 2D platformer game built entirely from scratch using the C programming language and fundamental physics mechanics.",
    tech: ["C", "Game Development", "Physics Engine"],
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800",
    link: "https://github.com/Abhishek87550/Midas",
    github: "https://github.com/Abhishek87550/Midas"
  }
];

const Projects = () => {
  return (
    <section
      id="projects"
      aria-label="Projects"
      className="relative flex min-h-screen w-full flex-col items-center justify-center bg-transparent px-5 py-24 sm:px-8 md:px-14 lg:px-20"
    >
      <ShootingStars />
      <div className="z-10 w-full max-w-6xl">
        {/* Header */}
        <div className="mb-20 text-center">
          <p className="reveal text-sm font-semibold uppercase tracking-[0.25em] text-[var(--text-highlight)] drop-shadow-[0_0_8px_var(--nav-shadow)]">
            Selected Work
          </p>
          <h2 className="reveal reveal-delay-200 mt-4 font-serif text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-[var(--accent-gradient-from)] via-[var(--accent-gradient-via)] to-[var(--accent-gradient-to)] drop-shadow-[0_12px_25px_var(--nav-shadow)]">
            Featured Projects
          </h2>
          <div className="reveal reveal-delay-300 mx-auto mt-6 h-[1px] w-24 bg-gradient-to-r from-transparent via-[#FAD961] to-transparent opacity-60 shadow-[0_0_15px_#FAD961]"></div>
        </div>

        {/* Projects Stack */}
        <div className="flex flex-col gap-16 md:gap-24">
          {DUMMY_PROJECTS.map((project, index) => (
            <div 
              key={index}
              className={`reveal reveal-delay-200 group relative grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-12`}
            >
              {/* Image Container */}
              <div className={`relative h-[300px] md:h-[450px] w-full overflow-hidden rounded-3xl border border-[var(--nav-border)] shadow-[0_15px_40px_rgba(0,0,0,0.6)] md:col-span-7 transition-all duration-700 group-hover:border-[var(--text-highlight)] ${index % 2 !== 0 ? 'md:order-2 md:col-start-6' : ''}`}>
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Content Container */}
              <div className={`relative z-20 flex flex-col justify-center rounded-3xl border border-[var(--nav-border)] bg-[var(--card-bg)] p-8 backdrop-blur-xl shadow-lg md:col-span-6 md:-mx-12 ${index % 2 !== 0 ? 'md:order-1' : 'md:col-start-7'}`}>
                <p className="mb-2 text-sm font-bold tracking-widest text-[var(--text-highlight)]">
                  {project.type}
                </p>
                <h3 className="mb-6 font-serif text-3xl font-bold text-[var(--text-heading)] drop-shadow-[0_2px_10px_var(--nav-shadow)] sm:text-4xl">
                  {project.title}
                </h3>
                
                <p className="mb-8 text-sm leading-relaxed text-[var(--text-body)] sm:text-base">
                  {project.description}
                </p>

                <div className="mb-8 flex flex-wrap gap-3">
                  {project.tech.map((tech, i) => (
                    <span 
                      key={i} 
                      className="rounded-full border border-[var(--nav-border)] bg-[#E19553]/5 px-4 py-1.5 text-[10px] font-bold tracking-widest text-[var(--text-secondary-heading)] uppercase shadow-[inset_0_0_10px_var(--nav-shadow)] transition-colors duration-300 hover:border-[var(--text-highlight)] hover:text-[var(--text-highlight)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-6">
                  <a 
                    href={project.github}
                    className="group/link flex items-center gap-2 text-sm font-semibold tracking-widest text-[var(--text-muted)] transition-colors hover:text-[var(--text-highlight)]"
                  >
                    <FiGithub className="text-xl transition-transform duration-300 group-hover/link:-translate-y-1 group-hover/link:drop-shadow-[0_0_8px_var(--nav-shadow)]" />
                    <span>CODE</span>
                  </a>
                  <a 
                    href={project.link}
                    className="group/link flex items-center gap-2 text-sm font-semibold tracking-widest text-[var(--text-highlight)] transition-colors hover:text-[var(--text-highlight)]"
                  >
                    <FiExternalLink className="text-xl transition-transform duration-300 group-hover/link:-translate-y-1 group-hover/link:translate-x-1 group-hover/link:drop-shadow-[0_0_8px_var(--nav-shadow)]" />
                    <span>LIVE DEMO</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
