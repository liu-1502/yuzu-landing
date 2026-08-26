import { useState } from "react";
import type { Product } from "@/data/content";
import { CitrusChart, SliceDetail } from "@/components/ui/CitrusChart";
import { ExitIcon, LockIcon, ShieldIcon } from "@/components/ui/Icons";
import { SectionHead } from "@/components/product/ProductShell";
import { cn } from "@/lib/utils";

const PAD = "px-6 lg:px-[60px]";

const FACT_ICONS = { lock: LockIcon, exit: ExitIcon, shield: ShieldIcon } as const;

/** Thành phần danh mục: quả chanh bên trái, các trọng số bên phải.
 * Trọng số có thể là null (Prime không công bố tỉ lệ) — lúc đó bỏ cột số. */
export function Composition({
  p,
  head,
  children,
}: {
  p: Product;
  head: { kicker: string; title: string; note?: string };
  /** Thay danh sách trọng số mặc định — Marketplace đưa thẻ vault vào đây. */
  children?: React.ReactNode;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className={cn("section-tint py-14 md:py-20", PAD)}>
      <div className="mx-auto max-w-[1280px]">
        <SectionHead kicker={head.kicker} title={head.title} />

        {head.note && (
          <p className="mx-auto mt-4 max-w-[80ch] text-center text-[13.5px] leading-[1.6] text-foreground">
            {head.note}
          </p>
        )}

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)] lg:gap-14">
          <div>
            <CitrusChart
              id={p.id}
              accent={p.color}
              slices={p.slices}
              active={hovered}
              setActive={setHovered}
            />
            <SliceDetail slices={p.slices} accent={p.color} active={hovered} />
          </div>

          {children ?? (
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
                    className="data w-[3.5ch] shrink-0 text-[22px] font-semibold leading-none"
                    style={{ color: s.color ?? p.color }}
                  >
                    {s.weight}%
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block text-[15px] font-medium leading-[1.35] text-foreground">
                    {s.label}
                  </span>
                  <span className="mt-1 block text-[13px] leading-[1.55] text-muted-foreground">
                    {s.detail}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          )}
        </div>

      </div>
    </section>
  );
}

/** Điều khoản: 3 thẻ Access / Exit / Buffer — giữ nguyên kiểu thẻ của Products. */
export function Terms({
  p,
  head,
}: {
  p: Product;
  head: { kicker: string; title: string };
}) {
  return (
    <section className={cn("section-tint border-t border-line-solid pt-14 md:pt-20", PAD)}>
      <div className="mx-auto max-w-[1280px]">
        <SectionHead kicker={head.kicker} title={head.title} />
        <div className="mt-10 grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
          {p.facts.map((f) => {
            const Icon = FACT_ICONS[f.icon as keyof typeof FACT_ICONS];
            return (
              <div
                key={f.label}
                className="flex items-center gap-3.5 rounded-md bg-surface px-3.5 py-3 sm:min-h-[132px] sm:flex-col sm:items-center sm:justify-center sm:gap-0 sm:py-3.5 sm:text-center"
              >
                <div className="shrink-0 sm:mb-2.5">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)] text-foreground">
                    <Icon className="size-5" />
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="microlabel microlabel-muted">{f.label}</div>
                  <div className="mt-1 text-[12.5px] font-medium leading-[1.4] text-foreground">
                    {f.value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
