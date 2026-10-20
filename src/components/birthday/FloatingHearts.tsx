import { useEffect, useMemo, useRef } from "react";
import { useIsDesktop, useMounted } from "@/hooks/use-birthday";

const GLYPHS = [
  { char: "♥", cls: "text-rose" },
  { char: "♥", cls: "text-cream" },
  { char: "✦", cls: "text-gold" },
  { char: "✧", cls: "text-cream" },
  { char: "❀", cls: "text-blush" },
  { char: "petal", cls: "bg-blush" },
  { char: "♥", cls: "text-lavender" },
];

/** Ambient layer of hearts, stars, sparkles and petals drifting upward. */
export function FloatingHearts({ calm = false }: { calm?: boolean }) {
  const mounted = useMounted();
  const isDesktop = useIsDesktop();
  const ref = useRef<HTMLDivElement>(null);
  const count = isDesktop ? 30 : 12;

  const particles = useMemo(() => {
    if (!mounted) return [];
    return Array.from({ length: count }, (_, i) => {
      const g = GLYPHS[i % GLYPHS.length];
      return {
        id: i,
        ...g,
        left: Math.random() * 100,
        size: 10 + Math.random() * (isDesktop ? 22 : 16),
        duration: 16 + Math.random() * 16,
        delay: -Math.random() * 30,
        dx: (Math.random() - 0.5) * 120,
        opacity: 0.35 + Math.random() * 0.35,
      };
    });
  }, [mounted, count, isDesktop]);

  // slow down smoothly (no jump) when calm — used by the finale
  useEffect(() => {
    ref.current?.getAnimations({ subtree: true }).forEach((a) => {
      a.playbackRate = calm ? 0.45 : 1;
    });
  }, [calm, particles]);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 animate-float-up"
          style={
            {
              left: `${p.left}%`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              "--dx": `${p.dx}px`,
              "--o": p.opacity,
            } as React.CSSProperties
          }
        >
          {p.char === "petal" ? (
            <span
              className={`block rounded-[60%_0_60%_0] ${p.cls}`}
              style={{ width: p.size * 0.8, height: p.size * 0.55 }}
            />
          ) : (
            <span className={`block leading-none ${p.cls}`} style={{ fontSize: p.size }}>
              {p.char}
            </span>
          )}
        </span>
      ))}
    </div>
  );
}
