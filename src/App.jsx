import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Intro from "./components/Intro";
import Exploration from "./components/Exploration";
import LoadingScreen from "./components/Loadingscreen";
import LevelOne from "./components/LevelOne";

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const introRef = useRef(null);
  const overlayRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);

  // Lock scroll until intro is done
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Once intro completes, unlock scroll and init ScrollTrigger
  useEffect(() => {
    if (!introComplete) return;

    document.body.style.overflow = "";

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: introRef.current,
          start: "top top",
          end: "+=100%",
          scrub: 1.5,
          pin: true,
        },
      });

      tl.to(introRef.current, { y: "-18%", ease: "none" }, 0);
      tl.to(overlayRef.current, { opacity: 1, ease: "none" }, 0);
    });

    return () => ctx.revert();
  }, [introComplete]);

  return (
    <div className="w-full bg-black">

      {/* Loading screen */}
      {!loaded && (
        <LoadingScreen onComplete={() => setLoaded(true)} />
      )}

      {/* Intro */}
      <div ref={introRef} className="relative w-full h-screen overflow-hidden">
        <Intro onComplete={() => setIntroComplete(true)} />
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: 0, zIndex: 20 }}
        />
      </div>

      {/* Exploration */}
      <Exploration />

      {/* ── Black buffer — smooth breathing room between sections ── */}
      <div className="w-full h-screen bg-black" />

      {/* Level One */}
      <LevelOne />

    </div>
  );
};

export default App;