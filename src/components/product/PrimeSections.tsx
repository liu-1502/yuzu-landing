import { useEffect, useRef, useState } from "react";
import type { Claim, Era, MapleCell, PrimePage, Stat } from "@/data/productPages";
import { asset } from "@/data/content";
import { PAD, WRAP } from "@/components/product/ProductShell";
import { MapleIcon } from "@/components/product/MapleIcons";
import { Reveal } from "@/components/product/Reveal";
import { cn } from "@/lib/utils";

/* ==========================================================================
   Prime dùng HỆ MÀU VÀ KIỂU THẺ RIÊNG, không chung với Alpha/Marketplace:
     - tiêu đề CANH GIỮA, kicker là một pill viền vàng
     - thẻ bo 40px, nền --prime-card, viền --prime-card-border, có ảnh 2:1
     - dải số liệu kẻ trên/dưới bằng border-image gradient (mờ dần hai đầu)
     - chỉ số chú thích [n] render thành <sup> màu --prime-accent-dark
   Token nằm trong `.prime-scope` ở index.css.
   ========================================================================== */

const CARD_PRIME =
  "rounded-[40px] border border-[var(--prime-card-border)] bg-[var(--prime-card)]";

/** Kẻ trên/dưới mờ dần hai đầu — bản dev làm bằng border-image gradient. */
const RULE_Y: React.CSSProperties = {
  borderTop: "1px solid transparent",
  borderBottom: "1px solid transparent",
  borderImage:
    "linear-gradient(90deg, transparent 0%, var(--prime-card-border) 50%, transparent 100%) 1",
};

/** Tách `[1]`, `[7]`… trong câu thành <sup>. Bản dev đánh chú thích ngay trong
 * dòng chữ, không phải ở cuối đoạn. */
function withRefs(text: string) {
  return text.split(/(\[\d+\])/g).map((part, i) =>
    /^\[\d+\]$/.test(part) ? (
      <sup key={i} className="text-xs text-[var(--prime-accent-dark)]">
        {part}
      </sup>
    ) : (
      part
    ),
  );
}

/** Dùng thẳng `.kicker` — viên pill nền trắng của home. Trước đây Prime tự dựng
 *  một pill riêng viền + nền tô accent, chữ 13px; giờ theo nếp chung. */
function Pill({ children }: { children: string }) {
  return <span className="kicker">{children}</span>;
}

function PrimeH2({ children }: { children: string }) {
  return (
    /* Cùng cỡ với `SectionHead` của Alpha/Marketplace: 30px, 40px từ `md`. Trước
       để 24px/36px nên tiêu đề Prime nhỏ hơn hai trang kia một nấc. */
    <h2 className="text-center text-3xl font-bold leading-[1.2] tracking-tight text-[var(--prime-text)] md:text-[40px]">
      {children}
    </h2>
  );
}

function Lead({ text, width }: { text: string; width: string }) {
  return (
    <div className={cn("mx-auto", width)}>
      {/* 15.5px như đoạn mô tả ở mọi section của hai trang kia. Trước để 20px
          (`text-xl`) nên chữ Prime bự hơn hẳn. */}
      <p className="text-center text-[15.5px] leading-[1.65] text-[var(--prime-text-subtle)]">
        {withRefs(text)}
      </p>
    </div>
  );
}

/** Dải số liệu ngang, kẻ mờ hai đầu, các ô chia đều. */
function StatRule({ stats }: { stats: Stat[] }) {
  return (
    <div className="w-full">
      <div className="flex w-full" style={RULE_Y}>
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex flex-1 flex-col items-center gap-2 px-2 py-6 text-center md:px-6 md:py-10"
          >
            <p className="text-2xl font-bold leading-[1.3] tabular-nums text-[var(--prime-accent)] md:text-[28px]">
              {s.value}
            </p>
            <p className="text-xs font-medium uppercase leading-[1.3] text-[var(--prime-text)]">
              {withRefs(s.label)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Thẻ luận điểm: ảnh 2:1 bo 24px ở trên, rồi tiêu đề và đoạn mô tả. */
function ArtCard({ c }: { c: Claim }) {
  return (
    <div className={cn("flex h-full flex-col gap-6 p-6", CARD_PRIME)}>
      {c.image && (
        <div className="relative w-full overflow-hidden rounded-3xl" style={{ aspectRatio: "2 / 1" }}>
          <img src={asset(c.image)} alt="" loading="lazy" className="prime-art absolute inset-0 size-full object-cover" />
        </div>
      )}
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-bold leading-normal text-[var(--prime-text)]">{c.title}</h3>
        <p className="text-sm leading-relaxed text-[var(--prime-text-subtle)] opacity-80">
          {withRefs(c.body)}
        </p>
      </div>
    </div>
  );
}

export function TBills({ data }: { data: PrimePage["tbills"] }) {
  return (
    <section className={cn("py-15", PAD)}>
      <div className={cn(WRAP, "flex flex-col items-center gap-10")}>
        {/* Kicker + tiêu đề nằm trong MỘT cụm cách nhau 16px, đúng nếp
            `SectionHead` của hai trang kia. Trước đây chúng là con riêng của cột
            `gap-10` nên cách nhau 40px — xa hơn hẳn. */}
        <Reveal y={60}>
          <div className="flex flex-col items-center gap-4">
            <Pill>{data.kicker}</Pill>
            <PrimeH2>{data.title}</PrimeH2>
          </div>
        </Reveal>
        <Reveal y={60} className="w-full">
          <StatRule stats={data.stats} />
        </Reveal>
        <div className="grid w-full gap-8 md:grid-cols-2">
          {data.claims.map((c, i) => (
            <Reveal key={c.title} y={60} delay={i * 0.06}>
              <ArtCard c={c} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------- CLO ---------------------------------- */

/** Vòng tròn "CLOs": hai vành nét đứt quay ngược chiều nhau (60s và 45s) và một
 * vành phát sáng ở giữa. Bản dev dựng vành sáng bằng một chuỗi <g filter> chồng
 * nhau; ở đây gom lại thành hai đường viền cộng blur — nhìn tương đương mà nhẹ
 * hơn nhiều. */
function CloRing() {
  return (
    <div className="relative size-[280px] shrink-0 lg:size-[400px]">
      <svg
        className="absolute inset-0 animate-[spin_60s_linear_infinite]"
        viewBox="0 0 600 600"
        fill="none"
        aria-hidden
      >
        <circle
          cx="300"
          cy="300"
          r="299"
          stroke="color-mix(in srgb, var(--prime-accent) 30%, transparent)"
          strokeWidth="1.36"
          strokeDasharray="6.82 6.82"
        />
      </svg>
      <svg
        className="absolute animate-[spin_45s_linear_infinite_reverse]"
        viewBox="0 0 491 491"
        fill="none"
        style={{ top: "9.1%", left: "9.1%", width: "81.8%", height: "81.8%" }}
        aria-hidden
      >
        <circle
          cx="245.5"
          cy="245.5"
          r="244.5"
          stroke="var(--prime-accent)"
          strokeWidth="1.36"
          strokeDasharray="5.45 5.45"
        />
      </svg>
      <div
        className="absolute rounded-full"
        style={{
          top: "18.2%",
          left: "18.2%",
          width: "63.6%",
          height: "63.6%",
          border: "6px solid var(--prime-accent)",
          filter: "blur(3px)",
          opacity: 0.75,
        }}
        aria-hidden
      />
      <span className="pointer-events-none absolute inset-0 flex select-none items-center justify-center text-5xl font-bold text-[var(--prime-accent)] lg:text-6xl">
        CLOs
      </span>
    </div>
  );
}

/** Số liệu dạng viên thuốc: badge tròn viền vàng chứa số, rồi nhãn. */
function StatPills({ stats }: { stats: Stat[] }) {
  return (
    <div className="flex flex-col gap-4 lg:ml-20 lg:gap-5">
      {stats.map((s, i) => (
        <Reveal key={s.label} y={20} delay={i * 0.07}>
          <div className="relative">
            {/* Sợi chỉ nối vòng tròn sang viên này. Neo vào CHÍNH viên
                (`right-full`, `top-1/2`) nên nó luôn nằm giữa viên và luôn lấp
                đúng khe `lg:ml-20` (80px) — trước đây bốn sợi đặt theo % của cả
                khối nên lệch tâm viên (20/36/52/70% so với tâm thật
                16.3/38.8/61.3/83.8%) và còn kéo xuyên qua viên. */}
            <span
              aria-hidden
              className="absolute top-1/2 right-full hidden h-px w-20 -translate-y-1/2 lg:block"
              style={{
                background: "linear-gradient(90deg, transparent 0%, var(--prime-accent) 100%)",
              }}
            />
          <div className="flex items-center gap-3 rounded-full border border-[var(--prime-card-border)] bg-[var(--prime-card)] py-2 pr-4 pl-2 lg:gap-4 lg:pr-5">
            <div className="flex h-11 min-w-11 items-center justify-center rounded-full border border-[var(--prime-accent)] bg-[var(--prime-bg)] px-3 lg:h-13 lg:min-w-13 lg:px-4">
              <span className="whitespace-nowrap text-lg font-medium tabular-nums text-[var(--prime-accent-strong)] lg:text-xl">
                {s.value}
              </span>
            </div>
            <span className="text-sm font-medium text-[var(--prime-text)] lg:text-lg">
              {withRefs(s.label)}
            </span>
          </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* --------------------------- dòng thời gian CLO ---------------------------- */

/** Đường cong bản dev vẽ dòng thời gian, viewBox 1289×1204. */
const SNAKE_D =
  "M7.05481 0.5C279.471 0.50039 628.629 12.139 903.865 68.3917C1319.43 153.324 1496.25 372.571 883.758 496.685C192.183 636.823 -43.3639 727.054 7.05481 847.078C57.47 967.10 391.924 1094.79 883.758 1155.94C1192.8 1194.37 1166.14 1188.68 1288.05 1202.82";
const SNAKE_W = 1289;
const SNAKE_H = 1204;

/** Bảy mốc nằm ở các vị trí này theo CHIỀU DÀI đường cong (tính ngược từ toạ độ
 *  thật trên bản dev, sai số < 0.02px nên đây đúng là số họ dùng). */
const ERA_AT = [0, 0.125, 0.25, 0.47, 0.61, 0.73, 0.93];

/** Khoảng hở giữa đáy thẻ và điểm neo: 32px, riêng mốc 4–5 là 82px — hai mốc đó
 *  nằm ở khúc đường đi xuống nên phải nâng cao hơn để chữ không đè lên đường. */
const ERA_LIFT = [32, 32, 32, 82, 82, 32, 32];

/**
 * Tiến độ vẽ đường theo cuộn: 0 khi đỉnh khối còn dưới 85% chiều cao khung nhìn,
 * 1 khi khối đã trôi qua. Bản dev khoá cuộn nên mình không đo được đúng công thức
 * của họ; đây là quãng hợp lý để mốc cuối (0.93) kịp hiện trước khi khối rời màn.
 */
function useDrawProgress(ref: React.RefObject<HTMLDivElement | null>) {
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setP(1);
      return;
    }
    let raf = 0;
    const read = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const span = vh * 0.25 + r.height;
      setP(Math.min(1, Math.max(0, (vh * 0.85 - r.top) / span)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref]);

  return p;
}

/** Chữ trong một mốc — dùng chung cho bản desktop và bản dọc trên điện thoại. */
function EraText({ era, bodyClass }: { era: Era; bodyClass: string }) {
  return (
    <>
      <span className="text-2xl font-medium leading-none text-[var(--prime-text)]">{era.year}</span>
      <div className="flex flex-col gap-1.5">
        <h4 className="text-2xl font-medium leading-tight text-[var(--prime-accent)]">
          {era.title}
        </h4>
        <p className={bodyClass}>{withRefs(era.body)}</p>
      </div>
    </>
  );
}

/**
 * Dòng thời gian CLO — dựng lại đúng bản dev, KHÔNG phải danh sách dọc như trước.
 *
 * Bản dev có hai biến thể tách hẳn nhau:
 *  - từ lg: một đường cong SVG uốn hình chữ S, bảy mốc đặt NGAY TRÊN đường ở các
 *    vị trí 0/12.5/25/47/61/73/93% chiều dài. Đường được vẽ dần theo cuộn
 *    (stroke-dashoffset), mốc nào bị đường đi qua thì hiện ra.
 *  - dưới lg: một vạch dọc bên trái, mốc xếp thẳng đứng, vạch cao dần theo cuộn.
 *
 * Toạ độ mốc lấy bằng `getPointAtLength` nên không cần đo DOM: chúng là toạ độ
 * trong viewBox, đổi sang % của khung là xong — khung giữ đúng tỉ lệ 1289:1204
 * nên vị trí khớp ở mọi bề rộng.
 */
function Timeline({ eras }: { eras: Era[] }) {
  const wide = useRef<HTMLDivElement>(null);
  const narrow = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const pWide = useDrawProgress(wide);
  const pNarrow = useDrawProgress(narrow);
  const [len, setLen] = useState(0);
  const [pts, setPts] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const total = path.getTotalLength();
    setLen(total);
    setPts(
      ERA_AT.map((f) => {
        const pt = path.getPointAtLength(f * total);
        return { x: pt.x, y: pt.y };
      }),
    );
  }, []);

  return (
    <>
      {/* Bản snake chỉ hiện từ `xl` (1280px) chứ không phải `lg` (1024px): bảy thẻ
          mốc rộng 360px, ở khổ 1024 thì khoảng cách ngang giữa các mốc chỉ còn
          ~320px nên thẻ đè nhau (đo được ba cặp chồng 38 / 43 / 11px). Dưới 1280
          dùng bản danh sách dọc — nó không bao giờ chồng. */}
      <div ref={wide} className="relative hidden w-full overflow-visible pt-32 xl:block">
        {/* Khung rộng hết khổ CHA (khối này đã được đưa ra ngoài `max-w-5xl`, xem
            `Clo`), tối đa 1080px — càng rộng thì các mốc càng giãn ra. */}
        <div className="relative z-10 mx-auto w-full" style={{ maxWidth: 1080 }}>
          <svg viewBox={`0 0 ${SNAKE_W} ${SNAKE_H}`} fill="none" className="block w-full" aria-hidden>
            {/* Vạch nền: bản dev để trắng 15% — trên nền kem gần như không thấy,
                nên thực tế người xem chỉ thấy nét vàng được vẽ dần. Giữ đúng
                giá trị của họ. */}
            <path d={SNAKE_D} stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
            <path
              ref={pathRef}
              d={SNAKE_D}
              stroke="var(--prime-accent)"
              strokeWidth={2}
              strokeLinecap="round"
              style={len ? { strokeDasharray: len, strokeDashoffset: len * (1 - pWide) } : undefined}
            />
          </svg>

          {pts.map((pt, i) => (
            <div
              key={eras[i]?.year ?? i}
              className="absolute"
              style={{
                left: `${(pt.x / SNAKE_W) * 100}%`,
                top: `${(pt.y / SNAKE_H) * 100}%`,
                /* Kẹp thẻ theo mép phải khung: mốc nằm ở 80% bề rộng thì thẻ chỉ
                   được dùng 20% còn lại. Thiếu dòng này thì hai thẻ cuối tràn ra
                   ngoài và bị `overflow-x: clip` của body cắt.
                   Cộng thêm 88px: khung 1080 nằm giữa màn ≥1280 (bản snake chỉ
                   hiện từ `xl`) nên còn ≥100px lề mỗi bên — mượn phần đó cho hai
                   thẻ sát mép, đỡ phải co xuống 204px. */
                maxWidth: `calc(${(1 - pt.x / SNAKE_W) * 100}% + 88px)`,
                opacity: pWide >= ERA_AT[i] ? 1 : 0,
                transform: `translateX(-8px) translateY(calc(-100% - ${ERA_LIFT[i]}px))`,
                transition: "opacity .6s ease",
              }}
            >
              {eras[i] && (
                <div className="relative">
                  {/* Sợi chỉ dọc mảnh 2px nối thẻ xuống đường, mờ dần sang trái. */}
                  <div
                    aria-hidden
                    className="absolute left-1.5 top-0"
                    style={{
                      width: 2,
                      height: 200,
                      background:
                        "linear-gradient(90deg, transparent 0%, var(--prime-card-border) 100%)",
                    }}
                  />
                  {/* 416px thay vì 360px (`w-90`): khoảng cách ngang giữa hai mốc kề
                        nhau là 432px, nên thẻ rộng tối đa 416px là vừa chừa 16px
                        hở — trước để 360px thì hở tới 74px, thẻ nhìn nhỏ mà chữ
                        lại xuống nhiều dòng. */}
                  <div className="flex w-[416px] max-w-full flex-col gap-2 pl-6 text-left">
                    <EraText
                      era={eras[i]}
                      bodyClass="text-sm font-normal leading-tight text-[var(--prime-text-subtle)]"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Chấm tròn NGAY TRÊN đường, giống hệt bản dọc dưới `lg`. Phải là một
              lớp riêng chứ không nhét vào khối thẻ ở trên: khối đó bị đẩy hẳn lên
              trên đường bằng `translateY(calc(-100% - lift))`, chấm nằm trong đó
              sẽ trôi theo và không còn chạm đường nữa. Vẽ sau nên nằm đè lên sợi
              chỉ dọc, che gọn chỗ chỉ gặp đường. */}
          {pts.map((pt, i) => (
            <div
              key={`dot-${eras[i]?.year ?? i}`}
              aria-hidden
              className="absolute size-3.5"
              style={{
                left: `${(pt.x / SNAKE_W) * 100}%`,
                top: `${(pt.y / SNAKE_H) * 100}%`,
                transform: "translate(-50%, -50%)",
                opacity: pWide >= ERA_AT[i] ? 1 : 0,
                transition: "opacity .6s ease",
              }}
            >
              <div
                className="absolute inset-0 rounded-full bg-[var(--prime-accent)]"
                style={{ filter: "blur(2px)" }}
              />
              <div className="absolute inset-0 rounded-full bg-[var(--prime-accent)]" />
            </div>
          ))}
        </div>
      </div>

      <div ref={narrow} className="relative w-full pl-8 xl:hidden">
        <div aria-hidden className="absolute left-0 top-0 h-full w-px bg-[var(--prime-card-border)]" />
        <div
          aria-hidden
          className="absolute left-0 top-0 h-full w-px origin-top bg-[var(--prime-accent)]"
          style={{ transform: `scaleY(${pNarrow})` }}
        />
        {eras.map((era, i) => {
          const on = pNarrow >= (i + 0.35) / eras.length;
          return (
            <div key={era.year} className="relative mb-12 last:mb-0">
              <div
                aria-hidden
                className="absolute -left-9.75 top-2.5 size-3.5 rounded-full bg-[var(--prime-accent)]"
                style={{ filter: "blur(2px)", opacity: on ? 1 : 0, transition: "opacity .5s ease" }}
              />
              <div
                aria-hidden
                className="absolute -left-9.75 top-2.5 size-3.5 rounded-full bg-[var(--prime-accent)]"
                style={{ opacity: on ? 1 : 0, transition: "opacity .5s ease" }}
              />
              <div
                className="flex flex-col gap-2"
                style={{ opacity: on ? 1 : 0, transition: "opacity .5s ease" }}
              >
                <EraText
                  era={era}
                  bodyClass="text-sm leading-relaxed text-[color-mix(in_srgb,var(--prime-text)_70%,transparent)]"
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}


export function Clo({ data }: { data: PrimePage["clo"] }) {
  return (
    <section
      className={cn(
        /* Nền trắng, KHÔNG nét kẻ trên/dưới. */
        "bg-surface py-15",
        PAD,
      )}
    >
      {/* max-w-5xl chứ không phải 5xl: vòng tròn + cột viên thuốc cần chỗ. */}
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-10">
        <Reveal y={60}>
          <div className="flex flex-col items-center gap-4">
            <Pill>{data.kicker}</Pill>
            <PrimeH2>{data.title}</PrimeH2>
            <Lead text={data.body} width="max-w-[800px]" />
          </div>
        </Reveal>

        <Reveal y={60} className="w-full">
          <div className="relative mx-auto">
            <div className="relative flex flex-col items-center gap-10 lg:flex-row lg:justify-center lg:gap-0">
              <CloRing />
              <StatPills stats={data.stats} />
            </div>
          </div>
        </Reveal>

        {/* Dòng thời gian PHÁ KHỔ 1024 của cột — cho rộng tới 1080px. Các mốc nằm
            theo % bề rộng khung nên khung càng rộng thì thẻ càng giãn ra; đó là
            cách duy nhất để bảy thẻ 360px không đè nhau.
            KHÔNG cần `left-1/2` + `-translate-x-1/2`: cột cha là
            `flex flex-col items-center` nên một item rộng hơn cột đã tự canh giữa
            sẵn; thêm hai lớp dịch đó vào là lệch hẳn 176px sang trái (đã đo).
            `mt-30` cộng `gap-10` của cột = 160px khoảng cách tới cụm vòng tròn. */}
        <div className="relative mt-30 w-[min(1080px,100vw-4rem)]">
          <Timeline eras={data.timeline} />
        </div>

        <Reveal y={60} className="w-full">
          {/* Bản dev KHÔNG dựng hai thẻ bo 40px ở đây: chỉ là một dải kẻ trên/dưới,
              tiêu đề 18px, và hai ô chữ trơn. Mình từng làm thành thẻ nên khối này
              cao hơn bản gốc 28px và nặng hơn hẳn về thị giác. */}
          <div className="border-y border-[var(--prime-card)] py-8">
            <h3 className="mb-4 text-lg font-bold text-[var(--prime-text)]">
              {data.compare.title}
            </h3>
            <div className="grid gap-6 sm:grid-cols-2">
              {data.compare.cards.map((c) => (
                <div key={c.title}>
                  <div className="mb-2 flex items-center gap-1">
                    <span className="text-sm font-semibold leading-relaxed text-[var(--prime-text)]">
                      {c.title}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-[var(--prime-text-muted)]">
                    {withRefs(c.body)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------- Maple --------------------------------- */

export function Lending({ data }: { data: PrimePage["lending"] }) {
  return (
    <section className={cn("py-15", PAD)}>
      <div className={cn(WRAP, "flex flex-col items-center gap-10")}>
        <Reveal y={60}>
          <div className="flex flex-col items-center gap-4">
            <Pill>{data.kicker}</Pill>
            <PrimeH2>{data.title}</PrimeH2>
            <Lead text={data.body} width="max-w-2xl" />
          </div>
        </Reveal>

        <Reveal y={60} className="w-full">
          <div className="flex w-full flex-col md:flex-row" style={RULE_Y}>
            {data.cells.map((c: MapleCell, i) => (
              <div
                key={c.title}
                className={cn(
                  "flex flex-1 flex-col items-center gap-4 px-4 py-8 text-center md:px-6 md:py-10",
                  i < data.cells.length - 1 &&
                    "border-b border-[var(--prime-card-border)] md:border-r md:border-b-0",
                )}
              >
                <MapleIcon src={c.icon} className="size-12 text-[var(--prime-accent)]" />
                <div className="flex flex-col gap-2">
                  <p className="text-[28px] font-bold leading-[1.3] tabular-nums text-[var(--prime-text)]">
                    {c.value}
                  </p>
                  <p className="text-base font-medium leading-[1.3] text-[var(--prime-text)]">
                    {c.title}
                  </p>
                </div>
                <p className="text-balance text-sm leading-relaxed text-[var(--prime-text)]">
                  {withRefs(c.body)}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal y={60}>
          {/* Bản dev để ghi chú này thành một dòng có ICON ĐỒNG HỒ 18px đứng
              trước, chữ 14px thường — không phải chữ 13px in hoa. File icon đã
              có sẵn trong repo, chỉ là mình chưa dùng. */}
          <div className="flex items-center justify-center gap-2">
            <img
              src={asset("/assets/yzPrime/maple-icon-clock.svg")}
              alt=""
              width={18}
              height={18}
              loading="lazy"
            />
            <span className="text-sm leading-[1.3] text-[var(--prime-text-muted)]">{data.note}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------------- Sources -------------------------------- */

export function Sources({ data }: { data: PrimePage["sources"] }) {
  return (
    /* Bản dev: px-6 rồi BỎ lề từ md (md:px-0) vì khối đã có max-w-5xl mx-auto —
       không phải px-4 sm:px-6 như các section khác. */
    <section className="bg-surface px-6 py-15 md:px-0">
      {/* Ba khối cách nhau gap-6, không phải mt-6/mt-8 xen kẽ. Chữ 11px, danh sách
          gap-1 — mình từng để 11.5px và gap-3 nên khối này cao hơn bản gốc 141px. */}
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <h4 className="text-[11px] font-semibold leading-relaxed text-[var(--prime-text-subtle)]">
          {data.title}
        </h4>
        <ol className="flex list-none flex-col gap-1 text-[11px] leading-relaxed break-words text-[var(--prime-text-muted)]">
          {data.items.map((s) => (
            <li key={s.ref}>
              <span className="font-semibold text-[var(--prime-accent-strong)]">{s.ref}</span>{" "}
              {s.text}
            </li>
          ))}
        </ol>
        <p className="text-[11px] leading-relaxed text-[var(--prime-text-muted)]">
          {data.disclaimer}
        </p>
      </div>
    </section>
  );
}
