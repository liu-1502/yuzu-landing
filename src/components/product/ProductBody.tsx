import type { Product } from "@/data/content";
import { asset } from "@/data/content";
import type { ProductPage, Vault } from "@/data/productPages";
import { CitrusChart, SliceDetail } from "@/components/ui/CitrusChart";
import { ExitIcon, LockIcon, ShieldIcon } from "@/components/ui/Icons";
import {
  CARD,
  PAD,
  SECTION,
  SectionHead,
  TokenSet,
  WRAP,
} from "@/components/product/ProductShell";
import { CitrusField } from "@/components/product/CitrusField";
import { Reveal } from "@/components/product/Reveal";
import { useState } from "react";
import { cn } from "@/lib/utils";

const FACT_ICONS = { lock: LockIcon, exit: ExitIcon, shield: ShieldIcon } as const;

/* --------------------------------- vault ---------------------------------- */

/** Thẻ vault của bản dev: viền, hover NHẤC LÊN 4px kèm bóng accent, icon tròn
 * nhấp lệch pha, và bảng chỉ số 2 CỘT dính đáy thẻ (`mt-auto`) để mọi thẻ trong
 * hàng có chân bảng thẳng nhau. */
function VaultCard({ v, i }: { v: Vault; i: number }) {
  return (
    <div
      className={cn(
        "flex h-full flex-col gap-4 p-5",
        CARD,
        "will-change-transform transition-[transform,border-color,box-shadow] hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--accent)_45%,transparent)] hover:shadow-[0_18px_38px_-22px_color-mix(in_srgb,var(--accent)_70%,transparent)]",
      )}
    >
      <div className="flex items-center gap-2.5">
        {v.icon && (
          <img
            src={asset(v.icon)}
            alt=""
            className="citrus-bob-fast size-7 shrink-0 rounded-full"
            style={{ animationDelay: `${i * 0.9}s` }}
          />
        )}
        <h3 className="text-[17px] font-semibold text-foreground">{v.name}</h3>
      </div>
      <p className="text-[13.5px] leading-[1.55] text-muted-foreground">{v.desc}</p>
      {v.metrics.length > 0 && (
        <dl className="mt-auto grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-line-solid pt-4">
          {v.metrics.map((m) => (
            <div key={m.label}>
              <dt className="microlabel">{m.label}</dt>
              <dd className="mt-0.5 text-[13.5px] font-medium tabular-nums text-foreground">
                {m.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

/* ------------------------------- composition ------------------------------ */

/**
 * Marketplace: mỗi vault là một exposure riêng nên phần này là lưới 3 thẻ vault.
 * Alpha: một danh mục có trọng số nên là quả chanh + danh sách trọng số.
 */
export function Composition({
  p,
  head,
  vaults,
}: {
  p: Product;
  head: ProductPage["composition"];
  vaults?: Vault[];
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className={cn("relative overflow-hidden", SECTION, PAD)}>
      <CitrusField seed={2273} count={9} />
      <div className={cn("relative", WRAP)}>
        <SectionHead kicker={head.kicker} title={head.title} />

        {head.note && (
          <Reveal delay={0.08}>
            <p className="mt-4 max-w-[80ch] text-[13.5px] leading-[1.6] text-muted-foreground">
              {head.note}
            </p>
          </Reveal>
        )}

        {vaults ? (
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {vaults
              .filter((v) => !v.upcoming)
              .map((v, i) => (
                <Reveal key={v.name} y={24} delay={i * 0.08}>
                  <VaultCard v={v} i={i} />
                </Reveal>
              ))}
          </div>
        ) : (
          <div className="mt-9 grid items-start gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-12">
            <Reveal y={24}>
              <CitrusChart
                id={p.id}
                accent={p.color}
                slices={p.slices}
                active={hovered}
                setActive={setHovered}
              />
              <SliceDetail slices={p.slices} accent={p.color} active={hovered} />
            </Reveal>

            <Reveal y={24} delay={0.08}>
              <ul className="flex flex-col">
                {p.slices.map((s, i) => (
                  <li
                    key={s.label}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    className="flex items-baseline gap-4 border-b border-line-solid py-4 first:pt-0 last:border-b-0"
                  >
                    {s.weight !== null && (
                      <span
                        className="w-[3.5ch] shrink-0 text-[22px] font-bold leading-none tabular-nums"
                        style={{ color: s.color ?? p.color }}
                      >
                        {s.weight}%
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="block text-[15px] font-medium leading-[1.35] text-foreground">
                        {s.label}
                      </span>
                      <span className="mt-1 block text-[13.5px] leading-[1.5] text-muted-foreground">
                        {s.detail}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        )}

        {/* "More on the way" — bản dev để ngoài lưới 3 thẻ, dạng một dòng nhắc. */}
        {vaults?.some((v) => v.upcoming) && (
          <Reveal delay={0.24}>
            {vaults
              .filter((v) => v.upcoming)
              .map((v) => (
                <div key={v.name} className={cn("mt-4 p-5", CARD)}>
                  <h3 className="text-[17px] font-semibold text-foreground">{v.name}</h3>
                  <p className="mt-2 text-[13.5px] leading-[1.55] text-muted-foreground">
                    {v.desc}
                  </p>
                </div>
              ))}
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ---------------------------------- terms --------------------------------- */

/**
 * Trên bản dev, Terms và bộ token nằm CHUNG một section (`border-y`): ba thẻ
 * spec trước, rồi `mt-9` tới lưới token. Vì vậy `TokenSet` được gọi từ đây chứ
 * không phải là một section riêng.
 */
export function Terms({
  p,
  head,
  tokens,
  tokensNote,
}: {
  p: Product;
  head: ProductPage["terms"];
  tokens: ProductPage["tokens"];
  tokensNote?: string;
}) {
  return (
    <section className={cn("border-y border-line-solid", SECTION, PAD)}>
      <div className={WRAP}>
        <SectionHead kicker={head.kicker} title={head.title} />

        <Reveal className="mt-9" delay={0.08}>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
            {p.facts.map((f) => {
              const Icon = FACT_ICONS[f.icon as keyof typeof FACT_ICONS];
              return (
                <div
                  key={f.label}
                  className="flex items-center gap-3.5 rounded-md border border-line-solid bg-surface px-3.5 py-3 sm:min-h-[132px] sm:flex-col sm:items-center sm:justify-center sm:gap-0 sm:py-3.5 sm:text-center"
                >
                  <div className="shrink-0 sm:mb-2.5">
                    <Icon className="citrus-bob-fast size-7 text-accent" />
                  </div>
                  <div className="min-w-0">
                    <div className="microlabel">{f.label}</div>
                    <div className="mt-1 text-[12.5px] font-medium leading-[1.4] text-foreground">
                      {f.value}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>

        <TokenSet tokens={tokens} note={tokensNote} />
      </div>
    </section>
  );
}
