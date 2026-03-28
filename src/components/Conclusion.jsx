import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BubbleButton from "./BubbleButton";
import conclusionBg from "../assets/conclusion.gif";

gsap.registerPlugin(ScrollTrigger);

const sequence = [
  "you made it.",
  "from the sunlit surface",
  "through the twilight zone",
  "past the midnight abyss",
  "all the way to the hadal deep",
  "most humans never go this far",
  "even in their imagination",
  "the ocean holds more secrets",
  "than all the stars we can see",
  "and somewhere down there",
  "something is looking back",
];

const HOLDS = [2.0, 2.0, 2.0, 2.0, 2.2, 2.2, 2.0, 2.2, 2.4, 2.0, 2.8];

const Conclusion = () => {
  const sectionRef    = useRef(null);
  const bgRef         = useRef(null);
  const blackRef      = useRef(null);
  const textRef       = useRef(null);
  const btnRef        = useRef(null);
  const lightsOutRef  = useRef(null);
  const torchLayerRef = useRef(null);  // mask layer for torch effect
  const cursorRef     = useRef(null);  // custom cursor dot
  const scrollHintRef = useRef(null);
  const hasActivated  = useRef(false);
  const indexRef      = useRef(0);
  const lightsActive  = useRef(false);
  const [showButton, setShowButton]       = useState(false);
  const [lightsOut, setLightsOut]         = useState(false);
  const [showPlayAgain, setShowPlayAgain] = useState(false);
  const playAgainRef                      = useRef(null);

  // ── Torch cursor mouse tracking ──────────────────────────────────
  useEffect(() => {
    if (!lightsOut) return;

    const section = sectionRef.current;

    const onMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      // Move custom cursor dot
      if (cursorRef.current) {
        cursorRef.current.style.left = `${x - 7}px`;
        cursorRef.current.style.top  = `${y - 7}px`;
      }

      // Update CSS vars on torch layer for mask position
      if (torchLayerRef.current) {
        torchLayerRef.current.style.setProperty("--x", `${x}px`);
        torchLayerRef.current.style.setProperty("--y", `${y}px`);
      }
    };

    window.addEventListener("mousemove", onMove);

    // Flicker torch ON
    const root = torchLayerRef.current;
    if (root) {
      root.style.setProperty("--size", "0px");
      let tl = gsap.timeline({
        onComplete: () => {
          // Stable flicker after ignition
          gsap.to(root, {
            "--size": "160px",
            duration: 0.14,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
          });
        },
      });
      tl.set(root, { "--size": "0px" })
        .to(root, { "--size": "40px",  duration: 0.1 })
        .to(root, { "--size": "0px",   duration: 0.12 })
        .to(root, { "--size": "90px",  duration: 0.1 })
        .to(root, { "--size": "15px",  duration: 0.1 })
        .to(root, { "--size": "130px", duration: 0.15 })
        .to(root, { "--size": "30px",  duration: 0.1 })
        .to(root, { "--size": "180px", duration: 0.2 })
        .to(root, { "--size": "60px",  duration: 0.12 })
        .to(root, { "--size": "200px", duration: 0.25 });
    }

    // Hide default cursor
    document.body.style.cursor = "none";

    // Show scroll hint after 2s
    const scrollTimer = setTimeout(() => {
      if (scrollHintRef.current) {
        gsap.to(scrollHintRef.current, { opacity: 1, y: -10, duration: 1 });
        gsap.to(scrollHintRef.current, {
          y: "+=10", repeat: -1, yoyo: true,
          duration: 1.4, ease: "sine.inOut",
        });
        document.body.style.overflow = "auto";
      }
    }, 2000);

    return () => {
      window.removeEventListener("mousemove", onMove);
      clearTimeout(scrollTimer);
      document.body.style.cursor = "";
    };
  }, [lightsOut]);

  // ── Main scene activation ────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => ScrollTrigger.refresh(), 100);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        once: true,
        onEnter: () => {
          if (hasActivated.current) return;
          hasActivated.current = true;
          activateScene();
        },
      });
    }, sectionRef);

    const activateScene = () => {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, sectionRef.current.offsetTop);

      gsap.fromTo(blackRef.current,
        { opacity: 1 },
        { opacity: 0, duration: 2.5, ease: "power2.inOut",
          onComplete: () => setTimeout(animateText, 300) }
      );
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
      if (i >= sequence.length) { showFinalButton(); return; }

      sequence[i].split(" ").forEach((word) => {
        const span = document.createElement("span");
        span.innerText = word;
        span.style.display = "inline-block";
        span.style.opacity = "0";
        span.style.marginRight = "0.3em";
        container.appendChild(span);
      });

      const wordEls = container.querySelectorAll("span");

      gsap.timeline({ onComplete: () => { indexRef.current++; animateText(); } })
        .fromTo(wordEls,
          { opacity: 0, y: 50, scale: 0.6 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(3)", stagger: 0.12 }
        )
        .to(container, { duration: HOLDS[i] })
        .to(wordEls, { opacity: 0, y: -30, scale: 0.8, stagger: 0.07, duration: 0.45, ease: "power2.in" });
    };

    const showFinalButton = () => {
      gsap.to(textRef.current, {
        opacity: 0, duration: 0.4,
        onComplete: () => {
          textRef.current.innerHTML = "";
          setShowButton(true);
          setTimeout(() => {
            if (btnRef.current) {
              gsap.fromTo(btnRef.current,
                { opacity: 0, scale: 0.7, y: 30 },
                { opacity: 1, scale: 1, y: 0, duration: 1, ease: "back.out(2)" }
              );
            }
          }, 50);
        },
      });
    };

    return () => {
      clearTimeout(timer);
      ctx.revert();
      document.body.style.overflow = "auto";
      document.body.style.cursor = "";
    };
  }, []);

  const handleLightsOut = () => {
    // Fade out all audio
    window.__stopAllAudio?.();

    // Fade screen to black
    gsap.to(lightsOutRef.current, {
      opacity: 1,
      duration: 2,
      ease: "power2.inOut",
      onComplete: () => setLightsOut(true),
    });

    // Show Play Again button after 7s
    setTimeout(() => {
      setShowPlayAgain(true);
      setTimeout(() => {
        if (playAgainRef.current) {
          gsap.fromTo(playAgainRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
          );
        }
      }, 50);
    }, 7000);
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div ref={bgRef} className="w-full h-full" style={{ opacity: 0 }}>
          <img src={conclusionBg} className="w-full h-full object-cover" alt="" />
        </div>
      </div>

      {/* Subtle dark overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: "rgba(0,0,0,0.35)" }} />

      {/* Black entry overlay */}
      <div ref={blackRef} className="absolute inset-0 bg-black z-20" />

      {/* Text */}
      <h1
        ref={textRef}
        className="relative z-30 text-white text-3xl md:text-5xl text-center px-6 leading-tight"
        style={{  fontWeight: 400 }}
      />

      {/* Bubble button */}
      {showButton && (
        <div
          ref={btnRef}
          className="absolute z-30 flex items-center justify-center"
          style={{ opacity: 0, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        >
          <BubbleButton label="Lights Out" onClick={handleLightsOut} />
        </div>
      )}

      {/* Lights-out black overlay */}
      <div
        ref={lightsOutRef}
        className="absolute inset-0 bg-black"
        style={{ opacity: 0, zIndex: 50, pointerEvents: lightsOut ? "auto" : "none" }}
      />

      {/* Play Again button — appears 7s after lights out, sits above everything */}
      {showPlayAgain && (
        <div
          ref={playAgainRef}
          className="fixed bottom-10 left-1/2 z-[999]"
          style={{ opacity: 0, transform: "translateX(-50%)" }}
        >
          <BubbleButton
            label="Play Again"
            onClick={() => window.location.reload()}
          />
        </div>
      )}

      {/* ── Torch reveal layer — only active after lights out ── */}
      {lightsOut && (
        <>
          {/* Torch mask layer — reveals the hidden text beneath */}
          <div
            ref={torchLayerRef}
            className="absolute inset-0"
            style={{
              zIndex: 60,
              "--x": "50%",
              "--y": "50%",
              "--size": "0px",
              maskImage: "radial-gradient(circle var(--size) at var(--x) var(--y), rgba(255,255,200,1) 0%, rgba(255,255,200,0.7) 30%, rgba(255,255,200,0.3) 60%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(circle var(--size) at var(--x) var(--y), rgba(255,255,200,1) 0%, rgba(255,255,200,0.7) 30%, rgba(255,255,200,0.3) 60%, transparent 100%)",
            }}
          >
            {/* Content visible through the torch */}
            <div className="w-full h-full relative flex items-center justify-center">
              <img src={conclusionBg} className="absolute inset-0 w-full h-full object-cover" alt="" />
              <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.2)" }} />
              <p
                className="relative text-white text-center px-8 text-xl md:text-3xl"
                style={{
                //   fontFamily: "'Space Mono', monospace",
                  fontWeight: 300,
                  letterSpacing: "0.08em",
                  lineHeight: 1.9,
                  textShadow: "0 0 20px rgba(255,255,200,0.6)",
                }}
              >
                <h1>thanks for diving with us</h1>
                <hr /><br />
                the ocean still holds<br />
                more than we will ever know.<br />
                <span style={{ opacity: 0.6, fontSize: "0.75em" }}>— Joy</span>
              </p>
            </div>
          </div>

          {/* Custom torch cursor dot */}
          <div
            ref={cursorRef}
            style={{
              position: "fixed",
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "rgba(255,255,200,0.9)",
              pointerEvents: "none",
              zIndex: 999,
              boxShadow: "0 0 8px 3px rgba(255,255,200,0.4)",
              mixBlendMode: "difference",
            }}
          />

          {/* Scroll hint */}
          {/* <div
            ref={scrollHintRef}
            className="fixed bottom-10 w-full text-center text-white text-sm tracking-widest"
            style={{
              opacity: 0,
              zIndex: 70,
              fontFamily: "'Space Mono', monospace",
              textShadow: "0 0 10px rgba(255,255,200,0.5)",
            }}
          >
            ↓ Scroll Down ↓
          </div> */}
        </>
      )}
    </section>
  );
};

export default Conclusion;