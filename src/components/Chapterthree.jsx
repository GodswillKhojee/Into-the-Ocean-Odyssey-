import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ChapterThree = () => {
  const sectionRef = useRef(null);
  const titleRef   = useRef(null);
  const lineRef    = useRef(null);
  const subtitleRef = useRef(null);
  const wipeRef    = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => ScrollTrigger.refresh(), 100);

    const ctx = gsap.context(() => {

      // ── Entry animations ──────────────────────────────────────────
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

      // ── Exit wipe ─────────────────────────────────────────────────
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
      {/* Deep crimson glow — even darker, feels like the abyss */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 700, height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(120,20,20,0.15) 0%, transparent 70%)",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        <p className="text-red-900 text-xs tracking-[0.4em] uppercase opacity-70"
           style={{ color: "rgba(180,60,60,0.7)" }}>
          chapter three
        </p>

        <h2
          ref={titleRef}
          className="text-white font-light opacity-0"
          style={{
            fontSize: "clamp(2rem, 6vw, 5rem)",
            letterSpacing: "-0.02em",
            fontFamily: "'Space Mono', monospace",
          }}
        >
          The Story Doesn't End Here
        </h2>

        <div
          ref={lineRef}
          className="w-24 h-px origin-left opacity-60"
          style={{ transform: "scaleX(0)", background: "rgba(180,60,60,0.8)" }}
        />

        <p
          ref={subtitleRef}
          className="text-base md:text-lg font-light max-w-md opacity-0"
          style={{
            color: "rgba(220,160,160,0.85)",
            letterSpacing: "0.05em", lineHeight: 1.8,
            fontFamily: "'Space Mono', monospace",
          }}
        >
          95% of the ocean remains unexplored.<br />
          the mystery is just beginning.
        </p>
      </div>

      {/* ── Scroll-driven wipe panel ── */}
      <div
        ref={wipeRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, #0a0000 0%, #000000 100%)",
          zIndex: 30,
          transform: "translateY(100%)",
        }}
      />
    </section>
  );
};

export default ChapterThree;