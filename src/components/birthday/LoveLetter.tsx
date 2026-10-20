import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { content } from "@/data/content";
import { FadeIn, LoveButton } from "./LoveButton";

/** Extra — a sealed envelope that opens into a handwritten letter. */
export function LoveLetter({ onNext }: { onNext: () => void }) {
  const [phase, setPhase] = useState<"closed" | "opening" | "read">("closed");

  function open() {
    if (phase !== "closed") return;
    setPhase("opening");
    window.setTimeout(() => setPhase("read"), 1900);
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
      <AnimatePresence mode="wait">
        {phase !== "read" ? (
          <motion.div key="env" exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6 }} className="flex flex-col items-center">
            <h2 className="font-display text-fluid-title font-semibold text-berry">You've got mail 💌</h2>
            <p className="mt-2 text-fluid-lead text-muted-foreground">sealed with a kiss, just for you</p>
            <Envelope opening={phase === "opening"} onOpen={open} />
            <motion.p
              animate={{ opacity: phase === "closed" ? [0.5, 1, 0.5] : 0 }}
              transition={{ duration: 2.2, repeat: Infinity }}
              className="mt-6 font-hand text-fluid-hand text-berry/80"
            >
              tap the seal
            </motion.p>
          </motion.div>
        ) : (
          <motion.article
            key="letter"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full rounded-3xl bg-paper px-6 py-8 text-left shadow-polaroid sm:px-10 md:px-14 md:py-12"
            style={{
              backgroundImage:
                "repeating-linear-gradient(transparent 0 2.35rem, color-mix(in oklab, var(--rose) 18%, transparent) 2.35rem calc(2.35rem + 1px))",
            }}
          >
            <span aria-hidden className="absolute -top-5 right-6 grid size-12 place-items-center rounded-full bg-rose-deep text-xl text-primary-foreground shadow-glow">
              ♥
            </span>
            {content.letter.map((para, i) => (
              <FadeIn key={i} delay={0.4 + i * 1.1}>
                <p className={`font-hand leading-[2.35rem] text-berry ${i === 0 ? "text-3xl md:text-4xl" : "mt-4 text-2xl md:text-[1.7rem]"}`}>
                  {para}
                </p>
              </FadeIn>
            ))}
            <FadeIn delay={0.4 + content.letter.length * 1.1}>
              <p className="mt-6 text-right font-hand text-2xl text-rose-deep md:text-3xl">
                Forever yours ♥
              </p>
            </FadeIn>
          </motion.article>
        )}
      </AnimatePresence>

      <div className="mt-8 min-h-14">
        {phase === "read" && (
          <FadeIn delay={1 + content.letter.length * 1.1}>
            <LoveButton onClick={onNext}>One more thing 🫙</LoveButton>
          </FadeIn>
        )}
      </div>
    </div>
  );
}

function Envelope({ opening, onOpen }: { opening: boolean; onOpen: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label="Open the letter"
      whileHover={!opening ? { scale: 1.04, rotate: -1 } : {}}
      animate={!opening ? { y: [0, -6, 0] } : { y: 30 }}
      transition={!opening ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : { duration: 1 }}
      className="relative mt-10 aspect-[3/2] w-[290px] cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-rose/50 sm:w-[340px] md:mt-12 md:w-[420px]"
      style={{ perspective: 900 }}
    >
      {/* back */}
      <div className="absolute inset-0 rounded-2xl bg-rose shadow-soft" />
      {/* letter peeking out */}
      <motion.div
        className="absolute inset-x-[8%] top-[6%] h-[85%] rounded-lg bg-paper p-4 shadow-soft"
        initial={{ y: 0 }}
        animate={{ y: opening ? "-55%" : 0 }}
        transition={{ delay: 0.7, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{ zIndex: opening ? 2 : 1 }}
      >
        <div className="mx-auto h-2 w-2/3 rounded-full bg-blush" />
        <div className="mx-auto mt-3 h-2 w-1/2 rounded-full bg-blush" />
        <div className="mt-4 text-center font-hand text-2xl text-rose-deep">for you ♥</div>
      </motion.div>
      {/* front pocket */}
      <div
        className="absolute inset-0 z-[3] rounded-2xl bg-blush"
        style={{ clipPath: "polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%)" }}
      />
      <div
        className="absolute inset-0 z-[3] rounded-2xl bg-peach opacity-70"
        style={{ clipPath: "polygon(0 100%, 50% 50%, 100% 100%)" }}
      />
      {/* flap */}
      <motion.div
        className="absolute inset-x-0 top-0 h-[60%] origin-top bg-rose-deep/80"
        style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)", zIndex: opening ? 0 : 4, transformStyle: "preserve-3d" }}
        animate={{ rotateX: opening ? 180 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
      {/* wax seal */}
      <motion.span
        className="absolute left-1/2 top-[52%] z-[5] grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-rose-deep text-2xl text-primary-foreground shadow-glow md:size-16"
        animate={opening ? { scale: 0, opacity: 0, rotate: 90 } : { scale: [1, 1.08, 1] }}
        transition={opening ? { duration: 0.4 } : { duration: 1.6, repeat: Infinity }}
      >
        ♥
      </motion.span>
    </motion.button>
  );
}
