import { AnimatePresence, motion } from "framer-motion";
import { Music, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

/** Floating mute/unmute button, bottom-right, on every screen. */
export function MusicToggle({
  visible,
  muted,
  onToggle,
  night,
}: {
  visible: boolean;
  muted: boolean;
  onToggle: () => void;
  night?: boolean;
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={onToggle}
          aria-label={muted ? "Play music" : "Mute music"}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          className={cn(
            "fixed z-50 grid size-12 place-items-center rounded-full transition-colors",
            "bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))]",
            night ? "border border-cream/30 bg-cream/10 text-cream backdrop-blur-md" : "glass-card text-berry",
          )}
        >
          {muted ? (
            <VolumeX className="size-5" />
          ) : (
            <motion.span
              animate={{ rotate: [0, -12, 12, 0], y: [0, -2, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Music className="size-5" />
            </motion.span>
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
