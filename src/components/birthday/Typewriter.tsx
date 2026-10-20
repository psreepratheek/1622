import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Types lines one after another. The full text is laid out invisibly
 * underneath so nothing shifts while typing.
 */
export function Typewriter({
  lines,
  speed = 42,
  startDelay = 600,
  onDone,
  className,
  lineClassName,
}: {
  lines: readonly string[];
  speed?: number;
  startDelay?: number;
  onDone?: () => void;
  className?: string;
  lineClassName?: string;
}) {
  const reduce = useReducedMotion();
  const [line, setLine] = useState(0);
  const [chars, setChars] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setStarted(true), startDelay);
    return () => window.clearTimeout(t);
  }, [startDelay]);

  useEffect(() => {
    if (reduce) {
      setLine(lines.length);
      onDone?.();
      return;
    }
    if (!started) return;
    if (line >= lines.length) {
      onDone?.();
      return;
    }
    const current = lines[line] ?? "";
    if (chars < current.length) {
      const t = window.setTimeout(() => setChars((c) => c + 1), speed + Math.random() * 30);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => {
      setLine((l) => l + 1);
      setChars(0);
    }, 650);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, line, chars, reduce]);

  return (
    <div className={className}>
      {lines.map((text, i) => {
        const shown = i < line ? text : i === line ? text.slice(0, chars) : "";
        const typing = i === line && started;
        return (
          <p key={i} className={`relative ${lineClassName ?? ""}`}>
            <span className="invisible" aria-hidden>
              {text}
            </span>
            <span className="absolute inset-0">
              {shown}
              {typing && <span className="ml-0.5 inline-block w-[2px] animate-pulse bg-rose align-middle" style={{ height: "1em" }} />}
            </span>
            <span className="sr-only">{text}</span>
          </p>
        );
      })}
    </div>
  );
}
