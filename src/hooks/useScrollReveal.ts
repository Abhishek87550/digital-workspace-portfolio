import { useEffect } from 'react';

export const useScrollReveal = (enabled: boolean = true) => {
  useEffect(() => {
    if (!enabled) return;

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Optional: observer.unobserve(entry.target) if you only want it to reveal once
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Slight delay to ensure React has painted the DOM after loading screen finishes
    const timeout = setTimeout(() => {
      const revealElements = document.querySelectorAll('.reveal');
      revealElements.forEach(el => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [enabled]);
};
