import { motion } from "framer-motion";
import { getLenis } from "@/lib/lenisInstance";
import logoSrc from "@/assets/images/logo.svg";

const NavLogo = () => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const home = document.getElementById("home");
    if (!home) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(home, { duration: 1.2 });
    else home.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <a
      href="#home"
      onClick={handleClick}
      aria-label="Go to top — Abhishek, Full Stack Developer"
      className="group flex flex-none items-center gap-3 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--nav-active)]"
    >
      <span className="relative flex h-10 w-10 flex-none items-center justify-center">
        {/* Ambient glow pulse behind the logo, purely decorative */}
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 -z-10 rounded-full bg-[var(--nav-active)]/40 blur-md"
          animate={{ opacity: [0.35, 0.7, 0.35], scale: [0.92, 1.08, 0.92] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <img
          src={logoSrc}
          alt=""
          aria-hidden="true"
          className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </span>

      <span className="hidden flex-col leading-tight sm:flex">
        <span className="text-sm font-semibold text-[var(--nav-text)]">Abhishek</span>
        <span className="text-[11px] font-medium tracking-wide text-[var(--nav-text)]/55">
          Full Stack Developer
        </span>
      </span>
    </a>
  );
};

export default NavLogo;
