import type { Claim, Era, PrimePage, Stat } from "@/data/productPages";
import {
  CARD,
  PAD,
  SECTION,
  SectionHead,
  WRAP,
} from "@/components/product/ProductShell";
import { Reveal } from "@/components/product/Reveal";
import { cn } from "@/lib/utils";

/* Prime dùng cùng idiom với hai trang kia: khổ max-w-5xl, lề px-4 sm:px-6, tiêu
   đề canh trái, thẻ `rounded-lg` có viền và hover đổi viền sang accent. */

/** Dải số liệu trong thân bài — khác dải KPI đầu trang (kia có kẻ full-bleed). */
function StatStrip({ stats }: { stats: Stat[] }) {
  return (
    <div className={cn("grid gap-3", stats.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4")}>
      {stats.map((s, i) => (
        <Reveal key={s.label} y={18} delay={i * 0.06}>
          <div className={cn("h-full p-5", CARD)}>
            <div className="text-2xl font-bold leading-9 tabular-nums text-foreground md:text-[32px]">
              {s.value}
            </div>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {s.label}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function ClaimCards({ claims, cols }: { claims: Claim[]; cols: string }) {
  return (
    <div className={cn("grid gap-4", cols)}>
      {claims.map((c, i) => (
        <Reveal key={c.title} y={24} delay={i * 0.08}>
          <div className={cn("flex h-full flex-col gap-3 p-5", CARD)}>
            <h3 className="text-[17px] font-semibold text-foreground">{c.title}</h3>
            <p className="text-[13.5px] leading-[1.55] text-muted-foreground">{c.body}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function TBills({ data }: { data: PrimePage["tbills"] }) {
  return (
    <section className={cn(SECTION, PAD)}>
      <div className={WRAP}>
        <SectionHead kicker={data.kicker} title={data.title} />
        <div className="mt-9">
          <StatStrip stats={data.stats} />
        </div>
        <div className="mt-4">
          <ClaimCards claims={data.claims} cols="md:grid-cols-2" />
        </div>
      </div>
    </section>
  );
}

/** Timeline CLO — mốc năm bên trái, nội dung bên phải, nối bằng một đường dọc. */
function Timeline({ eras }: { eras: Era[] }) {
  return (
    <ol className="relative mt-9">
      {eras.map((e, i) => (
        <Reveal key={e.year} x={-14} y={0} delay={i * 0.06}>
          <li className="relative flex gap-5 pb-8 last:pb-0 sm:gap-8">
            {/* Đường nối chạy từ tâm chấm xuống mốc kế tiếp; mốc cuối thì bỏ. */}
            {i < eras.length - 1 && (
              <span aria-hidden className="absolute left-[5px] top-3 h-full w-px bg-line-solid" />
            )}
            <span aria-hidden className="relative z-10 mt-2 size-[11px] shrink-0 rounded-full bg-accent" />
            <div className="min-w-0 flex-1 sm:flex sm:gap-8">
              <div className="w-[6ch] shrink-0 text-[17px] font-semibold leading-[1.4] tabular-nums text-foreground">
                {e.year}
              </div>
              <div className="min-w-0">
                <p className="text-[15px] font-medium text-foreground">{e.title}</p>
                <p className="mt-0.5 text-[13.5px] leading-[1.5] text-muted-foreground">{e.body}</p>
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
    <section className={cn(SECTION, PAD)}>
      <div className={WRAP}>
        <SectionHead kicker={data.kicker} title={data.title} />
        <Reveal delay={0.08}>
          <p className="mt-4 max-w-[80ch] text-[15px] leading-[1.6] text-muted-foreground">
            {data.body}
          </p>
        </Reveal>

        <div className="mt-9">
          <StatStrip stats={data.stats} />
        </div>

        <Timeline eras={data.timeline} />

        <Reveal delay={0.1}>
          <h3 className="mt-14 text-3xl font-bold leading-[1.2] tracking-tight text-foreground md:text-[32px]">
            {data.compare.title}
          </h3>
        </Reveal>
        <div className="mt-6">
          <ClaimCards claims={data.compare.cards} cols="md:grid-cols-2" />
        </div>
      </div>
    </section>
  );
}

export function Lending({ data }: { data: PrimePage["lending"] }) {
  return (
    <section className={cn(SECTION, PAD)}>
      <div className={WRAP}>
        <SectionHead kicker={data.kicker} title={data.title} />
        <Reveal delay={0.08}>
          <p className="mt-4 max-w-[80ch] text-[15px] leading-[1.6] text-muted-foreground">
            {data.body}
          </p>
        </Reveal>
        <div className="mt-9">
          <ClaimCards claims={data.cards} cols="md:grid-cols-3" />
        </div>
        <Reveal delay={0.2}>
          <p className="microlabel mt-6">{data.note}</p>
        </Reveal>
      </div>
    </section>
  );
}

/** Chú thích nguồn — chữ nhỏ, đánh số [1]..[10], kèm disclaimer cuối. */
export function Sources({ data }: { data: PrimePage["sources"] }) {
  return (
    <section className={cn("border-t border-line-solid py-12 md:py-16", PAD)}>
      <div className={WRAP}>
        <h2 className="microlabel">{data.title}</h2>
        <ol className="mt-6 flex flex-col gap-3">
          {data.items.map((s) => (
            <li key={s.ref} className="flex gap-3 text-[11.5px] leading-[1.6] text-faint">
              <span className="shrink-0 font-mono font-medium text-muted-foreground">{s.ref}</span>
              <span className="min-w-0">{s.text}</span>
            </li>
          ))}
        </ol>
        <p className="mt-8 border-t border-line-solid pt-6 text-[11.5px] leading-[1.6] text-faint">
          {data.disclaimer}
        </p>
      </div>
    </section>
  );
}
