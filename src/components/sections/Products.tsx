import { useCallback, useEffect, useRef, useState } from "react";
import { asset, products, productsHeading, type Product } from "@/data/content";
import { ArrowUpRight, ExitIcon, LockIcon, ShieldIcon } from "@/components/ui/Icons";
import { CitrusChart, SliceDetail } from "@/components/ui/CitrusChart";
import { cn } from "@/lib/utils";
import { isChoreographyOn } from "@/lib/useChoreography";

const FACT_ICONS = { lock: LockIcon, exit: ExitIcon, shield: ShieldIcon };

/* -------------------------------- mảnh dùng chung ------------------------------- */

function Heading({ trailing }: { trailing?: React.ReactNode }) {
  return (
    <div className="relative mb-8 flex flex-col items-center gap-4 pb-8 text-center md:mb-12 md:pb-12 before:absolute before:inset-x-[calc(50%-50vw)] before:bottom-0 before:h-px before:bg-line-solid before:content-['']">
      <div className="max-w-[52ch]">
        <span className="kicker mb-4">{productsHeading.kicker}</span>
        <h2 className="text-[30px] font-semibold leading-[1.08] text-foreground md:text-[40px] md:leading-[1.15]">
          {productsHeading.title}
        </h2>
      </div>
      {trailing}
    </div>
  );
}

function Yields({ p }: { p: Product }) {
  return (
    <div className="mb-6 flex min-h-[124px] flex-col justify-center gap-3">
      {p.yields.map((y) => (
        <div key={y.token} className="flex items-center gap-3">
          <img src={asset(y.icon)} alt="" className="h-7 w-7 shrink-0 rounded-full" />
          <span
            className="data text-[26px] font-medium leading-none"
            style={{ color: p.color }}
          >
            {y.apy}
          </span>
          <span className="text-[13px] text-foreground">
            paid on <span className="data font-semibold text-foreground">{y.token}</span>
            {y.tail}
          </span>
        </div>
      ))}
      <p className="text-[11.5px] leading-[1.55] text-foreground">{p.fee}</p>
    </div>
  );
}

function Spec({ p }: { p: Product }) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
      {p.facts.map((f) => {
        const Icon = FACT_ICONS[f.icon];
        return (
          <div
            key={f.label}
            className="flex items-center gap-3.5 rounded-md bg-white px-3.5 py-3 sm:min-h-[132px] sm:flex-col sm:items-center sm:justify-center sm:gap-0 sm:py-3.5 sm:text-center"
          >
            <div className="shrink-0 sm:mb-2.5">
              {/* Badge vuông bo, nền nhạt hơn icon; icon xám nhạt */}
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
  );
}

function Cta({ p }: { p: Product }) {
  return (
    <div className="mt-6 flex flex-col items-start gap-3">
      {/* Ghi chú nằm trên nút, trải hết chiều ngang, nét mảnh hơn */}
      <span className="microlabel microlabel-regular w-full">{p.cta.note}</span>
      <a
        href="#"
        className="group inline-flex items-center gap-2 rounded-btn px-[18px] py-2.5 text-[13.5px] font-semibold transition-transform duration-200 hover:-translate-y-0.5"
        style={{ background: p.color, color: p.ink }}
      >
        {p.cta.label}
        <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>
    </div>
  );
}

/**
 * Khi không hover, múi sáng tự chạy vòng: -1 → 0 → … → n-1 → -1.
 * Bước đầu 1100ms, các bước sau 1500ms — giống trang gốc.
 */
function useAutoSlice(p: Product, hovered: number | null, enabled: boolean) {
  const [auto, setAuto] = useState(-1);

  useEffect(() => setAuto(-1), [p.id]);

  useEffect(() => {
    if (!enabled || hovered !== null) return;
    const n = p.slices.length;
    const t = window.setTimeout(
      () => setAuto((v) => (v + 1 > n - 1 ? -1 : v + 1)),
      auto < 0 ? 1600 : 2200,
    );
    return () => window.clearTimeout(t);
  }, [auto, hovered, p, enabled]);

  return hovered ?? (auto >= 0 ? auto : null);
}

/** <768px → carousel; đủ cao và không giảm chuyển động → pinned; còn lại → stacked. */
type ProductMode = "carousel" | "pinned" | "stacked";

function resolveMode(): ProductMode {
  if (window.innerWidth < 768) return "carousel";
  // Cùng một điều kiện với Security / Transparency — xem chú thích trong
  // useChoreography: ba section nối nhau bằng margin âm nên không được lệch nhau.
  return isChoreographyOn() ? "pinned" : "stacked";
}

function useProductMode() {
  const [mode, setMode] = useState<ProductMode>(resolveMode);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMode(resolveMode());
    sync();
    window.addEventListener("resize", sync);
    mq.addEventListener("change", sync);
    return () => {
      window.removeEventListener("resize", sync);
      mq.removeEventListener("change", sync);
    };
  }, []);

  return mode;
}

/* ---------------------------------- pinned ---------------------------------- */

/** Màn cuối của khung cuộn KHÔNG dành cho tab nào: đó là quãng Security trượt đè
 * lên tấm Marketplace vẫn đang ghim. Trừ nó ra thì mỗi tab giữ nguyên quãng cuộn
 * như trước, phần thêm vào là overlap thuần tuý. */
const OVERLAP_SCREENS = 1;

/** Quãng cuộn thực sự chia cho 3 tab = chiều cao khung − phần thẻ ghim − overlap. */
function tabRange(el: HTMLElement) {
  const vh = window.innerHeight;
  return el.offsetHeight - (vh - 64) - OVERLAP_SCREENS * vh;
}

function Pinned() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const total = tabRange(el);
      const progress = Math.min(Math.max(-el.getBoundingClientRect().top / Math.max(1, total), 0), 0.9999);
      setIndex(Math.floor(progress * products.length));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const p = products[index];
  const active = useAutoSlice(p, hovered, true);

  const goTo = useCallback((i: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const total = tabRange(el);
    window.scrollTo({
      top: el.offsetTop + (total * (i + 0.5)) / products.length,
      behavior: "smooth",
    });
  }, []);

  // 400svh = 3 màn cho 3 tab + 1 màn để Security trượt đè lên (xem OVERLAP_SCREENS).
  // Đổi số này thì phải đổi cả -mt-[100svh] bên Security.
  return (
    <div id="products" ref={wrapRef} className="relative h-[400svh]">
      <section
        className={cn(
          // justify-start, KHONG phai center: ba tab cao khac nhau, can giua thi khoi tieu de
          // truot len xuong moi lan doi tab. Neo dinh => tieu de dung yen tuyet doi.
          "section-tint sticky flex flex-col overflow-hidden px-6 pt-8 pb-8 transition-colors duration-500 lg:px-[60px]",
          p.scope,
        )}
        style={{ top: 64, height: "calc(100svh - 64px)" }}
      >
        <div className="mx-auto w-full max-w-[1024px]">
          <Heading
            trailing={
              <div className="inline-flex gap-1 rounded-full bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] p-1">
                {products.map((item, i) => {
                  const on = item.id === p.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => goTo(i)}
                      aria-pressed={on}
                      className={cn(
                        "cursor-pointer rounded-full px-4 py-[7px] text-sm font-semibold transition-[background-color,color] duration-150",
                        on
                          ? "bg-surface text-foreground shadow-[0_1px_3px_rgba(0,0,0,.06)]"
                          : "bg-transparent text-[color-mix(in_srgb,var(--foreground)_70%,transparent)] hover:text-foreground",
                      )}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            }
          />

          {/* 460 chu khong phai 520: khung sticky cao co dinh (100svh-64), cot trai
              (chanh + the mo ta) la cot cao nhat nen thu hep no la cach duy nhat
              lay lai chieu cao ma khong dung vao padding. */}
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)] lg:gap-14">
            <div>
              <CitrusChart
                id={p.id}
                accent={p.color}
                slices={p.slices}
                active={active}
                setActive={setHovered}
              />
              <SliceDetail slices={p.slices} accent={p.color} active={active} />
            </div>

            <div>
              <Yields p={p} />
              <Spec p={p} />
              <Cta p={p} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* --------------------------------- carousel --------------------------------- */



/** Một thẻ trong rail ngang của bản mobile. Mỗi thẻ giữ múi đang chọn của riêng
 * nó, và chỉ cho tương tác khi đang là thẻ hiển thị — thẻ nằm ngoài khung vẫn ở
 * trong DOM, để bấm được thì bàn phím sẽ tab vào múi của thẻ không nhìn thấy. */
function CarouselSlide({ p, on }: { p: Product; on: boolean }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section
      aria-label={`${p.name}, ${p.kind}`}
      className="w-full shrink-0 snap-center"
      aria-hidden={!on || undefined}
    >
      <CitrusChart
        id={p.id}
        accent={p.color}
        slices={p.slices}
        active={active}
        setActive={setActive}
        interactive={on}
      />
      <SliceDetail slices={p.slices} accent={p.color} active={active} />
      <Yields p={p} />
    </section>
  );
}
function Carousel() {
  const railRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const step = (el: HTMLElement) => {
    const kids = el.children;
    if (kids.length < 2) return el.clientWidth;
    return (kids[1] as HTMLElement).offsetLeft - (kids[0] as HTMLElement).offsetLeft;
  };

  const goTo = (i: number) => {
    const el = railRef.current;
    if (el) el.scrollTo({ left: i * step(el), behavior: "smooth" });
  };

  const p = products[index];

  /* Ba thẻ cao khác nhau (Marketplace 588px, Prime 463px) mà flex rail thì lấy
     chiều cao của thẻ cao nhất — đứng ở Alpha sẽ thấy ~100px trống trước hàng dot.
     Cho khung bám theo thẻ đang hiện, có transition để lúc vuốt không giật. */
  const [railH, setRailH] = useState<number>();
  useEffect(() => {
    const measure = () => {
      const el = railRef.current?.children[index] as HTMLElement | undefined;
      if (el) setRailH(el.scrollHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [index]);

  return (
    <div
      id="products"
      className={cn("section-tint px-6 py-8 md:py-16 transition-colors duration-500", p.scope)}
    >
      <Heading />

      {/* Bọc thêm một lớp flex justify-center: track là inline-flex nên tự dạt về
          lề trái, trong khi Heading phía trên canh giữa — lệch tâm 27px. */}
      <div className="mb-5 flex justify-center">
        <div className="inline-flex gap-1 rounded-full bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] p-1">
        {products.map((item, i) => {
          const on = i === index;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(i)}
              aria-pressed={on}
              className={cn(
                "cursor-pointer rounded-full px-4 py-[7px] text-sm font-semibold transition-[background-color,color] duration-150",
                on
                  ? "bg-surface text-foreground shadow-[0_1px_3px_rgba(0,0,0,.06)]"
                  : "bg-transparent text-[color-mix(in_srgb,var(--foreground)_70%,transparent)] hover:text-foreground",
              )}
            >
              {item.name}
            </button>
          );
        })}
        </div>
      </div>

      <div
        ref={railRef}
        onScroll={() => {
          const el = railRef.current;
          if (!el) return;
          const i = Math.round(el.scrollLeft / step(el));
          setIndex(Math.max(0, Math.min(products.length - 1, i)));
        }}
        /* items-start là BẮT BUỘC khi đặt height tường minh: để mặc định stretch
           thì thẻ con cao bằng khung, `scrollHeight` đo lại chính chiều cao khung
           và vòng đo bị kẹt. */
        style={{ height: railH }}
        className="-mx-6 flex snap-x snap-mandatory items-start gap-6 overflow-x-auto overflow-y-hidden overscroll-x-contain px-6 transition-[height] duration-300 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((item, i) => (
          <CarouselSlide key={item.id} p={item} on={i === index} />
        ))}
      </div>

      {/* dot indicator — báo rail kéo ngang được, bấm được để nhảy card */}
      <div className="mt-4 flex justify-center gap-1.5">
        {products.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={item.name}
            aria-current={i === index}
            className={cn(
              // before:-inset-2.5 nới vùng bấm lên 26x26 mà không đổi kích thước hiển thị
              "relative h-1.5 cursor-pointer rounded-full transition-all duration-200 before:absolute before:-inset-2.5 before:content-['']",
              i === index ? "w-4 bg-foreground" : "w-1.5 bg-line-strong",
            )}
          />
        ))}
      </div>
    </div>
  );
}

/* --------------------------------- stacked ---------------------------------- */

function StackedCard({ p }: { p: Product }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      aria-label={`${p.name}, ${p.kind}`}
      className={cn("section-tint px-6 py-8 md:py-16 lg:px-[60px]", p.scope)}
    >
      <div className="mx-auto w-full max-w-[1024px]">
        <div className="mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-[22px] font-semibold" style={{ color: p.color }}>
            {p.name}
          </h3>
          <span className="microlabel">{p.kind}</span>
        </div>

        <p className="mb-6 max-w-[62ch] text-[14px] leading-[1.65] text-muted-foreground sm:mb-8">
          {p.pitch}
        </p>

        <div className="grid items-start gap-5 sm:gap-8 lg:grid-cols-[minmax(0,480px)_minmax(0,1fr)] lg:gap-14">
          <div className="mx-auto -my-2 w-full max-w-[340px] sm:my-0 sm:max-w-[420px]">
            <CitrusChart
              id={p.id}
              accent={p.color}
              slices={p.slices}
              active={hovered}
              setActive={setHovered}
            />
            <SliceDetail slices={p.slices} accent={p.color} active={hovered} />
          </div>
          <div>
            <Yields p={p} />
            <Spec p={p} />
            <Cta p={p} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stacked() {
  return (
    <div id="products">
      <div className="px-6 pt-8 md:pt-16 lg:px-[60px]">
        <div className="mx-auto w-full max-w-[1024px]">
          <Heading />
        </div>
      </div>
      {products.map((p) => (
        <StackedCard key={p.id} p={p} />
      ))}
    </div>
  );
}

/* ---------------------------------- export ---------------------------------- */

export function Products() {
  const mode = useProductMode();

  if (mode === "carousel") return <Carousel />;
  if (mode === "stacked") return <Stacked />;
  return <Pinned />;
}
