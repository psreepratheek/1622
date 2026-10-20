import { AnimatePresence, animate, motion, useMotionValue } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { content } from "@/data/content";
import { burstConfetti, heartShower, originFromElement } from "@/lib/confetti";
import { cn } from "@/lib/utils";
import { HugScene } from "./HugScene";
import { FadeIn, LoveButton } from "./LoveButton";

const SPRING = { type: "spring" as const, stiffness: 420, damping: 26 };

/** The very last question — "No" runs away, "Yes" gets hugs. */
export function LoveQuestion({ onReplay }: { onReplay: () => void }) {
  const q = content.loveQuestion;
  const [answered, setAnswered] = useState(false);
  const [dodges, setDodges] = useState(0);
  const yesRef = useRef<HTMLDivElement>(null);
  const noRef = useRef<HTMLButtonElement>(null);
  const lastDodge = useRef(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  /** Jump the "No" button somewhere random on screen, away from the finger/cursor and the Yes button. */
  const dodge = useCallback(
    (px?: number, py?: number) => {
      const now = performance.now();
      if (now - lastDodge.current < 200) return;
      lastDodge.current = now;
      const el = noRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const baseX = r.left - x.get();
      const baseY = r.top - y.get();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const m = 24;
      const yes = yesRef.current?.getBoundingClientRect();
      let tx = r.left;
      let ty = r.top;
      for (let i = 0; i < 30; i++) {
        tx = m + Math.random() * Math.max(0, vw - r.width - 2 * m);
        ty = m + Math.random() * Math.max(0, vh - r.height - 2 * m);
        const cx = tx + r.width / 2;
        const cy = ty + r.height / 2;
        const farFromPointer = px === undefined || py === undefined || Math.hypot(cx - px, cy - py) > 200;
        const pad = 16;
        const clearOfYes =
          !yes ||
          tx > yes.right + pad ||
          tx + r.width < yes.left - pad ||
          ty > yes.bottom + pad ||
          ty + r.height < yes.top - pad;
        const moved = Math.hypot(tx - r.left, ty - r.top) > 120;
        if (farFromPointer && clearOfYes && moved) break;
      }
      void animate(x, tx - baseX, SPRING);
      void animate(y, ty - baseY, SPRING);
      setDodges((d) => d + 1);
    },
    [x, y],
  );

  // Desktop: run away as soon as the cursor gets close.
  useEffect(() => {
    if (answered) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = noRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
      const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
      if (Math.hypot(dx, dy) < 70) dodge(e.clientX, e.clientY);
    };
    const onResize = () => {
      x.set(0);
      y.set(0);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, [answered, dodge, x, y]);

  function sayYes() {
    if (answered) return;
    setAnswered(true);
    void burstConfetti(originFromElement(yesRef.current), 140);
    window.setTimeout(() => void heartShower(), 1500);
  }

  const noLabel = q.noLabels[Math.min(dodges, q.noLabels.length - 1)];
  const yesScale = Math.min(1 + dodges * 0.06, 1.4);

  return (
    <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center text-center">
      <HugScene together={answered} />

      <AnimatePresence mode="wait">
        {!answered ? (
          <motion.div
            key="ask"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}
            transition={{ delay: 0.4, duration: 0.9 }}
            className="mt-6 flex flex-col items-center gap-8 md:mt-8"
          >
            <h1 className="font-hand text-fluid-title font-bold text-berry">{q.question}</h1>

            <div className="flex min-h-24 flex-wrap items-center justify-center gap-8">
              <motion.div ref={yesRef} animate={{ scale: yesScale }} transition={SPRING}>
                <LoveButton onClick={sayYes} className="min-h-16 px-12 py-4 text-xl md:min-h-[4.5rem] md:px-14 md:text-2xl">
                  {q.yes}
                </LoveButton>
              </motion.div>

              <motion.button
                ref={noRef}
                type="button"
                aria-label="No (good luck catching it)"
                style={{ x, y }}
                onPointerDown={(e) => {
                  e.preventDefault();
                  dodge(e.clientX, e.clientY);
                }}
                onClick={(e) => {
                  e.preventDefault();
                  dodge();
                }}
                onFocus={() => dodge()}
                className={cn(
                  buttonVariants({ variant: "glass", size: "lg" }),
                  "relative z-50 min-h-11 select-none rounded-full px-6 text-base",
                )}
              >
                {noLabel}
              </motion.button>
            </div>

            <div className="min-h-8">
              <AnimatePresence>
                {dodges >= 3 && (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="font-hand text-xl text-berry/80 md:text-2xl"
                  >
                    {q.shyHint}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div key="yay" className="mt-6 flex flex-col items-center gap-4 md:mt-8">
            <h1 className="font-hand text-fluid-title font-bold text-rose-deep text-glow">
              {q.answer.split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ opacity: 0, scale: 0.4, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0, rotate: [0, -6, 6, 0] }}
                  transition={{
                    delay: 1.6 + i * 0.35,
                    type: "spring",
                    stiffness: 260,
                    damping: 14,
                    rotate: { delay: 2 + i * 0.35, duration: 0.7 },
                  }}
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </h1>
            <FadeIn delay={3}>
              <p className="font-display text-fluid-lead italic text-berry">{q.answerSub}</p>
            </FadeIn>
            <FadeIn delay={4.4} className="mt-4">
              <LoveButton variant="glass" onClick={onReplay}>
                {q.replayLabel}
              </LoveButton>
            </FadeIn>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
