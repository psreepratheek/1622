import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { useState } from "react";
import { content } from "@/data/content";
import { FadeIn, LoveButton } from "./LoveButton";

const NOTE_COLORS = [
  "var(--rose)",
  "var(--lavender)",
  "var(--peach)",
  "var(--gold)",
  "var(--blush)",
];

/** Extra — a jar of folded notes, each one a shared memory. */
export function ReasonsJar({ onNext }: { onNext: () => void }) {
  const reasons = content.reasons;
  const [pulled, setPulled] = useState(0);
  const jar = useAnimationControls();
  const all = pulled >= reasons.length;

  async function pull() {
    if (all) return;
    void jar.start({ rotate: [0, -5, 5, -3, 3, 0], transition: { duration: 0.6 } });
    setPulled((p) => p + 1);
  }

  const remaining = reasons.length - pulled;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 text-center md:flex-row md:items-center md:justify-center md:gap-16 md:text-left">
      <div className="flex flex-col items-center">
        <h2 className="font-display text-fluid-title font-semibold text-berry">
          {content.memories.title}
        </h2>
        <p className="mt-2 text-fluid-lead text-muted-foreground">
          {all ? content.memories.completed : content.memories.instruction}
        </p>
        <motion.button
          type="button"
          onClick={pull}
          animate={jar}
          whileHover={!all ? { scale: 1.04 } : {}}
          aria-label="Pull a reason from the jar"
          className="mt-6 w-[170px] cursor-pointer rounded-3xl outline-none focus-visible:ring-4 focus-visible:ring-rose/50 md:w-[220px]"
        >
          <JarSvg remaining={remaining} total={reasons.length} />
        </motion.button>
        <p className="mt-3 text-sm font-semibold tracking-wider text-muted-foreground">
          {pulled} / {reasons.length}
        </p>
      </div>

      <div className="flex min-h-[220px] w-full max-w-sm flex-col items-center justify-center gap-6 md:min-h-[300px]">
        {/* every note shares one grid cell so they can overlap while swapping */}
        <div className="grid w-full place-items-center [&>*]:[grid-area:1/1]">
          <AnimatePresence initial={false}>
            {pulled === 0 ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-hand text-fluid-hand text-berry/70"
              >
                {reasons.length} little notes, all for you 💗
              </motion.p>
            ) : (
              <motion.div
                key={pulled}
                initial={{ opacity: 0, y: 80, scale: 0.3, rotate: -20 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: pulled % 2 ? -2 : 2 }}
                exit={{ opacity: 0, x: 60, rotate: 12 }}
                transition={{ type: "spring", stiffness: 90, damping: 13 }}
                className="relative w-full rounded-3xl p-6 shadow-polaroid md:p-8"
                style={{
                  background: `color-mix(in oklab, ${NOTE_COLORS[(pulled - 1) % NOTE_COLORS.length]} 45%, var(--paper))`,
                }}
              >
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-paper px-3 py-0.5 text-xs font-bold tracking-wider text-rose-deep shadow-soft">
                  #{pulled}
                </span>
                <p className="font-hand text-fluid-hand text-berry">{reasons[pulled - 1]}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex min-h-14 flex-wrap items-center justify-center gap-3">
          {pulled > 0 && !all && (
            <LoveButton variant="glass" onClick={pull}>
              Pull another 💗
            </LoveButton>
          )}
          {(pulled >= Math.min(3, reasons.length) || all) && (
            <FadeIn>
              <LoveButton onClick={onNext}>{all ? "Continue ✨" : "Skip to the end ✨"}</LoveButton>
            </FadeIn>
          )}
        </div>
      </div>
    </div>
  );
}

function JarSvg({ remaining, total }: { remaining: number; total: number }) {
  // notes stacked in the jar; fewer as she pulls them
  const slots = Array.from({ length: total }, (_, i) => ({
    x: 46 + ((i * 37) % 70),
    y: 198 - Math.floor(i / 3) * 22 - (i % 2) * 6,
    r: ((i * 53) % 60) - 30,
    c: NOTE_COLORS[i % NOTE_COLORS.length],
  }));
  return (
    <svg viewBox="0 0 160 230" className="h-auto w-full overflow-visible drop-shadow-xl">
      <ellipse cx="80" cy="224" rx="60" ry="6" fill="var(--berry)" opacity="0.12" />
      {/* lid */}
      <rect x="38" y="20" width="84" height="22" rx="6" fill="var(--gold)" />
      <path
        d="M44 26 h72 M44 32 h72 M44 38 h72"
        stroke="var(--cream)"
        strokeOpacity="0.6"
        strokeWidth="2"
      />
      {/* ribbon */}
      <rect x="40" y="44" width="80" height="8" fill="var(--rose)" />
      <path d="M80 48 C 70 34, 58 44, 72 52 Z M80 48 C 90 34, 102 44, 88 52 Z" fill="var(--rose)" />
      {/* jar body */}
      <path
        d="M44 52 L 116 52 Q 140 70 140 110 L 140 196 Q 140 220 116 220 L 44 220 Q 20 220 20 196 L 20 110 Q 20 70 44 52 Z"
        fill="var(--cream)"
        fillOpacity="0.45"
        stroke="var(--cream)"
        strokeWidth="3"
      />
      <AnimatePresence>
        {slots.slice(0, remaining).map((s, i) => (
          <motion.g
            key={i}
            exit={{ y: -170, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.7 }}
          >
            <rect
              x={s.x - 14}
              y={s.y - 9}
              width="28"
              height="18"
              rx="4"
              fill={s.c}
              transform={`rotate(${s.r} ${s.x} ${s.y})`}
            />
            <text
              x={s.x}
              y={s.y + 4}
              fontSize="10"
              textAnchor="middle"
              fill="var(--berry)"
              opacity="0.5"
              transform={`rotate(${s.r} ${s.x} ${s.y})`}
            >
              ♥
            </text>
          </motion.g>
        ))}
      </AnimatePresence>
      {/* shine */}
      <path
        d="M34 90 Q 30 130 34 190"
        stroke="var(--paper)"
        strokeOpacity="0.8"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
