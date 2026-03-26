import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import levelBg from "../assets/level2.gif";
import lanternfish from "../assets/lanternfish.png";
import hatchetfish from "../assets/hatchet.png";
import viperfish from "../assets/viperfish.png";

gsap.registerPlugin(ScrollTrigger);

const texts = [
  "deeper now",
  "welcome to the mesopelagic zone",
  "also known as the twilight zone",
  "it stretches from 200 to 1000 meters deep",
  "sunlight barely reaches here",
  "yet life still finds a way",
];

const HOLDS = [2.0, 2.4, 2.2, 2.2, 2.0, 2.2];

const LevelTwo = () => {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const textRef = useRef(null);
  const blackRef = useRef(null);
  const scrollRef = useRef(null);
  const indexRef = useRef(0);
  const hasActivated = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
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
          duration: 2,
          ease: "power2.inOut",
          onComplete: () => setTimeout(animateText, 200),
        }
      );

      gsap.fromTo(
        bgRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 2.5, ease: "power2.inOut" }
      );
    };

    const animateText = () => {
      const container = textRef.current;
      if (!container) return;
      container.innerHTML = "";

      const i = indexRef.current;
      if (i >= texts.length) {
        showEndMessage();
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

    const showEndMessage = () => {
      const container = textRef.current;
      container.innerHTML = "";

      // "lanternfish, viperfish, hatchetfish" is split into 3 individual beats with images
      const sequence = [
        { text: "bioluminescent creatures glow here", img: null },
        { text: "lanternfish",  img: lanternfish },
        { text: "viperfish",    img: viperfish },
        { text: "hatchetfish",  img: hatchetfish },
        { text: "it is cold, dark, and crushing", img: null },
        { text: "and still... full of wonder",    img: null },
        { text: "keep going deeper",              img: null },
      ];

      let i = 0;
      let currentImage = null;

      const playNext = () => {
        if (i >= sequence.length) return;

        const { text, img } = sequence[i];
        const isLast = i === sequence.length - 1;

        container.innerHTML = "";

        const span = document.createElement("div");
        span.innerText = text;
        span.style.opacity = "0";
        span.style.textAlign = "center";
        container.appendChild(span);

        // remove previous image
        if (currentImage) {
          gsap.to(currentImage, {
            opacity: 0, duration: 0.4,
            onComplete: () => { currentImage.remove(); currentImage = null; },
          });
        }

        if (img) {
          currentImage = document.createElement("img");
          currentImage.src = img;
          Object.assign(currentImage.style, {
            position: "absolute",
            bottom: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "160px",
            opacity: "0",
            zIndex: "30",
          });
          sectionRef.current.appendChild(currentImage);
        }

        const tl = gsap.timeline({
          onComplete: () => {
            if (isLast) {
              // stay visible — show scroll hint and unlock
              setTimeout(() => {
                gsap.to(scrollRef.current, { opacity: 1, y: -10, duration: 1 });
                gsap.to(scrollRef.current, {
                  y: "+=10", repeat: -1, yoyo: true,
                  duration: 1.4, ease: "sine.inOut",
                });
                document.body.style.overflow = "auto";
              }, 1000);
            } else {
              setTimeout(() => {
                gsap.to(span, {
                  opacity: 0, y: -20, duration: 0.5,
                  onComplete: () => { i++; playNext(); },
                });
              }, 1800);
            }
          },
        });

        tl.fromTo(span, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9 });

        if (currentImage) {
          tl.fromTo(
            currentImage,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.8 },
            "-=0.3"
          );
        }
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
      <div className="absolute inset-0 overflow-hidden">
        <div ref={bgRef} className="w-full h-full" style={{ opacity: 0 }}>
          <img src={levelBg} className="w-full h-full object-cover" alt="" />
        </div>
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Black entry overlay */}
      <div ref={blackRef} className="absolute inset-0 bg-black z-20" />

      {/* Text */}
      <h1
        ref={textRef}
        className="relative z-30 text-white text-3xl md:text-5xl text-center px-6"
      
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

export default LevelTwo;