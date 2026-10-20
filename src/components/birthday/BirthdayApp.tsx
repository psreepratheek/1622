import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BirthdaySurprise } from "./BirthdaySurprise";
import { ClickBursts } from "./ClickBursts";
import { CursorHeart } from "./CursorHeart";
import { Finale } from "./Finale";
import { FloatingHearts } from "./FloatingHearts";
import { Gate } from "./Gate";
import { HowWeMet } from "./HowWeMet";
import { LoveLetter } from "./LoveLetter";
import { LoveQuestion } from "./LoveQuestion";
import { PhotoMoment } from "./PhotoMoment";
import { ReasonsJar } from "./ReasonsJar";

const STEPS = ["gate", "birthday", "howWeMet", "photo", "letter", "reasons", "finale", "question"] as const;
type Step = (typeof STEPS)[number];

/** The whole story — one screen at a time. */
export function BirthdayApp() {
  const [step, setStep] = useState<Step>("gate");
  const isFinale = step === "finale";

  const go = (s: Step) => setStep(s);
  const next = () => setStep(STEPS[Math.min(STEPS.indexOf(step) + 1, STEPS.length - 1)] ?? "finale");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [step]);

  function screen() {
    switch (step) {
      case "gate":
        return (
          <Gate
            onUnlock={() => {
              next();
            }}
          />
        );
      case "birthday":
        return <BirthdaySurprise onNext={next} />;
      case "howWeMet":
        return <HowWeMet onNext={next} />;
      case "photo":
        return <PhotoMoment onNext={next} />;
      case "letter":
        return <LoveLetter onNext={next} />;
      case "reasons":
        return <ReasonsJar onNext={next} />;
      case "finale":
        return <Finale onContinue={next} />;
      case "question":
        return <LoveQuestion onReplay={() => go("birthday")} />;
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-[100dvh] text-foreground">
        {/* soft shifting pastel sky, then night for the finale */}
        <div aria-hidden className="fixed inset-0 -z-10 bg-dream" />
        <motion.div
          aria-hidden
          className="fixed inset-0 -z-10 bg-night"
          initial={false}
          animate={{ opacity: isFinale ? 1 : 0 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
        <FloatingHearts calm={isFinale} />
        <ClickBursts />
        <CursorHeart />
        <StoryProgress step={step} />

        <main className="relative z-10">
          <AnimatePresence mode="wait">
            <motion.section
              key={step}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="story-screen flex w-full items-center justify-center"
            >
              {screen()}
            </motion.section>
          </AnimatePresence>
        </main>

      </div>
    </MotionConfig>
  );
}

/** Little hearts at the top that fill as the story goes on. */
function StoryProgress({ step }: { step: Step }) {
  const chapters = STEPS.slice(1, STEPS.indexOf("finale"));
  const current = chapters.indexOf(step as (typeof chapters)[number]);
  return (
    <AnimatePresence>
      {current >= 0 && (
        <motion.nav
          aria-label="Story progress"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed left-1/2 top-[max(0.9rem,env(safe-area-inset-top))] z-40 flex -translate-x-1/2 gap-2 rounded-full glass-card px-4 py-2"
        >
          {chapters.map((c, i) => (
            <motion.span
              key={c}
              className={`text-sm leading-none ${i <= current ? "text-rose-deep" : "text-berry/25"}`}
              animate={i === current ? { scale: [1, 1.3, 1] } : { scale: 1 }}
              transition={{ duration: 1.4, repeat: i === current ? Infinity : 0 }}
            >
              ♥
            </motion.span>
          ))}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
