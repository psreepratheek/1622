import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { content } from "@/data/content";
import { useImageExists } from "@/hooks/use-birthday";
import { FadeIn, LoveButton } from "./LoveButton";
import { OrbitDecor, Polaroid } from "./Polaroid";

/** Section 4 — the photo develops like a real polaroid (or prints as a photo strip). */
export function PhotoMoment({ onNext }: { onNext: () => void }) {
  const reduce = useReducedMotion();
  const herExists = useImageExists(content.photos.her.src);
  const [beat, setBeat] = useState<"main" | "her">("main");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    const t = window.setTimeout(() => setReady(true), reduce ? 300 : beat === "main" ? 7800 : 2600);
    return () => window.clearTimeout(t);
  }, [beat, reduce]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
      <AnimatePresence mode="wait">
        {beat === "main" ? (
          <motion.div key="main" exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.6 }} className="flex flex-col items-center">
            <p className="mb-8 font-hand text-fluid-hand text-berry/80 md:mb-10">a little moment, just for you</p>
            {content.photoStyle === "strip" ? <PhotoStrip /> : <DevelopingPolaroid />}
          </motion.div>
        ) : (
          <motion.div
            key="her"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center"
          >
            <HerFrame />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 min-h-14">
        {ready && (
          <FadeIn>
            {beat === "main" && herExists ? (
              <LoveButton variant="glass" onClick={() => setBeat("her")}>
                Next 💫
              </LoveButton>
            ) : (
              <LoveButton onClick={onNext}>Continue 💌</LoveButton>
            )}
          </FadeIn>
        )}
      </div>
    </div>
  );
}

function DevelopingPolaroid() {
  return (
    <motion.div
      className="relative"
      initial={{ y: -320, rotate: -14, opacity: 0 }}
      animate={{ y: 0, rotate: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 55, damping: 9, mass: 1.1 }}
    >
      <OrbitDecor />
      <Polaroid
        photo={content.photos.couple}
        caption={content.photoCaption}
        develop
        tilt={-3}
        className="w-[280px] md:w-[420px]"
      />
    </motion.div>
  );
}

function PhotoStrip() {
  const photo = content.photos.couple;
  const zooms = [1, 1.35, 1.8];
  return (
    <div className="relative">
      <div className="mx-auto h-3 w-[200px] rounded-full bg-berry/80 shadow-soft md:w-[250px]" />
      <motion.div
        className="mx-auto -mt-1 w-[170px] bg-paper p-3 shadow-polaroid md:w-[220px]"
        initial={{ clipPath: "inset(0 0 100% 0)", y: -10 }}
        animate={{ clipPath: "inset(0 0 0% 0)", y: 0 }}
        transition={{ duration: 3.2, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="flex flex-col gap-3">
          {zooms.map((z, i) => (
            <div key={i} className="aspect-[4/3] overflow-hidden bg-cream">
              <motion.img
                src={photo.src}
                alt={i === 0 ? photo.alt : ""}
                loading="lazy"
                className="h-full w-full object-cover"
                style={{ objectPosition: photo.objectPosition, scale: z, transformOrigin: photo.objectPosition }}
                initial={{ filter: "blur(10px) grayscale(1)", opacity: 0.4 }}
                animate={{ filter: "blur(0px) grayscale(0)", opacity: 1 }}
                transition={{ delay: 1 + i * 0.8, duration: 2.6 }}
              />
            </div>
          ))}
        </div>
        <motion.p
          className="mt-3 text-center font-hand text-2xl text-berry"
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{ delay: 5, duration: 2 }}
        >
          {content.photoCaption}
        </motion.p>
      </motion.div>
    </div>
  );
}

function HerFrame() {
  const photo = content.photos.her;
  return (
    <>
      <motion.div
        className="relative"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <OrbitDecor glyph="★" count={6} />
        <div className="relative w-[250px] overflow-hidden rounded-[2rem] border-4 border-paper shadow-glow md:w-[360px]">
          <div className="aspect-[4/5]">
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              width={1024}
              height={1280}
              className="h-full w-full object-cover"
              style={{ objectPosition: photo.objectPosition }}
            />
          </div>
        </div>
      </motion.div>
      <motion.p
        className="mt-10 font-hand text-fluid-title text-rose-deep text-glow"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1.2 }}
      >
        {content.herPhotoLine}
      </motion.p>
    </>
  );
}
