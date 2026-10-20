import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { content } from "@/data/content";
import { burstConfetti, burstHearts, originFromElement } from "@/lib/confetti";
import { useIsDesktop, useMounted } from "@/hooks/use-birthday";
import { FadeIn, LoveButton } from "./LoveButton";

/** Section 2 — balloons, her name letter by letter, and a cake to blow out. */
export function BirthdaySurprise({ onNext }: { onNext: () => void }) {
  const [blown, setBlown] = useState(false);
  const cakeRef = useRef<HTMLButtonElement>(null);
  const title = `Happy Birthday,`;
  const name = `${content.herName}! 🎂`;
  const titleLen = Array.from(title).length;

  function blow() {
    if (blown) return;
    setBlown(true);
    const o = originFromElement(cakeRef.current);
    const flame = { x: o.x, y: Math.max(0, o.y - 0.12) };
    void burstConfetti(flame, 120);
    void burstHearts(flame, 18);
  }

  return (
    <div className="birthday-scene relative mx-auto flex w-full max-w-5xl flex-col items-center text-center">
      <Balloons />
      <h1 className="birthday-scene-title relative z-10 font-hand text-fluid-hero font-bold text-berry">
        <Letters text={title} />
        <br />
        <span className="text-rose-deep text-glow">
          <Letters text={name} offset={titleLen} />
        </span>
      </h1>

      <motion.button
        ref={cakeRef}
        type="button"
        onClick={blow}
        aria-label={blown ? "Candle blown out" : "Blow out the candle"}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 1 }}
        whileHover={!blown ? { scale: 1.04 } : {}}
        className="birthday-scene-cake relative z-10 mt-4 w-[220px] cursor-pointer rounded-3xl outline-none focus-visible:ring-4 focus-visible:ring-rose/50 sm:w-[250px] md:mt-6 md:w-[320px]"
      >
        <CakeSvg blown={blown} />
      </motion.button>

      <div className="relative z-10 mt-4 flex min-h-28 flex-col items-center gap-4">
        <AnimatePresence mode="wait">
          {!blown ? (
            <motion.p
              key="wish"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              transition={{ delay: 2.2 }}
              className="font-hand text-fluid-hand text-berry"
            >
              Make a wish and tap the candle ✨
            </motion.p>
          ) : (
            <motion.p
              key="made"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-hand text-fluid-hand text-berry"
            >
              Your wish is on its way to the stars ✨
            </motion.p>
          )}
        </AnimatePresence>
        {blown && (
          <FadeIn delay={1.4}>
            <LoveButton onClick={onNext}>Continue 💗</LoveButton>
          </FadeIn>
        )}
      </div>
    </div>
  );
}

function Letters({ text, offset = 0 }: { text: string; offset?: number }) {
  // Split into words (so words never break mid-line), keep a running letter index for the stagger.
  let idx = offset;
  const words = text.split(" ").map((word) => {
    const letters = Array.from(word).map((ch) => ({ ch, i: idx++ }));
    idx += 1; // the space
    return letters;
  });
  return (
    <>
      {words.map((letters, w) => (
        <span key={w} className="inline-block whitespace-nowrap">
          {letters.map(({ ch, i }) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: 24, rotate: -8 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ delay: 0.3 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {ch}
            </motion.span>
          ))}
          {w < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </>
  );
}

const BALLOON_COLORS = ["var(--rose)", "var(--lavender)", "var(--peach)", "var(--gold)", "var(--blush)"];

function Balloons() {
  const mounted = useMounted();
  const isDesktop = useIsDesktop();
  const balloons = useMemo(() => {
    if (!mounted) return [];
    const n = isDesktop ? 12 : 7;
    return Array.from({ length: n }, (_, i) => ({
      id: i,
      left: (i / n) * 100 + Math.random() * (100 / n) - 4,
      color: BALLOON_COLORS[i % BALLOON_COLORS.length],
      size: (isDesktop ? 56 : 42) + Math.random() * 22,
      duration: 13 + Math.random() * 9,
      delay: Math.random() * 6,
      sway: (Math.random() - 0.5) * 60,
    }));
  }, [mounted, isDesktop]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {balloons.map((b) => (
        <motion.div
          key={b.id}
          className="absolute top-full"
          style={{ left: `${b.left}%`, width: b.size }}
          initial={{ y: 0, x: 0 }}
          animate={{ y: "-130dvh", x: [0, b.sway, -b.sway / 2, 0] }}
          transition={{
            y: { duration: b.duration, delay: b.delay, repeat: Infinity, ease: "linear" },
            x: { duration: b.duration / 2, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <svg viewBox="0 0 60 110" className="h-auto w-full opacity-85">
            <ellipse cx="30" cy="30" rx="24" ry="29" fill={b.color} />
            <ellipse cx="21" cy="20" rx="6" ry="9" fill="var(--cream)" opacity="0.55" />
            <path d="M27 58 L33 58 L30 63 Z" fill={b.color} />
            <path d="M30 63 C 24 75, 36 85, 28 108" stroke="var(--berry)" strokeOpacity="0.3" fill="none" strokeWidth="1.2" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

function CakeSvg({ blown }: { blown: boolean }) {
  return (
    <svg viewBox="0 0 240 230" className="h-auto w-full overflow-visible drop-shadow-xl">
      {/* glow */}
      <motion.circle
        cx="120"
        cy="40"
        r="38"
        fill="var(--gold)"
        animate={{ opacity: blown ? 0 : [0.25, 0.4, 0.25] }}
        transition={{ duration: 2, repeat: blown ? 0 : Infinity }}
        style={{ filter: "blur(10px)" }}
      />
      {/* plate */}
      <ellipse cx="120" cy="212" rx="104" ry="12" fill="var(--cream)" />
      <ellipse cx="120" cy="208" rx="104" ry="10" fill="var(--paper)" />
      {/* bottom tier */}
      <rect x="30" y="140" width="180" height="68" rx="16" fill="var(--blush)" />
      <path
        d="M30 152 Q 45 172 60 152 T 90 152 T 120 152 T 150 152 T 180 152 T 210 152 L 210 146 Q 210 140 200 140 L 40 140 Q 30 140 30 146 Z"
        fill="var(--cream)"
      />
      {/* top tier */}
      <rect x="60" y="92" width="120" height="54" rx="14" fill="var(--rose)" />
      <path
        d="M60 104 Q 72 122 84 104 T 108 104 T 132 104 T 156 104 T 180 104 L 180 100 Q 180 92 170 92 L 70 92 Q 60 92 60 100 Z"
        fill="var(--cream)"
      />
      {/* sprinkles */}
      {[
        [48, 180, "var(--rose)"],
        [80, 192, "var(--lavender)"],
        [116, 178, "var(--gold)"],
        [150, 194, "var(--rose)"],
        [186, 176, "var(--lavender)"],
        [86, 128, "var(--cream)"],
        [124, 132, "var(--gold)"],
        [158, 124, "var(--cream)"],
      ].map(([x, y, c], i) => (
        <rect key={i} x={x as number} y={y as number} width="8" height="3" rx="1.5" fill={c as string} transform={`rotate(${(i * 37) % 70 - 35} ${x} ${y})`} />
      ))}
      {/* candle */}
      <rect x="113" y="50" width="14" height="44" rx="4" fill="var(--lavender)" />
      <path d="M113 58 L127 52 M113 70 L127 64 M113 82 L127 76" stroke="var(--cream)" strokeWidth="3" />
      <rect x="119" y="42" width="2" height="9" fill="var(--berry)" />
      {/* flame */}
      <AnimatePresence>
        {!blown && (
          <motion.g exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ originX: "120px", originY: "44px" }}>
            <g className="animate-flicker" style={{ transformBox: "fill-box" }}>
              <path d="M120 14 C 130 28, 130 40, 120 45 C 110 40, 110 28, 120 14 Z" fill="var(--gold)" />
              <path d="M120 26 C 125 33, 125 40, 120 43 C 115 40, 115 33, 120 26 Z" fill="var(--rose)" opacity="0.85" />
            </g>
          </motion.g>
        )}
      </AnimatePresence>
      {/* smoke puff */}
      {blown &&
        [0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cx={120 + (i - 1) * 6}
            cy="38"
            r="6"
            fill="var(--berry)"
            initial={{ opacity: 0.25, y: 0, scale: 0.6 }}
            animate={{ opacity: 0, y: -50 - i * 10, scale: 1.8 }}
            transition={{ duration: 1.6, delay: i * 0.15, ease: "easeOut" }}
          />
        ))}
    </svg>
  );
}
