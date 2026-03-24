import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function useAudio(musicSrc, wavesSrc, nextTrackSrc) {
  const audioRef = useRef(null);
  const wavesRef = useRef(null);
  const nextTrackRef = useRef(null);
  const musicTimerRef = useRef(null);
  const wavesActiveRef = useRef(false);

  const initAudio = () => {
    const wave = new Audio(wavesSrc);
    wave.loop = true;
    wave.volume = 0;
    wavesRef.current = wave;

    const audio = new Audio(musicSrc);
    audio.volume = 0;
    audio.currentTime = 0;
    audioRef.current = audio;

    // Preload next track
    const next = new Audio(nextTrackSrc);
    next.volume = 0;
    next.preload = "auto";
    nextTrackRef.current = next;

    // When procrastinating ends, fade in FrEsH
    audio.addEventListener("ended", () => {
      next.currentTime = 0;
      next.play().catch(() => {});
      gsap.to(next, { volume: 1, duration: 4, ease: "power2.inOut" });
    });
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
            wavesActiveRef.current = false;
          },
        });
      }
    }, delayMs);
  };

  // Page Visibility — pause all when tab hidden, resume when back
  useEffect(() => {
    const handleVisibility = () => {
      const audio = audioRef.current;
      const wave = wavesRef.current;
      const next = nextTrackRef.current;

      if (document.hidden) {
        audio?.pause();
        wave?.pause();
        next?.pause();
      } else {
        audio?.play().catch(() => {});
        next?.play().catch(() => {});
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
      nextTrackRef.current?.pause();
    };
  }, []);

  return { audioRef, wavesRef, nextTrackRef, initAudio, startWaves, startMusicAfterDelay };
}