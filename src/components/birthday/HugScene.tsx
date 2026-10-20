import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const LINE = {
  stroke: "var(--berry)",
  strokeWidth: 3,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
};
const HEART = "M0 4 C0 -1 -7 -2 -7 4 C-7 8 0 12 0 12 C0 12 7 8 7 4 C7 -2 0 -1 0 4 Z";

/**
 * A little cartoon couple. Apart (shy) until `together`, then they
 * walk to each other, hug, close their eyes and hearts float up.
 */
export function HugScene({ together }: { together: boolean }) {
  const [hugged, setHugged] = useState(false);

  useEffect(() => {
    if (!together) {
      setHugged(false);
      return;
    }
    const t = window.setTimeout(() => setHugged(true), 1450);
    return () => window.clearTimeout(t);
  }, [together]);

  const walking = together && !hugged;
  const xMove = { duration: hugged ? 0.6 : 1.4, ease: "easeInOut" as const };
  const yAnim = walking ? [0, -7, 0, -7, 0, -7, 0] : together ? 0 : [0, -3, 0];
  const yMove = walking
    ? { duration: 1.4, ease: "easeInOut" as const }
    : together
      ? { duration: 0.4 }
      : { duration: 2.6, repeat: Infinity, ease: "easeInOut" as const };

  const boy = { x: hugged ? 8 : together ? 0 : -78, y: yAnim };
  const girl = { x: hugged ? -8 : together ? 0 : 78, y: yAnim };
  const boyT = { x: xMove, y: yMove };
  const girlT = { x: xMove, y: { ...yMove, delay: together ? 0 : 0.6 } };

  return (
    <div className="relative mx-auto w-[300px] sm:w-[360px] md:w-[440px]">
      {/* soft glow behind them once they hug */}
      <motion.div
        aria-hidden
        className="absolute inset-x-10 top-6 bottom-6 rounded-full bg-rose"
        initial={{ opacity: 0 }}
        animate={{ opacity: hugged ? 0.35 : 0 }}
        transition={{ duration: 1.2 }}
        style={{ filter: "blur(40px)" }}
      />
      <svg
        viewBox="0 0 400 240"
        role="img"
        aria-label={hugged ? "A cute couple hugging" : "A cute couple"}
        className="relative h-auto w-full overflow-visible drop-shadow-lg"
      >
        {/* ground shadow */}
        <ellipse cx="200" cy="230" rx="150" ry="7" fill="var(--berry)" opacity="0.1" />

        <motion.g
          animate={hugged ? { rotate: [-2, 2, -2] } : { rotate: 0 }}
          transition={hugged ? { duration: 3.2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.4 }}
          style={{ originX: 0.5, originY: 1 }}
        >
          {/* ---------- him ---------- */}
          <motion.g initial={false} animate={boy} transition={boyT}>
            <rect x="148" y="204" width="12" height="24" rx="5" fill="var(--plum)" />
            <rect x="170" y="204" width="12" height="24" rx="5" fill="var(--plum)" />
            <motion.g animate={{ opacity: hugged ? 0 : 1 }} transition={{ duration: 0.3 }}>
              <path d="M140 156 Q127 180 133 198" {...LINE} strokeWidth="14" fill="none" />
              <path d="M140 156 Q127 180 133 198" stroke="var(--peach)" strokeWidth="9" strokeLinecap="round" fill="none" />
              <path d="M190 156 Q203 180 197 198" {...LINE} strokeWidth="14" fill="none" />
              <path d="M190 156 Q203 180 197 198" stroke="var(--peach)" strokeWidth="9" strokeLinecap="round" fill="none" />
            </motion.g>
            <path d="M134 212 Q132 152 165 134 Q198 152 196 212 Z" fill="var(--lavender)" {...LINE} />
            <path d="M157 140 L165 152 L173 140" fill="none" {...LINE} strokeWidth="2.5" />
            <motion.g
              animate={{ rotate: hugged ? 12 : 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              style={{ originX: 0.5, originY: 1 }}
            >
              <circle cx="165" cy="95" r="40" fill="var(--peach)" {...LINE} />
              <path
                d="M124 94 Q122 52 165 51 Q208 52 206 94 Q192 72 174 79 Q161 64 146 80 Q134 79 124 94 Z"
                fill="var(--plum)"
                {...LINE}
              />
              <Eye cx={151} cy={101} closed={hugged} />
              <Eye cx={179} cy={101} closed={hugged} />
              <ellipse cx="143" cy="114" rx="7" ry="4" fill="var(--rose)" opacity="0.65" />
              <ellipse cx="187" cy="114" rx="7" ry="4" fill="var(--rose)" opacity="0.65" />
              <path d="M158 115 Q165 122 172 115" fill="none" {...LINE} strokeWidth="2.5" />
            </motion.g>
          </motion.g>

          {/* ---------- her ---------- */}
          <motion.g initial={false} animate={girl} transition={girlT}>
            <rect x="221" y="204" width="11" height="24" rx="5" fill="var(--plum)" />
            <rect x="239" y="204" width="11" height="24" rx="5" fill="var(--plum)" />
            <motion.g animate={{ opacity: hugged ? 0 : 1 }} transition={{ duration: 0.3 }}>
              <path d="M215 160 Q203 182 209 198" {...LINE} strokeWidth="13" fill="none" />
              <path d="M215 160 Q203 182 209 198" stroke="var(--peach)" strokeWidth="8" strokeLinecap="round" fill="none" />
              <path d="M255 160 Q267 182 261 198" {...LINE} strokeWidth="13" fill="none" />
              <path d="M255 160 Q267 182 261 198" stroke="var(--peach)" strokeWidth="8" strokeLinecap="round" fill="none" />
            </motion.g>
            {/* long hair behind */}
            <motion.g
              animate={{ rotate: hugged ? -12 : 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              style={{ originX: 0.5, originY: 0.6 }}
            >
              <path d="M194 98 Q188 150 206 166 L264 166 Q282 150 276 98 Z" fill="var(--plum)" {...LINE} />
            </motion.g>
            <path d="M204 214 Q214 160 235 140 Q256 160 266 214 Z" fill="var(--rose)" {...LINE} />
            <path d="M210 196 Q235 204 260 196" fill="none" stroke="var(--cream)" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            <motion.g
              animate={{ rotate: hugged ? -12 : 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              style={{ originX: 0.5, originY: 1 }}
            >
              <circle cx="235" cy="100" r="38" fill="var(--peach)" {...LINE} />
              <path
                d="M196 99 Q196 60 235 60 Q274 60 274 99 Q259 80 241 85 Q226 73 211 89 Q203 90 196 99 Z"
                fill="var(--plum)"
                {...LINE}
              />
              {/* bow */}
              <path d="M262 66 L249 56 L250 77 Z" fill="var(--rose-deep)" {...LINE} strokeWidth="2.5" />
              <path d="M262 66 L275 56 L274 77 Z" fill="var(--rose-deep)" {...LINE} strokeWidth="2.5" />
              <circle cx="262" cy="66" r="4.5" fill="var(--gold)" {...LINE} strokeWidth="2.5" />
              <Eye cx={222} cy={106} closed={hugged} lashes />
              <Eye cx={248} cy={106} closed={hugged} lashes />
              <ellipse cx="213" cy="118" rx="7" ry="4" fill="var(--rose)" opacity="0.7" />
              <ellipse cx="257" cy="118" rx="7" ry="4" fill="var(--rose)" opacity="0.7" />
              <path d="M229 120 Q235 126 241 120" fill="none" {...LINE} strokeWidth="2.5" />
            </motion.g>
          </motion.g>

          {/* ---------- hugging arms (on top) ---------- */}
          <motion.g initial={false} animate={{ x: girl.x }} transition={{ x: xMove }}>
            <HugArm d="M216 158 Q190 178 164 164" sleeve="var(--peach)" show={hugged} delay={0.15} width={9} />
          </motion.g>
          <motion.g initial={false} animate={{ x: boy.x }} transition={{ x: xMove }}>
            <HugArm d="M186 152 Q220 176 248 158" sleeve="var(--lavender)" show={hugged} delay={0} width={11} />
          </motion.g>
        </motion.g>

        {/* shy little heart between them while apart */}
        {!together && (
          <motion.g transform="translate(200 120) scale(1.3)">
            <motion.path
              d={HEART}
              fill="var(--rose)"
              animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
          </motion.g>
        )}

        {/* hearts floating up once they hug */}
        {hugged &&
          [
            { x: 200, s: 1.6, d: 0 },
            { x: 178, s: 1.1, d: 0.7 },
            { x: 224, s: 1.2, d: 1.3 },
            { x: 192, s: 0.9, d: 1.9 },
            { x: 212, s: 1, d: 2.4 },
          ].map((h, i) => (
            <g key={i} transform={`translate(${h.x} 62) scale(${h.s})`}>
              <motion.path
                d={HEART}
                fill={i % 2 ? "var(--rose)" : "var(--rose-deep)"}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 1, 0], y: -38 }}
                transition={{ duration: 2.4, delay: h.d, repeat: Infinity, repeatDelay: 0.6, ease: "easeOut" }}
              />
            </g>
          ))}
      </svg>
    </div>
  );
}

function Eye({ cx, cy, closed, lashes }: { cx: number; cy: number; closed: boolean; lashes?: boolean }) {
  if (closed) {
    return <path d={`M${cx - 6} ${cy + 1} Q${cx} ${cy - 6} ${cx + 6} ${cy + 1}`} fill="none" {...LINE} strokeWidth="2.6" />;
  }
  return (
    <g>
      <circle cx={cx} cy={cy} r="5" fill="var(--berry)" />
      <circle cx={cx + 1.8} cy={cy - 1.8} r="1.6" fill="var(--cream)" />
      {lashes && <path d={`M${cx + 4} ${cy - 4} L${cx + 7} ${cy - 7}`} {...LINE} strokeWidth="2" />}
    </g>
  );
}

function HugArm({ d, sleeve, show, delay, width }: { d: string; sleeve: string; show: boolean; delay: number; width: number }) {
  const t = { duration: 0.7, delay, ease: "easeOut" as const };
  return (
    <g>
      <motion.path
        d={d}
        fill="none"
        {...LINE}
        strokeWidth={width + 5}
        initial={false}
        animate={{ pathLength: show ? 1 : 0, opacity: show ? 1 : 0 }}
        transition={t}
      />
      <motion.path
        d={d}
        fill="none"
        stroke={sleeve}
        strokeWidth={width}
        strokeLinecap="round"
        initial={false}
        animate={{ pathLength: show ? 1 : 0, opacity: show ? 1 : 0 }}
        transition={t}
      />
    </g>
  );
}
