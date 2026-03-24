import React, { useEffect, useRef, useState } from "react";
import { useAudio } from "./useAudio";
import { gsap } from "gsap";
import BubbleButton from "./BubbleButton";
import music from "../assets/Procrastinating.mp3";
import waves from "../assets/seawavesSound.mp3";
import fresh from "../assets/FrEsH.mp3";
import whaleBg from "../assets/intro_whale.gif";

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

const Intro = ({ onComplete }) => {

  // new things
  const scrollRef = useRef(null);

  const containerRef = useRef(null);
  const whaleRef = useRef(null);
  const [start, setStart] = useState(false);
  const indexRef = useRef(0);
  const tlRef = useRef(null);

  const { audioRef, wavesRef, initAudio, startWaves, startMusicAfterDelay } = useAudio(music, waves, fresh);

  useEffect(() => {
    if (!start) return;

    initAudio();
    startWaves();
    startMusicAfterDelay(24000);

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
        // Reveal whale gif from bottom
        gsap.fromTo(
          whaleRef.current,
          { y: "100%", opacity: 0 },
          { y: "0%", opacity: 1, duration: 1.8, ease: "power3.out" }
        );

        // Text slams in together
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
            // onComplete: () => {
            //   // Notify App that intro is done — unlock scroll
            //   setTimeout(() => onComplete?.(), 1200);
            // },
            onComplete: () => {
  // show scroll text after 1s
  setTimeout(() => {
    gsap.fromTo(
      scrollRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
      }
    );

    // optional floating effect
    gsap.to(scrollRef.current, {
      y: 10,
      repeat: -1,
      yoyo: true,
      duration: 1.2,
      ease: "sine.inOut",
    });

    onComplete?.(); // keep your existing callback
  }, 1000);
},
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
      audioRef.current?.pause();
      wavesRef.current?.pause();
    };
  }, [start]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">

      {/* Whale GIF — hidden until last line */}
      <div
        ref={whaleRef}
        className="absolute inset-0 translate-y-full opacity-0"
        style={{ zIndex: 0 }}
      >
        <img
          src={whaleBg}
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: "blur(3px) brightness(0.6)" }}
        />
      </div>

      {/* Button */}
      {!start && (
        <div className="relative z-10">
          <BubbleButton label="Play" onClick={() => setStart(true)} />
        </div>
      )}

      {/* Text */}
      <h1
        ref={containerRef}
        className={`relative z-10 text-white text-3xl md:text-5xl font-semibold text-center px-4 leading-snug ${
          start ? "block" : "hidden"
        }`}
      />
        {/* new things */}
       <p
        ref={scrollRef}
        className="absolute bottom-10 text-white text-sm md:text-base opacity-0 z-10 tracking-widest"
      >
        ↓ Scroll Down ↓
      </p>
    </div>
  );
};

export default Intro;