import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function useAudio(musicSrc, wavesSrc, nextTrackSrc) {
  const audioRef       = useRef(null);
  const wavesRef       = useRef(null);
  const nextTrackRef   = useRef(null);
  const musicTimerRef  = useRef(null);
  const wavesActiveRef = useRef(false);
  const firstDoneRef   = useRef(false); // true once first track finishes
  const nextStartedRef = useRef(false); // true once FrEsH has started

  const initAudio = () => {
    // ── Waves ────────────────────────────────────────────────────────
    const wave = new Audio(wavesSrc);
    wave.loop   = true;
    wave.volume = 0;
    wavesRef.current = wave;

    // ── First track ──────────────────────────────────────────────────
    const audio = new Audio(musicSrc);
    audio.volume      = 0;
    audio.currentTime = 0;
    audioRef.current  = audio;

    // ── Next track ───────────────────────────────────────────────────
    const next = new Audio(nextTrackSrc);
    next.volume  = 0;
    next.preload = "auto";
    nextTrackRef.current = next;

    // When first track ends → start FrEsH once, mark first as done
    audio.addEventListener("ended", () => {
      firstDoneRef.current = true;

      if (nextStartedRef.current) return; // safety guard
      nextStartedRef.current = true;

      next.currentTime = 0;
      next.play().catch(() => {});
      gsap.to(next, { volume: 0.85, duration: 4, ease: "power2.inOut" });

      // When FrEsH ends → fade waves out to silence
      next.addEventListener("ended", () => {
        gsap.to(wave, {
          volume: 0, duration: 3, ease: "power2.inOut",
          onComplete: () => {
            wave.pause();
            wavesActiveRef.current = false;
          },
        });
      }, { once: true });
    }, { once: true }); // once:true — never fires twice
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
      const wave  = wavesRef.current;
      if (!audio || firstDoneRef.current) return; // don't start if already finished

      audio.play().catch(() => {});
      gsap.to(audio, { volume: 0.85, duration: 6, ease: "power2.inOut" });

      // Lower waves underneath music — keep them alive
      if (wave) {
        gsap.to(wave, { volume: 0.15, duration: 4, ease: "power2.inOut" });
      }
    }, delayMs);
  };

  // Page visibility — pause / resume only tracks that are actively playing
  useEffect(() => {
    const handleVisibility = () => {
      const audio = audioRef.current;
      const wave  = wavesRef.current;
      const next  = nextTrackRef.current;

      if (document.hidden) {
        audio?.pause();
        wave?.pause();
        next?.pause();
      } else {
        // Only resume first track if it hasn't finished yet
        if (audio && !firstDoneRef.current && audio.currentTime > 0) {
          audio.play().catch(() => {});
        }
        // Only resume FrEsH if it was started
        if (next && nextStartedRef.current && !next.ended) {
          next.play().catch(() => {});
        }
        // Resume waves if they were active
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