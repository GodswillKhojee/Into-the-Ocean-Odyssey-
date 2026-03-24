import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Intro from "./components/Intro";
import Exploration from "./components/Exploration";

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const introRef = useRef(null);
  const overlayRef = useRef(null);
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

      // Intro drifts upward — parallax
      tl.to(introRef.current, { y: "-18%", ease: "none" }, 0);

      // Black overlay fades in over intro
      tl.to(overlayRef.current, { opacity: 1, ease: "none" }, 0);
    });

    return () => ctx.revert();
  }, [introComplete]);

  return (
    <div className="w-full bg-black">

      {/* Intro — pinned during scroll transition */}
      <div ref={introRef} className="relative w-full h-screen overflow-hidden">
        <Intro onComplete={() => setIntroComplete(true)} />

        {/* Black fade overlay */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: 0, zIndex: 20 }}
        />
      </div>

      {/* Exploration — visible after scroll */}
      <Exploration />
    </div>
  );
};

export default App;