// Small wrapper around canvas-confetti, loaded lazily (browser only).
const COLORS = ["#FFD6E0", "#FFE5D9", "#E4D5F7", "#FF8FAB", "#FFD97D", "#FFFFFF"];

type Origin = { x: number; y: number };

async function load() {
  const mod = await import("canvas-confetti");
  return mod.default;
}

export function originFromElement(el: Element | null): Origin {
  if (!el || typeof window === "undefined") return { x: 0.5, y: 0.5 };
  const r = el.getBoundingClientRect();
  return {
    x: (r.left + r.width / 2) / window.innerWidth,
    y: (r.top + r.height / 2) / window.innerHeight,
  };
}

export async function burstConfetti(origin: Origin = { x: 0.5, y: 0.5 }, particleCount = 80) {
  const confetti = await load();
  confetti({
    particleCount,
    spread: 80,
    startVelocity: 32,
    gravity: 0.7,
    ticks: 220,
    scalar: 0.9,
    origin,
    colors: COLORS,
    disableForReducedMotion: true,
  });
}

export async function burstHearts(origin: Origin = { x: 0.5, y: 0.5 }, particleCount = 30) {
  const confetti = await load();
  const heart = confetti.shapeFromText({ text: "💗", scalar: 2 });
  const sparkle = confetti.shapeFromText({ text: "✨", scalar: 2 });
  confetti({
    particleCount,
    spread: 110,
    startVelocity: 28,
    gravity: 0.5,
    ticks: 260,
    scalar: 2,
    shapes: [heart, sparkle],
    flat: true,
    origin,
    disableForReducedMotion: true,
  });
}

/** Fills the screen with hearts from both bottom corners. */
export async function heartShower() {
  const confetti = await load();
  const heart = confetti.shapeFromText({ text: "💗", scalar: 2.4 });
  const heart2 = confetti.shapeFromText({ text: "💖", scalar: 2.4 });
  const base = {
    particleCount: 45,
    spread: 70,
    startVelocity: 55,
    gravity: 0.6,
    ticks: 300,
    scalar: 2.4,
    shapes: [heart, heart2],
    flat: true,
    disableForReducedMotion: true,
  };
  confetti({ ...base, angle: 60, origin: { x: 0, y: 1 } });
  confetti({ ...base, angle: 120, origin: { x: 1, y: 1 } });
  setTimeout(() => confetti({ ...base, angle: 90, spread: 120, origin: { x: 0.5, y: 1 } }), 250);
}

/** One-off firework of hearts + confetti for the finale. */
export async function heartFirework() {
  const confetti = await load();
  const heart = confetti.shapeFromText({ text: "❤️", scalar: 2 });
  [0.25, 0.5, 0.75].forEach((x, i) => {
    setTimeout(() => {
      const origin = { x, y: 0.35 + (i % 2) * 0.08 };
      confetti({
        particleCount: 50,
        spread: 360,
        startVelocity: 26,
        gravity: 0.45,
        ticks: 260,
        origin,
        colors: COLORS,
        disableForReducedMotion: true,
      });
      confetti({
        particleCount: 14,
        spread: 360,
        startVelocity: 20,
        gravity: 0.35,
        ticks: 280,
        scalar: 2,
        shapes: [heart],
        flat: true,
        origin,
        disableForReducedMotion: true,
      });
    }, i * 420);
  });
}
