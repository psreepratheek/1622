import { useEffect, useRef, useState, useCallback } from "react";
import { MusicBox } from "@/lib/music-box";

/** true only after hydration — use for anything random or window-based. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}

export const useIsDesktop = () => useMediaQuery("(min-width: 768px)");

/** null while checking, then true/false. */
export function useImageExists(src: string | undefined) {
  const [exists, setExists] = useState<boolean | null>(src ? null : false);
  useEffect(() => {
    if (!src) return setExists(false);
    const img = new Image();
    img.onload = () => setExists(true);
    img.onerror = () => setExists(false);
    img.src = src;
  }, [src]);
  return exists;
}

/**
 * Background music. Uses the mp3 if it exists, otherwise a soft music box.
 * start() must be called from a tap/click (browser autoplay rules).
 */
export function useMusic(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const boxRef = useRef<MusicBox | null>(null);
  const hasFile = useRef<boolean | null>(null);
  const fadeRef = useRef<number | null>(null);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const volumeRef = useRef(0.5);

  useEffect(() => {
    fetch(src, { method: "HEAD" })
      .then((r) => {
        hasFile.current = r.ok && (r.headers.get("content-type") ?? "").startsWith("audio");
      })
      .catch(() => {
        hasFile.current = false;
      });
  }, [src]);

  const fadeAudio = useCallback((to: number, seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeRef.current) window.clearInterval(fadeRef.current);
    const from = audio.volume;
    const steps = Math.max(1, Math.round(seconds * 20));
    let i = 0;
    fadeRef.current = window.setInterval(() => {
      i += 1;
      audio.volume = Math.min(1, Math.max(0, from + ((to - from) * i) / steps));
      if (i >= steps && fadeRef.current) window.clearInterval(fadeRef.current);
    }, 50);
  }, []);

  const startBox = useCallback(() => {
    if (!boxRef.current) boxRef.current = new MusicBox();
    boxRef.current.start(volumeRef.current);
  }, []);

  const start = useCallback(() => {
    if (started) return;
    setStarted(true);
    if (hasFile.current) {
      const audio = new Audio(src);
      audio.loop = true;
      audio.volume = 0;
      audioRef.current = audio;
      audio
        .play()
        .then(() => fadeAudio(volumeRef.current, 2.5))
        .catch(() => startBox());
    } else {
      startBox();
    }
  }, [started, src, fadeAudio, startBox]);

  const applyVolume = useCallback(
    (v: number, seconds: number) => {
      if (audioRef.current) fadeAudio(v, seconds);
      boxRef.current?.setVolume(v, seconds);
    },
    [fadeAudio],
  );

  const toggle = useCallback(() => {
    setMuted((m) => {
      applyVolume(m ? volumeRef.current : 0, 0.6);
      return !m;
    });
  }, [applyVolume]);

  /** Softly raise/lower the music (finale swell). */
  const setLevel = useCallback(
    (v: number) => {
      volumeRef.current = v;
      if (!muted) applyVolume(v, 3);
    },
    [muted, applyVolume],
  );

  return { start, started, muted, toggle, setLevel };
}
