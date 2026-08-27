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
import { CitrusChart } from "@/components/ui/CitrusChart";
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

function SliceArt({ p }: { p: Product }) {
  const [active, setActive] = useState<number | null>(null);
  const half = Math.ceil(p.slices.length / 2);
  const cot = (from: number, to: number) =>
    p.slices.slice(from, to).map((s, k) => {
      const i = from + k;
      return (
        <SliceCard
          key={s.label}
          s={s}
          accent={p.color}
          on={i === active}
          onEnter={() => setActive(i)}
          onLeave={() => setActive(null)}
        />
      );
    });

  return (
    <Reveal y={24}>
      {/* Thứ tự trên mobile: quả chanh trước rồi tới thẻ — nên cột trái mang
          `order-2`, quả chanh `order-1`. Từ `lg` mới xếp ba cột thật. */}
      <div className="mt-9 grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-8">
        <div className="order-2 flex flex-col gap-4 lg:order-1">{cot(0, half)}</div>

        <div className="order-1 mx-auto w-full max-w-[420px] lg:order-2 lg:w-[420px]">
          <CitrusChart
            id={`comp-${p.id}`}
            accent={p.color}
            slices={p.slices}
            active={active}
            setActive={setActive}
          />
        </div>

        <div className="order-3 flex flex-col gap-4">{cot(half, p.slices.length)}</div>
      </div>
    </Reveal>
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
  return (
    <section className={cn("relative overflow-hidden", SECTION, PAD)}>
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
        ) : (
          <SliceArt p={p} />
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
