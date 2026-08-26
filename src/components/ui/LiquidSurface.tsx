import { useEffect, useRef } from "react";
import { Ripples } from "@/lib/ripples";

type Bubble = { x: number; y: number; r: number; speed: number; wobble: number; phase: number };

const makeBubble = (): Bubble => ({
  x: 6 + 188 * Math.random(),
  y: 104 + 30 * Math.random(),
  r: 0.9 + 1.8 * Math.random(),
  speed: 7 + 15 * Math.random(),
  wobble: 1.2 + 2.6 * Math.random(),
  phase: Math.random() * Math.PI * 2,
});

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/**
 * Mặt nước trong stat box — port đúng thuật toán trang gốc:
 * dâng nước 3.4s (easeOutCubic), sóng lừ đừ 2 tần số, gợn Ripples,
 * 8 bong bóng nổi lên, hover đẩy mực nước lên 0.95.
 */
export function LiquidSurface({
  level,
  active,
  tone,
  uid,
  reduced = false,
}: {
  level: number;
  active: boolean;
  tone: string;
  uid: string;
  reduced?: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<SVGPathElement>(null);
  const backRef = useRef<SVGPathElement>(null);
  const topRef = useRef<SVGPathElement>(null);
  const stopTopRef = useRef<SVGStopElement>(null);
  const stopBottomRef = useRef<SVGStopElement>(null);
  const circlesRef = useRef<(SVGCircleElement | null)[]>([]);

  const hoverRef = useRef(false);
  const startRef = useRef<number | null>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const currentRef = useRef(0);

  const seed = useRef(
    (([...uid].reduce((a, c) => a + c.charCodeAt(0), 0) % 100) / 100) * Math.PI * 2,
  ).current;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    if (reduced) {
      const y = 100 - 100 * level;
      const d = `M0 ${y} H200 V100 H0 Z`;
      frontRef.current?.setAttribute("d", d);
      backRef.current?.setAttribute("d", d);
      topRef.current?.setAttribute("d", `M0 ${y} H200`);
      circlesRef.current.forEach((c) => c?.setAttribute("opacity", "0"));
      return;
    }

    if (bubblesRef.current.length === 0) {
      bubblesRef.current = Array.from({ length: 8 }, makeBubble);
    }

    const ripples = new Ripples(56);
    let raf = 0;
    let last = 0;

    const onEnter = () => (hoverRef.current = true);
    const onLeave = () => (hoverRef.current = false);
    /* Lớp phủ này `pointer-events-none` nên KHÔNG bao giờ nhận được pointer —
       phải bắt trên thẻ cha. Trước chỉ dò `.stat-box` (chỉ landing có), nên ô KPI
       và thẻ CTA của trang sản phẩm không hề dâng nước khi hover. */
    const box = host.closest(".stat-box") ?? host.parentElement ?? host;
    box.addEventListener("pointerenter", onEnter);
    box.addEventListener("pointerleave", onLeave);

    raf = requestAnimationFrame(function frame(now: number) {
      if (startRef.current === null) startRef.current = now;
      if (!last) last = now;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const elapsed = now - startRef.current;
      const intro = active ? Math.min(elapsed / 3400, 1) : 0;
      const target = (hoverRef.current ? 0.95 : level) * (1 - Math.pow(1 - intro, 3));

      const maxStep = 0.2 * dt;
      const delta = target - currentRef.current;
      currentRef.current += Math.abs(delta) <= maxStep ? delta : Math.sign(delta) * maxStep;

      const k = now / 1000;
      const bob = 6 * Math.sin(0.2 * k + seed) + 3 * Math.sin(0.115 * k + 1.7 * seed);
      const E = 100 - 100 * currentRef.current - bob * intro;

      ripples.step();

      const build = (amp: number, offset: number) => {
        let d = "";
        for (let i = 0; i < 56; i++) {
          const x = (i / 55) * 200;
          const w = 0.75 * Math.sin(0.05 * x + 0.3 * k) + 0.6 * Math.sin(0.023 * x - 0.18 * k);
          const y = E + offset + (ripples.h[i] + w) * amp;
          d += i === 0 ? `M${x.toFixed(2)} ${y.toFixed(2)}` : ` L${x.toFixed(2)} ${y.toFixed(2)}`;
        }
        return d;
      };

      const front = build(1, 0);
      backRef.current?.setAttribute("d", `${build(0.55, 3)} V100 H0 Z`);
      frontRef.current?.setAttribute("d", `${front} V100 H0 Z`);
      topRef.current?.setAttribute("d", front);

      const fadeT =
        0.95 > level ? clamp01((currentRef.current - level) / (0.95 - level)) : 0;
      const stopOpacity = (1 - 0.55 * fadeT).toFixed(3);
      stopTopRef.current?.setAttribute("stop-opacity", stopOpacity);
      stopBottomRef.current?.setAttribute("stop-opacity", stopOpacity);

      for (let i = 0; i < bubblesRef.current.length; i++) {
        const b = bubblesRef.current[i];
        const circle = circlesRef.current[i];
        b.y -= b.speed * dt;
        if (!(b.y - b.r > E)) {
          bubblesRef.current[i] = makeBubble();
          circle?.setAttribute("opacity", "0");
          continue;
        }
        if (circle) {
          const cx = b.x + Math.sin(2.1 * k + b.phase) * b.wobble;
          const fadeIn = clamp01((100 - b.y) / 14);
          const fadeOut = clamp01((b.y - b.r - E) / 12);
          circle.setAttribute("cx", cx.toFixed(2));
          circle.setAttribute("cy", b.y.toFixed(2));
          circle.setAttribute("r", b.r.toFixed(2));
          circle.setAttribute("opacity", (0.5 * fadeIn * fadeOut * intro).toFixed(3));
        }
      }

      raf = requestAnimationFrame(frame);
    });

    return () => {
      cancelAnimationFrame(raf);
      box.removeEventListener("pointerenter", onEnter);
      box.removeEventListener("pointerleave", onLeave);
    };
  }, [active, level, reduced, seed]);

  return (
    <div ref={hostRef} className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg">
      <svg
        viewBox="0 0 200 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`lg-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop ref={stopTopRef} offset="0%" stopColor="var(--liquid-top)" stopOpacity="1" />
            <stop
              ref={stopBottomRef}
              offset="100%"
              stopColor="var(--liquid-bottom)"
              stopOpacity="1"
            />
          </linearGradient>
        </defs>
        <path ref={backRef} fill={tone} opacity={0.22} />
        <path ref={frontRef} fill={`url(#lg-${uid})`} />
        {Array.from({ length: 8 }, (_, i) => (
          <circle
            key={i}
            ref={(el) => {
              circlesRef.current[i] = el;
            }}
            r="1.4"
            fill="none"
            stroke={tone}
            strokeWidth={0.9}
            opacity={0}
          />
        ))}
        <path
          ref={topRef}
          fill="none"
          stroke={tone}
          strokeWidth={1.2}
          vectorEffect="non-scaling-stroke"
          opacity={0.9}
        />
      </svg>
    </div>
  );
}
