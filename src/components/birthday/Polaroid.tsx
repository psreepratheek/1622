import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Photo = { src: string; objectPosition: string; alt: string };

/** White polaroid frame with washi tape. `develop` animates the photo from blank to vivid. */
export function Polaroid({
  photo,
  caption,
  develop = false,
  developDelay = 1.2,
  captionDelay = 5.4,
  className,
  tilt = -3,
}: {
  photo: Photo;
  caption?: string;
  develop?: boolean;
  developDelay?: number;
  captionDelay?: number;
  className?: string;
  tilt?: number;
}) {
  return (
    <div className={cn("relative rounded-md bg-paper p-3 pb-4 shadow-polaroid md:p-4 md:pb-6", className)} style={{ rotate: `${tilt}deg` }}>
      <div className="washi absolute -top-4 left-1/2 h-8 w-24 -translate-x-1/2 -rotate-3 rounded-sm opacity-90 md:w-32" />
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-cream">
        <motion.img
          src={photo.src}
          alt={photo.alt}
          width={1024}
          height={1280}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: photo.objectPosition }}
          initial={develop ? { opacity: 0, filter: "blur(16px) grayscale(1) brightness(1.6)" } : false}
          animate={{ opacity: 1, filter: "blur(0px) grayscale(0) brightness(1)" }}
          transition={{ delay: developDelay, duration: 4, ease: "easeInOut" }}
        />
      </div>
      {caption && (
        <motion.p
          className="mt-3 text-center font-hand text-fluid-hand text-berry md:mt-4"
          initial={develop ? { clipPath: "inset(0 100% 0 0)" } : false}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{ delay: develop ? captionDelay : 0, duration: 2.2, ease: "easeInOut" }}
        >
          {caption}
        </motion.p>
      )}
    </div>
  );
}

/** Tiny hearts circling the frame + twinkling sparkles. */
export function OrbitDecor({ glyph = "♥", count = 5 }: { glyph?: string; count?: number }) {
  return (
    <div aria-hidden className="pointer-events-none absolute -inset-[14%]">
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        {Array.from({ length: count }, (_, i) => {
          const a = (i / count) * Math.PI * 2;
          return (
            <span
              key={i}
              className={cn("absolute text-lg md:text-2xl", i % 2 ? "text-rose" : "text-gold")}
              style={{ left: `${50 + Math.cos(a) * 50}%`, top: `${50 + Math.sin(a) * 50}%`, transform: "translate(-50%,-50%)" }}
            >
              {glyph}
            </span>
          );
        })}
      </motion.div>
      {[
        [8, 12],
        [88, 20],
        [92, 72],
        [4, 80],
        [50, 2],
        [60, 96],
      ].map(([l, t], i) => (
        <span
          key={i}
          className="absolute animate-twinkle text-sm text-cream md:text-base"
          style={{ left: `${l}%`, top: `${t}%`, animationDelay: `${i * 0.45}s` }}
        >
          ✦
        </span>
      ))}
    </div>
  );
}
