import { FiDownload } from "react-icons/fi";
import ShootingStars from "../ShootingStars";

const Resume = () => {
  return (
    <section
      id="resume"
      aria-label="Resume"
      className="relative flex min-h-screen w-full flex-col items-center justify-center bg-transparent px-5 py-24 sm:px-8 md:px-14 lg:px-20"
    >
      <ShootingStars />
      <div className="z-10 w-full max-w-5xl">
        {/* Header */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#3e3e42] pb-6 gap-6">
          <div>
            <p className="reveal text-sm font-semibold uppercase tracking-[0.25em] text-[var(--text-highlight)] drop-shadow-[0_0_8px_var(--nav-shadow)]">
              Curriculum Vitae
            </p>
            <h2 className="reveal reveal-delay-200 mt-2 font-serif text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-[var(--accent-gradient-from)] via-[var(--accent-gradient-via)] to-[var(--accent-gradient-to)] drop-shadow-[0_12px_25px_var(--nav-shadow)]">
              My Resume
            </h2>
          </div>
          
          <a
            href="#"
            className="reveal reveal-delay-300 group flex items-center justify-center gap-3 rounded-full border border-[var(--nav-border)] bg-black/40 px-6 py-3 text-sm font-bold tracking-widest text-[var(--text-highlight)] backdrop-blur-md transition-all duration-300 hover:border-[var(--text-highlight)] hover:bg-[#E19553]/10 hover:shadow-[0_0_15px_var(--nav-shadow)]"
          >
            <span>DOWNLOAD PDF</span>
            <FiDownload className="text-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:text-white" />
          </a>
        </div>

        {/* Document Viewer Container */}
        <div className="reveal reveal-delay-400 relative mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-[#3e3e42] bg-[#1e1e1e] shadow-[0_20px_50px_rgba(0,0,0,0.7)] h-[70vh] flex flex-col">
          {/* Top Bar resembling a PDF viewer */}
          <div className="flex h-12 w-full items-center justify-between border-b border-[#3e3e42] bg-[#252526] px-4">
            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full bg-[#ff5f56]"></div>
              <div className="h-3 w-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="h-3 w-3 rounded-full bg-[#27c93f]"></div>
            </div>
            <div className="text-xs font-semibold tracking-wider text-[#858585]">
              abhishek_sharma_resume.pdf
            </div>
            <div className="flex gap-3 text-[#858585]">
              <span className="hidden sm:block text-xs font-semibold">Page 1 of 1</span>
            </div>
          </div>

          {/* Document Scrolling Area */}
          <div 
            data-lenis-prevent="true"
            className="flex-1 overflow-y-auto overflow-x-hidden p-8 sm:p-12 md:p-16 custom-scrollbar bg-[#2d2d2d] flex justify-center"
          >
            
            {/* The Document Page (Placeholder) */}
            <div className="w-full max-w-3xl min-h-[1000px] bg-white rounded-md shadow-2xl p-10 flex flex-col">
              {/* Dummy Document Content */}
              <div className="border-b-2 border-gray-800 pb-6 mb-8 text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">ABHISHEK SHARMA</h1>
                <p className="text-gray-600 font-medium">B-Tech @ IIT Jodhpur | Software Engineer</p>
                <div className="flex justify-center gap-4 mt-3 text-sm text-[var(--text-muted)]">
                  <span>abhishek.dev</span>
                  <span>|</span>
                  <span>github.com/abhishek</span>
                  <span>|</span>
                  <span>linkedin.com/in/abhishek</span>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4">EDUCATION</h2>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900">Indian Institute of Technology (IIT) Jodhpur</h3>
                    <p className="text-gray-600 italic">Bachelor of Technology</p>
                  </div>
                  <span className="text-[var(--text-muted)] text-sm font-semibold">2022 - 2026</span>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4">EXPERIENCE</h2>
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">Software Development Intern</h3>
                      <p className="text-gray-600 italic">CyberUltron</p>
                    </div>
                    <span className="text-[var(--text-muted)] text-sm font-semibold">2023 - Present</span>
                  </div>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-2 mt-3">
                    <li>Engineered high-performance backend microservices utilizing Node.js and scalable cloud infrastructure.</li>
                    <li>Reduced API response times by 30% through effective database indexing and caching strategies.</li>
                    <li>Collaborated cross-functionally to define architecture and deliver production-ready features.</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4">TECHNICAL SKILLS</h2>
                <div className="text-gray-700 text-sm space-y-2">
                  <p><span className="font-bold text-gray-900">Languages:</span> C++, Python, JavaScript, TypeScript, SQL</p>
                  <p><span className="font-bold text-gray-900">Frameworks:</span> React, Next.js, Express, Tailwind CSS</p>
                  <p><span className="font-bold text-gray-900">Focus Areas:</span> Distributed Systems, Algorithms, High-Performance Scalable Backends</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resume;
