import { useEffect, useRef, useState } from "react";
import { asset } from "@/data/content";

const BRAND = "var(--yuzu-brand)";
/** BRAND pha alpha — dùng cho glow/stroke để giữ một nguồn màu duy nhất. */
const brand = (pct: number) => `color-mix(in srgb, ${BRAND} ${pct}%, transparent)`;

/* ------------------------------ Risk tranching ------------------------------ */

const TRANCHES = [
  { label: "yzUSD", sub: "Senior Tranche", color: BRAND, delay: "0s" },
  { label: "Reserve Fund", sub: null, color: "#eaa408", delay: "0.18s" },
  { label: "yzPP", sub: "Junior Tranche", color: BRAND, delay: "0.36s" },
];

const CONE_D =
  "M4.917 99.857C1.903 98.963.153 97.732.151 96.504L0 4.073C-.003 2.011 4.86.462 11.34.462h44.13l40.753-.46c7.856-.089 14.975 2.107 14.984 4.62l.296 92.446c.003 1.059-1.295 2.026-3.621 2.697l-44.096 12.721c-4.668 1.346-12.271 1.192-17.487-.355L4.917 99.857Z";

const CUBE_TRANSFORM =
  "matrix(0.955045 -0.296461 0.95237 0.304945 -5.239 18.197)";

/** 3 khối tranche xếp chồng, mỗi khối nảy lệch pha — như trang gốc. */
export function TrancheStack() {
  /* p-3 và svg hẹp lại (86 -> 72px) trên mobile: `items-end` dồn chồng khối
     xuống đáy, mà nó cao hơn khung nên thò 12px lên trên viền. */
  return (
    <div className="flex h-full items-end justify-center p-3 pt-8 sm:p-4">
      <div className="flex flex-col items-center gap-y-1.5 sm:gap-y-2 md:gap-y-3">
        {TRANCHES.map((t, i) => (
          <div key={t.label} className="relative flex flex-col items-center">
            <div className="relative z-10 mb-1 text-center">
              <div className="text-sm font-bold text-foreground md:text-base">{t.label}</div>
              {t.sub && (
                <div className="text-[9px] font-medium text-muted-foreground md:text-[10px]">
                  {t.sub}
                </div>
              )}
            </div>

            <div className="relative flex flex-col items-center">
              {/* cột sáng phía dưới khối */}
              <div className="pointer-events-none absolute bottom-0">
                <svg
                  viewBox="0 0 112 114"
                  fill="none"
                  className="w-[72px] sm:w-[108px] md:w-[136px]"
                  aria-hidden
                >
                  <defs>
                    <linearGradient
                      id={`tlight-${i}`}
                      x1="55.6"
                      y1="1.4"
                      x2="46.1"
                      y2="112.5"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop style={{ stopColor: t.color }} stopOpacity="0" />
                      <stop offset="0.75" style={{ stopColor: t.color }} stopOpacity="0.2" />
                      <stop offset="1" style={{ stopColor: t.color }} stopOpacity="1" />
                    </linearGradient>
                  </defs>
                  <path d={CONE_D} fill={`url(#tlight-${i})`} />
                </svg>
              </div>

              {/* khối tranche */}
              <div style={{ animation: `tranche-bounce 3s ease-in-out ${t.delay} infinite` }}>
                <svg
                  viewBox="0 0 112 36"
                  fill="none"
                  className="w-[72px] sm:w-[108px] md:w-[136px]"
                  aria-hidden
                >
                  <defs>
                    <linearGradient
                      id={`tbase-${i}`}
                      x1="32.1"
                      y1="-8.8"
                      x2="32.1"
                      y2="70.6"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="white" stopOpacity="0.15" />
                      <stop offset="1" stopOpacity="0.15" />
                    </linearGradient>
                  </defs>
                  <rect
                    x="3.05"
                    y="0.01"
                    width="60.8"
                    height="60.8"
                    rx="8"
                    transform={CUBE_TRANSFORM}
                    fill={`url(#tbase-${i})`}
                    fillOpacity="0.2"
                  />
                  <rect
                    x="3.05"
                    y="0.01"
                    width="60.8"
                    height="60.8"
                    rx="8"
                    transform={CUBE_TRANSFORM}
                    style={{ stroke: t.color }}
                    strokeWidth="3.2"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------- Radar ---------------------------------- */

/** Vòng radar với tia sáng quét 4s + logo Hypernative ở tâm. */
export function RadarVisual() {
  return (
    <div className="relative flex h-full items-center justify-center p-8 md:p-[60px]">
      <div className="relative flex h-[200px] w-[200px] items-center justify-center sm:h-[250px] sm:w-[250px]">
        <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" aria-hidden>
          <circle
            cx="50"
            cy="50"
            r="49.5"
            fill="none"
            style={{ stroke: brand(25) }}
            strokeWidth="0.3"
            strokeDasharray="0.8 2"
          />
        </svg>

        <div className="absolute inset-[10%]">
          <svg className="size-full" viewBox="0 0 100 100" aria-hidden>
            <circle
              cx="50"
              cy="50"
              r="49.5"
              fill="none"
              style={{ stroke: brand(35) }}
              strokeWidth="0.4"
              strokeDasharray="0.8 2"
            />
          </svg>
        </div>

        <div
          className="absolute inset-[20%] rounded-full"
          style={{
            border: `2px solid ${BRAND}`,
            boxShadow: `0 0 20px ${brand(20)}, 0 0 40px ${brand(8)}`,
          }}
        />

        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              `conic-gradient(from var(--light-angle), transparent 0%, transparent 55%, ${brand(2)} 65%, ${brand(6)} 75%, ${brand(12)} 85%, ${brand(22)} 96%, ${brand(30)} 99.5%, transparent 100%)`,
            animation: "rotate-light 4s linear infinite",
          }}
        />

        <div className="relative z-10 flex items-center justify-center">
          {/*
           * Logo Hypernative gốc là PNG xanh chuối trên nền trong suốt — đặt lên panel
           * sáng thì gần như tàng hình. Dùng luôn alpha của chính file đó làm mask rồi
           * tô bằng `--foreground`: light ra xanh đen, dark ra sáng. Không cần tải asset
           * mới, và silhouette khớp tuyệt đối với bản gốc.
           */}
          <span
            role="img"
            aria-label="Hypernative"
            className="size-30 bg-foreground"
            style={{
              WebkitMaskImage: `url(${asset("/assets/landing/radaz.png")})`,
              maskImage: `url(${asset("/assets/landing/radaz.png")})`,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Fordefi wallet ------------------------------ */

const KEY_POS = [
  { style: { top: "12%", left: "14%" }, delay: "0.1s" },
  { style: { top: "12%", right: "14%" }, delay: "0.3s" },
  { style: { bottom: "8%", left: "50%" }, delay: "0.5s", centered: true },
];

const KEY_D =
  "M26.25 2.11035C33.4988 2.11035 39.375 7.9866 39.375 15.2354C39.375 20.366 36.4307 24.8082 32.14 26.9667L32.1409 29.2448C32.1409 29.8247 31.9101 30.381 31.5 30.7914L28.7742 33.5172L31.4991 36.2413C31.9091 36.6513 32.1391 37.208 32.1392 37.788V42.1553C32.1391 42.5738 32.0191 42.9839 31.7931 43.3362L28.053 49.1689C27.6431 49.8083 26.9306 50.1895 26.1714 50.1755C25.4123 50.1617 24.7146 49.7552 24.3282 49.1014L20.8812 43.2678C20.6821 42.9307 20.5762 42.5466 20.5762 42.1553V27.0726C16.1685 24.9561 13.125 20.4516 13.125 15.2354C13.125 7.9866 19.0013 2.11035 26.25 2.11035ZM26.25 8.68652C25.7943 8.68652 25.3629 8.79055 24.9785 8.97705C23.5925 9.49323 22.6039 10.8289 22.6039 12.395C22.6039 14.4086 24.2375 16.0411 26.25 16.0411C28.2625 16.0411 29.8961 14.4086 29.8961 12.395C29.8961 10.8289 28.9075 9.49323 27.5215 8.97705C27.1371 8.79055 26.7057 8.68652 26.25 8.68652Z";

const KEY_BADGE_BG =
  `linear-gradient(179deg, ${brand(20)} 0.81%, ${brand(0)} 99.19%), var(--key-badge)`;

function KeyGlyph({ i }: { i: number }) {
  return (
    <svg width="32" height="32" viewBox="0 0 53 53" fill="none" aria-hidden>
      <g clipPath={`url(#clip-key-${i})`}>
        <path fillRule="evenodd" clipRule="evenodd" d={KEY_D} fill={`url(#paint-key-${i})`} />
      </g>
      <defs>
        <linearGradient
          id={`paint-key-${i}`}
          x1="39.375"
          y1="26.1431"
          x2="13.125"
          y2="26.1431"
          gradientUnits="userSpaceOnUse"
        >
          <stop style={{ stopColor: BRAND }} />
          <stop offset="1" style={{ stopColor: "var(--mark)" }} />
        </linearGradient>
        <clipPath id={`clip-key-${i}`}>
          <rect width="52.5" height="52.5" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

/** Ổ khoá quay vào rồi tách thành 3 mảnh khoá MPC — như trang gốc. */
export function WalletVisual() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [split, setSplit] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        window.setTimeout(() => setSplit(true), 1400);
      },
      { rootMargin: "-40px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* py-5 trên mobile: khung bọc là `h-full` nên nó hug lấy chính illus — thu nhỏ
     illus thì khung co theo, hở vẫn y nguyên 2px. Chỉ padding mới tách được
     illus khỏi viền. */
  return (
    <div ref={hostRef} className="relative flex h-full items-center justify-center py-5 sm:py-0">
      {/* 180 chứ không phải 220 trên mobile: khung chỉ cao 224px nên vòng ngoài
          cùng của radar hở đúng 2px với viền, nhìn như dính. */}
      <div className="relative flex h-[180px] w-[180px] items-center justify-center sm:h-[260px] sm:w-[260px]">
        <div className="absolute inset-0">
          <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" aria-hidden>
            <circle
              cx="50"
              cy="50"
              r="49.5"
              fill="none"
              style={{ stroke: brand(15) }}
              strokeWidth="0.4"
            />
          </svg>
          <div className="absolute inset-[12%]">
            <svg className="size-full" viewBox="0 0 100 100" aria-hidden>
              <circle
                cx="50"
                cy="50"
                r="49.5"
                fill="none"
                style={{ stroke: brand(35) }}
                strokeWidth="0.5"
                strokeDasharray="1.2 2.4"
              />
            </svg>
          </div>
          <div
            className="absolute inset-[24%] rounded-full"
            style={{
              border: `2px solid ${BRAND}`,
              boxShadow: `0 0 20px ${brand(25)}, 0 0 40px ${brand(10)}`,
            }}
          />
        </div>

        {/* ổ khoá */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-all duration-700"
          style={{ opacity: split ? 0 : 1, transform: split ? "scale(0.8)" : "scale(1)" }}
        >
          <div style={{ animation: "fordefi-spin 1.2s cubic-bezier(0.4, 0, 0.2, 1) 1" }}>
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden>
              <rect x="20" y="36" width="40" height="32" rx="6" fill="url(#lockGrad)" />
              <path
                d="M28 36V28C28 21.4 33.4 16 40 16C46.6 16 52 21.4 52 28V36"
                style={{ stroke: BRAND }}
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="40" cy="49" r="4" fill="#000" />
              <rect x="38" y="51" width="4" height="8" rx="2" fill="#000" />
              <defs>
                <linearGradient
                  id="lockGrad"
                  x1="40"
                  y1="36"
                  x2="40"
                  y2="68"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop style={{ stopColor: "var(--mark)" }} />
                  <stop offset="1" style={{ stopColor: BRAND }} />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* 3 mảnh khoá */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: split ? 1 : 0, transition: "opacity 0.7s" }}
        >
          {KEY_POS.map((k, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                ...k.style,
                opacity: split ? 1 : 0,
                transform: k.centered
                  ? `translateX(-50%) scale(${split ? 1 : 0.5})`
                  : `scale(${split ? 1 : 0.5})`,
                transition: `0.6s cubic-bezier(0.4, 0, 0.2, 1) ${k.delay}`,
              }}
            >
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full sm:h-18 sm:w-18"
                style={{ border: `1px solid ${brand(45)}`, background: KEY_BADGE_BG }}
              >
                <KeyGlyph i={i} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
