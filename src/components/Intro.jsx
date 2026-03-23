import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import BubbleButton from "./BubbleButton";
import music from "../assets/Procrastinating.mp3";

const texts = [
  "hey",
  "I am Joy",
  "do you like the ocean?",
  "I don't",
  "just kidding",
  "the ocean might look like a boring thing to explore",
  "but trust me",
  "the ocean is the most beautiful thing you can imagine",
  "let's explore the ocean together",
  "Into the Ocean",
];

const HOLDS = [2.0, 2.0, 2.2, 1.8, 1.8, 2.4, 1.8, 2.4, 1.6];

const Intro = () => {
  const containerRef = useRef(null);
  const [start, setStart] = useState(false);
  const indexRef = useRef(0);
  const tlRef = useRef(null);
  const audioRef = useRef(null);

  const startAudio = () => {
    const audio = new Audio(music);
    audio.volume = 0;
    audio.currentTime = 0;
    audioRef.current = audio;

    // Wait  after Play is pressed, then fade music in
    setTimeout(() => {
      audio.play().catch(() => {});
      gsap.to(audio, { volume: 1, duration: 6, ease: "power2.inOut" });
    }, 24000);
  };


  useEffect(() => {
    if (!start) return;

    startAudio();

    const animateText = () => {
      const i = indexRef.current;
      if (i >= texts.length) return;

      const container = containerRef.current;
      if (!container) return;

      container.innerHTML = "";

      const isLast = i === texts.length - 1;
      const isPreLast = i === texts.length - 2;

      texts[i].split(" ").forEach((word) => {
        const span = document.createElement("span");
        span.innerText = word;
        span.style.display = "inline-block";
        span.style.opacity = "0";
        span.style.marginRight = "0.3em";
        container.appendChild(span);
      });

      const wordEls = Array.from(container.querySelectorAll("span"));

      const tl = gsap.timeline({
        onComplete: () => {
          if (!isLast) {
            indexRef.current += 1;
            animateText();
          }
        },
      });

      tlRef.current = tl;

      if (isLast) {
        // "Into the Ocean" — dramatic word-by-word entrance
        tl.fromTo(
          wordEls,
          { opacity: 0, y: 60, scale: 0.5, letterSpacing: "0.4em" },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            letterSpacing: "0.05em",
            duration: 1.4,
            ease: "expo.out",
          }
        );
      } else {
        tl.fromTo(
          wordEls,
          { opacity: 0, y: 40, scale: 0.7, rotation: -6 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.9,
            ease: "back.out(2)",
            stagger: 0.18,
          }
        );

        tl.to(container, { duration: HOLDS[i] });

        tl.to(wordEls, {
          opacity: 0,
          y: -30,
          scale: 0.88,
          stagger: 0.08,
          duration: 0.55,
          ease: "power2.in",
        });

        if (isPreLast) {
          tl.to(container, { duration: 1.2 });
        }
      }
    };

    animateText();

    return () => {
      tlRef.current?.kill();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [start]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      {!start && (
        <BubbleButton label="Play" onClick={() => setStart(true)} />
      )}
      <h1
        ref={containerRef}
        className={`text-white text-3xl md:text-5xl font-semibold text-center px-4 leading-snug ${
          start ? "block" : "hidden"
        }`}
      />
    </div>
  );
};

export default Intro;