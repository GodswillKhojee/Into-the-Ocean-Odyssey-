import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function useAudio(musicSrc, wavesSrc) {
  const audioRef = useRef(null);
  const wavesRef = useRef(null);
  const musicTimerRef = useRef(null);
  const wavesActiveRef = useRef(false); // tracks if waves should be playing

  const initAudio = () => {
    const wave = new Audio(wavesSrc);
    wave.loop = true;
    wave.volume = 0;
    wavesRef.current = wave;

    const audio = new Audio(musicSrc);
    audio.volume = 0;
    audio.currentTime = 0;
    audioRef.current = audio;
  };

  const startWaves = () => {
    const wave = wavesRef.current;
    if (!wave) return;
    wavesActiveRef.current = true;
    wave.play().catch(() => {});
    gsap.to(wave, { volume: 0.7, duration: 3, ease: "power2.inOut" });
  };

  const startMusicAfterDelay = (delayMs = 24000) => {
    musicTimerRef.current = setTimeout(() => {
      const audio = audioRef.current;
      const wave = wavesRef.current;
      if (!audio) return;

      audio.currentTime = 0;
      audio.play().catch(() => {});
      gsap.to(audio, { volume: 1, duration: 6, ease: "power2.inOut" });

      if (wave) {
        gsap.to(wave, {
          volume: 0,
          duration: 4,
          ease: "power2.inOut",
          onComplete: () => {
            wave.pause();
            wavesActiveRef.current = false; // waves done, don't resume on tab switch
          },
        });
      }
    }, delayMs);
  };

  // Page Visibility — pause when tab hidden, resume when back
  useEffect(() => {
    const handleVisibility = () => {
      const audio = audioRef.current;
      const wave = wavesRef.current;

      if (document.hidden) {
        audio?.pause();
        wave?.pause();
      } else {
        audio?.play().catch(() => {});
        // Only resume waves if they were still active when tab was hidden
        if (wave && wavesActiveRef.current) {
          wave.play().catch(() => {});
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeout(musicTimerRef.current);
      audioRef.current?.pause();
      wavesRef.current?.pause();
    };
  }, []);

  return { audioRef, wavesRef, initAudio, startWaves, startMusicAfterDelay };
}