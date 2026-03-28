import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import levelBg from "../assets/titanicr.jpg";

gsap.registerPlugin(ScrollTrigger);

const texts = [
  "you are now 3800 meters deep",
  "this is the bathypelagic zone",
  "also known as the midnight zone",
  "no sunlight. no warmth.",
  "just pressure, darkness, and silence",
];

const HOLDS = [2.2, 2.4, 2.0, 2.2, 2.4];

// Generate stable bubble data once
const BUBBLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: `${4 + Math.random() * 92}%`,
  size: 4 + Math.random() * 10,
  delay: Math.random() * 6,
  duration: 5 + Math.random() * 7,
  drift: (Math.random() - 0.5) * 60,
  opacity: 0.15 + Math.random() * 0.35,
}));

const LevelThree = () => {
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
      // ── Bubble animations ─────────────────────────────────────────
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
          repeatDelay: Math.random() * 3,
        });
      });

      // ── Activate on scroll ────────────────────────────────────────
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

      // Fade black overlay out
      gsap.fromTo(blackRef.current,
        { opacity: 1 },
        {
          opacity: 0,
          duration: 2.2,
          ease: "power2.inOut",
          onComplete: () => setTimeout(animateText, 200),
        }
      );

      // Fade background in — slow and heavy
      gsap.fromTo(bgRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 3, ease: "power2.inOut" }
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

      gsap.timeline({
        onComplete: () => {
          indexRef.current++;
          animateText();
        },
      })
        .fromTo(wordEls,
          { opacity: 0, y: 40, scale: 0.8 },
          { opacity: 1, y: 0, scale: 1, duration: 1, ease: "back.out(2)", stagger: 0.15 }
        )
        .to(container, { duration: HOLDS[i] })
        .to(wordEls, { opacity: 0, y: -20, stagger: 0.08, duration: 0.6 });
    };

    const showFinalScene = () => {
      const container = textRef.current;

      const sequence = [
        { text: "at 3,800 meters lies the Titanic", img: null },
        { text: "it sank in 1912", img: null },
        { text: "and has rested here ever since", img: null },
        { text: "ohh Jack!", img: null },
        { text: "the deep remembers everything", img: null },
      ];

      let i = 0;

      const playNext = () => {
        if (i >= sequence.length) return;

        const { text } = sequence[i];
        const isLast = i === sequence.length - 1;

        container.innerHTML = "";
        const span = document.createElement("div");
        span.innerText = text;
        span.style.opacity = "0";
        span.style.textAlign = "center";
        container.appendChild(span);

        gsap.timeline({
          onComplete: () => {
            if (isLast) {
              setTimeout(() => {
                gsap.to(scrollRef.current, { opacity: 1, y: -10, duration: 1 });
                gsap.to(scrollRef.current, {
                  y: "+=10", repeat: -1, yoyo: true,
                  duration: 1.4, ease: "sine.inOut",
                });
                document.body.style.overflow = "auto";
                ScrollTrigger.refresh();
              }, 1200);
            } else {
              setTimeout(() => {
                gsap.to(span, {
                  opacity: 0, y: -20, duration: 0.5,
                  onComplete: () => { i++; playNext(); },
                });
              }, 2000);
            }
          },
        }).fromTo(span,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
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

      {/* Dark overlay to keep text readable over the busy image */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: "rgba(0,0,0,0.45)" }}
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
              border: "1.5px solid rgba(150, 210, 255, 0.7)",
              background: "rgba(150, 220, 255, 0.08)",
              boxShadow: "0 0 4px rgba(150,210,255,0.2)",
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

export default LevelThree;