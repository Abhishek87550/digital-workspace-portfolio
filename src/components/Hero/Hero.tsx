import ShootingStars from "../ShootingStars";
import TerminalTypingEffect from "./TerminalTypingEffect";

const Hero = () => {
  return (
    <section
      id="home"
      aria-label="Home"
      className="relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden bg-transparent px-5 pt-20 sm:px-8 md:px-14 lg:px-20 xl:px-28"
    >
      <ShootingStars />
      
      <div className="z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center mt-[-60px]">
        
        {/* Left Column: Text & Buttons */}
        <div className="flex flex-col items-start text-left">
          <p className="reveal text-sm font-semibold uppercase tracking-[0.25em] text-[var(--text-highlight)] drop-shadow-[0_0_8px_var(--nav-shadow)]">
            Abhishek Sharma <span className="mx-2 text-[var(--text-highlight)]">|</span> B-Tech @IIT Jodhpur
          </p>
          
          <h1 className="reveal reveal-delay-200 mt-6 font-serif text-[clamp(2.5rem,6vw,5.5rem)] font-extrabold leading-[1.05] tracking-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[var(--accent-gradient-from)] to-[var(--accent-gradient-to)] drop-shadow-[0_12px_25px_var(--nav-shadow)]">
              Crafting
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[var(--accent-gradient-via)] to-[var(--accent-gradient-to)] drop-shadow-[0_12px_25px_var(--nav-shadow)]">
              Digital Value
            </span>
          </h1>
          
          <p className="reveal reveal-delay-300 mt-8 max-w-xl text-lg font-light leading-relaxed text-[var(--text-body)]">
            A software engineer focused on building robust backends, immersive frontends, and scalable systems that solve complex problems and elevate human experiences.
          </p>
          
          <div className="reveal reveal-delay-400 mt-10 flex flex-wrap items-center gap-6">
            <a 
              href="#projects"
              className="shine-sweep group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-[#FAD961] via-[#F2B37E] to-[#E19553] px-8 py-4 font-bold tracking-wide text-black shadow-[0_10px_30px_var(--nav-shadow)] transition-all duration-300 hover:scale-105 hover:shadow-[0_15px_40px_var(--nav-shadow)] focus:outline-none focus:ring-4 focus:ring-[#FAD961]/50"
            >
              <span className="relative z-10 drop-shadow-sm">View Projects</span>
            </a>
            
            <a 
              href="#resume"
              className="group inline-flex items-center justify-center gap-3 rounded-full border-2 border-[var(--nav-border)] bg-black/40 px-8 py-4 font-bold tracking-wide text-[var(--text-highlight)] shadow-[inset_0_0_15px_var(--nav-shadow)] backdrop-blur-md transition-all duration-300 hover:bg-[#E19553]/10 hover:shadow-[0_0_20px_var(--nav-shadow),inset_0_0_20px_var(--nav-shadow)] focus:outline-none focus:ring-4 focus:ring-[#E19553]/50"
            >
              View Resume
            </a>
          </div>
        </div>

        {/* Right Column: Terminal Component */}
        <div className="reveal reveal-delay-500 flex justify-center lg:justify-end w-full">
          <TerminalTypingEffect />
        </div>

      </div>

      {/* Animated Mouse Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <a 
          href="#about" 
          aria-label="Scroll to view resume"
          className="flex flex-col items-center gap-2 opacity-70 transition-opacity hover:opacity-100"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--text-highlight)] font-semibold">Scroll to view resume</span>
          <div className="w-[26px] h-[42px] rounded-full border-2 border-[var(--text-highlight)] flex justify-center p-1 relative shadow-[0_0_10px_var(--nav-shadow)]">
            <div className="w-1 h-2 bg-[#FAD961] rounded-full animate-bounce shadow-[0_0_5px_var(--nav-shadow)]" />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
