import { Link } from "react-router-dom";
import type { Kpi, Layer, ProductPage, Step, TokenCard } from "@/data/productPages";
import { productOrder } from "@/data/productPages";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "@/components/ui/Icons";
import { CitrusField } from "@/components/product/CitrusField";
import { HeroBall } from "@/components/product/HeroBall";
import { cn } from "@/lib/utils";

/* Dùng chung một khổ ngang với mọi section của landing: px-6 / lg:px-[60px],
   nội dung kẹp trong max-w-[1280px]. */
const PAD = "px-6 lg:px-[60px]";

export function SectionHead({
  kicker,
  title,
  className,
}: {
  kicker: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-[52ch]", className)}>
      <span className="kicker mb-4">{kicker}</span>
      <h2 className="text-[30px] font-semibold leading-[1.08] text-foreground md:text-[40px] md:leading-[1.15]">
        {title}
      </h2>
    </div>
  );
}

/** Phần hero chỉ cần bấy nhiêu trường — Prime có kiểu riêng (PrimePage) nên
 * không ràng buộc vào nguyên ProductPage. */
export type HeroData = Pick<
  ProductPage,
  "id" | "kicker" | "title" | "intro" | "primary" | "secondary"
>;

/** Vị trí tâm quả cầu tính từ đỉnh section: pt-28 (112px) + nửa quả cầu 225px.
 * Hai thanh điều hướng sang sản phẩm khác neo đúng vào đây. */
const BALL_CENTER = 112 + 113;

/** Sản phẩm liền trước / liền sau theo vòng alpha → prime → marketplace → alpha. */
function siblings(id: ProductPage["id"]) {
  const i = productOrder.indexOf(id);
  const n = productOrder.length;
  return { prev: productOrder[(i - 1 + n) % n], next: productOrder[(i + 1) % n] };
}

const RAIL_LABEL = "font-mono text-[10.5px] uppercase tracking-[0.14em]";

/** Điều hướng trước/sau kẹp hai bên quả cầu — chỉ từ lg, hẹp hơn thì không đủ
 * chỗ hai bên. Bản mobile xem `MobileRails`. */
function SideRails({ id }: { id: ProductPage["id"] }) {
  const { prev, next } = siblings(id);

  const rail = (to: string, side: "left" | "right") => (
    <Link
      to={`/${to}`}
      className="pointer-events-auto flex flex-col items-center gap-0.5 rounded-md p-2 text-[color-mix(in_srgb,var(--foreground)_25%,transparent)] transition-colors duration-200 hover:text-foreground"
    >
      {side === "left" ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
      <span className={cn(RAIL_LABEL, "transition-colors duration-200")}>{to}</span>
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

/**
 * Điều hướng trước/sau cho mobile — bản dev ẩn hẳn hai thanh này dưới lg, tức là
 * trên điện thoại không có đường nào nhảy sang sản phẩm khác ngoài dropdown ở
 * header. Ở đây thay bằng một hàng nằm cuối hero: trước bên trái, sau bên phải,
 * gạch phân cách phía trên. Ẩn từ lg vì lúc đó đã có SideRails.
 */
function MobileRails({ id }: { id: ProductPage["id"] }) {
  const { prev, next } = siblings(id);

  return (
    <nav
      aria-label="Sản phẩm khác"
      className="mt-2 flex w-full max-w-[600px] items-center justify-between border-t border-line-solid pt-6 lg:hidden"
    >
      <Link
        to={`/${prev}`}
        /* min-h-11 = 44px: vùng bấm bằng py-1 chỉ cao 24px, dưới ngưỡng cảm ứng. */
        className="flex min-h-11 min-w-0 items-center gap-1.5 rounded-md py-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-4 shrink-0" />
        <span className={cn(RAIL_LABEL, "truncate")}>{prev}</span>
      </Link>
      <Link
        to={`/${next}`}
        className="flex min-h-11 min-w-0 items-center gap-1.5 rounded-md py-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <span className={cn(RAIL_LABEL, "truncate")}>{next}</span>
        <ChevronRight className="size-4 shrink-0" />
      </Link>
    </nav>
  );
}

/** Hero trang sản phẩm — canh giữa, quả cầu trên, tiêu đề dưới, hạt cam nổi
 * phía sau. Dựng theo đúng layout của dev.yuzu.money/alpha. */
export function ProductHero({ page }: { page: HeroData }) {
  // "Yuzu Alpha" → "Yuzu" + "Alpha", chữ cuối tô màu accent như trang gốc.
  const cut = page.title.lastIndexOf(" ");
  const lead = cut > 0 ? page.title.slice(0, cut) : "";
  const tail = cut > 0 ? page.title.slice(cut + 1) : page.title;

  return (
    <section className="section-tint relative overflow-hidden px-4 pt-28 pb-14 sm:px-6">
      <CitrusField seed={page.id.length * 7919} />
      <SideRails id={page.id} />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-14 text-center">
        <HeroBall id={page.id} />

        <div className="flex flex-col items-center gap-4">
          <span className="kicker">{page.kicker}</span>

          <h1 className="text-balance text-5xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-6xl md:text-7xl">
            {lead && `${lead} `}
            <span style={{ color: "var(--heading-accent, var(--accent))" }}>{tail}</span>
          </h1>

          <div className="flex flex-col items-center gap-7">
            <p className="max-w-[600px] px-2 text-[17px] leading-[1.62] text-muted-foreground md:px-0">
              {page.intro}
            </p>

            <div className="flex flex-col items-center gap-4 md:flex-row">
              <a
                href={page.primary.href}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--mark)] px-5 py-3 text-sm font-semibold text-[var(--accent-foreground)] transition-opacity hover:opacity-90"
              >
                {page.primary.label}
                {page.primary.rate && (
                  <span className="data font-semibold">{page.primary.rate}</span>
                )}
                <ArrowRight className="size-4" />
              </a>
              <a
                href={page.secondary.href}
                className="inline-flex items-center gap-1.5 rounded-full bg-surface px-5 py-3 text-sm font-semibold text-foreground transition-opacity hover:opacity-80"
              >
                {page.secondary.label}
                <ArrowUpRight className="size-4" />
              </a>
            </div>

            <MobileRails id={page.id} />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Dải 4 chỉ số, kẻ ngang trên dưới trải hết bề ngang như lưới Partners. */
export function KpiRow({ items }: { items: Kpi[] }) {
  return (
    <section aria-label="Key figures" className={cn("bg-surface", PAD)}>
      <div className="relative mx-auto max-w-[1280px] before:absolute before:inset-x-[calc(50%-50vw)] before:top-0 before:h-px before:bg-line-solid before:content-[''] after:absolute after:inset-x-[calc(50%-50vw)] after:bottom-0 after:z-[2] after:h-px after:bg-line-solid after:content-['']">
        {/* Cột theo đúng số chỉ số: Prime chỉ có 3, để md:grid-cols-4 thì thừa một
            ô trống ở cuối hàng. */}
        <div
          className={cn(
            "grid grid-cols-2 gap-px border-x border-line-solid bg-line-solid",
            items.length === 3 ? "md:grid-cols-3" : "md:grid-cols-4",
          )}
        >
          {items.map((k) => (
            <div
              key={k.label}
              className="flex flex-col items-center justify-center gap-1.5 bg-surface px-3 py-7"
            >
              <span className="data text-[26px] font-semibold leading-none text-foreground">
                {k.value}
              </span>
              <span className="microlabel microlabel-muted text-center">{k.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Bộ token của sản phẩm — 3 thẻ trắng, tên token cỡ lớn. */
export function TokenSet({ tokens, note }: { tokens: TokenCard[]; note?: string }) {
  return (
    <section className={cn("section-tint pb-14 md:pb-20", PAD)}>
      <div className="mx-auto max-w-[1280px]">
        <div className="grid gap-3 sm:grid-cols-3">
          {tokens.map((t) => (
            <div key={t.name} className="rounded-[20px] bg-surface px-5 py-6">
              <div className="data text-[20px] font-semibold leading-none text-foreground">
                {t.name}
              </div>
              <p className="mt-3 text-[13.5px] leading-[1.55] text-muted-foreground">{t.desc}</p>
            </div>
          ))}
        </div>
        {note && (
          <p className="mt-5 text-[13.5px] leading-[1.6] text-foreground">{note}</p>
        )}
      </div>
    </section>
  );
}

/** Các lớp bảo vệ, đánh số 1..n — cùng cách đánh số với deck Security. */
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
    <section className={cn("section-tint border-t border-line-solid py-14 md:py-20", PAD)}>
      <div className="mx-auto max-w-[1280px]">
        <SectionHead kicker={kicker} title={title} />
        <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {layers.map((l, i) => (
            <li key={l.title} className="rounded-[20px] bg-surface px-5 py-6">
              <span
                className="data flex size-9 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)] text-[15px] font-semibold text-foreground"
                aria-hidden
              >
                {i + 1}
              </span>
              <div className="mt-4 text-[15px] font-semibold leading-[1.3] text-foreground">
                {l.title}
              </div>
              <p className="mt-2 text-[13px] leading-[1.55] text-muted-foreground">{l.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Luồng vào: 4 bước nối nhau bằng mũi tên, xuống dòng thì xếp dọc. */
export function PathIn({
  kicker,
  steps,
  note,
}: {
  kicker: string;
  steps: Step[];
  note: string;
}) {
  return (
    <section className={cn("section-tint border-t border-line-solid py-14 md:py-20", PAD)}>
      <div className="mx-auto max-w-[1280px]">
        <span className="kicker mb-8">{kicker}</span>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.label} className="relative rounded-[20px] bg-surface px-5 py-6">
              <div className="microlabel microlabel-muted">{s.label}</div>
              <div className="mt-2 text-[15px] font-medium leading-[1.4] text-foreground">
                {s.value}
              </div>
              {i < steps.length - 1 && (
                <ArrowRight
                  aria-hidden
                  className="absolute -right-[18px] top-1/2 hidden size-3.5 -translate-y-1/2 text-[color-mix(in_srgb,var(--foreground)_35%,transparent)] lg:block"
                />
              )}
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-[80ch] text-[13px] leading-[1.6] text-foreground">{note}</p>
      </div>
    </section>
  );
}

/** CTA đóng trang. */
export function ClosingCta({ closing }: { closing: ProductPage["closing"] }) {
  return (
    <section className={cn("section-tint border-t border-line-solid py-16 md:py-24", PAD)}>
      <div className="mx-auto max-w-[1280px] text-center">
        <h2 className="text-[30px] font-semibold leading-[1.08] text-foreground md:text-[40px] md:leading-[1.15]">
          {closing.title}
        </h2>
        <p className="mx-auto mt-4 max-w-[62ch] text-[15.5px] leading-[1.65] text-muted-foreground">
          {closing.body}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={closing.primary.href}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--mark)] px-5 py-3 text-sm font-semibold text-[var(--accent-foreground)] transition-opacity hover:opacity-90"
          >
            {closing.primary.label}
            <ArrowRight className="size-4" />
          </a>
          <a
            href={closing.secondary.href}
            className="inline-flex items-center gap-1.5 rounded-full bg-surface px-5 py-3 text-sm font-semibold text-foreground transition-opacity hover:opacity-80"
          >
            {closing.secondary.label}
            <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
