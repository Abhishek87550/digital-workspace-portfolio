import { useEffect } from 'react';

const StarfieldBackground = () => {
  useEffect(() => {
    const canvas = document.getElementById("global-stars-canvas") as HTMLCanvasElement | null;
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
      const numStars = window.innerWidth < 768 ? 75 : 150;
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5,
          vx: Math.random() * 0.1 - 0.05,
          vy: Math.random() * 0.1 - 0.05,
          alpha: Math.random() * Math.PI * 2
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
    <div className="fixed inset-0 z-[-10] overflow-hidden bg-transparent">
      {/* Deep Space Nebulas (Radial Gradients) */}
      <div className="absolute top-0 left-0 h-[80vh] w-[80vw] -translate-x-1/4 -translate-y-1/4 rounded-full bg-[radial-gradient(ellipse_at_center,var(--nav-shadow)_0%,transparent_60%)] blur-[100px]" />
      <div className="absolute bottom-0 right-0 h-[90vh] w-[90vw] translate-x-1/3 translate-y-1/4 rounded-full bg-[radial-gradient(ellipse_at_center,var(--nav-shadow)_0%,transparent_60%)] blur-[120px]" />

      {/* High-Performance Canvas Starfield */}
      <canvas id="global-stars-canvas" className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" />
      
      {/* Subtle Cinematic Grain */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.02]" 
        style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }} 
      />
    </div>
  );
};

export default StarfieldBackground;
