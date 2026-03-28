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
  const sectionRef   = useRef(null);
  const bgRef        = useRef(null);
  const blackRef     = useRef(null);
  const textRef      = useRef(null);
  const btnRef       = useRef(null);
  const lightsOutRef = useRef(null);
  const hasActivated = useRef(false);
  const indexRef     = useRef(0);
  const [showButton, setShowButton] = useState(false);

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

      // Fade black overlay out
      gsap.fromTo(blackRef.current,
        { opacity: 1 },
        { opacity: 0, duration: 2.5, ease: "power2.inOut",
          onComplete: () => setTimeout(animateText, 300) }
      );
      // Fade bg in
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
      if (i >= sequence.length) {
        showFinalButton();
        return;
      }

      const words = sequence[i].split(" ");
      words.forEach((word) => {
        const span = document.createElement("span");
        span.innerText = word;
        span.style.display = "inline-block";
        span.style.opacity = "0";
        span.style.marginRight = "0.3em";
        container.appendChild(span);
      });

      const wordEls = container.querySelectorAll("span");

      gsap.timeline({ onComplete: () => { indexRef.current++; animateText(); } })
        // Bounce in word by word
        .fromTo(wordEls,
          { opacity: 0, y: 50, scale: 0.6 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.7, ease: "back.out(3)",
            stagger: 0.12,
          }
        )
        .to(container, { duration: HOLDS[i] })
        // Bounce out
        .to(wordEls, {
          opacity: 0, y: -30, scale: 0.8,
          stagger: 0.07, duration: 0.45,
          ease: "power2.in",
        });
    };

    const showFinalButton = () => {
      // Fade text container out then show button
      gsap.to(textRef.current, {
        opacity: 0, duration: 0.4,
        onComplete: () => {
          textRef.current.innerHTML = "";
          setShowButton(true);
          // Animate button in
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
    };
  }, []);

  const handleLightsOut = () => {
    // Full-screen fade to black — "lights out"
    gsap.to(lightsOutRef.current, {
      opacity: 1,
      duration: 2.5,
      ease: "power2.inOut",
      onComplete: () => {
        // Fade in a small closing message
        const msg = document.createElement("div");
        msg.innerText = "thanks for diving with us.";
        Object.assign(msg.style, {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "rgba(255,255,255,0.5)",
          fontFamily: "'Space Mono', monospace",
          fontSize: "clamp(0.8rem, 2vw, 1.2rem)",
          letterSpacing: "0.15em",
          textAlign: "center",
          opacity: "0",
          pointerEvents: "none",
        });
        lightsOutRef.current.appendChild(msg);
        gsap.to(msg, { opacity: 1, duration: 2, delay: 0.5, ease: "power2.out" });
      },
    });
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

      {/* Subtle dark overlay so text is readable */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: "rgba(0,0,0,0.35)" }}
      />

      {/* Black entry overlay */}
      <div ref={blackRef} className="absolute inset-0 bg-black z-20" />

      {/* Text container */}
      <h1
        ref={textRef}
        className="relative z-30 text-white text-3xl md:text-5xl text-center px-6 leading-tight"
        style={{ fontFamily: "'Space Mono', monospace", fontWeight: 400 }}
      />

      {/* Bubble button — absolutely centered */}
      {showButton && (
        <div
          ref={btnRef}
          className="absolute z-30 flex items-center justify-center"
          style={{
            opacity: 0,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <BubbleButton label="Lights Out" onClick={handleLightsOut} />
        </div>
      )}

      {/* Lights-out overlay — starts invisible, fills screen on click */}
      <div
        ref={lightsOutRef}
        className="absolute inset-0 bg-black pointer-events-none"
        style={{ opacity: 0, zIndex: 50 }}
      />
    </section>
  );
};

export default Conclusion;