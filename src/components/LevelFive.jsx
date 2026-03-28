import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import levelBg from "../assets/mariniaTrench.jpg";

gsap.registerPlugin(ScrollTrigger);

const texts = [
  "you have reached the hadal zone",
  "the deepest place on earth",
  "the mariana trench",
  "11,000 meters below the surface",
  "deeper than mount everest is tall",
];

const HOLDS = [2.2, 2.0, 2.2, 2.4, 2.4];

// Stable bubble data
const BUBBLES = Array.from({ length: 32 }, (_, i) => ({
  id: i,
  left: `${2 + Math.random() * 96}%`,
  size: 3 + Math.random() * 9,
  delay: Math.random() * 8,
  duration: 6 + Math.random() * 8,
  drift: (Math.random() - 0.5) * 70,
  opacity: 0.1 + Math.random() * 0.3,
}));

const LevelFive = () => {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const textRef = useRef(null);
  const blackRef = useRef(null);
  const scrollRef = useRef(null);
  const bubblesRef = useRef([]);
  const indexRef = useRef(0);
  const hasActivated = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Bubble animations
      bubblesRef.current.forEach((el, i) => {
        if (!el) return;
        const b = BUBBLES[i];
        gsap.set(el, { y: "100vh", opacity: 0 });
        gsap.to(el, {
          y: "-110vh",
          x: b.drift,
          opacity: b.opacity,
          duration: b.duration,
          delay: b.delay,
          repeat: -1,
          ease: "none",
          repeatDelay: Math.random() * 4,
        });
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        once: true,
        onEnter: () => {
          if (hasActivated.current) return;
          hasActivated.current = true;
          activateLevel();
        },
      });
    }, sectionRef);

    const activateLevel = () => {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, sectionRef.current.offsetTop);

      gsap.fromTo(
        blackRef.current,
        { opacity: 1 },
        {
          opacity: 0,
          duration: 2.5,
          ease: "power2.inOut",
          onComplete: () => setTimeout(animateText, 200),
        },
      );
      gsap.fromTo(
        bgRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 3.5, ease: "power2.inOut" },
      );
    };

    const animateText = () => {
      const container = textRef.current;
      if (!container) return;
      container.innerHTML = "";

      const i = indexRef.current;
      if (i >= texts.length) {
        showFinalScene();
        return;
      }

      texts[i].split(" ").forEach((word) => {
        const span = document.createElement("span");
        span.innerText = word;
        span.style.display = "inline-block";
        span.style.opacity = "0";
        span.style.marginRight = "0.3em";
        container.appendChild(span);
      });

      const wordEls = container.querySelectorAll("span");

      gsap
        .timeline({
          onComplete: () => {
            indexRef.current++;
            animateText();
          },
        })
        .fromTo(
          wordEls,
          { opacity: 0, y: 40, scale: 0.8 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "back.out(2)",
            stagger: 0.15,
          },
        )
        .to(container, { duration: HOLDS[i] })
        .to(wordEls, { opacity: 0, y: -20, stagger: 0.08, duration: 0.6 });
    };

    const showFinalScene = () => {
      const container = textRef.current;

      const sequence = [
        "only a few people have ever been here,",
        "even fewer than those who’ve walked on the moon.",
        "down here, time feels different,",
        "and the pressure is something we’re not built for.",
        "but still…",
        "life finds a way.",
        "it always does.",
      ];

      let i = 0;

      const playNext = () => {
        if (i >= sequence.length) return;
        const isLast = i === sequence.length - 1;

        container.innerHTML = "";
        const span = document.createElement("div");
        span.innerText = sequence[i];
        span.style.opacity = "0";
        span.style.textAlign = "center";
        container.appendChild(span);

        const hold = sequence[i] === "and yet..." ? 1200 : 2000;

        gsap
          .timeline({
            onComplete: () => {
              if (isLast) {
                setTimeout(() => {
                  gsap.to(scrollRef.current, {
                    opacity: 1,
                    y: -10,
                    duration: 1,
                  });
                  gsap.to(scrollRef.current, {
                    y: "+=10",
                    repeat: -1,
                    yoyo: true,
                    duration: 1.4,
                    ease: "sine.inOut",
                  });
                  document.body.style.overflow = "auto";
                }, 1200);
              } else {
                setTimeout(() => {
                  gsap.to(span, {
                    opacity: 0,
                    y: -20,
                    duration: 0.5,
                    onComplete: () => {
                      i++;
                      playNext();
                    },
                  });
                }, hold);
              }
            },
          })
          .fromTo(
            span,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1.1, ease: "power2.out" },
          );
      };

      playNext();
    };

    return () => {
      ctx.revert();
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div ref={bgRef} className="w-full h-full" style={{ opacity: 0 }}>
          <img src={levelBg} className="w-full h-full object-cover" alt="" />
        </div>
      </div>

      {/* Dark vignette */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* Bubbles */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {BUBBLES.map((b, i) => (
          <div
            key={b.id}
            ref={(el) => (bubblesRef.current[i] = el)}
            style={{
              position: "absolute",
              left: b.left,
              bottom: 0,
              width: b.size,
              height: b.size,
              borderRadius: "50%",
              border: "1.5px solid rgba(80, 180, 255, 0.6)",
              background: "rgba(80, 180, 255, 0.06)",
              boxShadow: "0 0 6px rgba(80,180,255,0.15)",
            }}
          />
        ))}
      </div>

      {/* Black entry overlay */}
      <div ref={blackRef} className="absolute inset-0 bg-black z-20" />

      {/* Text */}
      <h1
        ref={textRef}
        className="relative z-30 text-white text-3xl md:text-5xl text-center px-6"
        // style={{ fontWeight: 300 }}
      />

      {/* Scroll hint */}
      <div
        ref={scrollRef}
        className="absolute bottom-10 w-full text-center text-white text-lg tracking-widest opacity-0 z-30"
        style={{ textShadow: "0 0 10px rgba(255,255,255,0.4)" }}
      >
        ↓ Scroll Down ↓
      </div>
    </section>
  );
};

export default LevelFive;
