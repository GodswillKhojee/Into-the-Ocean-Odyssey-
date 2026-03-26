import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import levelBg from "../assets/level1.gif";

import jellyfish from "../assets/jellyfish.png";
import turtle from "../assets/seaTutle.png";
import dolphin from "../assets/dophin.png";
import shark from "../assets/shark.png";

gsap.registerPlugin(ScrollTrigger);

const texts = [
  "hello again",
  "this is the first layer of the ocean",
  "it’s called the epipelagic zone",
  "also known as the sunlight zone",
  "it stretches from the surface down to about 200 meters",
];

const HOLDS = [2.2, 2.4, 2.2, 2.0, 2.2];

const LevelOne = () => {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const textRef = useRef(null);
  const blackRef = useRef(null);
  const raysRef = useRef([]);
  const scrollRef = useRef(null);

  const indexRef = useRef(0);

  useEffect(() => {
    // 🚫 LOCK SCROLL
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {

      // 🌑 BLACK FADE (entry)
      gsap.fromTo(
        blackRef.current,
        { opacity: 1 },
        {
          opacity: 0,
          duration: 1.2,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
          },
        }
      );

      // 🌊 BACKGROUND REVEAL (INTRO STYLE — FIXED)
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            bgRef.current,
            {
              y: "100%",
              opacity: 0,
              scale: 1.2,
              filter: "blur(8px)",
            },
            {
              y: "0%",
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
              duration: 1.8,
              ease: "power3.out",
            }
          );

          // start text AFTER bg reveal
          setTimeout(animateText, 900);
        },
      });

      // 🌞 RAYS (optimized single loop)
      raysRef.current.forEach((ray, i) => {
        if (!ray) return;

        gsap.to(ray, {
          y: "+=40",
          x: i % 2 === 0 ? "+=20" : "-=20",
          duration: 6 + i * 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      // ✨ INTRO TEXT FLOW
      const animateText = () => {
        const container = textRef.current;
        container.innerHTML = "";

        let i = indexRef.current;
        if (i >= texts.length) return;

        const words = texts[i].split(" ");

        words.forEach((word) => {
          const span = document.createElement("span");
          span.innerText = word;
          span.style.display = "inline-block";
          span.style.opacity = "0";
          span.style.marginRight = "0.3em";
          container.appendChild(span);
        });

        const wordEls = container.querySelectorAll("span");

        const tl = gsap.timeline({
          onComplete: () => {
            if (i < texts.length - 1) {
              indexRef.current++;
              animateText();
            } else {
              showFinalScene();
            }
          },
        });

        tl.fromTo(
          wordEls,
          { opacity: 0, y: 40, scale: 0.8 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "back.out(2)",
            stagger: 0.15,
          }
        );

        tl.to(container, { duration: HOLDS[i] });

        tl.to(wordEls, {
          opacity: 0,
          y: -20,
          stagger: 0.08,
          duration: 0.6,
        });
      };

      // 🌊 FINAL STORY SEQUENCE (OPTIMIZED)
      const showFinalScene = () => {
        const container = textRef.current;

        const sequence = [
          { text: "here resides", img: null },
          { text: "jellyfish", img: jellyfish },
          { text: "sea turtles", img: turtle },
          { text: "dolphins", img: dolphin },
          { text: "sharks...", img: shark },
          { text: "ohh sharky", img: null },
          { text: "and more", img: null },
          { text: "now move to the next part", img: null },
        ];

        let i = 0;
        let currentImage = null;

        const playNext = () => {
          if (i >= sequence.length) return;

          const { text, img } = sequence[i];
          container.innerHTML = "";

          const span = document.createElement("div");
          span.innerText = text;
          span.style.opacity = "0";
          span.style.textAlign = "center";
          container.appendChild(span);

          if (currentImage) currentImage.remove();

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
            });
            container.parentElement.appendChild(currentImage);
          }

          let hold = text === "ohh sharky" ? 1000 : 1500;
          if (text === "now move to the next part") hold = 2200;

          const tl = gsap.timeline({
            onComplete: () => {
              setTimeout(() => {

                if (text === "now move to the next part") {
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
                  return;
                }

                gsap.to([span, currentImage], {
                  opacity: 0,
                  y: -20,
                  duration: 0.5,
                  onComplete: () => {
                    if (currentImage) currentImage.remove();
                    i++;
                    playNext();
                  },
                });

              }, hold);
            },
          });

          tl.fromTo(span, { opacity: 0, y: 30 }, { opacity: 1, y: 0 });

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

    }, sectionRef);

    return () => {
      document.body.style.overflow = "auto";
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* 🌊 BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          ref={bgRef}
          className="w-full h-full"
          style={{ transform: "translateY(100%)", opacity: 0 }}
        >
          <img src={levelBg} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* 🌞 RAYS */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            ref={(el) => (raysRef.current[i] = el)}
            className="absolute top-0 h-[120%]"
            style={{
              left: `${25 + i * 20}%`,
              width: `${220 - i * 30}px`,
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)",
              transform: `skewX(${-20 + i * 5}deg)`,
              filter: `blur(${40 + i * 10}px)`,
            }}
          />
        ))}
      </div>

      {/* 🌑 BLACK */}
      <div ref={blackRef} className="absolute inset-0 bg-black z-20" />

      {/* ✨ TEXT */}
      <h1
        ref={textRef}
        className="relative z-30 text-white text-3xl md:text-5xl text-center px-6"
      />

      {/* ⬇️ SCROLL */}
      <div
        ref={scrollRef}
        className="absolute bottom-10 w-full text-center text-white text-lg tracking-widest opacity-0"
        style={{ textShadow: "0 0 10px rgba(255,255,255,0.4)" }}
      >
        ↓ Scroll Down ↓
      </div>
    </section>
  );
};

export default LevelOne;