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
import { LiquidSurface } from "@/components/ui/LiquidSurface";
import { useReducedMotion } from "@/lib/useReducedMotion";
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

/** Nút hero của Alpha & Marketplace: cao 48px, chữ 15px, nút chính có vệt tối
 *  inset ở đáy. Cả HAI nút đều dùng mũi tên NGANG 18px trượt sang phải khi hover
 *  — trước đây mình để nút phụ mũi tên chéo lên và icon 16px. */
/* Nút lấy DÁNG của nút "Launch app" trên header — bo `rounded-sm`, có vệt tối
   inset ở đáy — nhưng MÀU thì theo màu brand của từng trang chứ không phải nền
   #1a1a1a: `--accent` đổi theo scope nên Alpha ra xanh, Prime vàng, Marketplace
   tím. Không dùng class `.launch-btn` nữa vì nó ghim cứng màu đen. */
const BTN_PRIMARY =
  "group/cta inline-flex h-12 items-center gap-2 whitespace-nowrap rounded-sm bg-accent px-5 text-[15px] font-medium text-accent-foreground shadow-[inset_0_-2px_0_0_rgba(0,0,0,0.11)] transition-opacity duration-300 hover:opacity-90";
const BTN_GHOST =
  "group/cta inline-flex h-12 items-center gap-2 whitespace-nowrap rounded-sm border border-line-solid bg-surface px-5 text-[15px] font-medium text-foreground transition-colors duration-300 hover:border-[color-mix(in_srgb,var(--accent)_40%,transparent)]";

/** Prime dùng bộ riêng: py-2 nên chỉ cao 44px, chữ 16px, số liệu to hơn (20px).
 *  Nền lấy --prime-accent (vàng nâu) chứ không phải --prime-text: biến đó là màu
 *  mực gần ĐEN, để vậy thì nút Prime ra đen giữa một trang vàng nâu. */
const BTN_PRIME =
  "group/cta relative inline-flex items-center gap-2 whitespace-nowrap rounded-sm bg-[var(--prime-accent)] px-4 py-2 text-base font-medium text-accent-foreground shadow-[inset_0_-2px_0_0_rgba(0,0,0,0.11)] transition-all duration-300 hover:opacity-90";
const BTN_PRIME_GHOST =
  "group/cta inline-flex items-center gap-2 whitespace-nowrap rounded-sm border border-[var(--prime-card-border)] bg-[var(--prime-bg)] px-4 py-2 text-base font-medium text-[var(--prime-text)] transition-all duration-300 hover:border-[color-mix(in_srgb,var(--prime-accent)_40%,transparent)]";

/** Mũi tên trong nút — 18px cho Alpha/Marketplace, 20px cho Prime. */
const CTA_ARROW = "transition-transform duration-300 group-hover/cta:translate-x-0.5";

export function SectionHead({
  kicker,
  title,
  center,
}: {
  kicker: string;
  title?: string;
  /** Canh giữa theo nếp home; bản dev canh trái. */
  center?: boolean;
}) {
  return (
    <Reveal>
      <div className={cn(center && "flex flex-col items-center text-center")}>
        <span className="kicker">{kicker}</span>
        {title && (
          <h2 className="mt-4 max-w-[620px] text-balance text-3xl font-bold leading-[1.2] tracking-tight text-foreground md:text-[40px]">
            {title}
          </h2>
        )}
      </div>
    </Reveal>
  );
}

/* ----------------------------------- hero ---------------------------------- */

export type HeroData = Pick<
  ProductPage,
  "id" | "kicker" | "title" | "intro" | "introMark" | "primary" | "secondary"
>;

/** Tâm quả cầu tính từ đỉnh section: pt-28 (112px) + nửa quả cầu 225px. */
const BALL_CENTER = 112 + 113;

function siblings(id: ProductPage["id"]) {
  const i = productOrder.indexOf(id);
  const n = productOrder.length;
  return { prev: productOrder[(i - 1 + n) % n], next: productOrder[(i + 1) % n] };
}

/* Bản dev: mũi V để `text-foreground/25` — rất nhạt, hover mới sang accent; còn
   nhãn thì mang màu muted riêng và cũng sang accent theo group. Mình từng để 65%
   nên hai thanh này đậm hơn hẳn bản gốc. */
const RAIL_LABEL =
  "font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground transition-colors duration-200 group-hover/rail:text-accent";
const RAIL_TONE =
  "text-[color-mix(in_srgb,var(--foreground)_25%,transparent)] transition-colors duration-200 hover:text-accent";

/** Nhãn trên thanh kẹp là TÊN sản phẩm (hoa đầu), không phải slug đường dẫn. */
const railName = (slug: string) => slug.charAt(0).toUpperCase() + slug.slice(1);

function SideRails({ id }: { id: ProductPage["id"] }) {
  const { prev, next } = siblings(id);
  const rail = (to: string, side: "left" | "right") => (
    <Link
      to={`/${to}`}
      className={cn(
        "group/rail pointer-events-auto flex flex-col items-center gap-0.5 rounded-md p-2",
        RAIL_TONE,
      )}
    >
      {side === "left" ? (
        <ChevronLeft className="size-14" />
      ) : (
        <ChevronRight className="size-14" />
      )}
      <span className={RAIL_LABEL}>{railName(to)}</span>
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
      className={cn(
        "group/rail flex min-h-11 min-w-0 items-center gap-1.5 rounded-md py-2",
        RAIL_TONE,
      )}
    >
      {side === "left" && <ChevronLeft className="size-4 shrink-0" />}
      <span className={cn(RAIL_LABEL, "truncate")}>{railName(to)}</span>
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

/** Tô đậm + accent hai cụm mà bản dev nhấn trong đoạn intro. */
function markIntro(text: string, marks: string[] | undefined, tone: string) {
  if (!marks?.length) return text;
  // Tách theo đúng chuỗi con, giữ cả dấu phân cách để ghép lại không mất chữ.
  const re = new RegExp(`(${marks.map((m) => m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`);
  return text.split(re).map((piece, i) =>
    marks.includes(piece) ? (
      <span key={i} className={cn("font-medium", tone)}>
        {piece}
      </span>
    ) : (
      piece
    ),
  );
}

export function ProductHero({ page }: { page: HeroData }) {
  const prime = page.id === "prime";
  const cut = page.title.lastIndexOf(" ");
  const lead = cut > 0 ? page.title.slice(0, cut) : "";
  const tail = cut > 0 ? page.title.slice(cut + 1) : page.title;
  const arrow = cn(CTA_ARROW, prime ? "size-5" : "h-[18px] w-[18px]");

  /* Hero của Prime KHÁC hẳn hai trang kia trên bản dev, không chỉ khác màu:
       - cột dọc gap-20 (80px) thay vì gap-14 (56px)
       - KHÔNG có dòng kicker phía trên H1
       - khối chữ gap-6 thay vì gap-7, nút cao 44px thay vì 48px
     Mình từng dùng chung một khuôn cho cả ba nên Prime bị cao hơn bản gốc 26px
     và có thêm một dòng chữ mà trang gốc không có. */
  return (
    /* pb: Alpha và Marketplace pb-14 (56px), riêng Prime pb-15 (60px). Không có
       section-tint — bản dev để nền cho wrapper scope lo, hero trong suốt. */
    <section className={cn("relative overflow-hidden pt-28", prime ? "pb-15" : "pb-14", PAD)}>
      <SideRails id={page.id} />

      <div
        className={cn(
          "relative mx-auto flex max-w-5xl flex-col items-center text-center",
          prime ? "gap-20" : "gap-14",
        )}
      >
        <div className="flex flex-col items-center gap-5">
          {/* Ô GIỮ CHỖ rỗng, đúng như bản dev: thẻ 225px của họ trống hoàn toàn,
              quả cầu là một lớp overlay của cả trang (xem HeroBallStage). Có vậy
              nó mới xoay được khi chuyển sản phẩm thay vì remount. */}
          <div
            data-ball-slot
            className="h-[200px] w-[200px] sm:h-[225px] sm:w-[225px]"
            aria-hidden
          />
          <MobileRails id={page.id} />
        </div>

        <div className="flex flex-col items-center gap-4">
          {!prime && (
            <Reveal>
              <span className="kicker">{page.kicker}</span>
            </Reveal>
          )}

          {/* H1 của bản dev là chữ PHẲNG (`font-variation-settings: normal`), chỉ
              từ cuối mang màu accent. Trước đây mình bọc nó trong hiệu ứng con
              trỏ wght 700→800 — vừa khác bản gốc, vừa cắt chữ thành từng ký tự
              nên trình đọc màn hình đọc rời rạc. */}
          <Reveal delay={prime ? 0 : 0.06}>
            <h1 className="text-balance font-sans text-5xl font-bold leading-[1.15] tracking-tight sm:text-6xl md:text-7xl">
              {lead && `${lead} `}
              <span style={{ color: "var(--heading-accent, var(--accent))" }}>{tail}</span>
            </h1>
          </Reveal>

          <Reveal delay={prime ? 0.06 : 0.12}>
            <div className={cn("flex flex-col items-center", prime ? "gap-6" : "gap-7")}>
              <p
                className={cn(
                  "text-center",
                  prime
                    ? "max-w-[560px] px-4 text-lg leading-[29.25px] text-[var(--prime-text-muted)] md:px-0"
                    : "max-w-[600px] px-2 text-[17px] leading-[1.62] text-muted-foreground md:px-0",
                )}
              >
                {markIntro(
                  page.intro,
                  page.introMark,
                  prime ? "text-[var(--prime-accent-strong)]" : "text-accent",
                )}
              </p>

              <div className="flex flex-col items-center gap-4 md:flex-row">
                <a href={page.primary.href} className={prime ? BTN_PRIME : BTN_PRIMARY}>
                  {page.primary.label}
                  {page.primary.rate && (
                    <span className={cn("font-bold tabular-nums", prime ? "text-xl" : "text-lg")}>
                      {page.primary.rate}
                    </span>
                  )}
                  <ArrowRight className={arrow} />
                </a>
                <a href={page.secondary.href} className={prime ? BTN_PRIME_GHOST : BTN_GHOST}>
                  {page.secondary.label}
                  <ArrowRight className={arrow} />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- dải chỉ số -------------------------------- */

/** Ô KPI của bản dev: thẻ có viền, `pb-11` chừa chỗ cho vệt nước ở đáy. */
/** Mực nước của bốn ô — dùng lại đúng bộ số của trang gốc đã ghi trong
 *  `content.ts` cho stat box của landing (0.38–0.44, biến thiên nhẹ cho từng ô
 *  chứ không mã hoá giá trị của chỉ số). */
const KPI_LEVEL = [0.4, 0.44, 0.38, 0.42];

export function KpiRow({ items }: { items: Kpi[] }) {
  const reduced = useReducedMotion();

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
            <div className="group relative flex min-h-[134px] flex-col items-center justify-start gap-1 overflow-hidden rounded-lg bg-surface-2 px-3 pt-5 pb-11">
              {/* Mặt nước ở đáy ô — thứ mà `pb-11` chừa chỗ cho. Bản dev dựng đúng
                  component này (viewBox 200×100, gradient --liquid-top → --liquid-bottom,
                  8 bong bóng, uid `stat-{i}`); trước đây mình chừa chỗ nhưng KHÔNG
                  vẽ nước, nên bốn ô này trống hẳn phần dưới. */}
              <LiquidSurface
                level={KPI_LEVEL[i % KPI_LEVEL.length]}
                active
                tone="var(--liquid-back)"
                uid={`stat-${i}`}
                reduced={reduced}
              />
              <span className="relative z-10 text-2xl font-bold leading-9 tabular-nums text-foreground md:text-[32px]">
                {k.value}
              </span>
              <p className="relative z-10 text-center text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
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
        /* Nếp home: nền xanh nhạt, không stroke. Thẻ đỡ (yzPP) giữ nhấn bằng
           một vệt accent ở viền TRÊN — đó là thứ nói nó đứng dưới hai thẻ kia. */
        "flex h-full items-start gap-3 rounded-lg bg-surface-2 p-4 transition-colors duration-300",
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
        <Reveal className="relative mt-6" delay={0.16}>
          {/* Bản dev không soi mũi tên theo lưới: hai mũi tên đặt giữa, cách nhau
              28% bề rộng — nên cả ở cột đơn vẫn thấy hai mũi. Và khoảng hở là
              mt-6 / mt-2, không phải mt-8 / mt-3 (mình từng để cao hơn 12px). */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-[18px] right-0 left-0 flex justify-center gap-[28%] text-[color-mix(in_srgb,var(--accent)_50%,transparent)]"
          >
            <ChevronUp className="size-4" />
            <ChevronUp className="size-4" />
          </div>
          <TokenRow token={base} delay={1.4} base />
          <p className="mt-2 text-center text-[13px] leading-[1.5] text-muted-foreground">
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
        <ol className="mt-9 grid gap-4 sm:grid-cols-2">
          {layers.map((l, i) => (
            <Reveal key={l.title} x={-14} y={0} delay={i * 0.07}>
              {/* Bỏ stroke theo nếp home: nền trắng, không viền, không đổi viền
                  khi hover. Chú thích PHẢI bọc trong ngoặc nhọn — `/* *​/` trần ở
                  vị trí con của JSX sẽ render thành chữ thật trên trang. */}
              <li className="flex h-full items-start gap-4 rounded-lg bg-surface p-4 sm:p-5">
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--accent)_35%,transparent)] font-mono text-[11px] font-semibold text-accent sm:mt-0">
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
      <div className={cn("relative", WRAP)}>
        <SectionHead kicker={kicker} />
        {/* Khe rộng 32px CHỈ từ `lg` — đúng chỗ mũi tên nối hiện ra: `-right-6`
            đặt tâm mũi tên giữa khe đó nên còn 8px thoáng mỗi bên (khe 16px cũ bị
            mũi tên rộng 16px lấp gần kín, lại còn đè lên thẻ 3px). Dưới `lg` mũi
            tên ẩn, thẻ xếp dọc, nên giữ 16px cho khỏi cao vô ích. */}
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map((s, i) => (
            <Reveal key={s.label} y={16} delay={i * 0.07}>
              <li className="relative h-full rounded-lg bg-surface p-5">
                <span className="microlabel">{s.label}</span>
                <p className="mt-1.5 text-[15px] font-medium leading-[1.4] text-foreground">
                  {s.value}
                </p>
                {i < steps.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute -right-6 top-1/2 hidden -translate-y-1/2 text-faint lg:block"
                  >
                    <ChevronRight className="size-4" />
                  </span>
                )}
              </li>
            </Reveal>
          ))}
        </ol>
        <Reveal delay={0.2}>
          <p className="mt-5 max-w-[640px] text-[13px] leading-[1.6] text-muted-foreground">
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
  const reduced = useReducedMotion();

  return (
    <section className={cn(SECTION, PAD)}>
      <Reveal>
        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 overflow-hidden rounded-xl bg-surface px-6 pt-14 pb-20 text-center">
          {/* Thẻ này bên dev cũng có mặt nước, phủ cả thẻ (1022×330) — cùng
              component với ô KPI. Mức nước lấy theo khoảng `pb-20` mà bản dev
              chừa ở đáy (80/330 ≈ 0.24): trang dev khoá cuộn nên không đọc được
              `d` của họ để lấy đúng số. */}
          <LiquidSurface
            level={0.24}
            active
            tone="var(--liquid-back)"
            uid="cta"
            reduced={reduced}
          />
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
                <ArrowRight className={cn(CTA_ARROW, "h-[18px] w-[18px]")} />
              </a>
              <a href={closing.secondary.href} className={BTN_GHOST}>
                {closing.secondary.label}
                <ArrowUpRight className={cn(CTA_ARROW, "h-[18px] w-[18px]")} />
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
