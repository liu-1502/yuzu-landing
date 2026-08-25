import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { asset } from "@/data/content";
import { YuzuMark, YzTokenIcon } from "@/components/ui/YuzuMark";

const BRAND = "#9fe870";
const BRAND_WARM = "#fdd447";

/** Nền quả cầu hero — theo theme: light = xanh nhạt, dark = tối như bản gốc. */
const SPHERE_TOP = "var(--hero-sphere-top)";
const SPHERE_EDGE = "var(--hero-sphere-edge)";

/** useInView({ once: true, margin: "-50px" }) — thay cho framer-motion của bản gốc. */
function useInView<T extends Element>(margin = "-50px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, inView] as const;
}

const ORBIT_TOKENS: {
  key: string;
  icon: ReactNode;
  angle: number;
  delay: number;
  ring?: boolean;
}[] = [
  { key: "yzusd", icon: <YzTokenIcon bg="#E6F6DA" mark="#6BCF13" className="size-5 sm:size-8" />, angle: 210, delay: 0.6 },
  { key: "styzusd", icon: <YzTokenIcon bg="#6BCF13" mark="white" className="size-5 sm:size-8" />, angle: 270, delay: 0.65 },
  { key: "yzilp", icon: <YzTokenIcon bg="#FDD447" mark="white" className="size-5 sm:size-8" />, angle: 330, delay: 0.7 },
  { key: "yzprime", icon: <TokenImg src="/assets/tokens/yzPrime.svg" hex />, angle: 30, delay: 0.75, ring: false },
  { key: "yzcash", icon: <TokenImg src="/assets/tokens/yzCash.svg" />, angle: 90, delay: 0.8 },
  { key: "yzsyrup", icon: <TokenImg src="/assets/tokens/yzSyrup.svg" />, angle: 150, delay: 0.85 },
];

function TokenImg({ src, hex }: { src: string; hex?: boolean }) {
  return (
    <img
      src={asset(src)}
      alt=""
      width={32}
      height={32}
      className={`size-5 sm:size-8 ${hex ? "" : "rounded-full"}`}
      draggable={false}
    />
  );
}

const PILLS: { label: string; style: CSSProperties; delay: number; anim: string }[] = [
  { label: "Tokenized RWA", style: { left: "-18%", top: "48%" }, delay: 0.7, anim: "bounce-pill 3s ease-in-out infinite" },
  { label: "Risk Tranching", style: { right: "-4%", top: "10%" }, delay: 0.8, anim: "bounce-pill 3s ease-in-out -1s infinite" },
  { label: "DeFi Composability", style: { right: "-8%", bottom: "14%" }, delay: 0.9, anim: "bounce-pill 3s ease-in-out -2s infinite" },
];

/**
 * Hero visual: 2 vòng nét chấm, quả cầu tối có ánh sáng xoay + noise,
 * mark Yuzu ở tâm, 6 token bay quanh và 3 pill nhãn — port theo trang gốc.
 */
export function OrbitVisual({ className }: { className?: string }) {
  const [ref, show] = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className={`relative size-full ${className ?? ""}`}>
      {/* vòng nét chấm ngoài */}
      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 100 100"
        style={{
          opacity: show ? 1 : 0,
          transform: show ? "scale(1)" : "scale(0.85)",
          transition: "opacity 0.9s ease 0.1s, transform 0.9s ease 0.1s",
        }}
        aria-hidden
      >
        <circle
          cx="50"
          cy="50"
          r="49.5"
          fill="none"
          stroke="color-mix(in srgb, var(--citrus) 55%, transparent)"
          strokeWidth="0.5"
          strokeDasharray="0.8 2"
        />
      </svg>

      {/* vòng nét chấm trong (75%) */}
      <svg
        className="absolute left-1/2 top-1/2"
        viewBox="0 0 100 100"
        style={{
          width: "75%",
          height: "75%",
          opacity: show ? 1 : 0,
          transform: show
            ? "translate(-50%, -50%) scale(1)"
            : "translate(-50%, -50%) scale(0.85)",
          transition: "opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s",
        }}
        aria-hidden
      >
        <circle
          cx="50"
          cy="50"
          r="49.5"
          fill="none"
          stroke="var(--citrus)"
          strokeWidth="0.5"
          strokeDasharray="0.8 2"
        />
      </svg>

      {/* quả cầu — light: xanh nhạt, dark: giữ màu tối gốc */}
      <div
        className="absolute left-1/2 top-1/2 rounded-full"
        style={{
          width: "50%",
          height: "50%",
          background: `radial-gradient(circle, ${SPHERE_TOP} 55%, ${SPHERE_EDGE} 100%)`,
          border: `2px solid ${BRAND}`,
          filter: "blur(0.795px)",
          boxShadow: `0 0 30px color-mix(in srgb, ${BRAND} 22%, transparent), 0 0 60px color-mix(in srgb, ${BRAND} 8%, transparent), inset 0 0 20px color-mix(in srgb, ${BRAND} 6%, transparent)`,
          opacity: show ? 1 : 0,
          transform: show
            ? "translate(-50%, -50%) scale(1)"
            : "translate(-50%, -50%) scale(0.85)",
          transition: "opacity 0.9s ease 0.3s, transform 0.9s ease 0.3s",
        }}
      />

      {/* noise + ánh sáng quét trong quả cầu */}
      <div
        className="absolute left-1/2 top-1/2 overflow-hidden rounded-full"
        style={{
          width: "50%",
          height: "50%",
          opacity: show ? 1 : 0,
          transform: show
            ? "translate(-50%, -50%) scale(1)"
            : "translate(-50%, -50%) scale(0.85)",
          transition: "opacity 0.9s ease 0.3s, transform 0.9s ease 0.3s",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${asset("/assets/landing/noise.png")}')`,
            backgroundSize: "200px",
            opacity: 0.06,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${asset("/assets/landing/noise.png")}')`,
            backgroundSize: "200px",
            opacity: 0.5,
            WebkitMaskImage:
              "conic-gradient(from var(--light-angle), transparent 0%, transparent 70%, white 88%, white 92%, transparent 100%)",
            maskImage:
              "conic-gradient(from var(--light-angle), transparent 0%, transparent 70%, white 88%, white 92%, transparent 100%)",
            animation: show ? "rotate-light 8s linear infinite" : "none",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `conic-gradient(from var(--light-angle), transparent 0%, transparent 72%, color-mix(in srgb, ${BRAND} 15%, transparent) 84%, color-mix(in srgb, ${BRAND} 30%, transparent) 90%, color-mix(in srgb, ${BRAND} 15%, transparent) 96%, transparent 100%)`,
            WebkitMaskImage: "radial-gradient(circle closest-side, transparent 30%, white 70%)",
            maskImage: "radial-gradient(circle closest-side, transparent 30%, white 70%)",
            animation: show ? "rotate-light 8s linear infinite" : "none",
          }}
        />
      </div>

      {/* viền sáng quét quanh quả cầu */}
      <div
        className="absolute left-1/2 top-1/2 rounded-full"
        style={{
          width: "50%",
          height: "50%",
          background: `conic-gradient(from var(--light-angle), transparent 0%, transparent 60%, color-mix(in srgb, ${BRAND_WARM} 10%, transparent) 76%, color-mix(in srgb, ${BRAND} 60%, transparent) 82%, white 88%, color-mix(in srgb, ${BRAND} 60%, transparent) 93%, color-mix(in srgb, ${BRAND_WARM} 10%, transparent) 97%, transparent 100%)`,
          WebkitMaskImage:
            "radial-gradient(circle closest-side, transparent 88%, white 94%, white 100%)",
          maskImage: "radial-gradient(circle closest-side, transparent 88%, white 94%, white 100%)",
          filter: "blur(2px)",
          mixBlendMode: "hard-light",
          animation: show ? "rotate-light 8s linear infinite" : "none",
          opacity: show ? 1 : 0,
          transform: show
            ? "translate(-50%, -50%) scale(1)"
            : "translate(-50%, -50%) scale(0.85)",
          transition: "opacity 0.9s ease 0.3s, transform 0.9s ease 0.3s",
        }}
      />

      {/* mark Yuzu ở tâm */}
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: "32.5%",
          height: "32.5%",
          opacity: show ? 1 : 0,
          transform: show
            ? "translate(-50%, -50%) scale(1)"
            : "translate(-50%, -50%) scale(0.85)",
          transition: "opacity 0.9s ease 0.3s, transform 0.9s ease 0.3s",
        }}
      >
        <YuzuMark className="size-full" />
      </div>

      {/* token bay quanh */}
      {ORBIT_TOKENS.map(({ key, icon, angle, delay, ring }) => (
        <div
          key={key}
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: show ? 1 : 0,
            transition: `opacity 0.5s ease ${delay}s`,
          }}
        >
          <div className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }}>
            <div
              className="absolute inset-0"
              style={{ animation: show ? "orbit-spin 25s linear infinite" : "none" }}
            >
              <div
                className="absolute"
                style={{ left: "50%", top: "12.5%", transform: "translate(-50%, -50%)" }}
              >
                <div
                  style={{ animation: show ? "orbit-counter-spin 25s linear infinite" : "none" }}
                >
                  <div style={{ transform: `rotate(-${angle}deg)` }}>
                    <div
                      className={
                        ring === false
                          ? undefined
                          : "rounded-full bg-white p-0 shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
                      }
                    >
                      {icon}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* pill nhãn */}
      {PILLS.map(({ label, style, delay, anim }) => (
        <div
          key={label}
          className="absolute"
          style={{
            ...style,
            opacity: show ? 1 : 0,
            transform: show ? "translateX(0)" : `translateX(${label === "Tokenized RWA" ? -10 : 10}px)`,
            transition: `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`,
          }}
        >
          <div style={{ animation: show ? anim : "none" }}>
            <div className="flex items-center justify-center gap-1.5 rounded-lg bg-[color-mix(in_srgb,var(--accent)_14%,var(--surface))] px-2.5 py-1 sm:gap-2.5 sm:rounded-xl sm:px-4 sm:py-2">
              <span className="whitespace-nowrap text-[10px] font-medium leading-3 text-foreground sm:text-sm sm:leading-4">
                {label}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
