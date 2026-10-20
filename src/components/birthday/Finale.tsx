import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { content } from "@/data/content";
import { heartFirework } from "@/lib/confetti";
import { useIsDesktop, useMounted } from "@/hooks/use-birthday";
import { LoveButton } from "./LoveButton";

/** Section 5 — night falls, lines fade in, "I love you". */
export function Finale({
  onContinue,
}: {
  onContinue: () => void;
}) {
  const reduce = useReducedMotion();
  const lines = content.finaleLines;
  const loveDelay = 1 + lines.length * 2;

  useEffect(() => {
    const t = window.setTimeout(() => void heartFirework(), (loveDelay + 0.6) * 1000);
    return () => window.clearTimeout(t);
  }, [loveDelay]);

  return (
    <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center text-center text-cream">
      <NightSky />
      <div className="relative z-10 space-y-2">
        {lines.map((l, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 1 + i * 2, duration: 1.6 }}
            className="font-display text-fluid-lead italic text-blush md:text-2xl"
          >
            {l}
          </motion.p>
        ))}
      </div>

      <div className="relative z-10 my-10 grid place-items-center md:my-16">
        {/* heartbeat behind the text */}
        <motion.div
          aria-hidden
          className="absolute size-[260px] text-rose md:size-[440px]"
          initial={{ opacity: 0 }}
          animate={reduce ? { opacity: 0.25 } : { opacity: 0.3, scale: [1, 1.12, 1, 1.08, 1] }}
          transition={{
            opacity: { delay: loveDelay, duration: 1.5 },
            scale: { delay: loveDelay, duration: 1.4, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{ filter: "blur(28px)" }}
        >
          <svg viewBox="0 0 24 24" className="h-full w-full" fill="currentColor">
            <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.4h2c.7-1.2 2.2-2.4 4.3-2.4 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z" />
          </svg>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: loveDelay, duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative font-hand text-fluid-hero font-bold text-cream text-glow"
        >
          I love you,
          <br />
          <span className="text-blush">{content.herName}</span> ❤️
        </motion.h1>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: loveDelay + 2.4, duration: 1.4 }}
        className="relative z-10 font-hand text-fluid-hand text-blush"
      >
        Happy Birthday, my love.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: loveDelay + 3.8, duration: 1 }}
        className="relative z-10 mt-10 flex flex-col items-center gap-4"
      >
        <LoveButton onClick={onContinue}>{content.loveQuestion.continueLabel}</LoveButton>
      </motion.div>
    </div>
  );
}

/** Twinkling stars + an occasional shooting star. */
function NightSky() {
  const mounted = useMounted();
  const isDesktop = useIsDesktop();
  const [shoot, setShoot] = useState(0);
  const stars = useMemo(
    () =>
      mounted
        ? Array.from({ length: isDesktop ? 60 : 28 }, (_, i) => ({
            id: i,
            l: Math.random() * 100,
            t: Math.random() * 100,
            s: 1 + Math.random() * 2.5,
            d: Math.random() * 3,
          }))
        : [],
    [mounted, isDesktop],
  );

  useEffect(() => {
    const t = window.setInterval(() => setShoot((s) => s + 1), 5200);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute animate-twinkle rounded-full bg-cream"
          style={{ left: `${s.l}%`, top: `${s.t}%`, width: s.s, height: s.s, animationDelay: `${s.d}s` }}
        />
      ))}
      {mounted && shoot > 0 && (
        <motion.span
          key={shoot}
          className="absolute h-px w-32 rounded-full bg-gradient-to-r from-transparent via-cream to-transparent"
          style={{ top: `${10 + ((shoot * 17) % 30)}%`, left: `${(shoot * 29) % 60}%`, rotate: "20deg" }}
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], x: 300, y: 110 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
      )}
    </div>
  );
}
