import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type Burst = { id: number; x: number; y: number; parts: { a: number; d: number; c: string; g: string }[] };

const GLYPHS = ["♥", "✦", "♥", "✧"];
const COLORS = ["text-rose", "text-gold", "text-rose-deep", "text-lavender"];
const pick = (arr: string[], i: number) => arr[i % arr.length] ?? "";

/** Little hearts & sparkles pop wherever she taps or clicks. */
export function ClickBursts() {
  const [bursts, setBursts] = useState<Burst[]>([]);

  useEffect(() => {
    let id = 0;
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement)?.closest("input, textarea")) return;
      const parts = Array.from({ length: 7 }, (_, i) => ({
        a: (i / 7) * Math.PI * 2 + Math.random() * 0.5,
        d: 28 + Math.random() * 30,
        c: pick(COLORS, i),
        g: pick(GLYPHS, i),
      }));
      const burst = { id: ++id, x: e.clientX, y: e.clientY, parts };
      setBursts((b) => [...b.slice(-6), burst]);
      window.setTimeout(() => setBursts((b) => b.filter((x) => x.id !== burst.id)), 1100);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60]">
      <AnimatePresence>
        {bursts.map((b) =>
          b.parts.map((p, i) => (
            <motion.span
              key={`${b.id}-${i}`}
              className={`absolute text-base leading-none ${p.c}`}
              style={{ left: b.x - 6, top: b.y - 8 }}
              initial={{ opacity: 1, x: 0, y: 0, scale: 0.4 }}
              animate={{
                opacity: 0,
                x: Math.cos(p.a) * p.d,
                y: Math.sin(p.a) * p.d - 14,
                scale: 1.1,
              }}
              transition={{ duration: 0.95, ease: "easeOut" }}
            >
              {p.g}
            </motion.span>
          )),
        )}
      </AnimatePresence>
    </div>
  );
}
