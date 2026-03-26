import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Exploration = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const lineRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title fades + rises in when section enters
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );

      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden"
    >
      {/* Subtle deep blue glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(14,116,180,0.07) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        <p
          className="text-blue-400 text-xs tracking-[0.4em] uppercase opacity-60"
        >
          chapter one
        </p>

        <h2
          ref={titleRef}
          className="text-white font-light opacity-0"
          style={{
            fontSize: "clamp(2.5rem, 7vw, 6rem)",
            letterSpacing: "-0.02em",
            fontFamily: "'Space Mono', monospace",
          }}
        >
          Trois Couches
        </h2>

        <div
          ref={lineRef}
          className="w-24 h-px bg-blue-400 origin-left opacity-60"
          style={{ transform: "scaleX(0)" }}
        />

        <p
          ref={subtitleRef}
          className="text-blue-200 text-base md:text-lg font-light max-w-md opacity-0"
          style={{
            letterSpacing: "0.05em",
            lineHeight: 1.8,
            fontFamily: "'Space Mono', monospace",
          }}
        >
          the ocean covers 71% of the earth.<br />
          we've explored less than 20% of it.
        </p>
      </div>
    </section>
  );
};

export default Exploration;