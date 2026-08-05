import { useEffect, useState } from "react";

const ShootingStars = () => {
  const [stars, setStars] = useState<{ id: number; top: string; left: string; delay: string; duration: string }[]>([]);

  useEffect(() => {
    // Exactly 3 shooting stars, very subtle
    const numStars = 3;
    const newStars = Array.from({ length: numStars }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 40}%`, 
      left: `${50 + Math.random() * 50}%`, 
      delay: `${Math.random() * 20}s`, // longer delay
      duration: `${2 + Math.random() * 1.5}s`, // slightly slower
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="shooting-star"
          style={{
            top: star.top,
            left: star.left,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        >
          <div className="shooting-star-head" />
          <div className="shooting-star-tail" />
        </div>
      ))}
    </div>
  );
};

export default ShootingStars;
