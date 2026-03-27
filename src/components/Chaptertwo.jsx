import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ChapterTwo = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const lineRef = useRef(null);
  const subtitleRef = useRef(null);
  const wipeRef = useRef(null);

  useEffect(() => {
    // Give ScrollTrigger a moment to recalculate positions after
    // LevelThree's scroll lock/unlock cycle
    const timer = setTimeout(() => ScrollTrigger.refresh(), 100);

    const ctx = gsap.context(() => {

      // ── Entry animations ─────────────────────────────────────────
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 1.4, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );

      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1, duration: 1.2, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );

      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        }
      );

      // ── Exit wipe — black panel slides up from bottom as you scroll out ──
      gsap.fromTo(
        wipeRef.current,
        { yPercent: 100 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "bottom bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );

    }, sectionRef);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden"
    >
      {/* Deep indigo glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 700, height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(49,46,129,0.18) 0%, transparent 70%)",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        <p className="text-indigo-400 text-xs tracking-[0.4em] uppercase opacity-60">
          chapter two
        </p>

        <h2
          ref={titleRef}
          className="text-white font-light opacity-0"
          style={{
            fontSize: "clamp(2.5rem, 7vw, 6rem)",
            letterSpacing: "-0.02em",
            
          }}
        >
          Still Unkown
        </h2>

        <div
          ref={lineRef}
          className="w-24 h-px bg-indigo-400 origin-left opacity-60"
          style={{ transform: "scaleX(0)" }}
        />

        <p
          ref={subtitleRef}
          className="text-indigo-200 text-base md:text-lg font-light max-w-md opacity-0"
          style={{
            letterSpacing: "0.05em", lineHeight: 1.8,
            
          }}
        >
          the deeper you go,<br />
          the less we know.
        </p>
      </div>

      {/* ── Scroll-driven wipe panel ── */}
      <div
        ref={wipeRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, #05030f 0%, #000000 100%)",
          zIndex: 30,
          transform: "translateY(100%)",
        }}
      />
    </section>
  );
};

export default ChapterTwo;