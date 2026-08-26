import { useRef } from "react";
import { Link } from "react-router-dom";
import type { Kpi, Layer, ProductPage, Step, TokenCard } from "@/data/productPages";
import { productOrder } from "@/data/productPages";
import { asset } from "@/data/content";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "@/components/ui/Icons";
import VariableFontCursorProximity from "@/components/fancy/text/variable-font-cursor-proximity";
import { CitrusField } from "@/components/product/CitrusField";
import { HeroBall } from "@/components/product/HeroBall";
import { Reveal } from "@/components/product/Reveal";
import { cn } from "@/lib/utils";

/* ==========================================================================
   Trang sản phẩm dựng theo ĐÚNG bản dev.yuzu.money, không theo nếp của landing.
   Ba khác biệt lớn nhất so với section của landing:
     - lề ngang px-4 sm:px-6 (16/24px), không phải px-6 lg:px-[60px]
     - khổ nội dung max-w-5xl (1024px), không phải 1280px
     - tiêu đề canh TRÁI
   ========================================================================== */
export const PAD = "px-4 sm:px-6";
export const WRAP = "mx-auto max-w-5xl";
export const SECTION = "py-16 md:py-20";

/** Thẻ chuẩn của bản dev: bo lg, có viền, hover đổi viền sang accent. */
export const CARD =
  "rounded-lg border border-line-solid bg-surface transition-colors duration-300 hover:border-[color-mix(in_srgb,var(--accent)_40%,transparent)]";

/** Nút chính / nút phụ — cao 12 (48px), bo tròn hết. */
const BTN_PRIMARY =
  "inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-5 text-[15px] font-medium text-background transition-opacity duration-300 hover:opacity-90";
const BTN_GHOST =
  "inline-flex h-12 items-center gap-1.5 rounded-full border border-line-solid px-5 text-[15px] font-medium text-foreground transition-colors duration-300 hover:border-[color-mix(in_srgb,var(--accent)_40%,transparent)]";

export function SectionHead({ kicker, title }: { kicker: string; title?: string }) {
  return (
    <Reveal>
      <span className="kicker">{kicker}</span>
      {title && (
        <h2 className="mt-4 max-w-[620px] text-balance text-3xl font-bold leading-[1.2] tracking-tight text-foreground md:text-[40px]">
          {title}
        </h2>
      )}
    </Reveal>
  );
}

/* ----------------------------------- hero ---------------------------------- */

export type HeroData = Pick<
  ProductPage,
  "id" | "kicker" | "title" | "intro" | "primary" | "secondary"
>;

/** Tâm quả cầu tính từ đỉnh section: pt-28 (112px) + nửa quả cầu 225px. */
const BALL_CENTER = 112 + 113;

/** Hiệu ứng con trỏ trên H1 — cùng cấu hình với tiêu đề hero của landing. */
const titleFx = (containerRef: React.RefObject<HTMLHeadingElement | null>) => ({
  containerRef,
  fromFontVariationSettings: "'wght' 700",
  toFontVariationSettings: "'wght' 800",
  radius: 90,
  falloff: "gaussian" as const,
});

function siblings(id: ProductPage["id"]) {
  const i = productOrder.indexOf(id);
  const n = productOrder.length;
  return { prev: productOrder[(i - 1 + n) % n], next: productOrder[(i + 1) % n] };
}

const RAIL_LABEL = "font-mono text-[10.5px] uppercase tracking-[0.14em]";
const RAIL_TONE =
  "text-[color-mix(in_srgb,var(--foreground)_65%,transparent)] transition-colors duration-200 hover:text-foreground";

function SideRails({ id }: { id: ProductPage["id"] }) {
  const { prev, next } = siblings(id);
  const rail = (to: string, side: "left" | "right") => (
    <Link
      to={`/${to}`}
      className={cn(
        "pointer-events-auto flex flex-col items-center gap-0.5 rounded-md p-2",
        RAIL_TONE,
      )}
    >
      {side === "left" ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
      <span className={RAIL_LABEL}>{to}</span>
    </Link>
  );

  return (
    <div
      className="pointer-events-none absolute inset-x-0 z-20 mx-auto hidden max-w-[840px] -translate-y-1/2 items-center justify-between px-4 lg:flex"
      style={{ top: BALL_CENTER }}
    >
      {rail(prev, "left")}
      {rail(next, "right")}
    </div>
  );
}

/** Bản dev ẩn hai thanh kẹp dưới lg — trên điện thoại không còn đường nào sang
 * sản phẩm khác. Thêm một hàng ngay dưới quả cầu. */
function MobileRails({ id }: { id: ProductPage["id"] }) {
  const { prev, next } = siblings(id);
  const item = (to: string, side: "left" | "right") => (
    <Link
      to={`/${to}`}
      className={cn("flex min-h-11 min-w-0 items-center gap-1.5 rounded-md py-2", RAIL_TONE)}
    >
      {side === "left" && <ChevronLeft className="size-4 shrink-0" />}
      <span className={cn(RAIL_LABEL, "truncate")}>{to}</span>
      {side === "right" && <ChevronRight className="size-4 shrink-0" />}
    </Link>
  );

  return (
    <nav
      aria-label="Sản phẩm khác"
      className="flex w-full max-w-[320px] items-center justify-between lg:hidden"
    >
      {item(prev, "left")}
      {item(next, "right")}
    </nav>
  );
}

export function ProductHero({ page }: { page: HeroData }) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cut = page.title.lastIndexOf(" ");
  const lead = cut > 0 ? page.title.slice(0, cut) : "";
  const tail = cut > 0 ? page.title.slice(cut + 1) : page.title;

  return (
    /* pb-15 = 60px (không phải pb-14) và KHÔNG có section-tint — bản dev để nền
       cho wrapper scope lo, hero chỉ trong suốt. */
    <section className={cn("relative overflow-hidden pt-28 pb-15", PAD)}>
      <CitrusField seed={page.id.length * 7919} />
      <SideRails id={page.id} />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-14 text-center">
        <div className="flex flex-col items-center gap-5">
          <HeroBall id={page.id} />
          <MobileRails id={page.id} />
        </div>

        <div className="flex flex-col items-center gap-4">
          <span className="kicker">{page.kicker}</span>

          <h1
            ref={titleRef}
            className="text-balance text-5xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-6xl md:text-7xl"
          >
            {lead && (
              <VariableFontCursorProximity {...titleFx(titleRef)}>
                {`${lead} `}
              </VariableFontCursorProximity>
            )}
            <VariableFontCursorProximity
              style={{ color: "var(--heading-accent, var(--accent))" }}
              {...titleFx(titleRef)}
            >
              {tail}
            </VariableFontCursorProximity>
          </h1>

          <div className="flex flex-col items-center gap-7">
            <p className="max-w-[600px] px-2 text-[17px] leading-[1.62] text-muted-foreground md:px-0">
              {page.intro}
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <a href={page.primary.href} className={BTN_PRIMARY}>
                {page.primary.label}
                {page.primary.rate && <span className="tabular-nums">{page.primary.rate}</span>}
                <ArrowRight className="size-4" />
              </a>
              <a href={page.secondary.href} className={BTN_GHOST}>
                {page.secondary.label}
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- dải chỉ số -------------------------------- */

/** Ô KPI của bản dev: thẻ có viền, `pb-11` chừa chỗ cho vệt nước ở đáy. */
export function KpiRow({ items }: { items: Kpi[] }) {
  return (
    <section
      aria-label="Key figures"
      className={cn("w-full border-y border-line-solid py-9 md:py-12", PAD)}
    >
      <div
        className={cn(
          "grid grid-cols-2 gap-3",
          WRAP,
          items.length === 3 ? "md:grid-cols-3" : "md:grid-cols-4",
        )}
      >
        {items.map((k, i) => (
          <Reveal key={k.label} y={18} delay={i * 0.06}>
            <div className="flex min-h-[134px] flex-col items-center justify-start gap-1 overflow-hidden rounded-lg border border-line-solid bg-surface px-3 pt-5 pb-11">
              <span className="text-2xl font-bold leading-9 tabular-nums text-foreground md:text-[32px]">
                {k.value}
              </span>
              <p className="text-center text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {k.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------- token ---------------------------------- */

function TokenRow({ token, delay, base }: { token: TokenCard; delay: number; base?: boolean }) {
  return (
    <div
      className={cn(
        "flex h-full items-start gap-3 p-4",
        CARD,
        base && "border-t-2 border-t-[color-mix(in_srgb,var(--accent)_55%,transparent)]",
      )}
    >
      {token.icon && (
        <img
          src={asset(token.icon)}
          alt=""
          className="citrus-bob-fast size-8 shrink-0 rounded-full"
          style={{ animationDelay: `${delay}s` }}
        />
      )}
      <div className="min-w-0">
        <p className="font-mono text-[13px] font-semibold text-foreground">{token.name}</p>
        <p className="mt-0.5 text-[13.5px] leading-[1.5] text-muted-foreground">{token.desc}</p>
      </div>
    </div>
  );
}

/**
 * Bộ token — trên bản dev nó nằm TRONG section Terms, cách hàng thẻ spec `mt-9`,
 * nên đây là một khối chứ không phải `<section>` riêng.
 * Khi có `note` (Alpha) thì token cuối là lớp đỡ: tách riêng, viền trên đậm, hai
 * mũi tên chỉ ngược lên hai token phía trên.
 */
export function TokenSet({ tokens, note }: { tokens: TokenCard[]; note?: string }) {
  const base = note ? tokens[tokens.length - 1] : null;
  const upper = base ? tokens.slice(0, -1) : tokens;

  return (
    <div className="mt-9">
      <div className="grid gap-4 md:grid-cols-2">
        {upper.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.08}>
            <TokenRow token={t} delay={i * 0.7} />
          </Reveal>
        ))}
      </div>

      {base && (
        <Reveal className="relative mt-8" delay={0.16}>
          {/* Hàng mũi tên soi đúng lưới hàng trên nên mỗi mũi tên rơi trúng tâm thẻ. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-[18px] right-0 left-0 grid grid-cols-1 gap-4 text-[color-mix(in_srgb,var(--accent)_50%,transparent)] md:grid-cols-2"
          >
            <ChevronUp className="mx-auto size-4" />
            <ChevronUp className="mx-auto hidden size-4 md:block" />
          </div>
          <TokenRow token={base} delay={1.4} base />
          <p className="mt-3 text-center text-[13px] leading-[1.5] text-muted-foreground">
            {note}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/* ------------------------------- protection ------------------------------- */

/** Mỗi lớp là một dòng, kèm cột vạch "độ sâu" bên phải: lớp ngoài cùng sáng
 * nhiều vạch, càng vào sâu càng ít. */
export function Protection({
  kicker,
  title,
  layers,
}: {
  kicker: string;
  title: string;
  layers: Layer[];
}) {
  return (
    <section className={cn(SECTION, PAD)}>
      <div className={WRAP}>
        <SectionHead kicker={kicker} title={title} />
        <ol className="mt-9 flex flex-col gap-3">
          {layers.map((l, i) => (
            <Reveal key={l.title} x={-14} y={0} delay={i * 0.07}>
              <li className={cn("flex items-start gap-4 p-4 sm:items-center sm:p-5", CARD)}>
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-line-strong font-mono text-[11px] font-semibold text-accent sm:mt-0">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-medium text-foreground">{l.title}</p>
                  <p className="mt-0.5 text-[13.5px] leading-[1.5] text-muted-foreground">
                    {l.desc}
                  </p>
                </div>
                <span
                  className="hidden shrink-0 gap-1 sm:flex"
                  aria-label={`Depth ${layers.length - i} of ${layers.length}`}
                >
                  {layers.map((_, k) => (
                    <span
                      key={k}
                      className={cn(
                        "h-5 w-1.5 rounded-full",
                        k < layers.length - i ? "bg-accent" : "bg-line-solid",
                      )}
                    />
                  ))}
                </span>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* --------------------------------- path in -------------------------------- */

export function PathIn({ kicker, steps, note }: { kicker: string; steps: Step[]; note: string }) {
  return (
    <section className={cn("relative overflow-hidden border-y border-line-solid", SECTION, PAD)}>
      <CitrusField seed={7717} count={7} />
      <div className={cn("relative", WRAP)}>
        <SectionHead kicker={kicker} />
        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.label} y={16} delay={i * 0.07}>
              <li className={cn("relative h-full p-5", CARD)}>
                <span className="microlabel">{s.label}</span>
                <p className="mt-1.5 text-[15px] font-medium leading-[1.4] text-foreground">
                  {s.value}
                </p>
                {i < steps.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute -right-[13px] top-1/2 hidden -translate-y-1/2 text-faint lg:block"
                  >
                    <ChevronRight className="size-4" />
                  </span>
                )}
              </li>
            </Reveal>
          ))}
        </ol>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-[80ch] text-[13px] leading-[1.6] text-muted-foreground">
            {note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------- CTA ----------------------------------- */

/** Bản dev bọc CTA trong một thẻ bo `rounded-xl` có viền; hạt cam rơi bên trong
 * thẻ chứ không phải cả section. */
export function ClosingCta({ closing }: { closing: ProductPage["closing"] }) {
  return (
    <section className={cn(SECTION, PAD)}>
      <Reveal>
        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 overflow-hidden rounded-xl border border-line-solid bg-surface px-6 pt-14 pb-20 text-center">
          <CitrusField seed={4409} count={8} />
          <div className="relative z-10 flex flex-col items-center gap-6">
            <h2 className="max-w-[520px] text-balance text-3xl font-bold leading-[1.2] tracking-tight text-foreground md:text-[38px]">
              {closing.title}
            </h2>
            <p className="max-w-[460px] text-[15px] leading-[1.6] text-muted-foreground">
              {closing.body}
            </p>
            <div className="mt-1 flex flex-col items-center gap-3 sm:flex-row">
              <a href={closing.primary.href} className={BTN_PRIMARY}>
                {closing.primary.label}
                <ArrowRight className="size-4" />
              </a>
              <a href={closing.secondary.href} className={BTN_GHOST}>
                {closing.secondary.label}
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
