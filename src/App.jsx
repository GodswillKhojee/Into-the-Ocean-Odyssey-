import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Intro from "./components/Intro";
import Exploration from "./components/Exploration";
import LoadingScreen from "./components/Loadingscreen";
import LevelOne from "./components/LevelOne";
import LevelTwo from "./components/LevelTwo";
import LevelThree from "./components/Levelthree";
import ChapterTwo from "./components/Chaptertwo";

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const introRef = useRef(null);
  const overlayRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

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

      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}

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

      {/* Black buffer → Level One */}
      <div className="w-full h-screen bg-black" />
      <LevelOne />

      {/* Black buffer → Level Two */}
      <div className="w-full h-screen bg-black" />
      <LevelTwo />

      {/* Black buffer → Level Three */}
      <div className="w-full h-screen bg-black" />
      <LevelThree />
      
      {/* Chapter Two interlude */}
      <ChapterTwo />

    </div>
  );
};

export default App;