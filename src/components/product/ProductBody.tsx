import type { Product } from "@/data/content";
import { asset } from "@/data/content";
import type { ProductPage, Vault } from "@/data/productPages";
import { ExitIcon, LockIcon, ShieldIcon } from "@/components/ui/Icons";
import {
  PAD,
  SECTION,
  SectionHead,
  TokenSet,
  WRAP,
} from "@/components/product/ProductShell";
import { CitrusChart, sliceAngles } from "@/components/ui/CitrusChart";
import { Reveal } from "@/components/product/Reveal";
import { useChoreography } from "@/lib/useChoreography";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const FACT_ICONS = { lock: LockIcon, exit: ExitIcon, shield: ShieldIcon } as const;

/* --------------------------------- vault ---------------------------------- */

/** Thẻ vault của bản dev: viền, hover NHẤC LÊN 4px kèm bóng accent, icon tròn
 * nhấp lệch pha, và bảng chỉ số 2 CỘT dính đáy thẻ (`mt-auto`) để mọi thẻ trong
 * hàng có chân bảng thẳng nhau. */
function VaultCard({ v, i }: { v: Vault; i: number }) {
  return (
    /* Nếp home: nền xanh nhạt, KHÔNG stroke. Hover chỉ nhấc thẻ lên 1 nấc —
       bỏ hẳn viền đổi màu và vệt đổ bóng màu accent. Kẻ ngang trong `dl` bên
       dưới giữ nguyên: đó là vạch phân cách nội dung, không phải viền thẻ. */
    <div
      className={cn(
        "flex h-full flex-col gap-4 rounded-lg bg-surface p-5",
        "will-change-transform transition-transform duration-300 hover:-translate-y-1",
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

/** Ghi chú dưới tiêu đề, có một cụm chữ là link (bản dev gắn "asset whitelist"). */
function Note({
  text,
  link,
}: {
  text: string;
  link?: { text: string; href: string };
}) {
  if (!link || !text.includes(link.text)) {
    return <>{text}</>;
  }
  const [before, after] = text.split(link.text);
  return (
    <>
      {before}
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-accent underline decoration-[color-mix(in_srgb,var(--accent)_40%,transparent)] underline-offset-2 transition-colors hover:decoration-[var(--accent)]"
      >
        {link.text}
      </a>
      {after}
    </>
  );
}


/**
 * Marketplace: mỗi vault là một exposure riêng nên phần này là lưới 3 thẻ vault.
 * Alpha: một danh mục có trọng số nên là quả chanh + danh sách trọng số.
 */
/**
 * Tỉ trọng: quả chanh có múi ở GIỮA, bốn thẻ chia hai bên — trái 2, phải 2.
 *
 * Trước đây dùng `SliceDetail` của trang chủ: bốn thẻ chồng lên nhau trong một ô
 * lưới và chỉ thẻ đang hover mới hiện. Ở đây cần thấy cả bốn cùng lúc nên dựng
 * riêng, nhưng giữ nguyên bộ `slices` trong content.ts mà trang chủ dùng —
 * không phát sinh nội dung mới.
 *
 * Liên kết hai chiều: rê vào một thẻ thì múi tương ứng trên quả chanh nổi lên, và
 * ngược lại.
 */
function SliceCard({
  s,
  accent,
  on,
  onEnter,
  onLeave,
}: {
  s: Product["slices"][number];
  accent: string;
  on: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="flex items-start gap-3 rounded-lg bg-surface px-3.5 py-3 transition-[box-shadow,transform] duration-300"
      style={{
        boxShadow: on
          ? "0 8px 22px color-mix(in srgb, var(--foreground) 10%, transparent)"
          : "0 4px 14px color-mix(in srgb, var(--foreground) 5%, transparent)",
        transform: on ? "translateY(-2px)" : undefined,
      }}
    >
      <span
        className="mt-[5px] h-[7px] w-[7px] shrink-0 rounded-[2px]"
        style={{ background: s.upcoming ? "var(--faint)" : (s.color ?? accent) }}
      />
      <span className="min-w-0 flex-1">
        <span className="block text-[12.5px] font-medium leading-tight text-foreground">
          {s.label}
        </span>
        <span className="mt-1 block text-[11.5px] leading-[1.5] text-faint">{s.detail}</span>
      </span>
      {s.weight !== null && (
        <span
          className="data shrink-0 text-[30px] font-semibold leading-none tracking-[-0.02em]"
          style={{ color: s.color ?? accent }}
        >
          {s.weight}%
        </span>
      )}
    </div>
  );
}

/** Số nhịp cuộn: một nhịp phóng to quả chanh, rồi mỗi múi một nhịp. */
const ZOOM_FROM = 1;
/** Cỡ lớn nhất khi cuộn hết nhịp phóng to — trần, còn thực tế bị khung bó lại. */
const ZOOM_TO = 1.5;
/** Bề rộng quả chanh lúc nghỉ. */
const ART_W = 420;
/** Thẻ hẹp hơn mức này thì chữ bắt đầu gãy giữa từ (đo: 189px gãy, 234px không). */
const CARD_MIN = 240;
const CARD_MAX = 420;
/** Hở giữa mép khung quả chanh và thẻ. */
const GAP = 16;

/** Làm mượt hai đầu — vào và ra đều, không giật như tuyến tính. */
const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Tiến độ cuộn qua khối đã ghim, 0 → 1.
 *
 * Đo trên chính khối cao `h-[500svh]`: phần trôi được bằng chiều cao khối trừ
 * một màn hình, vì màn cuối cùng là lúc khối vừa hết ghim.
 */
function useScrollBeat(ref: React.RefObject<HTMLDivElement | null>, on: boolean) {
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || !on) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      setP(travel <= 0 ? 1 : clamp01(-r.top / travel));
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
  }, [ref, on]);

  return p;
}

/**
 * Tỉ trọng dàn dựng theo cuộn.
 *
 * Mặc định chỉ có quả chanh, chưa thẻ nào. Cuộn nhịp đầu thì quả chanh phóng to
 * dần tới cỡ thật; mỗi nhịp sau nổi một múi lên và thả thẻ tương ứng ra ĐÚNG phía
 * múi đó — bốn múi thì tổng cộng năm nhịp, nên khối cao `500svh`.
 *
 * Dưới `lg`, hoặc khi người dùng tắt animation, `useChoreography()` trả false:
 * lúc đó bỏ hẳn phần ghim, xếp quả chanh trên rồi bốn thẻ dưới, hiện sẵn tất cả —
 * màn dàn dựng này cần cả chiều ngang lẫn chiều cao mới chạy được.
 */
function SliceArt({
  p,
  on,
  prog,
  artRef,
  dy,
}: {
  p: Product;
  on: boolean;
  prog: number;
  artRef?: React.RefObject<HTMLDivElement | null>;
  /** Số px cần đẩy xuống để quả chanh nằm đúng giữa khối đã ghim. */
  dy?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);

  useEffect(() => {
    const el = stage.current;
    if (!el || !on) return;
    const read = () => setW(el.clientWidth);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [on]);

  const goc = sliceAngles(p.slices);
  const beats = 1 + p.slices.length;
  /* Nén các nhịp vào 92% quãng cuộn rồi GIỮ nguyên ở 8% cuối: nếu trải đều tới
     100% thì thẻ cuối vừa hiện xong đúng lúc khối nhả ghim, người xem gần như
     không kịp thấy nó. */
  const beat = clamp01(prog / 0.92) * beats;

  /* Cỡ phóng to THỰC TẾ do khung quyết định: giữ cho mỗi thẻ ít nhất CARD_MIN,
     thiếu chỗ thì quả chanh nhỏ lại chứ không ép thẻ hẹp tới mức gãy chữ. Ở khung
     rộng thì chạm trần ZOOM_TO. */
  const zoomTo = w
    ? Math.min(ZOOM_TO, Math.max(1, (w - 2 * CARD_MIN - 2 * GAP) / ART_W))
    : ZOOM_TO;
  const scale = on ? ZOOM_FROM + (zoomTo - ZOOM_FROM) * smooth(clamp01(beat)) : 1;
  /* Thẻ NEO THEO QUẢ CHANH chứ không dán vào mép khung: `off` là khoảng cách từ
     tâm ra tới mép trong của thẻ. Dán vào mép thì màn càng rộng khe giữa càng
     toác — đúng chỗ bạn thấy xa nhau. */
  const off = Math.round((ART_W * zoomTo) / 2 + GAP);
  const cardW = w
    ? Math.round(Math.min(CARD_MAX, Math.max(CARD_MIN, w / 2 - off)))
    : CARD_MAX;
  /** Độ hiện của thẻ thứ k: 0 → 1 trong đúng nhịp của nó. */
  const reveal = (k: number) => (on ? smooth(clamp01(beat - 1 - k)) : 1);
  /** Múi đang được nhấn: múi của nhịp hiện tại, giữ tới khi nhịp sau tiếp quản. */
  const active = on
    ? beat < 1
      ? null
      : Math.min(Math.floor(beat - 1), p.slices.length - 1)
    : hover;

  /* Chia ĐỀU hai bên: nửa số múi nghiêng về phải nhất thì thẻ nằm bên phải, còn
     lại bên trái. Nếu chỉ xét `right` (múi nằm nửa nào) thì Alpha ra 1 thẻ phải /
     3 thẻ trái vì ba múi nhỏ dồn hết sang trái — lệch hẳn. Trong mỗi bên vẫn xếp
     từ trên xuống theo đúng thứ tự góc. */
  const cho = (() => {
    const xep = [...goc].sort((a, b) => Math.cos(b.mid) - Math.cos(a.mid));
    const nua = Math.ceil(xep.length / 2);
    const ben = (r: boolean) =>
      (r ? xep.slice(0, nua) : xep.slice(nua)).sort(
        (a, b) => Math.sin(a.mid) - Math.sin(b.mid),
      );
    return [true, false].flatMap((r) => {
      const ds = ben(r);
      return ds.map((g, hang) => ({ i: g.i, right: r, hang, trong: ds.length }));
    });
  })();

  const cards = p.slices.map((s, i) => (
    <SliceCard
      key={s.label}
      s={s}
      accent={p.color}
      on={i === active}
      onEnter={() => setHover(i)}
      onLeave={() => setHover(null)}
    />
  ));

  const chart = (
    <CitrusChart
      id={`comp-${p.id}`}
      accent={p.color}
      slices={p.slices}
      active={active}
      setActive={on ? () => {} : setHover}
    />
  );

  /* Không dàn dựng: xếp thường, hiện sẵn tất cả. */
  if (!on) {
    return (
      <Reveal y={24}>
        <div className="mt-9 flex flex-col items-center gap-6">
          <div className="w-full max-w-[420px]">{chart}</div>
          <div className="flex w-full flex-col gap-4">{cards}</div>
        </div>
      </Reveal>
    );
  }

  return (
    /* Chiều cao đúng bằng quả chanh lúc nghỉ (420 × 116/176 ≈ 277) cộng chút lề,
       KHÔNG phải một khung cao bằng màn hình: có vậy quả chanh mới nằm ngay dưới
       tiêu đề như lúc chưa có dàn dựng. Thẻ và phần chanh phóng to tràn ra ngoài
       khung này, nên section để `overflow-visible`. */
    <div
      ref={artRef}
      className="mt-9"
      style={{
        /* Nhịp zoom cũng ĐẨY quả chanh xuống giữa khối đã ghim: lúc nghỉ nó nằm
           ngay dưới tiêu đề, zoom xong thì ra chính giữa như một màn riêng. */
        transform: `translateY(${(dy ?? 0) * smooth(clamp01(prog * (1 + p.slices.length)))}px)`,
        willChange: "transform",
      }}
    >
        <div ref={stage} className="relative mx-auto h-[320px] w-full">
          {/* Căn giữa bằng FLEX chứ không phải `top-1/2 left-1/2` + translate:
              `transform` ở đây chỉ còn đúng `scale`, nên quả chanh không thể trôi
              đi đâu khi phóng to. (Ngoài ra Tailwind v4 biên dịch
              `-translate-x-1/2` thành thuộc tính `translate` RIÊNG, cộng dồn với
              `transform` inline — từng làm nó lệch hẳn nửa bề rộng.) */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div
              className="w-[420px] max-w-full"
              style={{ transform: `scale(${scale})`, transformOrigin: "center", willChange: "transform" }}
            >
              {chart}
            </div>
          </div>

          {[true, false].map((right) => (
            /* Mỗi bên là một CỘT FLEX chứ không phải mấy thẻ đặt tuyệt đối cách
               nhau một bước cố định: bước cứng 108px nhỏ hơn chiều cao thẻ khi
               chữ xuống ba dòng nên hai thẻ đè lên nhau. Cột flex thì cao bao
               nhiêu cũng không chồng.
               Bề rộng tính trong JS cùng lúc với cỡ quả chanh: hai thứ thương
               lượng với nhau theo bề rộng khung, xem `zoomTo`/`cardW`. Trước đây
               chừa CỨNG 680px cho quả chanh nên ở khung ~1000px thẻ chỉ còn 189px
               và chữ gãy giữa từ ("Overcollater / alized"). */
            <div
              key={String(right)}
              className="absolute flex flex-col gap-4"
              style={{
                width: cardW,
                [right ? "left" : "right"]: `calc(50% + ${off}px)`,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              {cho
                .filter((c) => c.right === right)
                .map(({ i }) => {
                  const r = reveal(i);
                  return (
                    <div
                      key={p.slices[i].label}
                      style={{
                        opacity: r,
                        transform: `translateX(${(right ? 1 : -1) * (1 - r) * 16}px)`,
                        pointerEvents: r > 0.9 ? "auto" : "none",
                        transition: "opacity .25s linear",
                        willChange: "opacity, transform",
                      }}
                    >
                      {cards[i]}
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
    </div>
  );
}

export function Composition({
  p,
  head,
  vaults,
}: {
  p: Product;
  head: ProductPage["composition"];
  vaults?: Vault[];
}) {
  const on = useChoreography() && !vaults;
  const track = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const art = useRef<HTMLDivElement>(null);
  const prog = useScrollBeat(track, on);
  const [dy, setDy] = useState(0);

  /* Khoảng cách từ chỗ quả chanh đứng lúc nghỉ tới chính giữa khối đã ghim.
     Đo bằng `offsetTop`/`offsetHeight` — hai giá trị LAYOUT, không bị `transform`
     làm sai, nên đo được ngay cả khi khối đang bị đẩy đi. */
  useEffect(() => {
    if (!on) return;
    const read = () => {
      const a = art.current;
      const k = pin.current;
      if (!a || !k) return;
      setDy(k.clientHeight / 2 - (a.offsetTop + a.offsetHeight / 2));
    };
    const raf = requestAnimationFrame(read);
    window.addEventListener("resize", read);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", read);
    };
  }, [on]);

  /* Tiêu đề ẩn NGAY khi bắt đầu cuộn, không mờ dần: vừa chạm cuộn là màn chuyển
     hẳn sang phần quả chanh. Ngưỡng 0.005 chỉ để tránh nhấp nháy ở đúng mép trên. */
  const fade = on && prog > 0.005 ? 0 : 1;

  const head_ = (
    <div className={cn("relative", WRAP)}>
        {/* Khối tiêu đề canh GIỮA — nếp của web này, bản dev canh trái. */}
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <span className="kicker">{head.kicker}</span>
            <h2 className="mt-4 max-w-[620px] text-balance text-3xl font-bold leading-[1.2] tracking-tight text-foreground md:text-[40px]">
              {head.title}
            </h2>
            {head.note && (
              <p className="mt-4 max-w-[620px] text-[14.5px] leading-[1.6] text-muted-foreground">
                <Note text={head.note} link={head.noteLink} />
              </p>
            )}
          </div>
        </Reveal>

        {vaults ? (
          /* Cả "More on the way" cũng nằm TRONG lưới, làm thẻ thứ 4 xuống hàng
             hai — bản dev để vậy. Tách nó ra ngoài thì section hụt 58px.
             `md:gap-y-8` nới khe giữa hàng ba thẻ và thẻ trải ngang bên dưới; chỉ
             từ `md` vì dưới đó lưới về một cột, để 32px chỉ làm cao thêm vô ích. */
          <div className="mt-9 grid gap-4 md:grid-cols-3 md:gap-y-8">
            {vaults.map((v, i) => (
              /* Thẻ "More on the way" trải hết hàng thay vì đứng lẻ một phần ba —
                 nó không có số liệu nên để hẹp bằng ba thẻ kia thì hụt hẳn. */
              <Reveal
                key={v.name}
                y={24}
                delay={i * 0.08}
                className={v.upcoming ? "md:col-span-3" : undefined}
              >
                <VaultCard v={v} i={i} />
              </Reveal>
            ))}
          </div>
        ) : null}
    </div>
  );

  /* SliceArt nằm NGOÀI khối `max-w-5xl` của phần chữ: màn dàn dựng cần rộng hơn
     1024px thì quả chanh lúc phóng to mới không chạm vào hai cột thẻ. */
  const artNode = !vaults ? <SliceArt p={p} on={on} prog={prog} artRef={art} dy={dy} /> : null;

  if (!on) {
    return (
      <section className={cn("relative", SECTION, PAD)}>
        {head_}
        {artNode}
      </section>
    );
  }

  return (
    /* GHIM CẢ TIÊU ĐỀ LẪN QUẢ CHANH cùng một khối. Trước đây chỉ ghim riêng quả
       chanh trong một khung cao bằng màn hình nên nó bị đẩy xuống giữa màn, cách
       tiêu đề một khoảng trống lớn. Ghim chung thì tiêu đề đứng yên phía trên và
       quả chanh nằm ngay dưới nó, đúng như lúc chưa có dàn dựng. */
    <section className={cn("relative", PAD)}>
      <div ref={track} className="h-[500svh]">
        {/* Cao hết màn để có một tâm thật mà đẩy quả chanh vào giữa. */}
        <div
          ref={pin}
          className={cn("sticky top-16 h-[calc(100svh-4rem)] overflow-hidden", SECTION)}
        >
          {/* Tắt luôn tương tác khi đã tàng hình: trong đoạn chú thích có link
              "asset whitelist", để nguyên thì nó vẫn bấm được dù không nhìn thấy. */}
          <div
            style={{
              opacity: fade,
              pointerEvents: fade < 0.05 ? "none" : undefined,
            }}
          >
            {head_}
          </div>
          {artNode}
        </div>
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
        {/* Theo nếp home: tiêu đề canh GIỮA, thẻ nền xanh nhạt (--surface-2) và
            BỎ stroke — giống stat box ngoài trang chủ, không phải thẻ viền nền
            trắng của bản dev. */}
        <SectionHead kicker={head.kicker} title={head.title} center />

        <Reveal className="mt-9" delay={0.08}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {p.facts.map((f) => {
              const Icon = FACT_ICONS[f.icon as keyof typeof FACT_ICONS];
              return (
                <div
                  key={f.label}
                  className="flex items-center gap-3.5 rounded-md bg-surface px-3.5 py-3 sm:min-h-[132px] sm:flex-col sm:items-center sm:justify-center sm:gap-0 sm:py-3.5 sm:text-center"
                >
                  {/* Theo đúng thẻ Spec ngoài home: icon 20px đặt trong ô bo 36px
                      nền `--foreground 6%`, KHÔNG phải icon 28px màu accent nhấp
                      nháy; nhãn dùng biến thể muted; bo `rounded-md`; và chỉ canh
                      giữa từ `sm` chứ không canh giữa cả ở mobile.
                      Một chỗ CỐ Ý khác home: home ghi `bg-white` cứng nên ở dark
                      mode thẻ vẫn trắng tinh trên nền gần đen — dùng `bg-surface`
                      để nó theo theme. */}
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
        </Reveal>

        <TokenSet tokens={tokens} note={tokensNote} />
      </div>
    </section>
  );
}
