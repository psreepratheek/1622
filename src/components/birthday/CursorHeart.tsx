import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/use-birthday";

/** Desktop only: a soft glowing heart that lazily follows the cursor. */
export function CursorHeart() {
  const finePointer = useMediaQuery("(pointer: fine) and (min-width: 768px)");
  const reduce = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 120, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 120, damping: 18, mass: 0.6 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!finePointer || reduce) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX + 14);
      y.set(e.clientY + 14);
      setVisible(true);
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [finePointer, reduce, x, y]);

  if (!finePointer || reduce) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[70] text-xl leading-none text-rose text-glow"
      style={{ x: sx, y: sy, opacity: visible ? 0.85 : 0 }}
    >
      <motion.span
        className="block"
        animate={{ scale: [1, 1.18, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        ♥
      </motion.span>
    </motion.div>
  );
}
