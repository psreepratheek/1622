import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { useRef, useState } from "react";
import { content } from "@/data/content";
import { isCorrectPassword } from "@/lib/password";
import { burstConfetti, heartShower, originFromElement } from "@/lib/confetti";
import { LoveButton } from "./LoveButton";

type Phase = "idle" | "opening" | "open" | "unlocked";

/** Section 1 — a wrapped gift that opens to reveal a password field. */
export function Gate({ onUnlock }: { onUnlock: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const giftRef = useRef<HTMLButtonElement>(null);
  const gift = useAnimationControls();
  const card = useAnimationControls();

  async function openGift() {
    if (phase !== "idle") return;
    setPhase("opening");
    await gift.start({
      rotate: [0, -6, 6, -5, 5, -3, 3, 0],
      transition: { duration: 0.9, ease: "easeInOut" },
    });
    setPhase("open");
    void burstConfetti(originFromElement(giftRef.current), 110);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (isCorrectPassword(value, content.passwords)) {
      setError(false);
      setPhase("unlocked");
      void heartShower();
      window.setTimeout(onUnlock, 1600);
    } else {
      setError(true);
      await card.start({
        x: [0, -12, 12, -9, 9, -4, 4, 0],
        transition: { duration: 0.6 },
      });
    }
  }

  const opened = phase === "open" || phase === "unlocked";

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground"
      >
        {content.birthdayLabel}
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="font-display text-fluid-title font-semibold text-berry text-balance"
      >
        Something special for you, <span className="font-hand text-rose-deep">{content.herName}</span>{" "}
        🎁
      </motion.h1>

      {/* Gift */}
      <motion.button
        ref={giftRef}
        type="button"
        onClick={openGift}
        aria-label="Open your gift"
        disabled={phase !== "idle"}
        animate={gift}
        whileHover={phase === "idle" ? { scale: 1.05 } : {}}
        className="relative mt-6 w-[210px] cursor-pointer rounded-3xl outline-none focus-visible:ring-4 focus-visible:ring-rose/50 disabled:cursor-default sm:w-[240px] md:mt-8 md:w-[300px]"
      >
        <motion.div
          animate={phase === "idle" ? { y: [0, -10, 0] } : { y: 0 }}
          transition={{ duration: 3, repeat: phase === "idle" ? Infinity : 0, ease: "easeInOut" }}
        >
          <GiftSvg opened={opened} />
        </motion.div>
        {phase === "idle" && (
          <motion.span
            className="absolute -right-2 top-2 text-2xl text-gold md:text-3xl"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          >
            ✦
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence mode="wait">
        {phase === "idle" || phase === "opening" ? (
          <motion.p
            key="hint"
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 2.4, repeat: Infinity }}
            className="mt-4 font-hand text-fluid-hand text-berry/80"
          >
            tap the gift
          </motion.p>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="mt-2 w-full max-w-sm"
          >
            <motion.form animate={card} onSubmit={submit} className="glass-card rounded-3xl p-5 md:p-7">
              <label htmlFor="pw" className="block font-display text-xl font-medium text-berry md:text-2xl">
                {content.passwordPrompt}
              </label>
              <p className="mt-1 text-sm text-muted-foreground">{content.passwordHint}</p>
              <input
                id="pw"
                autoFocus
                autoComplete="off"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError(false);
                }}
                placeholder="••••••••"
                disabled={phase === "unlocked"}
                className="mt-4 h-12 w-full rounded-2xl border border-glass-border bg-cream/80 px-4 text-center text-lg font-semibold tracking-[0.15em] text-berry outline-none transition-shadow placeholder:text-berry/30 focus:shadow-glow"
              />
              <div className="min-h-7 pt-2">
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="font-hand text-xl text-rose-deep"
                    >
                      Hmm, try again, cutie 💕
                    </motion.p>
                  )}
                  {phase === "unlocked" && (
                    <motion.p
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="font-hand text-xl text-rose-deep"
                    >
                      Yay! That's us 💗
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <LoveButton type="submit" className="mt-2 w-full" disabled={phase === "unlocked"}>
                Unlock 💗
              </LoveButton>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GiftSvg({ opened }: { opened: boolean }) {
  return (
    <svg viewBox="0 0 240 240" className="h-auto w-full overflow-visible drop-shadow-xl">
      <ellipse cx="120" cy="226" rx="78" ry="8" fill="var(--berry)" opacity="0.12" />
      {/* box body */}
      <rect x="42" y="110" width="156" height="112" rx="14" fill="var(--rose)" />
      <rect x="42" y="110" width="156" height="18" fill="var(--rose-deep)" opacity="0.25" />
      {[
        [64, 150],
        [92, 190],
        [160, 145],
        [176, 196],
        [70, 205],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="6" fill="var(--cream)" opacity="0.45" />
      ))}
      <rect x="108" y="110" width="24" height="112" fill="var(--gold)" />
      {/* inside glow when opened */}
      <motion.ellipse
        cx="120"
        cy="112"
        rx="70"
        ry="10"
        fill="var(--gold)"
        initial={{ opacity: 0 }}
        animate={{ opacity: opened ? 0.9 : 0 }}
        transition={{ duration: 0.6 }}
      />
      {/* lid + bow */}
      <motion.g
        style={{ originX: "120px", originY: "95px" }}
        animate={opened ? { y: -150, x: 40, rotate: 28, opacity: 0 } : { y: 0, x: 0, rotate: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.34, 1.3, 0.64, 1] }}
      >
        <rect x="32" y="82" width="176" height="34" rx="10" fill="var(--rose)" />
        <rect x="32" y="82" width="176" height="34" rx="10" fill="var(--cream)" opacity="0.18" />
        <rect x="108" y="82" width="24" height="34" fill="var(--gold)" />
        {/* bow loops */}
        <motion.g
          style={{ originX: "120px", originY: "80px" }}
          animate={opened ? { scale: 0.2, rotate: -40 } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.4 }}
        >
          <path d="M120 80 C 92 40, 62 60, 82 82 Z" fill="var(--gold)" />
          <path d="M120 80 C 148 40, 178 60, 158 82 Z" fill="var(--gold)" />
          <path d="M120 80 C 100 56, 82 64, 92 78 Z" fill="var(--cream)" opacity="0.35" />
          <path d="M116 82 L 100 108 L 110 106 Z" fill="var(--gold)" />
          <path d="M124 82 L 140 108 L 130 106 Z" fill="var(--gold)" />
          <circle cx="120" cy="80" r="10" fill="var(--gold)" />
        </motion.g>
      </motion.g>
    </svg>
  );
}
