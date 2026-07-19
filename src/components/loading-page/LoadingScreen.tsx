import { useEffect, useState } from "react";
import { gsap } from "gsap";
import ParticleCanvas from "./ParticleCanvas";
import "./Loading.css";
interface LoadingScreenProps {
  onFinish: () => void;
}

export default function LoadingScreen({
  onFinish,
}: LoadingScreenProps) {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleEnter = () => {
    if (isLeaving) return;

    setIsLeaving(true);

    gsap.to(".loading-container", {
      opacity: 0,
      duration: 1.2,
      ease: "power3.inOut",
      onComplete: onFinish,
    });
  };

  return (
    <div
      className={`loading-container ${
        isLeaving ? "loading-exit" : ""
      }`}
    >
      {/* Three.js Particle Scene */}
      <ParticleCanvas isLeaving={isLeaving} />

      {/* Enter Button */}
      <div className="loading-ui">
        <button
          className="enter-button"
          onClick={handleEnter}
        >
          Enter Portfolio
        </button>
      </div>
    </div>
  );
}