import { motion } from "framer-motion";
import { useState } from "react";
import { content } from "@/data/content";
import { FadeIn, LoveButton } from "./LoveButton";
import { Polaroid } from "./Polaroid";
import { Typewriter } from "./Typewriter";

/** Section 3 — how we met, typed out. */
export function HowWeMet({ onNext }: { onNext: () => void }) {
  const [done, setDone] = useState(false);
  const photo = content.photos.chapterOne;

  return (
    <div className="mx-auto grid w-full max-w-5xl items-center gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-14">
      <div className="relative overflow-hidden rounded-3xl">
        {/* mobile: blurred photo background */}
        <img
          src={photo.src}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-md md:hidden"
          style={{ objectPosition: photo.objectPosition }}
        />
        <div className="glass-card relative rounded-3xl p-6 sm:p-8 md:p-10">
          <TwoHearts />
          <h2 className="mt-4 text-center font-display text-fluid-title font-semibold text-berry md:text-left">
            Where did our story begin
          </h2>
          <Typewriter
            lines={content.howWeMet}
            onDone={() => setDone(true)}
            className="mt-5 space-y-3 text-center md:text-left"
            lineClassName="font-hand text-fluid-hand text-berry"
          />
          <div className="mt-6 flex flex-col items-center md:items-start">
            {done && (
              <FadeIn>
                <LoveButton onClick={onNext}>
                  Continue{" "}
                  <motion.span
                    className="inline-block"
                    animate={{ scale: [1, 1.25, 1, 1.18, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  >
                    ♥
                  </motion.span>
                </LoveButton>
              </FadeIn>
            )}
          </div>
        </div>
      </div>

      {/* laptop: framed polaroid beside the text */}
      <motion.div
        className="hidden justify-center md:flex"
        initial={{ opacity: 0, rotate: 8, y: 30 }}
        animate={{ opacity: 1, rotate: 0, y: 0 }}
        transition={{ delay: 0.6, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <Polaroid photo={photo} caption="the beginning of us" tilt={4} className="w-[340px] lg:w-[380px]" />
      </motion.div>
    </div>
  );
}

function TwoHearts() {
  return (
    <div aria-hidden className="relative mx-auto flex h-12 w-24 items-center justify-center md:mx-0">
      <motion.span
        className="absolute text-3xl text-rose"
        animate={{ x: [-22, -8, -22] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        ♥
      </motion.span>
      <motion.span
        className="absolute text-3xl text-rose-deep"
        animate={{ x: [22, 8, 22] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        ♥
      </motion.span>
      <motion.span
        className="absolute -top-1 text-sm text-gold"
        animate={{ opacity: [0, 0, 1, 0, 0], scale: [0.5, 0.5, 1.2, 0.5, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        ✦
      </motion.span>
    </div>
  );
}

