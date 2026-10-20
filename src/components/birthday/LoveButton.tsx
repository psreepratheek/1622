import { motion, type HTMLMotionProps } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = HTMLMotionProps<"button"> & {
  variant?: "love" | "glass" | "night";
};

/** Rounded button with a gentle grow + wiggle on hover. */
export function LoveButton({ variant = "love", className, children, ...props }: Props) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.06, rotate: [0, -2, 2, 0], transition: { duration: 0.5 } }}
      whileTap={{ scale: 0.95 }}
      className={cn(buttonVariants({ variant, size: "xl" }), className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}

/** Fades a block in after a delay (seconds). */
export function FadeIn({
  delay = 0,
  className,
  children,
}: {
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
