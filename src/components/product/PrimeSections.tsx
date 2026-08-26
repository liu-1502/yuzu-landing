import type { Claim, Era, MapleCell, PrimePage, Stat } from "@/data/productPages";
import { asset } from "@/data/content";
import { PAD, WRAP } from "@/components/product/ProductShell";
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

function Pill({ children }: { children: string }) {
  return (
    <div className="inline-flex items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--prime-accent)_32%,transparent)] bg-[color-mix(in_srgb,var(--prime-accent)_12%,transparent)] px-4 py-2">
      <span className="text-[13px] font-semibold uppercase leading-none tracking-[0.08em] text-[var(--prime-accent-strong)]">
        {children}
      </span>
    </div>
  );
}

function PrimeH2({ children }: { children: string }) {
  return (
    <h2 className="text-center text-2xl font-bold leading-[1.2] tracking-tight text-[var(--prime-text)] md:text-4xl">
      {children}
    </h2>
  );
}

function Lead({ text, width }: { text: string; width: string }) {
  return (
    <div className={cn("mx-auto", width)}>
      <p className="text-center text-xl leading-[1.3] text-[var(--prime-text-subtle)]">
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
          <img src={asset(c.image)} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
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
        <Reveal y={60}>
          <Pill>{data.kicker}</Pill>
        </Reveal>
        <Reveal y={60}>
          <PrimeH2>{data.title}</PrimeH2>
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
      <span className="pointer-events-none absolute inset-0 flex select-none items-center justify-center text-5xl font-bold text-[var(--prime-text)] lg:text-6xl">
        CLOs
      </span>
    </div>
  );
}

/** Số liệu dạng viên thuốc: badge tròn viền vàng chứa số, rồi nhãn. */
function StatPills({ stats }: { stats: Stat[] }) {
  return (
    <div className="flex flex-col gap-4 lg:ml-12 lg:gap-5">
      {stats.map((s, i) => (
        <Reveal key={s.label} y={20} delay={i * 0.07}>
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
        </Reveal>
      ))}
    </div>
  );
}

function Timeline({ eras }: { eras: Era[] }) {
  return (
    <ol className="relative w-full">
      {eras.map((e, i) => (
        <Reveal key={e.year} x={-14} y={0} delay={i * 0.05}>
          <li className="relative flex gap-5 pb-8 last:pb-0 sm:gap-8">
            {i < eras.length - 1 && (
              <span
                aria-hidden
                className="absolute top-3 left-[5px] h-full w-px bg-[var(--prime-card-border)]"
              />
            )}
            <span
              aria-hidden
              className="relative z-10 mt-2 size-[11px] shrink-0 rounded-full bg-[var(--prime-accent)]"
            />
            <div className="min-w-0 flex-1 sm:flex sm:gap-8">
              <div className="w-[6ch] shrink-0 text-[17px] font-semibold leading-[1.4] tabular-nums text-[var(--prime-text)]">
                {e.year}
              </div>
              <div className="min-w-0">
                <p className="text-[15px] font-medium text-[var(--prime-text)]">{e.title}</p>
                <p className="mt-0.5 text-[13.5px] leading-[1.5] text-[var(--prime-text-subtle)]">
                  {withRefs(e.body)}
                </p>
              </div>
            </div>
          </li>
        </Reveal>
      ))}
    </ol>
  );
}

export function Clo({ data }: { data: PrimePage["clo"] }) {
  return (
    <section className={cn("py-15", PAD)}>
      {/* max-w-7xl chứ không phải 5xl: vòng tròn + cột viên thuốc cần chỗ. */}
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-16">
        <Reveal y={60}>
          <div className="flex flex-col items-center gap-4">
            <Pill>{data.kicker}</Pill>
            <PrimeH2>{data.title}</PrimeH2>
            <Lead text={data.body} width="max-w-[800px]" />
          </div>
        </Reveal>

        <Reveal y={60} className="w-full">
          <div className="relative mx-auto flex max-w-[1100px] flex-col items-center gap-10 lg:flex-row lg:justify-center lg:gap-0">
            <CloRing />
            <StatPills stats={data.stats} />
          </div>
        </Reveal>

        <div className="w-full max-w-5xl">
          <Timeline eras={data.timeline} />
        </div>

        <Reveal y={60} className="w-full max-w-5xl">
          <PrimeH2>{data.compare.title}</PrimeH2>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {data.compare.cards.map((c) => (
              <div key={c.title} className={cn("flex h-full flex-col gap-2 p-6", CARD_PRIME)}>
                <h3 className="text-2xl font-bold leading-normal text-[var(--prime-text)]">
                  {c.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--prime-text-subtle)] opacity-80">
                  {withRefs(c.body)}
                </p>
              </div>
            ))}
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
          <Pill>{data.kicker}</Pill>
        </Reveal>
        <Reveal y={60}>
          <PrimeH2>{data.title}</PrimeH2>
        </Reveal>
        <Reveal y={60}>
          <Lead text={data.body} width="max-w-2xl" />
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
                <img src={asset(c.icon)} alt="" width={48} height={48} loading="lazy" />
                <div className="flex flex-col gap-2">
                  <p className="text-[28px] font-bold leading-[1.3] tabular-nums text-[var(--prime-text)]">
                    {c.value}
                  </p>
                  <p className="text-base font-medium leading-[1.3] text-[var(--prime-text)]">
                    {c.title}
                  </p>
                </div>
                <p className="text-balance text-sm leading-relaxed text-[var(--prime-text-subtle)]">
                  {withRefs(c.body)}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal y={60}>
          <p className="text-center text-[13px] font-medium uppercase tracking-wide text-[var(--prime-text-subtle)]">
            {data.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------------- Sources -------------------------------- */

export function Sources({ data }: { data: PrimePage["sources"] }) {
  return (
    <section className={cn("border-t border-[var(--prime-card-border)] py-15", PAD)}>
      <div className={WRAP}>
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--prime-accent-strong)]">
          {data.title}
        </h2>
        <ol className="mt-6 flex flex-col gap-3">
          {data.items.map((s) => (
            <li
              key={s.ref}
              className="flex gap-3 text-[11.5px] leading-[1.6] text-[var(--prime-text-subtle)] opacity-80"
            >
              <span className="shrink-0 font-mono font-medium text-[var(--prime-accent-dark)]">
                {s.ref}
              </span>
              <span className="min-w-0">{s.text}</span>
            </li>
          ))}
        </ol>
        <p className="mt-8 border-t border-[var(--prime-card-border)] pt-6 text-[11.5px] leading-[1.6] text-[var(--prime-text-subtle)] opacity-70">
          {data.disclaimer}
        </p>
      </div>
    </section>
  );
}
