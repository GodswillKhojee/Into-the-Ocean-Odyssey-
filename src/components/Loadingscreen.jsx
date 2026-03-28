import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// All assets to preload
import music from "../assets/Procrastinating.mp3";
import waves from "../assets/seawavesSound.mp3";
import fresh from "../assets/FrEsH.mp3";
import whaleBg from "../assets/intro_whale.gif";
// import heroPng from "../assets/hero.png";
import level1 from "../assets/level1.gif";
import level2 from "../assets/level2.gif";
import dolphin from "../assets/dophin.png";
import shark from "../assets/shark.png";
import seaTrutle from "../assets/seaTutle.png";
import jellyfish from "../assets/jellyfish.png";
import levelFour from "../assets/level-four.gif";
import marinaTrench from "../assets/mariniaTrench.jpg";
import Conclusion from "../assets/conclusion.gif";

const ASSETS = [
  { type: "audio", src: music },
  { type: "audio", src: waves },
  { type: "audio", src: fresh },
  { type: "image", src: whaleBg },
  { type: "image", src: level1 },
  { type: "image", src: level2 },
  { type: "image", src: dolphin },
  { type: "image", src: shark },
  { type: "image", src: seaTrutle },
  { type: "image", src: jellyfish },
  { type: "image", src: levelFour },
  { type: "image", src: marinaTrench },
  { type: "image", src: Conclusion },
];

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const waterRef = useRef(null);
  const percentRef = useRef(null);
  const wavePathRef = useRef(null);
  const containerRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    let loaded = 0;
    const total = ASSETS.length;

    const updateProgress = (val) => {
      setProgress(val);

      // Water fill rises from bottom (100% = full screen)
      gsap.to(waterRef.current, {
        height: `${val}%`,
        duration: 0.6,
        ease: "power2.out",
      });
    };

    const onAssetLoaded = () => {
      loaded++;
      updateProgress(Math.round((loaded / total) * 100));

      if (loaded === total) {
        // Small delay then fade out
        setTimeout(() => {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 1,
            ease: "power2.inOut",
            onComplete: () => onComplete?.(),
          });
        }, 600);
      }
    };

    ASSETS.forEach(({ type, src }) => {
      if (type === "image") {
        const img = new Image();
        img.onload = onAssetLoaded;
        img.onerror = onAssetLoaded;
        img.src = src;
      } else if (type === "audio") {
        const audio = new Audio();
        audio.addEventListener("canplaythrough", onAssetLoaded, { once: true });
        audio.addEventListener("error", onAssetLoaded, { once: true });
        audio.preload = "auto";
        audio.src = src;
      }
    });

    // Animate wave path continuously
    let t = 0;
    const animateWave = () => {
      t += 0.03;
      if (wavePathRef.current) {
        const w = window.innerWidth;
        // SVG wave path that oscillates
        const d = `M0,10 
          C${w * 0.2},${10 + Math.sin(t) * 8} 
           ${w * 0.4},${10 + Math.sin(t + 1) * 8} 
           ${w * 0.6},${10 + Math.sin(t + 2) * 8} 
           ${w * 0.8},${10 + Math.sin(t + 3) * 8} 
           ${w},10 
          L${w},0 L0,0 Z`;
        wavePathRef.current.setAttribute("d", d);
      }
      animFrameRef.current = requestAnimationFrame(animateWave);
    };
    animateWave();

    return () => cancelAnimationFrame(animFrameRef.current);
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
    >
      {/* Water fill — rises from bottom */}
      <div
        ref={waterRef}
        className="absolute bottom-0 left-0 w-full"
        style={{ height: "0%", zIndex: 1 }}
      >
        {/* Animated wave on top of water */}
        <svg
          className="absolute w-full"
          style={{ top: -19, left: 0 }}
          height="20"
          preserveAspectRatio="none"
        >
          <path ref={wavePathRef} fill="rgba(14, 116, 180, 0.85)" />
        </svg>

        {/* Water body */}
        <div
          className="w-full h-full"
          style={{ background: "rgba(14, 116, 180, 0.85)" }}
        />
      </div>

      {/* Percentage text — sits above water */}
      <div
        ref={percentRef}
        className="relative z-10 flex flex-col items-center gap-3 select-none"
      >
        <span
          className=" tabular-nums"
          style={{
            fontSize: "clamp(3.5rem, 10vw, 7rem)",
            fontWeight: 300,
            letterSpacing: "-0.04em",
            color: progress >= 50 ? "#0a1628" : "#e0f2fe",
            transition: "color 0.4s ease",
            // fontFamily: "'Space Mono', monospace",
            mixBlendMode: "difference",
          }}
        >
          {progress}%
        </span>
        <span
          className="text-xs tracking-[0.35em] uppercase"
          style={{
            color: progress >= 55 ? "#0a1628" : "#7dd3fc",
            transition: "color 0.4s ease",
            // fontFamily: "'Space Mono', monospace",
            mixBlendMode: "difference",
          }}
        >
          LOOK OUT
        </span>
      </div>
    </div>
  );
};

export default LoadingScreen;
