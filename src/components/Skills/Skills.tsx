"use client";

import { useState, useRef, useEffect } from "react";
import Spline from "@splinetool/react-spline";
import { motion, AnimatePresence } from "framer-motion";

// ==========================================
// 1. SKILLS DATA
// ==========================================
interface Skill {
  name: string;
  category: string;
  icon: string;
  description: string;
}

const SKILLS_DATA: Record<string, Skill> = {
  js: { name: "JavaScript", category: "Languages", icon: "/assets/logos/javascript-mono.svg", description: "The programming language of the Web." },
  ts: { name: "TypeScript", category: "Languages", icon: "/assets/logos/typescript-mono.svg", description: "Strongly typed programming language that builds on JavaScript." },
  html: { name: "HTML5", category: "Frontend", icon: "/assets/logos/react-mono.svg", description: "The standard markup language for documents designed to be displayed in a web browser." },
  css: { name: "CSS3", category: "Frontend", icon: "/assets/logos/tailwind-css-mono.svg", description: "Style sheet language used for describing the presentation of a document." },
  react: { name: "React", category: "Frontend", icon: "/assets/logos/react-mono.svg", description: "A JavaScript library for building user interfaces." },
  vue: { name: "Vue.js", category: "Frontend", icon: "/assets/logos/vuedotjs-mono.svg", description: "The Progressive JavaScript Framework." },
  nextjs: { name: "Next.js", category: "Frontend / Fullstack", icon: "/assets/logos/nextdotjs-mono.svg", description: "The React Framework for the Web." },
  tailwind: { name: "Tailwind CSS", category: "Styling", icon: "/assets/logos/tailwind-css-mono.svg", description: "A utility-first CSS framework for rapid UI development." },
  nodejs: { name: "Node.js", category: "Backend", icon: "/assets/logos/nodedotjs-mono.svg", description: "JavaScript runtime built on Chrome's V8 engine." },
  express: { name: "Express.js", category: "Backend", icon: "/assets/logos/express-mono.svg", description: "Fast, unopinionated, minimalist web framework for Node.js." },
  postgres: { name: "PostgreSQL", category: "Database", icon: "/assets/logos/postgresql-mono.svg", description: "The World's Most Advanced Open Source Relational Database." },
  mongodb: { name: "MongoDB", category: "Database", icon: "/assets/logos/mongodb-mono.svg", description: "The developer data platform." },
  git: { name: "Git", category: "Tools", icon: "/assets/logos/github-mono.svg", description: "Free and open source distributed version control system." },
  github: { name: "GitHub", category: "Tools", icon: "/assets/logos/github-mono.svg", description: "Where the world builds software." },
  prettier: { name: "Prettier", category: "Tools", icon: "/assets/logos/react-mono.svg", description: "Opinionated Code Formatter." },
  npm: { name: "NPM", category: "Tools", icon: "/assets/logos/nodedotjs-mono.svg", description: "Essential JavaScript development tools." },
  firebase: { name: "Firebase", category: "Cloud", icon: "/assets/logos/firebase-mono.svg", description: "An app development platform that helps you build and grow apps." },
  wordpress: { name: "WordPress", category: "CMS", icon: "/assets/logos/react-mono.svg", description: "Beautiful designs, powerful features, and the freedom to build anything." },
  linux: { name: "Linux", category: "OS", icon: "/assets/logos/docker-mono.svg", description: "Open source operating system." },
  docker: { name: "Docker", category: "DevOps", icon: "/assets/logos/docker-mono.svg", description: "Empowering App Development for Developers." },
  nginx: { name: "NGINX", category: "DevOps", icon: "/assets/logos/docker-mono.svg", description: "High Performance Load Balancer, Web Server, & Reverse Proxy." },
  aws: { name: "AWS", category: "Cloud", icon: "/assets/logos/cloudflare-mono.svg", description: "Amazon Web Services Cloud Computing." },
  gcp: { name: "Google Cloud", category: "Cloud", icon: "/assets/logos/cloudflare-mono.svg", description: "Google Cloud Platform Computing Services." },
  vim: { name: "Vim", category: "Tools", icon: "/assets/logos/react-mono.svg", description: "A highly configurable text editor." },
  vercel: { name: "Vercel", category: "Cloud", icon: "/assets/logos/vercel-mono.svg", description: "Develop. Preview. Ship." }
};

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
export default function Skills() {
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);
  const activeSkillRef = useRef<Skill | null>(null);

  // Spline Interactions setup
  const [splineApp, setSplineApp] = useState<any>(null);

  // Audio Refs
  const pressSound = useRef<HTMLAudioElement | null>(null);
  const releaseSound = useRef<HTMLAudioElement | null>(null);

  // Dragging State for 360 Rotation
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

  // Initialize Audio
  useEffect(() => {
    pressSound.current = new Audio("/assets/keycap-sounds/press.mp3");
    releaseSound.current = new Audio("/assets/keycap-sounds/release.mp3");
  }, []);

  // Audio Playback Helpers
  const playPressSound = () => {
    if (pressSound.current) {
      pressSound.current.currentTime = 0;
      pressSound.current.play().catch(() => {});
    }
  };

  const playReleaseSound = () => {
    if (releaseSound.current) {
      releaseSound.current.currentTime = 0;
      releaseSound.current.play().catch(() => {});
    }
  };

  // Spline Interaction Handlers
  const handleMouseDown = () => {
    playPressSound();
  };

  const handleMouseUp = () => {
    playReleaseSound();
  };

  const handleMouseHover = (e: any) => {
    const keyName = e.target.name;
    
    if (keyName === "body" || keyName === "platform") {
      if (activeSkillRef.current) {
        playReleaseSound();
        setActiveSkill(null);
        activeSkillRef.current = null;
      }
      return;
    }

    const skill = SKILLS_DATA[keyName];
    if (skill) {
      if (!activeSkillRef.current || activeSkillRef.current.name !== skill.name) {
        if (activeSkillRef.current) playReleaseSound();
        playPressSound();
        setActiveSkill(skill);
        activeSkillRef.current = skill;
      }
    }
  };

  useEffect(() => {
    if (!splineApp) return;

    const onMouseDown = () => handleMouseDown();
    const onMouseUp = () => handleMouseUp();
    const onMouseHover = (e: any) => handleMouseHover(e);

    splineApp.addEventListener("mouseDown", onMouseDown);
    splineApp.addEventListener("mouseUp", onMouseUp);
    splineApp.addEventListener("mouseHover", onMouseHover);

    const updateScale = () => {
      const kbd = splineApp.findObjectByName("keyboard");
      if (kbd) {
        const isMobile = window.innerWidth < 768;
        // Increased mobile scale from 0.15 to 0.22 so it's fully visible and usable on phones
        const scale = isMobile ? 0.22 : 0.25;
        kbd.scale.x = scale;
        kbd.scale.y = scale;
        kbd.scale.z = scale;
        kbd.position.y = isMobile ? -10 : -40;
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);

    const allObjects = splineApp.getAllObjects();
    allObjects
      .filter((obj: any) => obj.name === "keycap-desktop" || obj.name === "keycap")
      .forEach((keycap: any) => {
        keycap.visible = true;
        if (keycap.name === "keycap") {
          keycap.position.y = 50; 
        }
      });

    return () => {
      splineApp.removeEventListener("mouseDown", onMouseDown);
      splineApp.removeEventListener("mouseUp", onMouseUp);
      splineApp.removeEventListener("mouseHover", onMouseHover);
      window.removeEventListener("resize", updateScale);
    };
  }, [splineApp]);

  // Global Drag Handlers for 360 Rotation
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      isDragging.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDragging.current = false;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (isDragging.current && splineApp) {
        const kbd = splineApp.findObjectByName("keyboard");
        if (kbd) {
          const deltaX = e.clientX - previousMousePosition.current.x;
          const deltaY = e.clientY - previousMousePosition.current.y;
          
          kbd.rotation.y += deltaX * 0.005;
          kbd.rotation.x += deltaY * 0.005;
          
          // Removed X rotation clamping so the keyboard acts as a full 360-degree model
          // kbd.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, kbd.rotation.x));
        }
        previousMousePosition.current = { x: e.clientX, y: e.clientY };
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerUp); // cancel drag if mouse leaves window

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerUp);
    };
  }, [splineApp]);
  // Canvas Starfield Effect
  useEffect(() => {
    const canvas = document.getElementById("skills-stars-canvas") as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let stars: { x: number, y: number, radius: number, vx: number, vy: number, alpha: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      const numStars = window.innerWidth < 768 ? 50 : 150;
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5,
          vx: Math.random() * 0.2 - 0.1,
          vy: Math.random() * 0.2 - 0.1,
          alpha: Math.random()
        });
      }
    };

    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#ffffff";
      stars.forEach(star => {
        ctx.globalAlpha = Math.abs(Math.sin(star.alpha)) * 0.8 + 0.2;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
        
        star.x += star.vx;
        star.y += star.vy;
        star.alpha += 0.02;

        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;
      });
      animationFrameId = requestAnimationFrame(drawStars);
    };

    resize();
    window.addEventListener("resize", resize);
    drawStars();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section id="skills" aria-label="Skills" className="relative w-full min-h-screen flex items-center justify-center bg-transparent overflow-hidden">
      
      {/* High-Performance Canvas Starfield & Glowing Nebulas */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <canvas id="skills-stars-canvas" className="absolute inset-0 w-full h-full opacity-60" />
        <div className="absolute top-0 left-0 h-[80vh] w-[80vw] -translate-x-1/4 -translate-y-1/4 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(110,80,225,0.12)_0%,transparent_60%)] blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-[90vh] w-[90vw] translate-x-1/3 translate-y-1/4 rounded-full bg-[radial-gradient(ellipse_at_center,var(--nav-shadow)_0%,transparent_60%)] blur-[120px]" />
      </div>

      {/* Header */}
      <div className="absolute top-24 z-10 w-full flex flex-col items-center pointer-events-none px-4">
        <h2 className="font-serif text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-[var(--accent-gradient-from)] via-[var(--accent-gradient-via)] to-[var(--accent-gradient-to)] drop-shadow-[0_12px_25px_var(--nav-shadow)] text-center">
          Technical Skills
        </h2>
        <p className="mt-4 max-w-2xl text-base sm:text-lg text-[#b8b8b8] mx-auto text-center">
          Drag to rotate the interactive 3D keyboard below to explore my tech stack.
        </p>
      </div>

      {/* 2. Spline 3D Keyboard */}
      <div className="w-full h-screen z-10 absolute inset-0 pt-32 touch-none">
        <Spline
          scene="/assets/skills-keyboard.spline"
          onLoad={(app) => setSplineApp(app)}
        />
      </div>

      {/* 3. Skill Hover Information Card (Smoothly Animated) */}
      <AnimatePresence>
        {activeSkill && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 p-4 sm:p-5 rounded-2xl bg-black/80 backdrop-blur-xl border border-[#3e3e42] text-[var(--text-heading)] w-[90vw] sm:w-[350px] max-w-sm z-20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-none"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="p-2 bg-[#1a1a1a] rounded-lg border border-[var(--nav-border)]">
                <img
                  src={activeSkill.icon}
                  alt={activeSkill.name}
                  className="w-6 h-6 sm:w-8 sm:h-8 invert"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg sm:text-xl tracking-wide">{activeSkill.name}</h3>
                <span className="text-[10px] sm:text-xs font-semibold text-[var(--text-highlight)] uppercase tracking-wider">
                  {activeSkill.category}
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#858585] leading-relaxed">
              {activeSkill.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
