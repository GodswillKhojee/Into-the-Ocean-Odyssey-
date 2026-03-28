import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function useAudio(musicSrc, wavesSrc, nextTrackSrc, thirdTrackSrc) {
  const audioRef        = useRef(null);
  const wavesRef        = useRef(null);
  const nextTrackRef    = useRef(null);
  const thirdTrackRef   = useRef(null);
  const musicTimerRef   = useRef(null);
  const wavesActiveRef  = useRef(false);
  const firstDoneRef    = useRef(false);
  const nextStartedRef  = useRef(false);
  const thirdStartedRef = useRef(false);

  const initAudio = () => {
    // ── Waves ────────────────────────────────────────────────────────
    const wave = new Audio(wavesSrc);
    wave.loop   = true;
    wave.volume = 0;
    wavesRef.current = wave;

    // ── First track (Procrastinating) ────────────────────────────────
    const audio = new Audio(musicSrc);
    audio.volume      = 0;
    audio.currentTime = 0;
    audioRef.current  = audio;

    // ── Second track (FrEsH) ─────────────────────────────────────────
    const next = new Audio(nextTrackSrc);
    next.volume  = 0;
    next.preload = "auto";
    nextTrackRef.current = next;

    // ── Third track (conclusion music) ───────────────────────────────
    if (thirdTrackSrc) {
      const third = new Audio(thirdTrackSrc);
      third.volume  = 0;
      third.preload = "auto";
      thirdTrackRef.current = third;
    }

    // When first track ends → start FrEsH
    audio.addEventListener("ended", () => {
      firstDoneRef.current = true;
      if (nextStartedRef.current) return;
      nextStartedRef.current = true;

      next.currentTime = 0;
      next.play().catch(() => {});
      gsap.to(next, { volume: 0.85, duration: 4, ease: "power2.inOut" });

      // When FrEsH ends → start third track
      next.addEventListener("ended", () => {
        const third = thirdTrackRef.current;

        // Fade waves out
        gsap.to(wave, {
          volume: 0, duration: 3, ease: "power2.inOut",
          onComplete: () => { wave.pause(); wavesActiveRef.current = false; },
        });

        // Start third track if provided
        if (third && !thirdStartedRef.current) {
          thirdStartedRef.current = true;
          third.currentTime = 0;
          third.play().catch(() => {});
          gsap.to(third, { volume: 0.8, duration: 4, ease: "power2.inOut" });
        }
      }, { once: true });
    }, { once: true });
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
      if (!audio || firstDoneRef.current) return;

      audio.play().catch(() => {});
      gsap.to(audio, { volume: 0.85, duration: 6, ease: "power2.inOut" });

      if (wave) {
        gsap.to(wave, { volume: 0.15, duration: 4, ease: "power2.inOut" });
      }
    }, delayMs);
  };

  // Fade out and stop all audio — called on lights out
  const stopAll = (duration = 2.5) => {
    const targets = [
      audioRef.current,
      wavesRef.current,
      nextTrackRef.current,
      thirdTrackRef.current,
    ].filter(Boolean);

    targets.forEach((el) => {
      if (!el.paused) {
        gsap.to(el, {
          volume: 0,
          duration,
          ease: "power2.inOut",
          onComplete: () => { el.pause(); },
        });
      }
    });
  };

  // Page visibility
  useEffect(() => {
    const handleVisibility = () => {
      const audio = audioRef.current;
      const wave  = wavesRef.current;
      const next  = nextTrackRef.current;
      const third = thirdTrackRef.current;

      if (document.hidden) {
        audio?.pause();
        wave?.pause();
        next?.pause();
        third?.pause();
      } else {
        if (audio && !firstDoneRef.current && audio.currentTime > 0) {
          audio.play().catch(() => {});
        }
        if (next && nextStartedRef.current && !next.ended) {
          next.play().catch(() => {});
        }
        if (third && thirdStartedRef.current && !third.ended) {
          third.play().catch(() => {});
        }
        if (wave && wavesActiveRef.current) {
          wave.play().catch(() => {});
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      clearTimeout(musicTimerRef.current);
      audioRef.current?.pause();
      wavesRef.current?.pause();
      nextTrackRef.current?.pause();
      thirdTrackRef.current?.pause();
    };
  }, []);

  return { audioRef, wavesRef, nextTrackRef, thirdTrackRef, initAudio, startWaves, startMusicAfterDelay, stopAll };
}