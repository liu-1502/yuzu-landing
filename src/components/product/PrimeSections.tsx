import type { Claim, Era, PrimePage, Stat, Vault } from "@/data/productPages";
import { asset } from "@/data/content";
import { SectionHead } from "@/components/product/ProductShell";
import { cn } from "@/lib/utils";

const PAD = "px-6 lg:px-[60px]";

/** Dải số liệu nhỏ nằm trong một section (khác KpiRow ở đầu trang: không kẻ
 * full-bleed, chỉ là hàng thẻ). */
function StatStrip({ stats }: { stats: Stat[] }) {
  return (
    <div
      className={cn(
        "grid gap-3",
        stats.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4",
      )}
    >
      {stats.map((s) => (
        <div key={s.label} className="rounded-[20px] bg-surface px-5 py-6">
          <div className="data text-[30px] font-semibold leading-none text-foreground">
            {s.value}
          </div>
          <div className="microlabel microlabel-muted mt-3">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function ClaimCards({ claims, cols }: { claims: Claim[]; cols: string }) {
  return (
    <div className={cn("grid gap-3", cols)}>
      {claims.map((c) => (
        <div key={c.title} className="rounded-[20px] bg-surface px-5 py-6">
          <div className="text-[15px] font-semibold leading-[1.3] text-foreground">{c.title}</div>
          <p className="mt-3 text-[13px] leading-[1.6] text-muted-foreground">{c.body}</p>
        </div>
      ))}
    </div>
  );
}

export function TBills({ data }: { data: PrimePage["tbills"] }) {
  return (
    <section className={cn("section-tint py-14 md:py-20", PAD)}>
      <div className="mx-auto max-w-[1280px]">
        <SectionHead kicker={data.kicker} title={data.title} />
        <div className="mt-10">
          <StatStrip stats={data.stats} />
        </div>
        <div className="mt-3">
          <ClaimCards claims={data.claims} cols="sm:grid-cols-2" />
        </div>
      </div>
    </section>
  );
}

/** Timeline CLO — mốc năm bên trái, nội dung bên phải, nối bằng một đường dọc. */
function Timeline({ eras }: { eras: Era[] }) {
  return (
    <ol className="relative mt-10">
      {eras.map((e, i) => (
        <li key={e.year} className="relative flex gap-5 pb-8 last:pb-0 sm:gap-8">
          {/* Đường nối chạy từ tâm chấm xuống mốc kế tiếp; mốc cuối thì bỏ. */}
          {i < eras.length - 1 && (
            <span
              aria-hidden
              className="absolute left-[5px] top-3 h-full w-px bg-line-solid sm:left-[5px]"
            />
          )}
          <span
            aria-hidden
            className="relative z-10 mt-2 size-[11px] shrink-0 rounded-full bg-[var(--mark)]"
          />
          <div className="min-w-0 flex-1 sm:flex sm:gap-8">
            <div className="data w-[6ch] shrink-0 text-[17px] font-semibold leading-[1.4] text-foreground">
              {e.year}
            </div>
            <div className="min-w-0">
              <div className="text-[15px] font-semibold leading-[1.35] text-foreground">
                {e.title}
              </div>
              <p className="mt-1.5 text-[13px] leading-[1.6] text-muted-foreground">{e.body}</p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Clo({ data }: { data: PrimePage["clo"] }) {
  return (
    <section className={cn("section-tint border-t border-line-solid py-14 md:py-20", PAD)}>
      <div className="mx-auto max-w-[1280px]">
        <SectionHead kicker={data.kicker} title={data.title} />
        <p className="mx-auto mt-4 max-w-[80ch] text-center text-[15.5px] leading-[1.65] text-muted-foreground">
          {data.body}
        </p>

        <div className="mt-10">
          <StatStrip stats={data.stats} />
        </div>

        <Timeline eras={data.timeline} />

        <h3 className="mt-14 text-center text-[24px] font-semibold leading-[1.15] text-foreground md:text-[30px]">
          {data.compare.title}
        </h3>
        <div className="mt-6">
          <ClaimCards claims={data.compare.cards} cols="sm:grid-cols-2" />
        </div>
      </div>
    </section>
  );
}

export function Lending({ data }: { data: PrimePage["lending"] }) {
  return (
    <section className={cn("section-tint border-t border-line-solid py-14 md:py-20", PAD)}>
      <div className="mx-auto max-w-[1280px]">
        <SectionHead kicker={data.kicker} title={data.title} />
        <p className="mx-auto mt-4 max-w-[80ch] text-center text-[15.5px] leading-[1.65] text-muted-foreground">
          {data.body}
        </p>
        <div className="mt-10">
          <ClaimCards claims={data.cards} cols="sm:grid-cols-3" />
        </div>
        <p className="microlabel microlabel-muted mt-6">{data.note}</p>
      </div>
    </section>
  );
}

/** Chú thích nguồn — chữ nhỏ, đánh số [1]..[10], kèm disclaimer cuối. */
export function Sources({ data }: { data: PrimePage["sources"] }) {
  return (
    <section className={cn("section-tint border-t border-line-solid py-12 md:py-16", PAD)}>
      <div className="mx-auto max-w-[1280px]">
        <h2 className="microlabel microlabel-muted">{data.title}</h2>
        <ol className="mt-6 flex flex-col gap-3">
          {data.items.map((s) => (
            <li key={s.ref} className="flex gap-3 text-[11.5px] leading-[1.6] text-faint">
              <span className="data shrink-0 font-medium text-muted-foreground">{s.ref}</span>
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

/** Thẻ vault của Marketplace: tên, mô tả, và lưới 6 chỉ số. Vault "More on the
 * way" chưa có chỉ số nên chỉ hiện mô tả. */
export function VaultCards({ vaults }: { vaults: Vault[] }) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {vaults.map((v) => (
        <div
          key={v.name}
          className={cn(
            "flex flex-col rounded-[20px] px-5 py-6",
            v.upcoming ? "bg-[color-mix(in_srgb,var(--foreground)_4%,transparent)]" : "bg-surface",
          )}
        >
          <div className="flex items-center gap-2.5">
            {v.icon && (
              <img
                src={asset(v.icon)}
                alt=""
                /* citrus-bob-fast: bản dev cho 3 icon vault trong khối Composition
                   nhấp nhẹ 4.5s. */
                className="citrus-bob-fast size-7 shrink-0 rounded-full"
              />
            )}
            <div className="data text-[20px] font-semibold leading-none text-foreground">
              {v.name}
            </div>
          </div>
          <p className="mt-3 text-[13px] leading-[1.6] text-muted-foreground">{v.desc}</p>
          {v.metrics.length > 0 && (
            <dl className="mt-5 grid grid-cols-3 gap-x-4 gap-y-4 border-t border-line-solid pt-5">
              {v.metrics.map((m) => (
                <div key={m.label}>
                  <dt className="microlabel microlabel-muted">{m.label}</dt>
                  <dd className="data mt-1.5 text-[15px] font-semibold leading-none text-foreground">
                    {m.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      ))}
    </div>
  );
}
