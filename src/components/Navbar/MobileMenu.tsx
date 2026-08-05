import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { NAV_ITEMS } from "./navConfig";
import { getLenis } from "@/lib/lenisInstance";
import ThemeToggle from "./ThemeToggle";

interface MobileMenuProps {
  activeId: string;
}

const MobileMenu = ({ activeId }: MobileMenuProps) => {
  const [open, setOpen] = useState(false);

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    setOpen(false);
    if (!target) return;

    // Let the collapse animation start before the (also-smooth) scroll
    // kicks in, so the two motions don't visually compete.
    window.setTimeout(() => {
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(target, { duration: 1.2, offset: 0 });
      else target.scrollIntoView({ behavior: "smooth" });
    }, 120);
  };

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav-dropdown"
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--nav-border)] bg-[var(--nav-text)]/5 text-[var(--nav-text)] backdrop-blur-sm transition-colors duration-300 hover:bg-[var(--nav-text)]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--nav-active)]"
      >
        {open ? <FiX className="text-lg" /> : <FiMenu className="text-lg" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav-dropdown"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute left-4 right-4 top-[calc(100%+10px)] z-40 overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-3 shadow-[0_20px_60px_-15px_var(--card-shadow)] backdrop-blur-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <nav aria-label="Mobile">
              <ul role="list" className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = item.id === activeId;
                  return (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => handleClick(e, item.id)}
                        aria-current={isActive ? "true" : undefined}
                        className={`block rounded-2xl px-4 py-3 text-base font-medium transition-colors duration-200 ${
                          isActive
                            ? "bg-[var(--nav-active)] text-[var(--bg-primary)]"
                            : "text-[var(--nav-text)]/80 hover:bg-[var(--nav-text)]/5 hover:text-[var(--nav-text)]"
                        }`}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="mt-3 flex items-center justify-between rounded-2xl border border-[var(--card-border)] px-4 py-3">
              <span className="text-sm font-medium text-[var(--nav-text)]/70">
                Theme
              </span>
              <ThemeToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileMenu;
